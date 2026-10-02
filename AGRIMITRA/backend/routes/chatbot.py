from fastapi import APIRouter
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from chatbot.rag import ask_agrimitra

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/")
def chat_with_agrimitra(request: ChatRequest):
    answer = ask_agrimitra(request.question)
    return {"answer": answer}
