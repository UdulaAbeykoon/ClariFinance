import os
import sys
from dotenv import load_dotenv
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
    sys.exit(1)

DB_DIR = "chroma_db"

def main():
    # 1. Initialize Embeddings
    print("Initializing embeddings...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 2. Load Vector DB
    if not os.path.exists(DB_DIR):
        print(f"Error: {DB_DIR} not found. Please run 'python ingest.py' first.")
        sys.exit(1)
        
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    # 3. Setup Retriever
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 10} # Retrieve top 10 chunks
    )

    # 4. Setup LLM (Using Groq via OpenAI SDK for stability)
    llm = ChatOpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=GROQ_API_KEY,
        model="llama-3.3-70b-versatile",
        temperature=0
    )

    # 5. Setup Prompt and Chain
    system_prompt = (
        "You are a financial analyst assistant. "
        "Use the following pieces of retrieved context to answer the question. "
        "If the answer is not in the context, say that you do not know. "
        "Do not try to make up an answer. "
        "Always provide your answer in a readable point form. Put each point on a new line. Do NOT use asterisks (*) or any bullet characters."
        "\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    # 6. Chat Loop
    print("\nFinance AI Ready! Type 'exit' to quit.\n")
    
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break
        
        if not query.strip():
            continue

        print("AI: Thinking...")
        response = rag_chain.invoke({"input": query})
        print(f"AI: {response['answer']}\n")

if __name__ == "__main__":
    main()
