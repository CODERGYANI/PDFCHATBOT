from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from pdf_processor import load_vectorstore

pdf_router = APIRouter()

UPLOAD_DIR = "documents"

@pdf_router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    load_vectorstore()  # Re-index the documents including the new one
    return {"message": f"{file.filename} uploaded and processed successfully."}
