import { apiRequest } from "../JS/api.js";

class MessagingApp {
  constructor(userId) {
    this.userId = userId; // logged-in user
    this.currentChat = null;
    this.chats = [];
    this.messages = {};
    this.init();
  }

async init() {
  await this.loadChats();
  this.bindEvents();
  this.setupInputHandlers();

  // Only render once chats are available
  if (this.chats.length > 0) {
    this.renderChatList();
  } else {
    console.warn("No chats loaded from backend");
  }
}


  bindEvents() {
    const chatSearch = document.getElementById("chatSearch");
    if (chatSearch) {
      chatSearch.addEventListener("input", (e) => {
        this.filterChats(e.target.value);
      });
    }

    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");
    if (sendButton) sendButton.addEventListener("click", () => this.sendMessage());
    if (messageInput) {
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      messageInput.addEventListener("input", () => this.toggleSendButton());
    }
  }

  async loadChats() {
    try {
      this.chats = await apiRequest(`/Messages/User/${this.userId}`, "GET");
    } catch (err) {
      console.error("Failed to load chats:", err.message);
      this.chats = [];
    }
  }

async selectChat(conversationId) {
  this.currentChat = conversationId;
  await this.loadMessages(conversationId);

  // Re-render both chats and messages after successful load
  this.renderChatList();
  this.renderMessages();

  document.getElementById("messageInput").disabled = false;
  document.getElementById("sendButton").disabled = false;
}

async loadMessages(conversationId) {
  try {
    const msgs = await apiRequest(`/Messages/${conversationId}`, "GET");
if (Array.isArray(msgs) && msgs.length > 0)
    this.messages[conversationId] = msgs;
  } catch (err) {
    console.error("Failed to load messages:", err.message);
    // Keep old messages instead of clearing
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
  }
}


async sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const text = messageInput.value.trim();
  if (!text || !this.currentChat) return;

  const message = {
  ConversationID: this.currentChat,
  SenderID: this.userId,
  MessageText: text,
  IsRead: false
};


  try {
    const sent = await apiRequest("/Messages/Send", "POST", message);
    if (!this.messages[this.currentChat]) this.messages[this.currentChat] = [];
    this.messages[this.currentChat].push(sent);
    this.renderMessages();

    // Delay then confirm state from DB
    setTimeout(() => this.loadMessages(this.currentChat), 500);

    messageInput.value = "";
    this.toggleSendButton();
  } catch (err) {
    console.error("Failed to send message:", err.message);
  }
}


  renderChatList() {
    const chatList = document.getElementById("chatList");
    if (!chatList) return;
    chatList.innerHTML = "";

    if (this.chats.length === 0) {
      chatList.innerHTML = "<p style='text-align:center;'>No active chats</p>";
      return;
    }

    this.chats.forEach((chat) => {
      const otherUser =
        chat.user1ID === this.userId ? chat.user2 : chat.user1;

      const chatItem = document.createElement("div");
      chatItem.className = `chat-item ${
        this.currentChat === chat.conversationID ? "active" : ""
      }`;
      chatItem.dataset.chatId = chat.conversationID;

      chatItem.innerHTML = `
        <div class="chat-avatar">${otherUser.userName[0]}</div>
        <div class="chat-preview">
          <div class="chat-name">${otherUser.userName} ${otherUser.userSurname}</div>
          <div class="chat-last-message">Click to view</div>
        </div>
        <div class="chat-time">${new Date(
          chat.createdAt
        ).toLocaleDateString()}</div>
      `;

      chatItem.addEventListener("click", () =>
        this.selectChat(chat.conversationID)
      );
      chatList.appendChild(chatItem);
    });
  }

renderMessages() {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages || !this.currentChat) return;

  const msgs = this.messages[this.currentChat];
  if (!Array.isArray(msgs) || msgs.length === 0) {
    chatMessages.innerHTML = `
      <div class="no-chat-selected">
        <div class="no-chat-icon"><i class='bx bx-message-square-detail'></i></div>
        <h3>No messages yet</h3>
        <p>Start a conversation</p>
      </div>`;
    return;
  }

  const html = msgs.map(m => `
    <div class="message ${m.senderID === this.userId ? "sent" : "received"} revealed">
      <div class="message-bubble">
        ${m.messageText}
        <div class="message-time">
          ${new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  `).join("");

  chatMessages.innerHTML = html;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}



  toggleSendButton() {
    const input = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    if (sendButton) sendButton.disabled = !input.value.trim();
  }

  filterChats(query) {
    const chatItems = document.querySelectorAll(".chat-item");
    chatItems.forEach((item) => {
      const name = item
        .querySelector(".chat-name")
        .textContent.toLowerCase();
      item.style.display = name.includes(query.toLowerCase())
        ? "flex"
        : "none";
    });
  }

  setupInputHandlers() {
    const emojiBtn = document.querySelector(".emoji-btn");
    const attachBtn = document.querySelector(".attach-btn");
    const voiceBtn = document.querySelector(".voice-btn");

    if (emojiBtn)
      emojiBtn.addEventListener("click", () =>
        alert("Emoji picker not implemented yet.")
      );
    if (attachBtn)
      attachBtn.addEventListener("click", () =>
        alert("Attachment upload not implemented yet.")
      );
    if (voiceBtn)
      voiceBtn.addEventListener("click", () =>
        alert("Voice messages not implemented yet.")
      );
  }
}

// Initialize
if (!window.messagingAppLoaded) {
  window.messagingAppLoaded = true;
  document.addEventListener("DOMContentLoaded", () => {
    window.messagingApp = new MessagingApp(1);
  });
}

