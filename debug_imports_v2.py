try:
    import langchain
    print(f"Langchain: Version={getattr(langchain, '__version__', 'N/A')} File={getattr(langchain, '__file__', 'N/A')}")
    
    import langchain_community
    print(f"Community: {getattr(langchain_community, '__version__', 'N/A')}")
    
    import langchain_core
    print(f"Core: {getattr(langchain_core, '__version__', 'N/A')}")
    
    try:
        from langchain.chains import create_retrieval_chain
        print("Import create_retrieval_chain success")
    except ImportError as e:
        print(f"Failed to import create_retrieval_chain: {e}")

    try:
        from langchain_openai import ChatOpenAI
        print("Import ChatOpenAI success")
    except ImportError as e:
        print(f"Failed to import ChatOpenAI: {e}")

except Exception as e:
    print(f"General Error: {e}")
