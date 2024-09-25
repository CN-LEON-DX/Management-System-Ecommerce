const formSendData = document.querySelector(".inner-form");
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  // display to frontend
  const body = document.querySelector(".chat-box");
  const div = document.createElement("div");

  const currentUserID = body.getAttribute("chatID");
  let html = "";
  if (data.userID == currentUserID) {
    html += `
        <div class="message user mb-4 flex justify-end">
            <div class="flex flex-col items-end">
                <div class="bg-blue-500 text-white p-2 rounded-lg max-w-xs ">
                    ${data.content}
                </div>
            </div>
        </div>
    `;
  } else {
    html += `
        <div class="message user mb-4 flex justify-start">
            <div class="flex flex-col items-start">
                <div class="text-right text-sm text-gray-600">
                    ${data.fullName}
                </div>
                <div class="bg-gray-300 text-gray-800 p-2 rounded-lg max-w-xs ">
                    ${data.content}
                </div>
            </div>
        </div>
    `;
  }

  div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// end SERVER_RETURN_MESSAGE
var typingTimeout;

const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(typingTimeout);

  const userID = document.querySelector(".chat-box").getAttribute("chatID");

  typingTimeout = setTimeout(() => {
    socket.emit("CLIENT_STOP_TYPING", { userID });
  }, 5000);
};
// emoj picker
const emojPicker = document.querySelector("emoji-picker");
if (emojPicker) {
  const inputChat = document.getElementById("inputChat");
  emojPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    showTyping();
  });
}

const btnIcon = document.querySelector(".btnIcon");
const tooltip = document.querySelector(".tooltip");
Popper.createPopper(btnIcon, tooltip);

document.querySelector(".btnIcon").onclick = () => {
  tooltip.classList.toggle("shown");
};
// emoj picker

const inputChat = document.getElementById("inputChat");

inputChat.addEventListener("keyup", () => {
  showTyping();
});

const typingIndicatorsContainer = document.querySelector(".inner-list-typing");
const typingIndicators = {};
const body = document.querySelector(".chat-box");

socket.on("SERVER_RETURN_TYPING", (data) => {
  const { userID, fullName, content } = data;

  if (!typingIndicators[userID]) {
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.innerText = `${fullName} is typing...`;
    typingIndicators[userID] = indicator;
    typingIndicatorsContainer.appendChild(indicator);

    body.scrollTop = body.scrollHeight;
  }
});

socket.on("SERVER_STOP_TYPING", (userID) => {
  if (typingIndicators[userID]) {
    typingIndicatorsContainer.removeChild(typingIndicators[userID]);
    delete typingIndicators[userID];
  }
});

console.log("Run here !");
// file-upload
const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-image");
// file-upload

console.log("Run here !");
