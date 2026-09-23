import os
import json
from langchain_core.documents import Document
from langchain_text_splitters import CharacterTextSplitter
from rag_engine import vector_db, process_and_upload_pdf

data_folder = os.path.join(os.path.dirname(__file__), 'data')

# --- NAYA: PDF -> (jurisdiction, act_name) mapping ---
# FIX: process_and_upload_pdf() (via PyPDFLoader) never set a "jurisdiction"
# key on PDF chunks, so they were invisible to retrieve_dual_jurisdiction_context()'s
# filter={"jurisdiction": ...} search -- only the JSON reference files (which
# explicitly had jurisdiction="India") could ever be retrieved. This mapping
# lets every PDF chunk carry the right jurisdiction + a human-readable act_name
# so citations/retrieval work correctly. Matching is done by a lowercase
# substring check against the filename, so it survives minor filename variations.
PDF_METADATA_RULES = [
    # (keyword to match in filename, jurisdiction, act_name)
    ("patents_act", "India", "Patents Act, 1970"),
    ("biological_diversity", "India", "Biological Diversity Act, 2002"),
    ("bd_act_amendment", "India", "Biological Diversity (Amendment) Act, 2023"),
    ("drugsandcosmetics", "India", "Drugs & Cosmetics Act, 1940 and Rules, 1945"),
    ("food_safety", "India", "Food Safety and Standards Act, 2006"),
    ("nagoya", "International", "Nagoya Protocol"),
    ("wipo", "International", "WIPO GRATK Treaty"),
]

DEFAULT_JURISDICTION = "India"  # fallback for any PDF that doesn't match a rule above
DEFAULT_ACT_NAME = "Statute"


def resolve_pdf_metadata(filename: str) -> dict:
    """Looks up jurisdiction + act_name for a PDF based on its filename.

    Filenames in the data folder mix underscores and spaces (e.g.
    "Patents_Act_1970.pdf" vs "THE BIOLOGICAL DIVERSITY ACT, 2002...pdf"),
    so we normalize by stripping spaces/underscores/commas before matching,
    and keep the rule keywords in the same normalized form.
    """
    normalized = filename.lower().replace(" ", "").replace("_", "").replace(",", "").replace("-", "")
    for keyword, jurisdiction, act_name in PDF_METADATA_RULES:
        if keyword.replace("_", "") in normalized:
            return {"jurisdiction": jurisdiction, "act_name": act_name}
    # No rule matched -- still tag with a default jurisdiction so the chunk
    # remains retrievable, instead of silently falling through the filter.
    print(f"⚠️  No metadata rule matched for '{filename}', using default jurisdiction='{DEFAULT_JURISDICTION}'.")
    return {"jurisdiction": DEFAULT_JURISDICTION, "act_name": DEFAULT_ACT_NAME}


if os.path.exists(data_folder):
    all_files = os.listdir(data_folder)
    pdf_files = [f for f in all_files if f.endswith('.pdf')]
    json_files = [f for f in all_files if f.endswith('.json')]
    
    print(f'📂 Found {len(pdf_files)} PDFs and {len(json_files)} JSON files.')
    
    # 1. Process PDFs
    for pdf in pdf_files:
        pdf_path = os.path.join(data_folder, pdf)
        pdf_metadata = resolve_pdf_metadata(pdf)
        print(f"Processing PDF: {pdf}... (jurisdiction={pdf_metadata['jurisdiction']}, act_name={pdf_metadata['act_name']})")
        process_and_upload_pdf(pdf_path, extra_metadata=pdf_metadata)
        
    # 2. Process JSON files
    for jfile in json_files:
        jpath = os.path.join(data_folder, jfile)
        print(f'Processing JSON: {jfile}...')
        try:
            with open(jpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            text_content = json.dumps(data, indent=2, ensure_ascii=False)
            splitter = CharacterTextSplitter(chunk_size=800, chunk_overlap=100)
            chunks = splitter.create_documents([text_content], metadatas=[{'source': jfile, 'jurisdiction': 'India'}])
            vector_db.add_documents(chunks)
        except Exception as e:
            print(f'Error reading JSON {jfile}: {e}')
            
    print('🎉 All files successfully indexed into ChromaDB vector store!')
else:
    print('❌ Data folder nahi mila!')