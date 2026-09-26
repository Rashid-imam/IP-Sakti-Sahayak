import os
import re
import warnings
from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# --- IN-MEMORY CACHING IMPORT ---
from cachetools import TTLCache, cached

# In-memory cache to store recent queries for 24 hours (86400 seconds) for instant responses
response_cache = TTLCache(maxsize=200, ttl=86400)

# --- NAYE IMPORTS PDF UPLOAD KE LIYE ---
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables and suppress Chroma warnings
load_dotenv()
warnings.filterwarnings("ignore", category=UserWarning, module="langchain_chroma")

base_dir = os.path.dirname(os.path.abspath(__file__))
persist_dir = os.path.join(base_dir, "chroma_db")

# Initialize ChromaDB vector store using all-MiniLM-L6-v2 embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_db = Chroma(
    collection_name="ip_sakti_corpus",
    embedding_function=embeddings,
    persist_directory=persist_dir,
    collection_metadata={"hnsw:space": "cosine"}
)

# Set up LLM client via OpenRouter (using low temperature for legal precision)
api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("LLM_API_KEY")
base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
model_name = os.getenv("LLM_MODEL", "openrouter/free")

llm = ChatOpenAI(
    model=model_name,
    openai_api_key=api_key,
    openai_api_base=base_url,
    temperature=0.2,
    max_tokens=3500,
    timeout=40,
    max_retries=1
)

# --- NAYA FUNCTION: PDF UPLOAD KE LIYE ---
def process_and_upload_pdf(file_path: str, extra_metadata: dict = None):
    """PDF file ko read karke, chunks banakar vector DB mein save karta hai.

    FIX: PyPDFLoader only ever sets "source" and "page" metadata on each chunk --
    it has no idea which jurisdiction or act a PDF belongs to. Since
    retrieve_dual_jurisdiction_context() filters retrieval with
    filter={"jurisdiction": ...}, any chunk missing that key can NEVER match the
    filter and is silently excluded from retrieval forever. extra_metadata lets
    the caller (ingest_all.py) attach {"jurisdiction": "India", "act_name": "..."}
    etc. to every chunk coming from a given PDF.
    """
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
        chunks = text_splitter.split_documents(documents)
        if extra_metadata:
            for chunk in chunks:
                chunk.metadata.update(extra_metadata)
        vector_db.add_documents(chunks)
        print(f"Successfully indexed {len(chunks)} chunks from {os.path.basename(file_path)}")
        return True
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return False
# ----------------------------------------

# 5-branch router prompt: handles greetings, medical queries, out-of-domain, triage, and legal search
router_prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are the central intent router and regulatory triage planner for IP-SAKTI Sahayak, "
        "Ministry of AYUSH, Government of India.\n"
        "Analyze the user query in the context of recent chat history. You natively comprehend Indian languages, "
        "transliterations (Hinglish/Urdu/Devanagari), typos, and colloquial speech.\n\n"
        "Classify the query into EXACTLY ONE of the following 5 actions:\n\n"
        "1. CASUAL_CHAT:\n"
        "Trigger: Greetings ('hi', 'asslamualaikum', 'ram ram', 'namaste'), asking how you are, identity/capabilities.\n"
        "Output Format:\n"
        "ACTION: CHAT\n"
        "RESPONSE: <Warm 2-3 sentence conversational reply in '{response_language}'. No legal sections. No bullets.>\n\n"
        "2. MEDICAL_ADVICE:\n"
        "Trigger: User asking for medical diagnosis, treatment, cure, or home remedies for their own health symptoms "
        "(e.g., 'mujhe khasi ho rahi hai kya karu', 'fever cure', 'treatment for pet dard').\n"
        "Output Format:\n"
        "ACTION: MEDICAL_ADVICE\n\n"
        "3. OUT_OF_DOMAIN:\n"
        "Trigger: Questions completely outside AYUSH/herbal/IP domain (e.g., IPC 302 murder trial, evidence act, drone fabrication, coding, stock market).\n"
        "Output Format:\n"
        "ACTION: OUT_OF_DOMAIN\n\n"
        "4. CLARIFICATION_REQUIRED:\n"
        "Trigger: User mentions developing or launching an unclassified formulation (e.g. 'Maine ek naya hair oil banaya hai', 'herbal syrup launch karna hai', 'churna banaya hai') "
        "WITHOUT having specified whether it is Classical vs Proprietary, or Cosmetic vs Therapeutic Drug. "
        "Do NOT guess the category. Do NOT reject patentability immediately.\n"
        "Output Format:\n"
        "ACTION: CLARIFY\n\n"
        "5. STATUTORY_DIAGNOSTIC:\n"
        "Trigger: Specific formulation with declared ingredients/claims, statutory questions (Section 3(p), 3(e), NBA Form-III, "
        "Biological Diversity Act 2002 as amended in 2023, Vaidya exemptions, WIPO vs India comparisons, or follow-ups).\n"
        "Output Format:\n"
        "ACTION: SEARCH\n"
        "JURISDICTION_SCOPE: <INDIA | INTERNATIONAL | BOTH>\n"
        "SEARCH_QUERY: <Concise standalone English legal search keywords for ChromaDB retrieval.>\n\n"
        "Strictly adhere to the output format."
    )),
    ("user", "Recent Chat History:\n{chat_history}\n\nLatest User Query: {user_query}")
])
router_chain = router_prompt | llm | StrOutputParser()

