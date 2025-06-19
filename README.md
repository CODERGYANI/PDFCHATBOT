# PDF Chatbot

## Overview
This project is a simple PDF chatbot backend built using FastAPI.  
You can upload PDFs, process them into embeddings, and then ask questions.  
The bot returns answers based on the contents of the PDFs.

---

## Features
- Extract text from PDFs (OCR for scanned PDFs included)
- Store embeddings with FAISS
- RAG-based question answering
- Persistent chat history in a database
- REST API endpoints with FastAPI
- Ready to deploy on any server

---

## Tech Stack
- Python 3.x
- FastAPI
- LangChain
- HuggingFace Transformers
- FAISS
- SQLAlchemy (SQLite)
- PyMuPDF, pdf2image, pytesseract

---

## Folder Structure
project/
├─ documents/ # Uploaded PDFs
├─ vectorstore/ # Generated FAISS index
├─ pdf_processor.py # Handles PDF and OCR
├─ rag.py # RAG and QA logic
├─ chat.py # Chat routes
├─ main.py # FastAPI entrypoint
├─ models.py # DB models
├─ database.py # DB setup
├─ requirements.txt # Dependencies
└─ README.md



## Setup Instructions

### 1. Clone the repo
git clone https://github.com/yourusername/PDFCHATBOT.git
cd PDFCHATBOT



### 2. Create virtual environment and install requirements
python -m venv venv
venv\Scripts\activate # Windows

or source venv/bin/activate # MacOS/Linux
pip install -r requirements.txt



### 3. Install Poppler and Tesseract
Download and add these to your PATH:
- [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases/)
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)

---

## Usage

### 1. Build vectorstore
Add PDFs to `documents/` and then run:
python -c "from pdf_processor import load_vectorstore; load_vectorstore()"



### 2. Run the server
uvicorn main:app --reload



### 3. Test the API
- Upload new PDFs at `/pdf/upload-pdf`
- Ask questions at `/chat/ask`
- View history at `/chat/history?user_id=1`

---

## Troubleshooting
- If OCR doesn’t work, check Tesseract installation.
- If Poppler errors occur, make sure Poppler is in PATH.
- Check the log for missing input errors (`query`, etc.).

---

## Future Improvements
- Deploy on a cloud platform
- Improve frontend
- Add authentication
- Improve prompt handling and chunking

---

## Contact
For any queries or contributions, feel free to open an issue or contact the repo owner(me).
