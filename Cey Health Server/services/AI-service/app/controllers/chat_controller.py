from app.services.langchain_service import symptom_chain
from app.services.vector_service import add_doctor

async def handle_chat(request):
    try:
        user_info = request.user
        user_input = request.message

        response = await symptom_chain(user_info, user_input)

        return {"response": response["response"]}
    except Exception as e:
        print(e)
        return {"response": str(e)}


async def handle_doctor(request):
    try:
        doctor = request.doctor

        #Add the doctor
        response = add_doctor(doctor)

        if(response):
            return {"response": True}
        else:
            return {"response": False}
    except Exception as e:
        print(e)
        return {"response": False}