# Core diagnostic prompt grounding Indian patent law, 2023 BDA amendment, and international treaties
# YAHAN MARkDOWN AUR BULLET POINT WALI INSTRUCTION ADD KI HAI
system_instruction = (
    "You are IP-SAKTI Sahayak, an authoritative legal AI assistant for the Ministry of AYUSH, Government of India.\n"
    "Evaluate patentability, traditional knowledge conflicts, and regulatory compliance strictly grounded "
    "in the statutory corpus provided below and the preceding conversational thread.\n\n"
    "AUTHORITATIVE STATUTORY & TREATY REPERTOIRE:\n"
    "1. Patents Act 1970:\n"
    "   - Section 3(p): Inventions which in effect are traditional knowledge are non-patentable.\n"
    "   - Section 3(e): Mere admixtures resulting only in aggregation of properties without proven synergy are non-patentable.\n"
    "   - Section 10(4)(d): Mandatory disclosure of the source and geographical origin of biological material.\n"
    "2. Biological Diversity Act, 2002 (as amended by Biological Diversity (Amendment) Act, 2023):\n"
    "   - Section 7 Proviso (as amended in 2023): Registered AYUSH practitioners (Vaidyas, Hakims) practicing indigenous medicine "
    "     for livelihood and sustenance are EXEMPT from prior intimation/approval to State Biodiversity Boards. Always cite this as Section 7 Proviso amended in 2023.\n"
    "   - Section 6 / Section 3: Mandatory prior approval from NBA via Form-III for foreign IPR filing or commercial utilization by commercial entities.\n"
    "3. Drugs & Cosmetics Act 1940 & Rules 1945:\n"
    "   - Classical Drugs: Formulations strictly cited in First Schedule 54 authoritative texts (Charaka, Sahasrayogam, etc.).\n"
    "   - Patent & Proprietary (P&P) Medicines: Formulations containing ingredients mentioned in authoritative texts but with a novel ratio/recipe.\n"
    "   - Rule 128 / Sec 33E: Cosmetics cannot make therapeutic claims (e.g. curing hair-fall/alopecia or treating diseases).\n"
    "4. WIPO GRATK Treaty (2024) & Nagoya Protocol:\n"
    "   - Article 3 WIPO GRATK (2024): Mandatory disclosure of country of origin for inventions based on genetic resources and associated TK.\n"
    "   - Nagoya Protocol: Mandatory Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT).\n\n"
    "FORMATTING DIRECTIVE (CRITICAL):\n"
    "Always format your response using standard Markdown. Strictly use `**` for bolding key terms or headings.\n"
    "Use standard markdown lists (`- ` or `1. `) instead of bullet characters like '•'.\n"
    "ALWAYS use double line breaks (`\\n\\n`) to separate different points, sections, or paragraphs.\n"
    "Never return a single continuous block of text.\n\n"
    "JURISDICTION ISOLATION & OUTPUT LAYOUT DIRECTIVE:\n"
    "The national and international legal layers must NEVER be conflated in a single paragraph.\n\n"
    "A. IF JURISDICTION MODE IS 'BOTH' (Comparative Analysis):\n"
    "You MUST output exactly these distinct markdown blocks (remembering to use '-' and '\\n\\n'):\n\n"
    "### 🇮🇳 National Framework (India — IPO & NBA)\n"
    "- **Assessment:** <Statutory assessment under Indian Patents Act & Biological Diversity Act 2002 (as amended in 2023) in {response_language}>\n\n"
    "- **Citation:** <Explicit Indian statutes: Patents Act Sec 10(4)(d)/3(p)/3(e), BDA Sec 6 / Sec 7 Proviso in {response_language}>\n\n"
    "- **Recommended Action:** <Domestic compliance steps in {response_language}>\n\n"
    "### 🌐 International Framework (WIPO & Treaties)\n"
    "- **Assessment:** <Treaty requirements under WIPO GRATK Treaty 2024 and Nagoya Protocol in {response_language}>\n\n"
    "- **Citation:** <WIPO GRATK Treaty (2024) Article 3; Nagoya Protocol PIC/MAT in {response_language}>\n\n"
    "- **Recommended Action:** <International PCT/foreign filing compliance steps in {response_language}>\n\n"
    "### ⚖️ Comparative Interplay & Key Differences\n"
    "<Direct comparison explaining how India's pre-filing BDA approval regime interacts with WIPO's global patent disclosure standard in {response_language}>\n\n"
    "B. IF JURISDICTION MODE IS SINGLE ('INDIA' or 'INTERNATIONAL'):\n"
    "Output exactly 3 bullet points (using '-' and '\\n\\n'):\n"
    "- **Assessment:** <Legal verdict and patentability status in {response_language}>\n\n"
    "- **Citation:** <Exact legal acts, explicit sections, citing BDA 2002 as amended in 2023 where applicable in {response_language}>\n\n"
    "- **Recommended Action:** <Concrete next steps in {response_language}>\n\n"
    "LANGUAGE DIRECTIVE:\n"
    "- Output 100% of your response in '{response_language}'. Complete every sentence fully. Never truncate on a semicolon."
)

diagnostic_prompt = ChatPromptTemplate.from_messages([
    ("system", system_instruction),
    ("user", (
        "Recent Conversation Context:\n{chat_history}\n\n"
        "Statutory & TKDL Context:\n{context}\n\n"
        "Current Query: {query}\n"
        "Jurisdiction Scope: {jurisdiction_scope}\n"
        "Product Category: {product_category}\n"
        "Response Language: {response_language}"
    ))
])
diagnostic_chain = diagnostic_prompt | llm | StrOutputParser()

