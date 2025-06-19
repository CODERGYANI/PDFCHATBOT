from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from chat import chat_router 
from database import engine
from models import Base
from pdf_api import pdf_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(pdf_router, prefix="/pdf")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth")
app.include_router(chat_router, prefix="/chat")  

@app.get("/")
def read_root():
    return {"message": "Backend is running"}
