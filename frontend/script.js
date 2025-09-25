let recognition;
let isRecording = false;
let useBrowserSpeech = false;

const micBtn = document.getElementById("micBtn");
const transcriptEl = document.getElementById("transcript");
const gptEl = document.getElementById("gptResponse");
const audioEl = document.getElementById("responseAudio");
const modeToggle = document.getElementById("modeToggle");
const modeLabel = document.getElementById("modeLabel");

const ibmApiKeyEl = document.getElementById("ibmApiKey");
const gptApiKeyEl = document.getElementById("gptApiKey");

// Restore keys if saved before
ibmApiKeyEl.value = localStorage.getItem("ibmApiKey") || "";
gptApiKeyEl.value = localStorage.getItem("gptApiKey") || "";

// Save on change
ibmApiKeyEl.addEventListener("change", () =>
  localStorage.setItem("ibmApiKey", ibmApiKeyEl.value)
);
gptApiKeyEl.addEventListener("change", () =>
  localStorage.setItem("gptApiKey", gptApiKeyEl.value)
);

modeToggle.addEventListener("change", () => {
  useBrowserSpeech = modeToggle.checked;
  modeLabel.textContent = useBrowserSpeech
    ? "Browser Speech Mode"
    : "IBM Speech Mode";
});

// Setup browser recognition
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let interim = "";
    let final = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript + " ";
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    transcriptEl.textContent = final + interim;

    if (final.trim() !== "") {
      if (!handleCommand(final.trim().toLowerCase())) {
        sendToGPT(final.trim(), gptApiKeyEl.value);
      }
    }
  };
}

// Toggle mic
micBtn.onclick = async () => {
  if (!isRecording) {
    if (useBrowserSpeech) {
      recognition.start();
    } else {
      startIBMRecording();
    }
    micBtn.textContent = "⏹ Stop Talking";
    isRecording = true;
  } else {
    if (useBrowserSpeech) {
      recognition.stop();
    } else {
      stopIBMRecording();
    }
    micBtn.textContent = "🎤 Start Talking";
    isRecording = false;
  }
};

// ===== IBM Recording =====
let mediaRecorder;
let audioChunks = [];

async function startIBMRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    audioChunks = [];
    sendToBackend(blob);
  };
  mediaRecorder.start();
}
function stopIBMRecording() {
  mediaRecorder.stop();
}

// ===== IBM Mode Send =====
async function sendToBackend(blob) {
  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  formData.append("apikey", ibmApiKeyEl.value);
  formData.append("gptkey", gptApiKeyEl.value);

  const response = await fetch("http://127.0.0.1:5000/process", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.error) {
    alert("Error: " + data.error);
    return;
  }

  transcriptEl.textContent = data.transcript;
  gptEl.textContent = data.gpt;
  audioEl.src = "data:audio/mp3;base64," + data.audio;
  audioEl.play();
}

// ===== GPT Request =====
async function sendToGPT(userText) {
  const apiKey = document.getElementById("gptApiKey").value;

  const res = await fetch("http://127.0.0.1:5000/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: userText,
      api_key: apiKey || null,
    }),
  });

  const data = await res.json();
  if (data.error) {
    alert("Error: " + data.error);
    return;
  }

  gptEl.textContent = data.response;
  speak(data.response); // ✅ always speak
}

// ===== Default Commands =====
function handleCommand(command) {
  if (command.includes("hello")) {
    speak("Hi Luc, how are you today?");
    return true;
  } else if (command.includes("open google")) {
    speak("Opening Google...");
    window.open("https://google.com", "_blank");
    return true;
  } else if (command.includes("time")) {
    const now = new Date().toLocaleTimeString();
    speak("The current time is " + now);
    return true;
  }
  return false;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
  gptEl.textContent = text;
}
