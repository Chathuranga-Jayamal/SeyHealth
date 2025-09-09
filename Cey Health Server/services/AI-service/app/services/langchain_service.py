from langchain.chat_models import ChatOpenAI
from app.utils.promt_templates import SYMPTOM_CHECKER_PROMPT
from app.services.vector_service import search_doctors_by_symptoms
from app.memory.memory_store import get_chat_history, update_chat_history
from app.config import OPENROUTER_API_KEY

llm = ChatOpenAI(
    model_name="mistralai/mistral-small-3.2-24b-instruct:free",
    temperature=0.7,
    openai_api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

async def symptom_chain(user_info, user_input):
    try:
        # Search doctors (may be empty)
        matched_doctors = search_doctors_by_symptoms(user_input) or []

        # Get last 10 messages (may be empty)
        history = get_chat_history(user_info.id) or []
        history_text = "\n".join([f"User: {h['user']}\nBot: {h['bot']}" for h in history])
        if not history_text:
            history_text = "No previous chat history."

        print("History:", history_text)

        # If no matched doctors
        if not matched_doctors:
            matched_doctors_text = "No matching doctors found."
        else:
            matched_doctors_text = ", ".join([d['name'] for d in matched_doctors])

        print("Doctors:", matched_doctors_text)

        # Build prompt
        prompt = SYMPTOM_CHECKER_PROMPT.format(
            user_info=str(user_info),
            user_input=user_input,
            matched_doctors=matched_doctors_text,
            chat_history=history_text
        )

        print("Prompt:", prompt)

        # Call LLM
        response = await llm.ainvoke(prompt)
        response_text = response.content

        print("Response:", response_text)

        # Update chat history
        update_chat_history(user_info.id, user_input, response_text)

        return {"response": response_text}

    except Exception as e:
        print("Error in symptom_chain:", e)
        return {"response": str(e)}