# Helper function to remove reasoning tags and enforce clean bullet formatting
def clean_and_format_output(text: str) -> str:
    if not text or not text.strip():
        return ""

    raw_text = text.strip()
    cleaned = re.sub(r"<think>.*?</think>", "", raw_text, flags=re.DOTALL).strip()

    if not cleaned and "<think>" in raw_text:
        inside = re.findall(r"<think>(.*?)(?:</think>|$)", raw_text, flags=re.DOTALL)
        if inside:
            candidate = inside[-1].strip()
            if any(m in candidate for m in ["-", "Assessment", "National Framework", "मूल्यांकन"]):
                cleaned = candidate
            else:
                lines = [l.strip() for l in candidate.split("\n") if len(l.strip()) > 15]
                cleaned = "\n\n".join(lines[-4:]) if lines else candidate

    valid_lines = []
    for line in cleaned.split("\n"):
        l_str = line.strip()
        l_lower = l_str.lower()
        if any(bad in l_lower for bad in ["user safety:", "safety evaluation:", "safety: safe"]):
            continue
        if l_str:
            valid_lines.append(l_str)

    # NAYA LOGIC: Sentence Reconstructor
    # Agar line ke ant mein punctuation nahi hai aur agli line bullet se shuru nahi ho rahi, 
    # toh in dono ko wapas jod do taaki paragraph break na ho.
    reconstructed_text = ""
    for i, line in enumerate(valid_lines):
        reconstructed_text += line
        if i < len(valid_lines) - 1:
            next_line = valid_lines[i+1]
            # Agar current line incomplete lag rahi hai, aur next line bullet nahi hai: join with space
            if not line.endswith(('.', ':', '?', '!', ';')) and not next_line.strip().startswith(('-', '1.', '2.', '3.', '###')):
                 reconstructed_text += " "
            else:
                 reconstructed_text += "\n\n" # Only add paragraph break if it's a real new section

    cleaned = reconstructed_text.strip()

    is_diagnostic = any(
        marker in cleaned.lower()
        for marker in [
            "assessment", "national framework", "international framework",
            "मूल्यांकन", "citation", "उद्धरण", "recommended action", "अनुशंसित"
        ]
    )
    
    # Ensure lists use standard markdown '-' instead of '•'
    if is_diagnostic and "###" not in cleaned:
        cleaned = re.sub(r"^\s*•\s+", "- ", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"^\s*\d+[\.\)]\s+", "- ", cleaned, flags=re.MULTILINE)
        # FIX: pehle ye line har hyphen (jaise non-patentable, Form-III, cross-reference
        # ke andar wale "-") ko bhi bullet samajh kar todh rahi thi, kyunki \s* ka matlab
        # "zero ya usse zyada space" hota hai (compulsory space nahi). Isi wajah se
        # sentences beech mein hi toot rahe the.
        # Ab hum sirf un hyphens ko match karte hain jinke DONO taraf real whitespace ho
        # (\s+ compulsory), aur jinke baad "**" (bold marker) aata ho — yani genuinely
        # "- **Assessment:**" jaisa ek bullet hai, koi word ke andar wala hyphen nahi.
        cleaned = re.sub(r"(?<!\n)(?<!^)\s+-\s+(?=\*\*)", "\n\n- ", cleaned)
        if cleaned and not cleaned.startswith("-"):
            cleaned = "- " + cleaned

    return cleaned.strip()

# ==================== NEW FUNCTION: READINESS SCORE CALCULATION ====================
def calculate_readiness_score(
    query: str,
    jurisdiction_scope: str,
    has_citations: bool = False,
    confidence_score: float = 0.5
) -> dict:
    """
    Calculate formulation patentability readiness (0-100)
    
    Factors:
    - Clarity (0-25): Query mein complete formulation info hai?
    - Legal Grounding (0-25): TKDL + Statutory compliance references
    - Documentation (0-25): Classical vs Proprietary declaration
    - International Readiness (0-25): Jurisdiction scope clarity
    """
    
    q_lower = query.lower()
    
    # 1. CLARITY (0-25)
    clarity_score = 0
    if any(w in q_lower for w in ["ashwagandha", "tulsi", "neem", "brahmi", "amalaki", "shatavari", "हरीतकी", "अमलकी", "तुलसी"]):
        clarity_score += 6.25
    if any(c.isdigit() for c in query):  # Quantities mentioned
        clarity_score += 6.25
    if any(w in q_lower for w in ["baldness", "alopecia", "fever", "diabetes", "cough", "pain", "गंजापन", "खांसी", "बुखार"]):
        clarity_score += 6.25
    if any(w in q_lower for w in ["charaka", "sushruta", "sahasrayogam", "bhavaprakash", "चरक", "सुश्रुत"]):
        clarity_score += 6.25
    clarity_score = min(25, clarity_score)
    
    # 2. LEGAL GROUNDING (0-25)
    legal_score = 0
    if any(w in q_lower for w in ["tkdl", "traditional knowledge", "पारंपरिक ज्ञान"]):
        legal_score += 6.25
    if any(w in q_lower for w in ["section 3(p)", "3(p)", "non-patentable"]):
        legal_score += 6.25
    if any(w in q_lower for w in ["biodiversity", "nba", "biological diversity", "जैव विविधता"]):
        legal_score += 6.25
    if any(w in q_lower for w in ["classical", "proprietary", "patent", "शास्त्रीय", "स्वामित्व"]):
        legal_score += 6.25
    legal_score = min(25, legal_score)
    
    # 3. DOCUMENTATION (0-25)
    docs_score = 0
    if any(w in q_lower for w in ["classical", "proprietary", "novel recipe", "नया सूत्र"]):
        docs_score += 6.25
    if any(w in q_lower for w in ["rule 128", "cosmetic", "therapeutic", "drug", "औषधि", "प्रसाधन"]):
        docs_score += 6.25
    if any(w in q_lower for w in ["ingredients", "ratio", "composition", "formula", "सामग्री", "अनुपात"]):
        docs_score += 6.25
    if any(w in q_lower for w in ["source", "origin", "location", "region", "geographical", "स्रोत", "मूल"]):
        docs_score += 6.25
    docs_score = min(25, docs_score)
    
    # 4. INTERNATIONAL READINESS (0-25)
    intl_score = 0
    if jurisdiction_scope in ["BOTH", "International"]:
        intl_score += 6.25
    if has_citations:
        intl_score += 6.25
    if any(w in q_lower for w in ["india", "himalaya", "region", "भारत", "क्षेत्र", "geographical"]):
        intl_score += 6.25
    if any(w in q_lower for w in ["pic", "mat", "nagoya", "benefit sharing", "पूर्व सहमति"]):
        intl_score += 6.25
    intl_score = min(25, intl_score)
    
    # Calculate final score
    raw_total = clarity_score + legal_score + docs_score + intl_score
    final_score = min(100, raw_total + (confidence_score * 15))
    
    # Determine readiness level
    if final_score >= 75:
        readiness_level = "🟢 Patent-Ready"
        color_code = "high"
    elif final_score >= 50:
        readiness_level = "🟡 Clarify Needed"
        color_code = "medium"
    else:
        readiness_level = "🔴 More Info Needed"
        color_code = "low"
    
    return {
        "score": round(final_score, 0),
        "level": readiness_level,
        "color": color_code,
        "clarity": round(clarity_score, 0),
        "legal": round(legal_score, 0),
        "documentation": round(docs_score, 0),
        "international": round(intl_score, 0)
    }
