const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const fileButton = document.getElementById("fileButton");
const fileInput = document.getElementById("fileInput");

const welcome = document.getElementById("welcome");
const messages = document.getElementById("messages");
const chatArea = document.getElementById("chatArea");

const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

let chatNumber = 1;

/* =========================
   INPUT
========================= */

function updateInput() {
  sendButton.disabled = input.value.trim() === "";
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height =
    Math.min(input.scrollHeight, 180) + "px";
}

input.addEventListener("input", () => {
  updateInput();
  resizeInput();
});

/* =========================
   SEND MESSAGE
========================= */

function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  welcome.style.display = "none";

  addMessage(text, "user");

  input.value = "";
  input.style.height = "auto";

  updateInput();

  setTimeout(() => {
    addMessage(
      "KhanhOS AI đang hoạt động. Đây là phản hồi demo. Sau này có thể kết nối API AI thật.",
      "ai"
    );
  }, 500);
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "K";

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = text;

  message.appendChild(avatar);
  message.appendChild(content);

  messages.appendChild(message);

  requestAnimationFrame(() => {
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

/* =========================
   FILE BUTTON
========================= */

fileButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files);

  if (files.length === 0) return;

  welcome.style.display = "none";

  const names = files
    .map(file => `• ${file.name}`)
    .join("\n");

  addMessage(`Đã chọn file:\n${names}`, "user");

  fileInput.value = "";
});

/* =========================
   NEW CHAT
========================= */

newChatBtn.addEventListener("click", () => {
  chatNumber++;

  messages.innerHTML = "";
  welcome.style.display = "flex";

  input.value = "";
  input.style.height = "auto";

  updateInput();

  document
    .querySelectorAll(".chat-item")
    .forEach(item => item.classList.remove("active"));

  const chat = document.createElement("button");
  chat.className = "chat-item active";

  chat.innerHTML = `
    <span>💬</span>
    <span>Cuộc chat ${chatNumber}</span>
  `;

  chatList.prepend(chat);

  chat.addEventListener("click", () => {
    document
      .querySelectorAll(".chat-item")
      .forEach(item => item.classList.remove("active"));

    chat.classList.add("active");
  });
});

/* =========================
   SUGGESTIONS
========================= */

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.text;

    updateInput();
    resizeInput();

    input.focus();
  });
});

/* =========================
   MOBILE SIDEBAR
========================= */

mobileMenu.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", event => {
  if (window.innerWidth > 800) return;

  if (
    !sidebar.contains(event.target) &&
    !mobileMenu.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

updateInput();
