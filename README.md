# IBM-GPT-tss-and-stt

🎙️ **A Voice Assistant Powered by IBM Watson & OpenAI GPT**

This project allows seamless voice interactions via both **browser** and **backend** modes. It integrates IBM Watson's Text-to-Speech (TTS) and Speech-to-Text (STT) with OpenAI GPT, enabling natural, intelligent conversations.

---

## 🚀 Features

* **Browser & Backend Modes**: Interact via your browser UI or backend terminal.
* **API Key Input**: Users can input their OpenAI GPT API key through the UI.
* **Default Commands**: Predefined responses for common queries if GPT key is not provided.
* **GPT-Powered Responses**: Dynamically generate intelligent responses when a valid API key is supplied.
* **Text-to-Speech & Speech-to-Text**: Convert spoken words to text and generate speech responses.

---

## 🔧 Default Commands

These are available even **without a GPT API key**:

| Command     | Response Example                                             |
| ----------- | ------------------------------------------------------------ |
| hello / hi  | "Hi there! How can I help you today?"                        |
| who are you | "I’m your personal voice assistant, built with IBM and GPT." |
| time        | Returns current time (HH:MM)                                 |
| date        | Returns current date (e.g., Monday, September 25, 2025)      |
| joke        | Returns a random joke from a predefined list                 |

> The backend automatically matches the user's input to these commands.

---

## 🛠️ Technologies Used

* **IBM Watson STT & TTS** – Speech recognition and synthesis
* **OpenAI GPT-4o-mini** – Lightweight GPT model for conversation
* **Python & Flask** – Backend server and API
* **JavaScript/HTML/CSS** – Browser UI

---

## 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/Luc0-0/IBM-GPT-tss-and-stt.git
cd IBM-GPT-tss-and-stt
```

2. **Install Backend Dependencies**

```bash
pip install -r backend/requirements.txt
```

3. **Configure API Keys**

* Set your OpenAI GPT API key in the browser UI when prompted.
* IBM Watson credentials are used for TTS/STT as needed.

4. **Run the Backend**

```bash
cd backend
python app.py
```

5. **Run the Frontend**

```bash
cd frontend
npm install
npm start
```

* Open `http://localhost:3000` in your browser to interact with the assistant.

---

## 🧪 Usage

* **Browser Mode**: Click the microphone icon → speak → get GPT or default responses read back.
* **Backend Mode**: Send POST requests to `/gpt` with `text` and optional `api_key`.

  * Without `api_key`, default commands are used.
  * With `api_key`, GPT generates dynamic responses.

Example POST request:

```json
POST /gpt
{
  "text": "tell me a joke",
  "api_key": "YOUR_OPENAI_KEY"
}
```

Response:

```json
{
  "response": "Why don’t skeletons fight each other? Because they don’t have the guts.",
  "mode": "default"
}
```

---

## 📄 License

MIT License – see [LICENSE](LICENSE)
