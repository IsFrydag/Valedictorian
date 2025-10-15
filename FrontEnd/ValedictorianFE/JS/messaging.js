// WhatsApp-style Messaging JavaScript

class MessagingApp {
    constructor() {
        this.currentChat = null;
        this.chats = this.loadSampleChats();
        this.messages = this.loadSampleMessages();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderChatList();
        this.setupInputHandlers();
    }

    bindEvents() {
        // Chat search functionality
        const chatSearch = document.getElementById('chatSearch');
        if (chatSearch) {
            chatSearch.addEventListener('input', (e) => {
                this.filterChats(e.target.value);
            });
        }

        // New chat button
        const newChatBtn = document.querySelector('.new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.showNewChatDialog();
            });
        }

        // Message input handlers
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput && sendButton) {
            messageInput.addEventListener('input', () => {
                this.toggleSendButton();
            });

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Header action buttons
        const searchBtn = document.querySelector('.search-btn');
        const menuBtn = document.querySelector('.menu-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.toggleMessageSearch();
            });
        }

        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.showChatMenu();
            });
        }
    }

    loadSampleChats() {
        return [
            {
                id: 1,
                name: 'Alice Johnson',
                avatar: 'AJ',
                lastMessage: 'Hey! How are you doing?',
                time: '2:30 PM',
                unread: 2,
                online: true
            },
            {
                id: 2,
                name: 'Bob Smith',
                avatar: 'BS',
                lastMessage: 'The meeting is at 3 PM tomorrow',
                time: '1:45 PM',
                unread: 0,
                online: false
            },
            {
                id: 3,
                name: 'Carol Williams',
                avatar: 'CW',
                lastMessage: 'Thanks for your help!',
                time: '11:20 AM',
                unread: 1,
                online: true
            },
            {
                id: 4,
                name: 'David Brown',
                avatar: 'DB',
                lastMessage: 'Can we discuss the project?',
                time: 'Yesterday',
                unread: 0,
                online: false
            },
            {
                id: 5,
                name: 'Emma Davis',
                avatar: 'ED',
                lastMessage: 'See you at the conference',
                time: 'Yesterday',
                unread: 3,
                online: true
            }
        ];
    }

    loadSampleMessages() {
        return {
            1: [
                { id: 1, text: 'Hi there!', sender: 'them', time: '2:25 PM' },
                { id: 2, text: 'Hello! How can I help you?', sender: 'me', time: '2:26 PM' },
                { id: 3, text: 'I wanted to ask about the assignment', sender: 'them', time: '2:28 PM' },
                { id: 4, text: 'Sure, what do you need to know?', sender: 'me', time: '2:29 PM' },
                { id: 5, text: 'Hey! How are you doing?', sender: 'them', time: '2:30 PM' }
            ],
            2: [
                { id: 1, text: 'Don\'t forget about our meeting', sender: 'them', time: '1:40 PM' },
                { id: 2, text: 'The meeting is at 3 PM tomorrow', sender: 'them', time: '1:45 PM' }
            ],
            3: [
                { id: 1, text: 'I really appreciate your help with the project', sender: 'them', time: '11:15 AM' },
                { id: 2, text: 'You\'re welcome! Happy to help', sender: 'me', time: '11:18 AM' },
                { id: 3, text: 'Thanks for your help!', sender: 'them', time: '11:20 AM' }
            ]
        };
    }

    renderChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        chatList.innerHTML = '';

        this.chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item ${this.currentChat === chat.id ? 'active' : ''}`;
            chatItem.dataset.chatId = chat.id;

            chatItem.innerHTML = `
                <div class="chat-avatar">
                    ${chat.avatar}
                </div>
                <div class="chat-preview">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-last-message">${chat.lastMessage}</div>
                </div>
                <div class="chat-time">${chat.time}</div>
                ${chat.unread > 0 ? `<div class="chat-unread">${chat.unread}</div>` : ''}
            `;

            chatItem.addEventListener('click', () => {
                this.selectChat(chat.id);
            });

            chatList.appendChild(chatItem);
        });
    }

    selectChat(chatId) {
        this.currentChat = chatId;
        
        // Update active chat in sidebar
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeChat = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (activeChat) {
            activeChat.classList.add('active');
        }

        // Update chat header
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            document.getElementById('currentChatName').textContent = chat.name;
            document.getElementById('currentChatStatus').textContent = chat.online ? 'Online' : 'Last seen recently';
            
            // Update avatar
            const avatar = document.getElementById('currentChatAvatar');
            if (avatar && avatar.parentElement) {
                avatar.parentElement.innerHTML = `<div class="avatar">${chat.avatar}</div>`;
            }
        }

        // Clear unread count
        if (chat.unread > 0) {
            chat.unread = 0;
            this.renderChatList();
        }

        // Enable input
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.placeholder = `Message ${chat.name}`;
        }
        
        if (sendButton) {
            sendButton.disabled = false;
        }

        // Render messages
        this.renderMessages();
    }

    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages || !this.currentChat) return;

        const messages = this.messages[this.currentChat] || [];
        
        if (messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="no-chat-selected">
                    <div class="no-chat-icon">
                        <i class='bx bx-message-square-detail'></i>
                    </div>
                    <h3>No messages yet</h3>
                    <p>Start a conversation with ${this.chats.find(c => c.id === this.currentChat)?.name}</p>
                </div>
            `;
            return;
        }

        chatMessages.innerHTML = '';

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.sender}`;
            
            messageElement.innerHTML = `
                <div class="message-bubble">
                    ${message.text}
                    <div class="message-time">${message.time}</div>
                </div>
            `;

            chatMessages.appendChild(messageElement);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput || !messageInput.value.trim() || !this.currentChat) return;

        const messageText = messageInput.value.trim();
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        const newMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'me',
            time: timeString
        };

        // Add message to chat
        if (!this.messages[this.currentChat]) {
            this.messages[this.currentChat] = [];
        }
        
        this.messages[this.currentChat].push(newMessage);

        // Update last message in chat list
        const chat = this.chats.find(c => c.id === this.currentChat);
        if (chat) {
            chat.lastMessage = messageText;
            chat.time = timeString;
        }

        // Clear input
        messageInput.value = '';
        this.toggleSendButton();

        // Re-render
        this.renderMessages();
        this.renderChatList();

        // Simulate typing indicator and response
        this.simulateTypingIndicator();
    }

    simulateTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate response after 2-3 seconds
        setTimeout(() => {
            // Remove typing indicator
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }

            // Add response message
            const responses = [
                'Thanks for your message!',
                'I understand. Let me get back to you on that.',
                'That sounds good to me!',
                'I will check and let you know.',
                'Great idea!',
                'I agree with you.',
                'Let me think about it.',
                'Sounds perfect!'
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });

            const responseMessage = {
                id: Date.now(),
                text: randomResponse,
                sender: 'them',
                time: timeString
            };

            if (!this.messages[this.currentChat]) {
                this.messages[this.currentChat] = [];
            }
            
            this.messages[this.currentChat].push(responseMessage);

            // Update last message in chat list
            const chat = this.chats.find(c => c.id === this.currentChat);
            if (chat) {
                chat.lastMessage = randomResponse;
                chat.time = timeString;
            }

            this.renderMessages();
            this.renderChatList();
        }, 2500);
    }

    toggleSendButton() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput && sendButton) {
            sendButton.disabled = !messageInput.value.trim();
        }
    }

    filterChats(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.chat-last-message').textContent.toLowerCase();
            
            if (chatName.includes(query.toLowerCase()) || lastMessage.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    showNewChatDialog() {
        // For now, show an alert. In a real app, this would open a modal
        alert('New chat functionality would open here. You can search for users and start a new conversation.');
    }

    toggleMessageSearch() {
        alert('Message search functionality would be implemented here.');
    }

    showChatMenu() {
        alert('Chat menu options would appear here (mute, archive, delete, etc.).');
    }

    setupInputHandlers() {
        // Emoji button
        const emojiBtn = document.querySelector('.emoji-btn');
        if (emojiBtn) {
            emojiBtn.addEventListener('click', () => {
                alert('Emoji picker would open here. For now, you can type emojis directly.');
            });
        }

        // Attach button
        const attachBtn = document.querySelector('.attach-btn');
        if (attachBtn) {
            attachBtn.addEventListener('click', () => {
                alert('File attachment options would appear here (photos, documents, etc.).');
            });
        }

        // Voice button
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                alert('Voice message recording would start here.');
            });
        }
    }
}

// Initialize messaging app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with messaging
    if (document.querySelector('.mesBox')) {
        window.messagingApp = new MessagingApp();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessagingApp;
}