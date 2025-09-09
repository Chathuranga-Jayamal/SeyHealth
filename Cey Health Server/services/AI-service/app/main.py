from fastapi import FastAPI
from app.chat_router import router as chat_router
import uvicorn

app = FastAPI(title="Cey Health AI Chatbot")

app.include_router(chat_router, prefix="/chat")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=3500, reload=True)