# ============================== END READINESS SCORE FUNCTION ==============================

def normalize_jurisdiction(jurisdiction: str) -> str:
    if "International" in jurisdiction:
        return "International"
    return "India"

# Dual retrieval with metadata filtering to prevent jurisdictional cross-talk
def retrieve_dual_jurisdiction_context(query: str, search_query: str, mode: str, default_jurisdiction: str, k: int = 3):
    queries = [q for q in [search_query, query] if q]
    collected_docs = []

    # Run side-by-side search for comparative mode
    if mode == "BOTH":
        india_candidates = []
        intl_candidates = []

        for q in queries:
            try:
                ind = vector_db.similarity_search_with_relevance_scores(q, k=2, filter={"jurisdiction": "India"})
                if ind: india_candidates.extend(ind)
            except Exception: pass

            try:
                intl = vector_db.similarity_search_with_relevance_scores(q, k=2, filter={"jurisdiction": "International"})
                if intl: intl_candidates.extend(intl)
            except Exception: pass

        # Filter out redundant chunks while preserving top candidates
        seen = set()
        india_sorted = sorted(india_candidates, key=lambda x: x[1], reverse=True)
        for doc, score in india_sorted:
            if doc.page_content not in seen and len([d for d in collected_docs if d[0].metadata.get("jurisdiction") == "India"]) < 2:
                collected_docs.append((doc, score))
                seen.add(doc.page_content)

        intl_sorted = sorted(intl_candidates, key=lambda x: x[1], reverse=True)
        for doc, score in intl_sorted:
            if doc.page_content not in seen and len([d for d in collected_docs if d[0].metadata.get("jurisdiction") == "International"]) < 2:
                collected_docs.append((doc, score))
                seen.add(doc.page_content)

        # Fallback to general search if isolated filters return insufficient documents
        if len(collected_docs) < 2:
            try:
                fallback = vector_db.similarity_search_with_relevance_scores(search_query or query, k=4)
                for doc, score in fallback:
                    if doc.page_content not in seen:
                        collected_docs.append((doc, score))
                        seen.add(doc.page_content)
            except Exception: pass

        return collected_docs

    # Standard retrieval for single jurisdiction target
    target_j = mode if mode in ["India", "International"] else default_jurisdiction
    candidates = []
    for q in queries:
        try:
            results = vector_db.similarity_search_with_relevance_scores(q, k=k, filter={"jurisdiction": target_j})
            if results: candidates.append(results)
        except Exception: pass

        if not candidates:
            try:
                results = vector_db.similarity_search_with_relevance_scores(q, k=k)
                if results: candidates.append(results)
            except Exception: pass

    if not candidates:
        return []

    return max(candidates, key=lambda res: res[0][1])

# Safe deflection for questions outside the AYUSH legal scope
def build_abstain_message(response_language: str) -> str:
    if response_language == "Hinglish":
        return (
            "⚠️ **Out-of-Domain Query (Scope se Bahar):**\n\n"
            "Aapka sawal AYUSH/Ayurveda IP aur Traditional Knowledge ke daayre se bahar hai. "
            "IP-SAKTI Sahayak sirf traditional knowledge, herbal formulations, aur biological resources se related statutory compliance ko evaluate karta hai.\n\n"
            "👉 Kripya criminal/civil court matters ya technical software queries ke liye sambandhit **Legal Advocate ya Domain Expert** se consult karein."
        )
    elif "Hindi" in response_language:
        return (
            "⚠️ **दायरे से बाहर का प्रश्न:**\n\n"
            "यह प्रश्न आयुष/आयुर्वेद IP और पारंपरिक ज्ञान के वैधानिक दायरे से बाहर है। "
            "यह प्रणाली केवल हर्बल दवाओं, जैव संसाधनों और आयुष पेटेंट नियमों का विश्लेषण करती है।\n\n"
            "👉 कृपया इस विषय के लिए संबंधित **विधिक अधिवक्ता या विशेषज्ञ** से संपर्क करें।"
        )
    else:
        return (
            "⚠️ **Out-of-Domain Query:**\n\n"
            "This query falls outside the scope of AYUSH/Ayurveda Intellectual Property and Traditional Knowledge. "
            "This engine is strictly restricted to herbal formulations, biological diversity regulations, and AYUSH patentability.\n\n"
            "👉 Please consult an appropriate **Legal Advocate or Domain Specialist**."
        )

