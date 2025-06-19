from sqlalchemy import Column, Integer, String, DateTime
from database import Base  
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Conversation(Base):
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    question = Column(String)
    answer = Column(String)
    source = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
