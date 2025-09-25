import requests
import base64

STT_URL = "https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/<instance-id>/v1/recognize"
TTS_URL = "https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/<instance-id>/v1/synthesize"

def transcribe_audio(audio_file, api_key):
    headers = {
        "Authorization": "Basic " + base64.b64encode(f"apikey:{api_key}".encode()).decode(),
        "Content-Type": "audio/webm"
    }

    response = requests.post(STT_URL, headers=headers, data=audio_file)
    result = response.json()

    try:
        return result["results"][0]["alternatives"][0]["transcript"]
    except:
        return ""

def synthesize_text(text, api_key):
    headers = {
        "Authorization": "Basic " + base64.b64encode(f"apikey:{api_key}".encode()).decode(),
        "Content-Type": "application/json",
        "Accept": "audio/wav"
    }

    response = requests.post(TTS_URL, headers=headers, json={"text": text})
    return response.content
