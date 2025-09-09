from collections import deque

# Global memory dict: user_id -> deque of messages
chat_memory = {}
MAX_HISTORY = 10  # Keep last 10 messages

def get_chat_history(user_id):
    """
    Returns a list of dicts: [{"user": "text", "bot": "text"}, ...]
    """
    return list(chat_memory.get(user_id, deque()))

def update_chat_history(user_id, user_msg, bot_msg):
    """
    Updates memory with a new user/bot message pair.
    """
    if user_id not in chat_memory:
        chat_memory[user_id] = deque(maxlen=MAX_HISTORY)
    chat_memory[user_id].append({
        "user": user_msg,
        "bot": bot_msg
    })
