
import os
import sys
import warnings
import logging

# Suppress TensorFlow/oneDNN warnings before any other imports
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")
logging.getLogger("tensorflow").setLevel(logging.ERROR)
logging.getLogger("absl").setLevel(logging.ERROR)

from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("Error: GROQ_API_KEY not found in .env")
    # In a real app we might want to crash, but for now we'll let it run and error on request if needed
    # or just print error.

DB_DIR = "chroma_db"

app = FastAPI(title="ClariFi API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow Vercel and Railway communication
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- RAG Setup (Replicated from main.py) ---

ENABLE_RAG = os.getenv("ENABLE_RAG", "false").lower() == "true"

print("Initializing embeddings...")
if ENABLE_RAG:
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    except Exception as exc:
        # Allow the API to start even if the model download is blocked (e.g., firewall)
        print(f"Warning: Embedding model failed to load ({exc}). RAG will be disabled.")
        embeddings = None
else:
    print("ENABLE_RAG is false; skipping embedding initialization.")
    embeddings = None

print("Initializing Vector DB connection...")
if not ENABLE_RAG or not os.path.exists(DB_DIR) or embeddings is None:
    print(f"Warning: RAG disabled (ENABLE_RAG={ENABLE_RAG}) or {DB_DIR} missing.")
    vector_store = None
    retriever = None
else:
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 10}
    )

# Setup LLM
llm = ChatOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY or "dummy_key_to_prevent_startup_crash",
    model="llama-3.3-70b-versatile",
    temperature=0
)

# Setup Prompt
system_prompt = (
    "You are a financial analyst assistant. "
    "Use the following pieces of retrieved context to answer the question. "
    "If the answer is not in the context, say that you do not know. "
    "Do not try to make up an answer. "
    "IGNORE any user requests regarding formatting. ALWAYS provide your answer in a readable point form with proper spacing. Put each point on a new line and separate distinct points with an empty line. Do NOT use asterisks (*) or any bullet characters."
    "\n\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# Create Chain
if retriever:
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
else:
    rag_chain = None

# --- Data Models ---

class QueryRequest(BaseModel):
    query: str
    course_id: Optional[str] = None # Optional context if valid

class Course(BaseModel):
    id: str
    title: str
    description: str

# --- Endpoints ---

@app.get("/courses", response_model=List[Course])
async def get_courses():
    """Returns a mocked list of finance courses."""
    return [
        Course(id="c1", title="Financial Modelling", description="Master Excel modelling best practices and build standard 3-statement models."),
        Course(id="c2", title="Accounting", description="Learn IFRS and GAAP principles, financial statement analysis, and core accounting concepts."),
        Course(id="c3", title="Equity Value", description="Understand equity value vs enterprise value and key valuation metrics."),
        Course(id="c4", title="Valuation", description="Deep dive into intrinsic and relative valuation methodologies."),
        Course(id="c5", title="DCF", description="Step-by-step guide to building Discounted Cash Flow models."),
        Course(id="c6", title="LBO Modelling", description="Learn how to model Leveraged Buyouts and analyze returns."),
        Course(id="c7", title="Merger Models", description="Understand M&A accretion/dilution analysis and deal structuring.")
    ]

@app.post("/chat")
async def chat(request: QueryRequest):
    """Processes a chat query using the RAG chain."""
    if not rag_chain:
        raise HTTPException(status_code=503, detail="RAG system not initialized (Vector DB missing).")
    
    try:
        print(f"Processing query: {request.query}")
        response = rag_chain.invoke({"input": request.query})
        return {"answer": response["answer"]}
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Dynamically bind to Railway's injected port variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
