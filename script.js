/* =========================================================
   ELEMENTS
========================================================= */

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

const profileButton = document.getElementById("profileButton");
const accountMenu = document.getElementById("accountMenu");

const settingsBtn = document.getElementById("settingsBtn");
const settingsOverlay = document.getElementById("settingsOverlay");
const settingsClose = document.getElementById("settingsClose");

const settingsPageTitle =
  document.getElementById("settingsPageTitle");

const generalSettings =
  document.getElementById("generalSettings");

const otherSettings =
  document.getElementById("otherSettings");

const otherSettingsTitle =
  document.getElementById("otherSettingsTitle");

const themeSelect =
  document.getElementById("themeSelect");


/* =========================================================
   STATE
========================================================= */

const STORAGE_KEY = "khanhos-chats";

let chats = loadChats();
let currentChatId = null;


/* =========================================================
   STORAGE
========================================================= */

function loadChats() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const data = JSON.parse(saved);

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {
    console.error(
      "Không thể đọc lịch sử chat:",
      error
    );

    return [];
  }
}


function saveChats() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(chats)
    );
  } catch (error) {
    console.error(
      "Không thể lưu lịch sử chat:",
      error
    );
  }
}


/* =========================================================
   CHAT ID
========================================================= */

function generateChatId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}


/* =========================================================
   CHAT TITLE
========================================================= */

function makeChatTitle(text) {
  const clean =
    text.replace(/\s+/g, " ").trim();

  if (clean.length <= 35) {
    return clean;
  }

  return clean.slice(0, 35) + "...";
}


/* =========================================================
   CREATE CHAT
========================================================= */

