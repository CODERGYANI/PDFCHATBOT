from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from rag import get_qa_chain
from models import Conversation
from pydantic import BaseModel
from datetime import datetime

chat_router = APIRouter()
qa = get_qa_chain()

class ChatRequest(BaseModel):
    user_id: int
    question: str

@chat_router.post("/ask")
def ask_question(req: ChatRequest, db: Session = Depends(get_db)):
    try:
      
        result = qa.invoke({"query": req.question})
        answer = result["result"]
        source = ", ".join(
            [doc.metadata.get("source", "unknown") for doc in result.get("source_documents", [])]
        )

       
        convo = Conversation(
            user_id=req.user_id,
            question=req.question,
            answer=answer,
            source=source,
            timestamp=datetime.now()
        )
        db.add(convo)
        db.commit()

        return {"answer": answer, "source": source}

    except Exception as e:
        print(f"\n🔥 ERROR in /chat/ask: {e}\n")
        raise HTTPException(status_code=500, detail="An error occurred while processing the question.")

@chat_router.get("/history")
def get_history(user_id: int, db: Session = Depends(get_db)):
    convos = db.query(Conversation).filter_by(user_id=user_id).all()
    return [
        {
            "question": c.question,
            "answer": c.answer,
            "source": c.source,
            "time": str(c.timestamp)
        }
        for c in convos
    ]
