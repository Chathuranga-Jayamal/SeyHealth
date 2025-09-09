from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings

persist_directory = "chroma_db"

# Lightweight CPU-friendly embedding
embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize the Chroma vector store
db = Chroma(persist_directory=persist_directory, embedding_function=embedding)

# Function to add documents
def add_documents(docs, metadata=None):
    db.add_texts(texts=docs, metadatas=metadata)
    print("Documents added to vector store")

# Function to search documents
def search_documents(query, k=3):
    return db.similarity_search(query, k=k)

# Function to add a doctor
def add_doctor(doctor):
    docs = [f"{doctor.name} is a specialist in {doctor.speciality} and qualified in {doctor.qualification}"]
    metadata = [{"type": "doctor"}]
    add_documents(docs, metadata)
    print(f"Doctor {doctor.name} added to vector store")
    return True

# Function to search for doctors by symptoms
def search_doctors_by_symptoms(symptom_input, k=3):
    results = db.similarity_search(symptom_input, k=k, filter={"type": "doctor"})
    print('search results of doctors', results)
    return results
