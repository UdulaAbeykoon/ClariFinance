import os
import shutil
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

SOURCE_DIR = "source_docs"
DB_DIR = "chroma_db"

def load_documents():
    documents = []
    if not os.path.exists(SOURCE_DIR):
        os.makedirs(SOURCE_DIR)
        print(f"Created {SOURCE_DIR} - please drop files here.")
        return []

    for filename in os.listdir(SOURCE_DIR):
        file_path = os.path.join(SOURCE_DIR, filename)
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
            documents.extend(loader.load())
        elif filename.endswith(".txt"):
            loader = TextLoader(file_path)
            documents.extend(loader.load())
    
    return documents

def ingest():
    # 1. Load Documents
    print(f"Loading documents from {SOURCE_DIR}...")
    docs = load_documents()
    if not docs:
        print("No documents found in source_docs/.")
        return

    # 2. Split Text
    print("Splitting documents...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(docs)
    print(f"Created {len(chunks)} chunks.")

    # 3. Create Embeddings
    print("Initializing embeddings (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 4. Create/Update Vector DB
    # Clean existing DB to ensure fresh start (optional, but good for this persistent setup)
    if os.path.exists(DB_DIR):
        try:
            shutil.rmtree(DB_DIR)
        except PermissionError:
            print(f"Error: Could not delete {DB_DIR}. likely because it is being used by another process (like main.py).")
            print("Please close any running instances of the chat application and try again.")
            return
    
    print("Creating ChromaDB...")
    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_DIR
    )
    print(f"Vector DB created in {DB_DIR}")

if __name__ == "__main__":
    ingest()