# Clinical disclaimer to redirect self-treatment requests to doctors
def build_medical_disclaimer(response_language: str) -> str:
    if response_language == "Hinglish":
        return (
            "⚠️ **Medical Disclaimer (Chikitsa Salah Nahi Hai):**\n\n"
            "Main **IP-SAKTI Sahayak** hoon — mera uddeshya sirf Ayurvedic formulations ke **Patent aur Regulatory Compliance** ko verify karna hai. "
            "Main koi doctor ya medical practitioner nahi hoon aur kisi bimari ya lakshan (jaise khasi, bukhar, dard) ka ilaj ya dawa suggest nahi kar sakta.\n\n"
            "👉 Kripya clinical treatment ke liye kisi **Registered Ayurvedic Practitioner (Vaidya)** ya physician se consult karein."
        )
    elif "Hindi" in response_language:
        return (
            "⚠️ **चिकित्सीय अस्वीकरण (चिकित्सा सलाह नहीं है):**\n\n"
            "मैं **आईपी-शक्ति सहायक** हूँ — मेरा उद्देश्य केवल आयुर्वेदिक फॉर्मूलेशन के **पेटेंट और विनियामक अनुपालन** की जांच करना है। "
            "मैं कोई योग्य चिकित्सक नहीं हूँ और किसी बीमारी या लक्षण (जैसे खांसी, बुखार) के लिए उपचार या दवा की सलाह नहीं दे सकता।\n\n"
            "👉 कृपया समुचित उपचार के लिए किसी **पंजीकृत आयुर्वेदिक चिकित्सक (वैद्य)** से परामर्श लें।"
        )
    else:
        return (
            "⚠️ **Medical Disclaimer:**\n\n"
            "I am **IP-SAKTI Sahayak**, an AI diagnostic engine designed strictly for evaluating **Intellectual Property (IP) and patentability** of AYUSH formulations. "
            "I am not a medical practitioner and cannot provide clinical diagnoses or medicinal prescriptions.\n\n"
            "👉 Please consult a **qualified Ayurvedic practitioner (Vaidya) or registered physician** for medical advice."
        )

# Generates triage options to classify ambiguous formulation queries
def build_clarification_response(response_language: str) -> tuple:
    if response_language == "Hinglish":
        text_reply = (
            "🔍 **Formulation Classification & Regulatory Triage:**\n\n"
            "Aapke naye Ayurvedic utpaad ke sahi IPR aur licensing path ko diagnose karne ke liye kripya yeh **3 zaruri baatein spasht karein**:\n\n"
            "1. **Formulation Base (Classical vs Proprietary):**\n"
            "   - Kya yeh First Schedule ke 54 authoritative texts (jaise Charaka Samhita, Sahasrayogam, AFI) se exact liya gaya hai (Classical Drug)?\n"
            "   - Ya yeh aapka naya proprietary combination hai (Patent & Proprietary Medicine)?\n\n"
            "2. **Product Claim & Intended Use:**\n"
            "   - Kya iska claim Cosmetic hai (baalon ki conditioning/nourishment — Rule 128)?\n"
            "   - Ya therapeutic drug claim hai (jaise baldness, alopecia, ya dandruff cure karna)?\n\n"
            "3. **Target Category:**\n"
            "   - Kya aap ise **Ayurvedic Drug**, **Cosmetic**, ya **Ayurveda-Aahar** (Nutraceutical) ke roop me register karna chahte hain?\n\n"
            "👉 Inka jawab likhein, taaki main exact patentability aur statutory forms (NBA Form-III / Drug License) diagnose kar sakoon."
        )
    elif "Hindi" in response_language:
        text_reply = (
            "🔍 **फॉर्मूलेशन वर्गीकरण एवं विनियामक ट्राइएज:**\n\n"
            "आपके नए आयुर्वेदिक उत्पाद के सही IPR और लाइसेंसिंग मार्ग के सटीक विश्लेषण के लिए कृपया निम्नलिखित **3 मुख्य प्रश्नों को स्पष्ट करें**:\n\n"
            "1. **उत्पाद का आधार (शास्त्रीय बनाम प्रोप्राइटरी):**\n"
            "   - क्या यह प्रथम अनुसूची के 54 प्रामाणिक ग्रंथों (चरक संहिता, सहस्रयोगम आदि) से लिया गया है (शास्त्रीय/जेनेरिक दवा)?\n"
            "   - या यह आपका नवीन संयोजन है (पेटेंट एवं प्रोप्राइटरी औषधि)?\n\n"
            "2. **दावा और लक्षित उपयोग:**\n"
            "   - क्या यह केवल कॉस्मेटिक उपयोग (बालों का पोषण/कंडीशनिंग — नियम 128) के लिए है?\n"
            "   - या चिकित्सीय उपचार (गंजापन, एलोपेसिया या बाल झड़ना रोकने का दावा) के लिए है?\n\n"
            "3. **उत्पाद श्रेणी:**\n"
            "   - आप इसे **आयुर्वेदिक औषधि**, **प्रसाधन सामग्री (Cosmetic)**, या **आयुर्वेद-आहार** में किस रूप में लाना चाहते हैं?\n\n"
            "👉 कृपया उत्तर दें ताकि सही पेटेंट एवं लाइसेंस प्रक्रिया का विश्लेषण किया जा सके।"
        )
    else:
        text_reply = (
            "🔍 **Formulation Classification & Regulatory Triage:**\n\n"
            "To accurately determine the patentability and licensing pathway for your Ayurvedic formulation, please clarify the following **3 minimum parameters**:\n\n"
            "1. **Formulation Base:**\n"
            "   - Is it an exact classical formulation codified in the 54 First Schedule texts (e.g. Sahasrayogam, Charaka Samhita)?\n"
            "   - Or is it a novel formulation developed by you (Patent & Proprietary Medicine)?\n\n"
            "2. **Intended Claim & Scope:**\n"
            "   - Is it intended for cosmetic purposes (conditioning, grooming under Rule 128)?\n"
            "   - Or does it claim therapeutic cure (treating baldness, alopecia, or chronic hair loss)?\n\n"
            "3. **Target Regulatory Category:**\n"
            "   - Are you registering this as an **Ayurvedic Drug**, a **Cosmetic**, or an **Ayurveda-Aahar (Nutraceutical)**?\n\n"
            "👉 Reply with these details to receive the precise statutory evaluation and licensing roadmap."
        )

    structured_data = {
        "classification_questions": [
            {
                "id": "formulation_base",
                "label": "Formulation Base",
                "options": ["Classical / Generic (First Schedule)", "Patent & Proprietary (Novel Recipe)"]
            },
            {
                "id": "claim_type",
                "label": "Product Claim",
                "options": ["Cosmetic (Conditioning / Rule 128)", "Therapeutic Drug (Cure / Treatment)"]
            },
            {
                "id": "regulatory_category",
                "label": "Target Category",
                "options": ["Ayurvedic Drug", "Cosmetic", "Ayurveda-Aahar"]
            }
        ]
    }

    return text_reply, structured_data

