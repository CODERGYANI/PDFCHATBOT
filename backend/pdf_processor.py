import os
import fitz  # PyMuPDF
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

from pdf2image import convert_from_path
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document


def ocr_pdf_page_images(file_path):
    print("🧠 OCR fallback triggered...")
    try:
        images = convert_from_path(file_path)
    except Exception as e:
        print(f"❌ OCR failed for {file_path}: {e}")
        return []

    docs = []
    for i, img in enumerate(images):
        text = pytesseract.image_to_string(img)
        if text.strip():
            source = f"{os.path.basename(file_path)} - OCR Page {i + 1}"
            docs.append(Document(page_content=text, metadata={"source": source}))
            print(f"   🖼️ OCR Page {i+1} sample: {text[:100].strip()}...")
        else:
            print(f"   ⚠️ OCR Page {i+1} has no readable text.")
    return docs


def process_pdf(file_path):
    texts = []
    print(f"\n📄 Processing file: {file_path}")
    try:
        doc = fitz.open(file_path)
    except Exception as e:
        print(f"❌ Error opening PDF: {e}")
        return []

    print(f"📄 Total pages: {len(doc)}")

    for i, page in enumerate(doc):
        text = page.get_text("text")  # Robust mode
        print(f"DEBUG: Raw extracted text from page {i+1}: {repr(text[:100])}")
        if text.strip():
            source = f"{os.path.basename(file_path)} - Page {i + 1}"
            texts.append(Document(page_content=text, metadata={"source": source}))
        else:
            print(f"   ⚠️ Page {i+1} has no extractable text.")

    if not texts:
        print("⚠️ No extractable text found — switching to OCR")
        texts = ocr_pdf_page_images(file_path)
        for i, doc in enumerate(texts):
            print(f"[OCR DEBUG] Page {i+1}:\n{doc.page_content[:300]}\n")

        


    return texts


def load_vectorstore(pdf_dir="documents", index_dir="vectorstore"):
    all_docs = []

    if not os.path.exists(pdf_dir):
        print(f"❌ Directory '{pdf_dir}' not found.")
        return

    print(f"\n📂 Scanning directory: {pdf_dir}")
    for fname in os.listdir(pdf_dir):
        if fname.lower().endswith(".pdf"):
            full_path = os.path.abspath(os.path.join(pdf_dir, fname))
            print(f"📎 Reading: {full_path}")

            if not os.path.exists(full_path):
                print(f"❌ File does not exist: {full_path}")
                continue
            if os.path.getsize(full_path) == 0:
                print(f"❌ File is empty: {full_path}")
                continue

            try:
                docs = process_pdf(full_path)
            except Exception as e:
                print(f"❌ Failed to process {fname}: {e}")
                continue

            if docs:
                print(f"✅ Extracted {len(docs)} pages from '{fname}'")
                all_docs.extend(docs)
            else:
                print(f"⚠️ No readable content in '{fname}'")

    print(f"\n📚 Total documents/pages collected: {len(all_docs)}")

    if not all_docs:
        print("❌ No content to embed. Please check your PDFs.")
        return

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=1000)
    split_docs = splitter.split_documents(all_docs)
    print(f"🧩 Total chunks created: {len(split_docs)}")

    if not split_docs:
        print("❌ ERROR: No chunks created. Check if your PDFs contain extractable or OCR-able text.")
        return

    print("\n🔍 Generating embeddings and saving vectorstore...")
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(split_docs, embedding)
    vectorstore.save_local(index_dir)

    print(f"✅ Vectorstore saved at: '{index_dir}/index.faiss' and 'index.pkl'\n")
