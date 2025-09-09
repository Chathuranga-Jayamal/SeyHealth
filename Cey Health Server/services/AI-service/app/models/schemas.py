from pydantic import BaseModel
from typing import List, Optional

class UserInfo(BaseModel):
    id: int
    name: str
    age: Optional[int] = None
    medical_records: Optional[str] = "User History Not Found"
class ChatRequest(BaseModel):
    user: UserInfo
    message: str

class ChatResponse(BaseModel):
    response: str

class DoctorRequest(BaseModel):
    doctor: str

class DoctorResponse(BaseModel):
    response: bool