# Primary diagnostic entrypoint
def query_ip_assistant(
    query: str,
    product_category: str = "Drug",
    jurisdiction: str = "India",
    language: str = "English",
    response_language: str = "English",
    chat_history: list = None,
    has_paid_access: bool = False
) -> dict:

    normalized_jurisdiction = normalize_jurisdiction(jurisdiction)

    # Maintain sliding window memory buffer (trailing 6 conversational turns)
    if chat_history is None:
        chat_history = []

    history_lines = []
    for msg in chat_history[-6:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        content = msg.get("content", "").strip()
        history_lines.append(f"{role}: {content}")
    history_str = "\n".join(history_lines).strip()

    # Classify query intent using native LLM router
    router_output = ""
    try:
        raw_plan = router_chain.invoke({
            "chat_history": history_str if history_str else "None",
            "user_query": query,
            "response_language": language or response_language
        })
        router_output = re.sub(r"<think>.*?</think>", "", raw_plan, flags=re.DOTALL).strip()
    except Exception:
        router_output = "ACTION: SEARCH\nJURISDICTION_SCOPE: INDIA\nSEARCH_QUERY: " + query

    # Branch 1: Conversational / greeting response
    if "ACTION: CHAT" in router_output:
        resp_match = re.search(r"RESPONSE:\s*(.*)", router_output, flags=re.DOTALL)
        if resp_match and resp_match.group(1).strip():
            chat_reply = clean_and_format_output(resp_match.group(1).strip())
        else:
            chat_reply = router_output.replace("ACTION: CHAT", "").strip()

        return {
            "status": "SUCCESS",
            "intent": "CASUAL_CHAT",
            "is_comparative": False,
            "needs_clarification": False,
            "answer": chat_reply,
            "primary_citation": "IP-SAKTI Sahayak — Conversational Mode",
            "confidence_score": 1.00,
            "escalation_required": False,
            "grounding_verified": True,
            "source_metadata": None,
            "citations": [],
            "data": {},
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (None for casual chat)
            "readiness_score": None,
            "readiness_level": None,
            "readiness_color": None,
            "readiness_breakdown": None
        }

    # Branch 2: Clinical safety guardrail
    if "ACTION: MEDICAL_ADVICE" in router_output:
        return {
            "status": "ABSTAIN",
            "intent": "MEDICAL_ADVICE",
            "is_comparative": False,
            "needs_clarification": False,
            "answer": build_medical_disclaimer(language or response_language),
            "primary_citation": "Clinical Guardrail — Consult a Qualified Vaidya/Doctor",
            "confidence_score": 0.00,
            "escalation_required": True,
            "grounding_verified": None,
            "source_metadata": None,
            "citations": [],
            "data": {},
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (None for medical)
            "readiness_score": None,
            "readiness_level": None,
            "readiness_color": None,
            "readiness_breakdown": None
        }

    # Branch 3: Out-of-domain guardrail
    if "ACTION: OUT_OF_DOMAIN" in router_output:
        return {
            "status": "ABSTAIN",
            "intent": "OUT_OF_DOMAIN",
            "is_comparative": False,
            "needs_clarification": False,
            "answer": build_abstain_message(language or response_language),
            "primary_citation": "Out of Domain — Guardrail",
            "confidence_score": 0.00,
            "escalation_required": True,
            "grounding_verified": None,
            "source_metadata": None,
            "citations": [],
            "data": {},
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (None for out-of-domain)
            "readiness_score": None,
            "readiness_level": None,
            "readiness_color": None,
            "readiness_breakdown": None
        }

    # Branch 4: Interactive classification triage for unclassified formulations
    q_lower = query.lower()
    is_vague_product_query = (
        any(w in q_lower for w in ["hair oil", "tel banaya", "syrup banaya", "churna banaya", "creme banayi", "oil banaya"])
        and not any(k in q_lower for k in ["classical", "proprietary", "rule 128", "cosmetic", "charaka", "sahasrayogam", "ashwagandha", "amla"])
    )

    if "ACTION: CLARIFY" in router_output or is_vague_product_query:
        clarify_text, clarify_data = build_clarification_response(language or response_language)
        
        # Calculate readiness for clarification case
        readiness = calculate_readiness_score(
            query=query,
            jurisdiction_scope="India",
            has_citations=False,
            confidence_score=0.4
        )
        
        return {
            "status": "SUCCESS",
            "intent": "CLASSIFICATION_TRIAGE",
            "is_comparative": False,
            "needs_clarification": True,
            "answer": clarify_text,
            "primary_citation": "Drugs & Cosmetics Act 1940 (First Schedule & Rule 128)",
            "confidence_score": 0.92,
            "escalation_required": False,
            "grounding_verified": True,
            "source_metadata": None,
            "citations": [],
            "data": clarify_data,
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (for clarification case)
            "readiness_score": readiness["score"],
            "readiness_level": readiness["level"],
            "readiness_color": readiness["color"],
            "readiness_breakdown": {
                "clarity": readiness["clarity"],
                "legal": readiness["legal"],
                "documentation": readiness["documentation"],
                "international": readiness["international"]
            }
        }

    # Branch 5: Statutory legal retrieval and synthesis
    search_query = query
    query_match = re.search(r"SEARCH_QUERY:\s*(.*)", router_output, flags=re.DOTALL)
    if query_match and query_match.group(1).strip():
        search_query = query_match.group(1).strip().split("\n")[0]

    # Detect whether comparative synthesis is requested
    is_comparative_query = any(w in q_lower for w in ["compare", "vs", "dono", "both", "अंतर", "तुलना"])
    j_match = re.search(r"JURISDICTION_SCOPE:\s*(\w+)", router_output, flags=re.IGNORECASE)
    detected_j = j_match.group(1).upper() if j_match else ""

    if is_comparative_query or "BOTH" in detected_j:
        jurisdiction_scope = "BOTH"
    elif "INT" in detected_j or "international" in q_lower or "wipo" in q_lower:
        jurisdiction_scope = "International"
    else:
        jurisdiction_scope = "India"

    # Execute vector retrieval
    results = retrieve_dual_jurisdiction_context(query, search_query, jurisdiction_scope, normalized_jurisdiction)

    if not results:
        return {
            "status": "ABSTAIN",
            "intent": "INSUFFICIENT_CORPUS",
            "is_comparative": (jurisdiction_scope == "BOTH"),
            "needs_clarification": False,
            "answer": "Corpus me is formulation se sambandhit koi statutory reference ya prior art nahi mila.",
            "primary_citation": "Corpus Incomplete",
            "confidence_score": 0.0,
            "escalation_required": True,
            "grounding_verified": None,
            "source_metadata": None,
            "citations": [],
            "data": {},
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (None for insufficient corpus)
            "readiness_score": None,
            "readiness_level": None,
            "readiness_color": None,
            "readiness_breakdown": None
        }
    
    # --- PAID DATABASE CHECK ---
    context_text = "\n\n".join([doc.page_content for doc, _ in results])
    if "derwent" in context_text.lower() or "clarivate" in context_text.lower():
        if not has_paid_access:
             return {
                "status": "ABSTAIN",
                "intent": "PAID_DATA_ACCESS",
                "is_comparative": False,
                "needs_clarification": False,
                "answer": "This record belongs to a Paid Subscription Database. Explicit permission is required to access it.",
                "primary_citation": "Paid Database (Access Restricted)",
                "confidence_score": 1.0,
                "escalation_required": True,
                "grounding_verified": None,
                "source_metadata": None,
                "citations": [],
                "requires_paid_access": True,
                "external_links": [],
                "data": {},
                "sources": [],
                # ✅ READINESS SCORE (None for paid access)
                "readiness_score": None,
                "readiness_level": None,
                "readiness_color": None,
                "readiness_breakdown": None
            }
    # -----------------------------------------------

    top_doc, raw_score = results[0]

    # Floor check: reject low-scoring chunks to avoid hallucinated legal advice
    if raw_score < 0.20:
        return {
            "status": "ABSTAIN",
            "intent": "LOW_RELEVANCE",
            "is_comparative": (jurisdiction_scope == "BOTH"),
            "needs_clarification": False,
            "answer": build_abstain_message(language or response_language),
            "primary_citation": "Low Relevance Abstention",
            "confidence_score": 0.00,
            "escalation_required": True,
            "grounding_verified": None,
            "source_metadata": None,
            "citations": [],
            "data": {},
            "requires_paid_access": False,
            "external_links": [],
            "sources": [],
            # ✅ READINESS SCORE (None for low relevance)
            "readiness_score": None,
            "readiness_level": None,
            "readiness_color": None,
            "readiness_breakdown": None
        }

    # Extract source document page metadata for PDF viewer deep linking
    source_path = top_doc.metadata.get("source", "")
    page_num = top_doc.metadata.get("page", 0)
    file_name = os.path.basename(source_path) if source_path else f"{top_doc.metadata.get('act_name', 'Statute')}.pdf"
    try:
        page_display = int(page_num) + 1
    except (ValueError, TypeError):
        page_display = 1

    # Build citations for EVERY retrieved chunk
    citations = []
    seen_citation_keys = set()
    for doc, _score in results:
        c_source_path = doc.metadata.get("source", "")
        c_page_num = doc.metadata.get("page", 0)
        c_file_name = os.path.basename(c_source_path) if c_source_path else f"{doc.metadata.get('act_name', 'Statute')}.pdf"

        if not c_file_name.lower().endswith(".pdf"):
            continue  # skip JSON reference datasets

        try:
            c_page_display = int(c_page_num) + 1
        except (ValueError, TypeError):
            c_page_display = 1

        dedupe_key = (c_file_name, c_page_display)
        if dedupe_key in seen_citation_keys:
            continue
        seen_citation_keys.add(dedupe_key)

        citations.append({
            "file_name": c_file_name,
            "file_path": c_source_path,
            "page_number": c_page_display,
            "act_name": doc.metadata.get("act_name", "Statute"),
            "section": doc.metadata.get("section", "")
        })

    source_info = citations[0] if citations else None

    # Tag and assemble context chunks by jurisdiction
    context_chunks = []
    for doc, score in results:
        act = doc.metadata.get("act_name", "Statute")
        sec = doc.metadata.get("section", "General Reference")
        jur = doc.metadata.get("jurisdiction", "General")
        context_chunks.append(f"[{jur.upper()} REGIME — {act} — {sec}]:\n{doc.page_content.strip()}")

    context_str = "\n\n".join(context_chunks)

    # Run statutory reasoning chain
    final_answer = ""
    for _ in range(2):
        try:
            raw_diagnostic = diagnostic_chain.invoke({
                "chat_history": history_str if history_str else "None",
                "context": context_str,
                "query": query,
                "jurisdiction_scope": jurisdiction_scope,
                "product_category": product_category,
                "response_language": language or response_language
            })
            cleaned = clean_and_format_output(raw_diagnostic)

            # Completeness and structure validation
            is_complete = len(cleaned) >= 60 and not cleaned.strip().endswith(";")
            if jurisdiction_scope == "BOTH":
                is_complete = is_complete and ("National Framework" in cleaned or "International Framework" in cleaned or "भारतीय" in cleaned)

            if is_complete:
                final_answer = cleaned
                break
        except Exception as exc:
            final_answer = f"[Notice: Generation interrupted - {str(exc)}]\n\nStatutory Context:\n{context_str}"
            break

    # Static legal fallback covering the 2023 Biodiversity Amendment
    if not final_answer or len(final_answer.strip()) < 50 or final_answer.strip().endswith(";"):
        if jurisdiction_scope == "BOTH":
            final_answer = (
                "### 🇮🇳 National Framework (India — IPO & NBA)\n"
                "- **Assessment:** Biological resources ke commercial upyog aur IPR filing par Indian Patents Act 1970 aur Biological Diversity Act, 2002 (as amended in 2023) dono lagu hote hain. Section 10(4)(d) ke tehat geographical origin ka mandatory disclosure zaroori hai aur Section 3(p) TKDL crude formulation ko reject karta hai.\n\n"
                "- **Citation:** Patents Act 1970 (Section 10(4)(d), 3(p), 3(e)); Biological Diversity Act, 2002 (as amended by Amendment Act 2023, Section 6).\n\n"
                "- **Recommended Action:** TKDL prior art novelty check karein aur commercial entity ke roop me National Biodiversity Authority (NBA) me Form-III file karein.\n\n"
                "### 🌐 International Framework (WIPO & Treaties)\n"
                "- **Assessment:** WIPO GRATK Treaty (2024) ke Article 3 ke anusaar genetic resources par based patent application me country of origin disclose karna anivarya hai. Sath hi Nagoya Protocol ke Prior Informed Consent (PIC) aur Mutually Agreed Terms (MAT) satisfy hone chahiye.\n\n"
                "- **Citation:** WIPO GRATK Treaty 2024 (Article 3); Nagoya Protocol (ABS Provisions).\n\n"
                "- **Recommended Action:** International PCT patent application me origin certificate aur benefit-sharing clearance attach karein.\n\n"
                "### ⚖️ Comparative Interplay & Key Differences\n"
                "Bharat ka kanoon (BDA Section 6) patent filing se pehle NBA ki statutory prior-approval enforce karta hai, jabki WIPO GRATK Treaty global patent offices me origin disclosure ko harmonize karti hai taaki biopiracy ko roka ja sake."
            )
        else:
            is_vaidya_query = any(w in q_lower for w in ["vaidya", "practitioner", "churna bechta", "livelihood", "sustenance"])
            if is_vaidya_query:
                final_answer = (
                    "- **Assessment:** Registered AYUSH practitioner (Vaidya) jo indigenous medicine livelihood aur sustenance ke liye practice kar rahe hain, unhe mandatory prior approval aur ABS compliance se statutory exemption prapt hai.\n\n"
                    "- **Citation:** Section 7 Proviso, Biological Diversity Act, 2002 (as amended by the Biological Diversity (Amendment) Act, 2023).\n\n"
                    "- **Recommended Action:** Apni AYUSH state registration certificate aur traditional practice ka record maintain karein; large-scale commercial manufacturing par NBA compliance punah verify karein."
                )
            else:
                act_cited = top_doc.metadata.get('act_name', 'Indian Patents Act 1970 & Biological Diversity Act 2002')
                sec_cited = top_doc.metadata.get('section', 'Statutory Provisions')
                final_answer = (
                    f"- **Assessment:** Crude herbal formulation traditional knowledge ke tehat Section 3(p) me non-patentable hai. Naye extraction process ke liye Section 3(e) synergy aur novelty prove karni hogi.\n\n"
                    f"- **Citation:** {act_cited} ({sec_cited}).\n\n"
                    f"- **Recommended Action:** Praktikal patentability ke liye TKDL database aur NBA Form-III guidelines check karein."
                )

    normalized_conf = round(min(0.98, max(0.40, float(raw_score) + 0.35)), 2)

    # Resolve primary citation badge string
    is_vaidya_query = any(w in q_lower for w in ["vaidya", "practitioner", "churna bechta", "livelihood"])
    if is_vaidya_query:
        primary_cite = "Biological Diversity Act, 2002 (Sec 7 Proviso as amended in 2023)"
    elif jurisdiction_scope == "BOTH":
        primary_cite = "Dual Regime: Patents Act 1970 / BDA 2023 & WIPO GRATK 2024"
    else:
        primary_cite = f"{top_doc.metadata.get('act_name', 'Corpus')} — {top_doc.metadata.get('section', 'Statutory Reference')}"
        
    # --- EXTRACT LINKS ---
    external_links = []
    if "ipindia" in final_answer.lower() or "patent" in final_answer.lower():
        external_links.append("https://ipindia.gov.in")
    if "biodiversity" in final_answer.lower() or "nba" in final_answer.lower():
        external_links.append("https://nbaindia.org/")
    # ---------------------------------

    # ✅ CALCULATE READINESS SCORE FOR STATUTORY DIAGNOSTIC
    readiness = calculate_readiness_score(
        query=query,
        jurisdiction_scope=jurisdiction_scope,
        has_citations=len(citations) > 0,
        confidence_score=normalized_conf
    )

    return {
        "status": "SUCCESS",
        "intent": "STATUTORY_DIAGNOSTIC",
        "is_comparative": (jurisdiction_scope == "BOTH"),
        "needs_clarification": False,
        "answer": final_answer,
        "primary_citation": primary_cite,
        "confidence_score": normalized_conf,
        "escalation_required": False,
        "grounding_verified": True,
        "source_metadata": source_info,
        "requires_paid_access": False,
        "external_links": external_links,
        "sources": [source_info["file_name"]] if source_info else [file_name],
        "citations": citations,
        "data": {
            "jurisdiction_scope": jurisdiction_scope,
            "raw_context_count": len(results),
            "source_metadata": source_info
        },
        # ✅ READINESS SCORE (for statutory diagnostic)
        "readiness_score": readiness["score"],
        "readiness_level": readiness["level"],
        "readiness_color": readiness["color"],
        "readiness_breakdown": {
            "clarity": readiness["clarity"],
            "legal": readiness["legal"],
            "documentation": readiness["documentation"],
            "international": readiness["international"]
        }
    }