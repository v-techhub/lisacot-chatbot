const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1.1;
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) {
    // const audio = new Audio("./windows-98-error.mp3");
    // audio.play();
    // alert("Please enter a message");
    return;
  }
  addMessage(text, "user");
  input.value = "";
  await handleCommand(text.toLowerCase());
}

async function handleCommand(cmd) {
  addMessage("Thinking...", "bot");
  let reply = "";

  try {
    if (cmd.startsWith("/weather")) {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=6.4474&longitude=3.3903&current_weather=true"
      );
      const data = await res.json();
      reply = `It's ${data.current_weather.temperature}°C and ${
        data.current_weather.weathercode < 3 ? "clear" : "cloudy"
      } in Nigeria.`;
    } else if (cmd.startsWith("/dog")) {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      reply = `<img src="${data.message}" width="250"/> 🐶 Here's a cute dog!`;
      speak("Here's a cute dog!");
    } else if (cmd.startsWith("/joke")) {
      const res = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");
      const data = await res.json();
      reply =
        data.type === "single" ? data.joke : `${data.setup} — ${data.delivery}`;
    } else if (cmd.startsWith("/advice")) {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      reply = `💡 ${data.slip.advice}`;
    } else if (cmd.startsWith("/quote")) {
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();
      reply = `“${data.content}” — ${data.author}`;
    } else {
      reply =
        "Try these commands: /weather, /joke, /dog, /advice, or /quote 🌈";
    }
  } catch (err) {
    reply = "⚠️ Oops! Something went wrong fetching data.";
  }

  chat.removeChild(chat.lastChild);
  addMessage(reply, "bot");
  if (!reply.includes("<img")) speak(reply.replace(/<[^>]*>/g, "")); // Speak only text
}
