from fastapi import APIRouter, Request
from app.controllers.chat_controller import handle_chat, handle_doctor
from app.models.schemas import ChatRequest, ChatResponse, DoctorRequest, DoctorResponse

router = APIRouter()

@router.post("/")
async def chat_endpoint(request: ChatRequest)-> ChatResponse:
    print('/ request', request)
    return await handle_chat(request)

@router.post("/doctor")
async def chat_endpoint(request: DoctorRequest)-> DoctorResponse:
    print('/doctor request', request)
    return await handle_doctor(request)