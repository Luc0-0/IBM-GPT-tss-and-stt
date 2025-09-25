from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import datetime
import random

app = Flask(__name__)
CORS(app)

# --- Default responses ---
DEFAULT_COMMANDS = {
    "hello": "Hi there! How can I help you today?",
    "hi": "Hello, nice to see you!",
    "who are you": "I’m your personal voice assistant, built with IBM and GPT.",
    "time": lambda: f"The current time is {datetime.datetime.now().strftime('%H:%M')}",
    "date": lambda: f"Today is {datetime.datetime.now().strftime('%A, %B %d, %Y')}",
    "joke": lambda: random.choice([
        "Why don’t skeletons fight each other? Because they don’t have the guts.",
        "I told my computer I needed a break, and it said: no problem, I’ll go to sleep.",
        "Why was the math book sad? It had too many problems."
    ])
}

def get_default_response(user_text: str) -> str | None:
    """Match user_text with a default command and return response if found."""
    text = user_text.lower()
    for key, val in DEFAULT_COMMANDS.items():
        if key in text:
            return val() if callable(val) else val
    return None

# --- GPT endpoint ---
@app.route("/gpt", methods=["POST"])
def gpt_endpoint():
    data = request.json
    text = data.get("text", "")
    api_key = data.get("api_key")

    # If no GPT key → fallback to default responses
    if not api_key:
        default = get_default_response(text)
        if default:
            return jsonify({"response": default, "mode": "default"})
        else:
            return jsonify({"response": "Sorry, I don’t have an answer without GPT." , "mode": "default"})

    # If GPT key is given → call GPT
    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # lightweight but powerful
            messages=[{"role": "user", "content": text}]
        )
        return jsonify({"response": response.choices[0].message.content, "mode": "gpt"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