function createChat(firstMessage = "") {

  const chat = {
    id: generateChatId(),

    title:
      firstMessage
        ? makeChatTitle(firstMessage)
        : "Cuộc chat mới",

    messages: [],

    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  chats.unshift(chat);

  currentChatId = chat.id;

  saveChats();
  renderChatList();

  return chat;
}


/* =========================================================
   GET CURRENT CHAT
========================================================= */

function getCurrentChat() {

  if (!currentChatId) {
    return null;
  }

  return (
    chats.find(
      chat => chat.id === currentChatId
    ) || null
  );
}


/* =========================================================
   START NEW CHAT
========================================================= */

function startNewChat() {

  /*
    Không tạo chat ở đây.

    Chỉ mở một phiên chat trống.
    Khi người dùng gửi tin đầu tiên
    mới tạo chat trong Gần đây.
  */

  currentChatId = null;

  messages.innerHTML = "";

  welcome.style.display = "flex";

  input.value = "";
  input.style.height = "auto";

  updateInputState();
  renderChatList();

  input.focus();

  if (window.innerWidth <= 800) {
    sidebar.classList.remove("open");
  }
}


/* =========================================================
   OPEN OLD CHAT
========================================================= */

function openChat(chatId) {

  const chat =
    chats.find(
      item => item.id === chatId
    );

  if (!chat) {
    return;
  }

  currentChatId = chat.id;

  messages.innerHTML = "";

  if (chat.messages.length === 0) {

    welcome.style.display = "flex";

  } else {

    welcome.style.display = "none";

    chat.messages.forEach(message => {
      renderMessage(
        message.text,
        message.role
      );
    });
  }

  renderChatList();

  requestAnimationFrame(() => {
    chatArea.scrollTop =
      chatArea.scrollHeight;
  });
}


/* =========================================================
   RENDER CHAT LIST
========================================================= */

function renderChatList() {

  chatList.innerHTML = "";

  chats.forEach(chat => {

    const item =
      document.createElement("button");

    item.className = "chat-item";

    if (chat.id === currentChatId) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <span class="chat-icon">💬</span>
      <span class="chat-name"></span>
    `;

    item.querySelector(".chat-name")
      .textContent = chat.title;

    item.addEventListener(
      "click",
      () => {
        openChat(chat.id);
      }
    );

    chatList.appendChild(item);
  });
}


/* =========================================================
   INPUT
========================================================= */

function updateInputState() {
  sendButton.disabled =
    input.value.trim() === "";
}


function resizeInput() {

  input.style.height = "auto";

  input.style.height =
    Math.min(
      input.scrollHeight,
      180
    ) + "px";
}


input.addEventListener(
  "input",
  () => {
    updateInputState();
    resizeInput();
  }
);


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

  const text =
    input.value.trim();

  if (!text) {
    return;
  }


  /*
    Nếu đang ở phiên "Chat mới"
    thì CHỈ BÂY GIỜ mới tạo chat.
  */

  let chat = getCurrentChat();

  if (!chat) {
    chat = createChat(text);
  }


  /*
    Nếu chat chưa có tin nhắn
    thì dùng tin đầu tiên làm tên.
  */

  if (chat.messages.length === 0) {
    chat.title =
      makeChatTitle(text);
  }


  chat.messages.push({
    role: "user",
    text: text,
    createdAt: Date.now()
  });

  chat.updatedAt =
    Date.now();

  saveChats();


  welcome.style.display =
    "none";


  renderMessage(
    text,
    "user"
  );


  input.value = "";
  input.style.height = "auto";

  updateInputState();
  renderChatList();


  /*
    AI DEMO
  */

  setTimeout(() => {

    const activeChat =
      chats.find(
        item => item.id === chat.id
      );

    if (!activeChat) {
      return;
    }


    const reply =
      "KhanhOS AI đang hoạt động. Đây là phản hồi demo. Sau này có thể nối API AI thật vào đây.";


    activeChat.messages.push({
      role: "ai",
      text: reply,
      createdAt: Date.now()
    });

    activeChat.updatedAt =
      Date.now();

    saveChats();


    /*
      Chỉ hiện phản hồi nếu
      vẫn đang ở chat này.
    */

    if (
      currentChatId === activeChat.id
    ) {

      renderMessage(
        reply,
        "ai"
      );

    }

  }, 600);
}


/* =========================================================
   RENDER MESSAGE
========================================================= */

function renderMessage(text, role) {

  const message =
    document.createElement("div");

  message.className =
    `message ${role}`;


  const avatar =
    document.createElement("div");

  avatar.className =
    "message-avatar";

  avatar.textContent = "K";


  const content =
    document.createElement("div");

  content.className =
    "message-content";

  content.textContent =
    text;


  message.appendChild(avatar);
  message.appendChild(content);

  messages.appendChild(message);


  requestAnimationFrame(() => {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  });
}


/* =========================================================
   SEND EVENTS
========================================================= */

sendButton.addEventListener(
  "click",
  sendMessage
);


input.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }

  }
);


/* =========================================================
   CHAT MỚI
========================================================= */

newChatBtn.addEventListener(
  "click",
  startNewChat
);


/* =========================================================
   FILE
========================================================= */

fileButton.addEventListener(
  "click",
  () => {
    fileInput.click();
  }
);


fileInput.addEventListener(
  "change",
  () => {

    const files =
      Array.from(fileInput.files);

    if (!files.length) {
      return;
    }


    /*
      Nếu chưa có chat,
      hành động thêm file cũng
      trở thành nội dung đầu tiên.
    */

    let chat =
      getCurrentChat();

    if (!chat) {
      chat = createChat(files[0].name);
    }


    const fileNames =
      files
        .map(file => `• ${file.name}`)
        .join("\n");


    const text =
      `Đã chọn file:\n${fileNames}`;


    chat.messages.push({
      role: "user",
      text: text,
      createdAt: Date.now()
    });

    chat.updatedAt =
      Date.now();

    saveChats();


    welcome.style.display =
      "none";


    renderMessage(
      text,
      "user"
    );


    renderChatList();

    fileInput.value = "";
  }
);


/* =========================================================
   SUGGESTIONS
========================================================= */

document
  .querySelectorAll(".suggestion")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        input.value =
          button.dataset.text;

        updateInputState();
        resizeInput();

        input.focus();
      }
    );

  });


/* =========================================================
   ACCOUNT MENU
========================================================= */

/*
  Gắn click vào TOÀN BỘ nút profile.
  Vì avatar nằm bên trong profile-button,
  bấm avatar cũng sẽ kích hoạt nút này.
*/

profileButton.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();

    accountMenu.classList.toggle("open");

  }
);


/*
  Ngăn click bên trong menu làm
  document click đóng menu ngay.
*/

accountMenu.addEventListener(
  "click",
  event => {
    event.stopPropagation();
  }
);


/*
  Click ngoài menu + ngoài profile
  mới đóng account menu.
*/

document.addEventListener(
  "click",
  event => {

    if (
      !profileButton.contains(event.target) &&
      !accountMenu.contains(event.target)
    ) {

      accountMenu.classList.remove("open");

    }

  }
);


/* =========================================================
   SETTINGS
========================================================= */

settingsBtn.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();

    accountMenu.classList.remove("open");

    settingsOverlay.classList.add("open");

  }
);


settingsClose.addEventListener(
  "click",
  () => {
    settingsOverlay.classList.remove("open");
  }
);


/*
  Click nền tối bên ngoài modal
  để đóng Settings.
*/

settingsOverlay.addEventListener(
  "click",
  event => {

    if (
      event.target === settingsOverlay
    ) {

      settingsOverlay.classList.remove(
        "open"
      );

    }

  }
);


/* ESC */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }

    accountMenu.classList.remove("open");

    settingsOverlay.classList.remove(
      "open"
    );

  }
);


/* =========================================================
   SETTINGS NAVIGATION
========================================================= */

document
  .querySelectorAll(".settings-nav-item")
  .forEach(item => {

    item.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".settings-nav-item"
          )
          .forEach(nav => {
            nav.classList.remove("active");
          });


        item.classList.add("active");


        const title =
          item.dataset.title;


        settingsPageTitle.textContent =
          title;


        if (title === "Chung") {

          generalSettings.style.display =
            "block";

          otherSettings.style.display =
            "none";

        } else {

          generalSettings.style.display =
            "none";

          otherSettings.style.display =
            "flex";

          otherSettingsTitle.textContent =
            title;
        }

      }
    );

  });


/* =========================================================
   SETTINGS SEARCH
========================================================= */

const settingsSearch =
  document.getElementById(
    "settingsSearch"
  );

settingsSearch.addEventListener(
  "input",
  () => {

    const query =
      settingsSearch.value
        .trim()
        .toLowerCase();


    document
      .querySelectorAll(
        ".settings-nav-item"
      )
      .forEach(item => {

        const title =
          item.dataset.title
            .toLowerCase();

        item.style.display =
          !query ||
          title.includes(query)
            ? "flex"
            : "none";

      });

  }
);


/* =========================================================
   THEME
========================================================= */

function applyTheme(theme) {

  /*
    Giao diện sáng sẽ cần bộ màu riêng
    sau này. Hiện tại dark là mặc định.
  */

  if (theme === "light") {
    document.body.classList.add(
      "light-theme"
    );
  } else {
    document.body.classList.remove(
      "light-theme"
    );
  }
}


themeSelect.addEventListener(
  "change",
  () => {

    const theme =
      themeSelect.value;

    localStorage.setItem(
      "khanhos-theme",
      theme
    );

    applyTheme(theme);

  }
);


const savedTheme =
  localStorage.getItem(
    "khanhos-theme"
  );


if (savedTheme) {

  themeSelect.value =
    savedTheme;

  applyTheme(savedTheme);

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileMenu.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    sidebar.classList.toggle("open");

  }
);


document.addEventListener(
  "click",
  event => {

    if (window.innerWidth > 800) {
      return;
    }

    if (
      sidebar.contains(event.target) ||
      mobileMenu.contains(event.target)
    ) {
      return;
    }

    sidebar.classList.remove("open");

  }
);


/* =========================================================
   STARTUP
========================================================= */

/*
  Không tự tạo chat.

  Khi mở KhanhOS:
  - nếu có lịch sử: chỉ render danh sách
  - khu chat vẫn là phiên mới
  - currentChatId = null

  Người dùng gửi tin đầu tiên
  thì mới tạo chat.
*/

currentChatId = null;

messages.innerHTML = "";

welcome.style.display = "flex";

renderChatList();

updateInputState();
