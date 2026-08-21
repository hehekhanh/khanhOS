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


let chatNumber = 1;


/* =========================================================
   CHAT INPUT
========================================================= */

function updateInputState() {

  const hasText =
    input.value.trim().length > 0;

  sendButton.disabled = !hasText;
}


function resizeInput() {

  input.style.height = "auto";

  const height =
    Math.min(input.scrollHeight, 180);

  input.style.height =
    `${height}px`;
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


  welcome.style.display =
    "none";


  addMessage(
    text,
    "user"
  );


  input.value = "";

  input.style.height =
    "auto";


  updateInputState();


  /* DEMO AI RESPONSE */

  setTimeout(() => {

    addMessage(
      "KhanhOS AI đang hoạt động. Đây là phản hồi demo. Sau này mày có thể nối API AI thật vào đây.",
      "ai"
    );

  }, 600);
}


function addMessage(
  text,
  type
) {

  const message =
    document.createElement("div");

  message.className =
    `message ${type}`;


  const avatar =
    document.createElement("div");

  avatar.className =
    "message-avatar";

  avatar.textContent =
    "K";


  const content =
    document.createElement("div");

  content.className =
    "message-content";

  content.textContent =
    text;


  message.appendChild(
    avatar
  );

  message.appendChild(
    content
  );


  messages.appendChild(
    message
  );


  requestAnimationFrame(() => {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  });
}


sendButton.addEventListener(
  "click",
  sendMessage
);


input.addEventListener(
  "keydown",
  (event) => {

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
   FILE UPLOAD
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
      Array.from(
        fileInput.files
      );


    if (
      files.length === 0
    ) {
      return;
    }


    welcome.style.display =
      "none";


    const fileNames =
      files
        .map(
          file =>
            `• ${file.name}`
        )
        .join("\n");


    addMessage(
      `Đã chọn file:\n${fileNames}`,
      "user"
    );


    fileInput.value =
      "";

  }
);


/* =========================================================
   NEW CHAT
========================================================= */

newChatBtn.addEventListener(
  "click",
  () => {

    chatNumber++;


    messages.innerHTML =
      "";


    welcome.style.display =
      "flex";


    input.value =
      "";

    input.style.height =
      "auto";


    updateInputState();


    document
      .querySelectorAll(".chat-item")
      .forEach(
        item =>
          item.classList.remove(
            "active"
          )
      );


    const newChat =
      document.createElement(
        "button"
      );


    newChat.className =
      "chat-item active";


    newChat.innerHTML = `
      <span class="chat-icon">💬</span>
      <span class="chat-name">
        Cuộc chat ${chatNumber}
      </span>
    `;


    chatList.prepend(
      newChat
    );


    newChat.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".chat-item"
          )
          .forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


        newChat.classList.add(
          "active"
        );

      }
    );

  }
);


/* =========================================================
   SUGGESTIONS
========================================================= */

document
  .querySelectorAll(".suggestion")
  .forEach(
    suggestion => {

      suggestion.addEventListener(
        "click",
        () => {

          input.value =
            suggestion.dataset.text;


          updateInputState();

          resizeInput();

          input.focus();

        }
      );

    }
  );


/* =========================================================
   ACCOUNT MENU
========================================================= */

profileButton.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

    accountMenu.classList.toggle(
      "open"
    );

  }
);


/* CLOSE ACCOUNT MENU */

document.addEventListener(
  "click",
  (event) => {

    if (
      !accountMenu.contains(
        event.target
      ) &&
      !profileButton.contains(
        event.target
      )
    ) {

      accountMenu.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   SETTINGS
========================================================= */

settingsBtn.addEventListener(
  "click",
  () => {

    accountMenu.classList.remove(
      "open"
    );

    settingsOverlay.classList.add(
      "open"
    );

  }
);


/* CLOSE SETTINGS */

settingsClose.addEventListener(
  "click",
  () => {

    settingsOverlay.classList.remove(
      "open"
    );

  }
);


/* CLICK OUTSIDE */

settingsOverlay.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      settingsOverlay
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
  (event) => {

    if (
      event.key === "Escape"
    ) {

      settingsOverlay.classList.remove(
        "open"
      );

      accountMenu.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   SETTINGS NAVIGATION
========================================================= */

document
  .querySelectorAll(
    ".settings-nav-item"
  )
  .forEach(
    item => {

      item.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".settings-nav-item"
            )
            .forEach(
              nav =>
                nav.classList.remove(
                  "active"
                )
            );


          item.classList.add(
            "active"
          );


          const title =
            item.dataset.title;


          settingsPageTitle.textContent =
            title;


          if (
            title === "Chung"
          ) {

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

    }
  );


/* =========================================================
   THEME
========================================================= */

function applyTheme(
  theme
) {

  if (
    theme === "light"
  ) {

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


    applyTheme(
      theme
    );

  }
);


/* LOAD THEME */

const savedTheme =
  localStorage.getItem(
    "khanhos-theme"
  );


if (
  savedTheme
) {

  themeSelect.value =
    savedTheme;

  applyTheme(
    savedTheme
  );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

mobileMenu.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "open"
    );

  }
);


document.addEventListener(
  "click",
  (event) => {

    if (
      window.innerWidth > 800
    ) {
      return;
    }


    if (
      sidebar.contains(
        event.target
      ) ||
      mobileMenu.contains(
        event.target
      )
    ) {
      return;
    }


    sidebar.classList.remove(
      "open"
    );

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateInputState();
