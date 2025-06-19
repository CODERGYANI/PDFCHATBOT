from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

def get_qa_chain():
    # Load embeddings and vector store
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.load_local("vectorstore", embedding, allow_dangerous_deserialization=True)
    retriever = db.as_retriever(search_kwargs={"k": 5})

    # Load LLM (Flan-T5)
    hf_pipeline = pipeline("text2text-generation", model="google/flan-t5-large")
    llm = HuggingFacePipeline(pipeline=hf_pipeline)

    # Simple RetrievalQA chain
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
        chain_type="stuff"
    )

    return qa
