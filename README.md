# 🌿 IP-SAKTI Sahayak

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange)](https://www.sih.gov.in/)
[![Team](https://img.shields.io/badge/Team-Data__Exora-245C3A)](#team)
[![Problem Statement](https://img.shields.io/badge/PS-SIH26045-blue)](#)
[![Theme](https://img.shields.io/badge/Theme-HealthTech-green)](#)

A source-grounded AI decision-support platform that simplifies the **Intellectual Property, Traditional Knowledge, biodiversity, and regulatory journey for Ayurveda innovations**.

Built by **Data_Exora** for **Smart India Hackathon 2026**, IP-SAKTI Sahayak helps Ayurveda practitioners, researchers, startups, MSMEs, cultivators, and innovators move from:

**Product Idea → Classification → IP & ABS Assessment → Readiness → Risk Identification → Source-Grounded Guidance → Next Steps**

---

## 📌 Overview

**IP-SAKTI Sahayak** is a source-grounded AI decision-support platform designed to simplify the Intellectual Property (IP), Traditional Knowledge, biodiversity, and regulatory journey for Ayurveda-based innovations.

For Ayurveda practitioners, researchers, startups, MSMEs, cultivators, and innovators, navigating patents, Traditional Knowledge, biodiversity requirements, regulatory frameworks, prior art, and documentation can be complex.

IP-SAKTI Sahayak converts this complexity into a structured digital journey:

> **Product Idea → Classification → Readiness Assessment → Risk Identification → Source-Grounded Guidance → Next Steps**

The platform combines deterministic workflows, curated knowledge sources, Retrieval-Augmented Generation (RAG), document analysis, similarity-based discovery, confidence scoring, and human escalation to provide understandable and evidence-backed guidance.

> **Disclaimer:** IP-SAKTI Sahayak is a decision-support and information platform. It does not replace advice from qualified legal, regulatory, or IP professionals.

---

# 🎯 How IP-SAKTI Sahayak Addresses the Problem

- **Unifies** complex IP and regulatory requirements into one guided workflow.
- **Connects** formulations, ingredients, Traditional Knowledge, patents, research, and references through similarity-based discovery and a Knowledge Graph.
- Uses **curated legal and regulatory sources**, document uploads, confidence scoring, and safe escalation.
- Identifies **information gaps and potential next steps**.
- Provides **research collections, FAQs, tutorials, and an Ayurveda Dictionary**.
- Supports **multilingual interaction** for wider accessibility.
- Maintains an **evidence trail** behind AI-generated guidance.

---

# ✨ Key Features

| Key Feature | Description |
|---|---|
| 🧭 **AI-Powered IP & Regulatory Navigator** | Provides a single guided workflow to help Ayurveda practitioners, researchers, startups, MSMEs, cultivators, and innovators navigate IP and regulatory pathways. |
| 📊 **IP Readiness Assessment** | Evaluates IP, documentation, compliance, and related readiness factors to identify gaps and guide users toward relevant next steps. |
| 💡 **Innovation Passport** | Creates a structured record of the innovation containing product information, IP considerations, evidence, identified gaps, readiness information, and potential next steps. |
| 🕸️ **Knowledge Graph** | Connects ingredients, formulations, traditional uses, research, patents, and related information to provide a connected view of the Ayurveda innovation ecosystem. |
| 🌍 **Jurisdiction Switcher** | Allows users to switch between Indian and international contexts so that the platform can provide jurisdiction-specific IP, regulatory, and compliance guidance. |
| 🤝 **Ayurveda & IP Community** | Helps users discover Ayurveda institutions and patent owners for collaboration, networking, and knowledge sharing. |
| 📱 **WhatsApp-Based Accessibility** | Extends access through WhatsApp-based interaction, making IP and regulatory guidance easier to access through a familiar communication platform. |
| 🎙️ **Offline Voice Assistance** | Enables voice-based access in low- or no-network environments to improve last-mile accessibility for users who may have limited internet connectivity. |
| 🧩 **Know Your Product Classification** | Understands product details, ingredients, formulation, intended use, and claims to guide users toward relevant product categories and compliance considerations. |
| 🌱 **Integrated IP & ABS Assessment** | Brings together relevant IP pathways and biodiversity / Access & Benefit Sharing considerations into a unified assessment workflow. |
| 🔍 **Traditional Knowledge & Prior-Art Similarity Scanner** | Performs similarity-based discovery using formulation details, ingredients, traditional uses, therapeutic indications, references, and related patent information. |
| 🧠 **RAG-Based AI Assistant** | Uses Retrieval-Augmented Generation to retrieve relevant information from curated knowledge sources before generating AI-assisted responses. |
| 📚 **Source-Grounded Responses** | Provides supporting sources and citations with AI-generated guidance to improve traceability and evidence-based decision support. |
| 🎯 **Confidence-Based Guidance** | Evaluates retrieval and evidence quality to provide confidence-aware responses rather than treating every generated answer as equally reliable. |
| 🛑 **Safe Abstention** | Avoids unsupported guidance when sufficient reliable evidence is unavailable and can route such queries for further review. |
| 👨‍⚖️ **Human Expert Escalation** | Allows low-confidence or unresolved queries to be escalated for appropriate human review. |
| 📄 **Document Upload & Analysis** | Allows users to upload formulation and supporting documents for analysis within the decision-support workflow. |
| 🌐 **Multilingual Support** | Supports multilingual interaction to make the platform more accessible to users across the AYUSH ecosystem. |
| 📖 **Ayurveda Dictionary** | Provides simple explanations of Ayurveda terminology to help users understand technical terms. |
| 📚 **Knowledge Collections** | Provides curated collections covering legal and regulatory information, Ayurveda and Traditional Knowledge, research and publications, and patents and innovation. |
| 🔎 **Hybrid Search** | Combines semantic/vector retrieval with keyword-based search to improve discovery of relevant knowledge-base information. |
| 📋 **Evidence Trail** | Maintains supporting information behind AI-assisted guidance so users can trace responses back to retrieved evidence. |
| 🔐 **Secure Authentication** | Provides user authentication and protected access to relevant platform functionality using JWT-based authentication. |
| 💬 **Session Context** | Maintains relevant product and conversation context throughout a user session for more consistent interactions. |

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    USER / CUSTOMER                          │
│ Practitioner • Startup/MSME • Researcher • Cultivator       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  1. USER CHANNELS                           │
│                                                             │
│ Web • Voice • Upload • Multilingual Interaction             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                REACT FRONTEND                               │
│                                                             │
│ React + TypeScript + Vite + Tailwind CSS                    │
│                                                             │
│ Home • Ask SAKTI AI • Know Your Product • Library           │
│ Knowledge Graph • Community • Help & Support                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                         REST API / JSON
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                             │
│                                                             │
│ Authentication • Chat • RAG • Document Processing            │
│ Session Context • API Routing                               │
└─────────────────────────────┬───────────────────────────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ RAG ENGINE       │ │ DATABASE         │ │ AUTHENTICATION   │
│                  │ │                  │ │                  │
│ Query Routing    │ │ SQLite           │ │ JWT              │
│ Hybrid Search    │ │ Sessions         │ │ Password Hashing │
│ Embeddings       │ │ User Data        │ │ Protected APIs   │
│ LLM              │ │ Chat History     │ │                  │
│ Validation       │ │                  │ │                  │
└────────┬─────────┘ └──────────────────┘ └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              CURATED KNOWLEDGE BASE                         │
│                                                             │
│ Indian IP Laws • AYUSH Sources • TKDL-related Sources       │
│ Regulatory Frameworks • Research • Patents • References     │
└─────────────────────────────────────────────────────────────┘
```

---

# 🔄 RAG Intelligence Workflow

```text
User Query
    │
    ▼
Query Router
    │
    ├── Knowledge Graph Retrieval
    │
    ├── Semantic / Vector Search
    │
    └── Keyword / BM25 Search
             │
             ▼
      Hybrid Retrieval
             │
             ▼
      Evidence Assessment
             │
             ▼
          LLM
             │
             ▼
       Validation Layer
             │
             ├── High Confidence
             │       │
             │       ▼
             │   Cited Response
             │
             └── Low Confidence
                     │
                     ▼
              Human Review / Escalation
```

---

# 🗂️ Project Structure

The repository currently contains the following main structure:

```text
IP-SAKTI/
│
├── backend_rag/
│   │
│   ├── auth/
│   │   ├── hashing.py
│   │   └── jwt_handler.py
│   │
│   ├── chroma_db/
│   │   ├── <collection-data>/
│   │   └── chroma.sqlite3
│   │
│   ├── data/
│   │
│   ├── database/
│   │   ├── db_setup.py
│   │   └── models.py
│   │
│   ├── generated_reports/
│   │
│   ├── routers/
│   │   ├── auth_routes.py
│   │   └── chat_routes.py
│   │
│   ├── temp_uploads/
│   │
│   ├── ingest_all.py
│   ├── ip_sakti.db
│   ├── main.py
│   ├── rag_engine.py
│   ├── report_generator.py
│   ├── requirements.txt
│   └── ...
│
├── Frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── ChatBot.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageFrame.tsx
│   │   │   ├── ProductJourney.tsx
│   │   │   ├── SectionIntro.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── TutorialStrip.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Ask-Sakti-ai.tsx
│   │   │   ├── CommunityPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DictionaryPage.tsx
│   │   │   ├── Help&Support.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   ├── knowYourProduct.tsx
│   │   │   ├── Library.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── PatentSearchPage.tsx
│   │   │   ├── signupPage.tsx
│   │   │   └── TKDLpage.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── data.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy

## Database

- SQLite
- ChromaDB

## AI / RAG

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Hybrid Search
- Embeddings
- Large Language Model (LLM)
- Knowledge Graph
- Confidence-based validation

## Authentication

- JWT
- Password hashing
- Protected API routes

## Deployment

- Frontend: Vercel
- Backend: Deployable as a FastAPI service

---

# 🚀 Quick Start

## 1. Clone the Repository

```bash
git clone 

cd IP-SAKTI-Sahayak
```

---

# 🐍 Backend Setup

Open a terminal in the project root.

```bash
cd backend_rag
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI backend:

```bash
uvicorn main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a **new terminal**.

From the project root:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend_rag` directory:

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | API key used to access the OpenRouter LLM service. |
| `LLM_MODEL` | Specifies the LLM model used by the application. |
| `DATABASE_URL` | Defines the database connection URL. |
| `SECRET_KEY` | Secret used for JWT authentication and token security. |
| `ALGORITHM` | JWT signing algorithm used for authentication. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Defines how long an authentication token remains valid. |

### Example

Add sensitive environment files to `.gitignore`.

Example:

```gitignore
.env
.env.*
venv/
__pycache__/
*.pyc
```

---

# 📖 User Journey

```text
                    START
                      │
                      ▼
              Enter Product Details
                      │
                      ▼
             Know Your Product
                      │
                      ▼
              Product Classification
                      │
                      ▼
              IP & ABS Assessment
                      │
                      ▼
              Readiness Assessment
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        Potential Risk      No Major Gap
             │                 │
             ▼                 │
       Prior-Art / TK         │
       Similarity Check       │
             │                 │
             └────────┬────────┘
                      ▼
              Ask SAKTI AI
                      │
                      ▼
              RAG Retrieval
                      │
                      ▼
             Evidence Validation
                      │
             ┌────────┴────────┐
             │                 │
        High Confidence    Low Confidence
             │                 │
             ▼                 ▼
       Cited Guidance      Human Review
             │                 │
             └────────┬────────┘
                      ▼
                 Next Steps
                      │
                      ▼
              Innovation Passport
```

---

# 🧠 Knowledge Ingestion Pipeline

The knowledge base follows an offline ingestion workflow:

```text
Official / Curated Sources
          │
          ▼
    Document Collection
          │
          ▼
     OCR / PDF Extraction
          │
          ▼
    Document Cleaning
          │
          ▼
   Metadata Extraction
          │
          ▼
   Chunking & Indexing
          │
          ├───────────────┐
          ▼               ▼
      Embeddings       Keyword Index
          │               │
          └───────┬───────┘
                  ▼
           Hybrid Retrieval
                  │
                  ▼
              RAG Engine
```

Metadata can include information such as:

- Source
- Jurisdiction
- Document type
- Publication date
- Legal / regulatory category
- Relevant topic
## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register User |
| `POST` | `/api/auth/login` | Login User |
| `POST` | `/api/chat` | Chat with Bot |
| `GET` | `/` | Read Root |
| `POST` | `/api/upload` | Upload Document |
| `POST` | `/api/authorize_paid_access` | Authorize Paid Data |
| `POST` | `/api/generate-report` | Generate Innovation Passport |
| `GET` | `/api/download-report/{file_name}` | Download Report |
| `GET` | `/api/reports` | List Reports |
| `DELETE` | `/api/reports/{file_name}` | Delete Report |
| `GET` | `/api/sessions/{session_id}` | Get Session Info |
| `GET` | `/api/sessions` | List User Sessions |

### API Documentation

`http://127.0.0.1:8000/docs`

---

# 🔮 Future Scope

Potential future extensions include:

- Expanded multilingual voice interaction
- Additional official knowledge sources
- More advanced patent search integrations
- Expanded Knowledge Graph coverage
- Improved document intelligence
- Expert review workflows
- Government / institutional API integration
- Premium external research datasets
- Offline or low-connectivity voice assistance
- Advanced analytics and reporting
- PostgreSQL-based production scaling

---

# 📜 Disclaimer

IP-SAKTI Sahayak provides AI-assisted information and decision support based on available sources.

The platform does **not** provide legal advice, does not determine legal rights, and does not replace qualified IP, legal, regulatory, biodiversity, or professional advice.

Similarity results, readiness scores, classifications, confidence values, and AI-generated responses should be reviewed appropriately before being used for legal, regulatory, commercial, or filing decisions.

---

# ⭐ Vision

> **Make the journey from an Ayurveda innovation to informed IP and regulatory action simpler, more accessible, and more evidence-driven.**

**IP-SAKTI Sahayak — One Innovation. One Guided Journey.**

---

## 🤝 Contributing

This project was developed for **Smart India Hackathon 2026** by **Team Data_Exora**.

Contributions, suggestions, and improvements are welcome.

## 👥 Team Data_Exora

**Smart India Hackathon 2026**  
**Problem Statement ID:** SIH26045  
**Theme:** HealthTech  
**Team:** Data_EXORA 

---

**Developed for Smart India Hackathon 2026**
