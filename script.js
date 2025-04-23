const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Append messages to chat
function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.textContent = `${sender === 'user' ? 'You' : 'Calmi'}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  appendMessage("bot", "Typing...");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // Remove 'Typing...'
    const typing = chatBox.querySelector(".bot:last-child");
    if (typing) typing.remove();

    appendMessage("bot", data.response);
  } catch (err) {
    console.error("Error:", err);
    appendMessage("bot", "Oops! Something went wrong.");
  }
}

// Send on Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
