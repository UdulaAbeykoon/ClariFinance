import os
import sys
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load environment variables
load_dotenv()

DB_DIR = "chroma_db"

def debug():
    print("Initializing embeddings...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    if not os.path.exists(DB_DIR):
        print(f"Error: {DB_DIR} not found.")
        return
        
    print("Loading Vector DB...")
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    query = "What Does “Financial Modeling” Mean?"
    print(f"\nQuery: {query}")
    print("-" * 50)
    
    print(f"Collection count: {vector_store._collection.count()}")
    
    # Retrieve docs
    results = vector_store.similarity_search_with_score(query, k=10)
    
    if not results:
        print("No results found!")
    
    for i, (doc, score) in enumerate(results):
        print(f"\n[Result {i+1}] Score: {score:.4f}")
        print(f"Source: {doc.metadata.get('source', 'Unknown')}")
        print(f"Content Preview: {doc.page_content[:400]}...") # Increased preview
        print("-" * 30)

if __name__ == "__main__":
    debug()
