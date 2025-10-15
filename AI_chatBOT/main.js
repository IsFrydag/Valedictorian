// AI Chatbot Main JavaScript
class AIChatbot {
    constructor() {
        this.files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        this.messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        this.knowledgeBase = JSON.parse(localStorage.getItem('knowledgeBase') || '{}');
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupP5Background();
        this.updateStats();
        this.loadRecentFiles();
        this.initializeKnowledgeGraph();
        this.loadChatHistory();
    }

    setupEventListeners() {
        // File upload
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-teal-400', 'bg-teal-50');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-teal-400', 'bg-teal-50');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-teal-400', 'bg-teal-50');
            this.handleFileSelect(e.dataTransfer.files);
        });

        // Chat functionality
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        
        sendButton.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick actions
        document.getElementById('clear-chat').addEventListener('click', () => this.clearChat());
        document.getElementById('export-knowledge').addEventListener('click', () => this.exportKnowledge());
        document.getElementById('reprocess-all').addEventListener('click', () => this.reprocessAllFiles());
    }

    handleFileSelect(files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => this.isValidFileType(file));
        
        if (validFiles.length === 0) {
            this.showNotification('Please select valid file types (PDF, DOCX, TXT, CSV, JSON)', 'error');
            return;
        }

        this.processFiles(validFiles);
    }

    isValidFileType(file) {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           'text/plain', 'text/csv', 'application/json'];
        const validExtensions = ['.pdf', '.docx', '.txt', '.csv', '.json'];
        
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    }

    async processFiles(files) {
        const progressContainer = document.getElementById('upload-progress');
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = document.getElementById('progress-percent');
        
        progressContainer.classList.remove('hidden');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progress = ((i + 1) / files.length) * 100;
            
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
            
            // Simulate processing time
            await this.simulateProcessing(file);
            
            // Add file to knowledge base
            const fileData = {
                id: Date.now() + i,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadDate: new Date().toISOString(),
                content: await this.extractFileContent(file),
                processed: true
            };
            
            this.files.push(fileData);
            this.addToKnowledgeBase(fileData);
        }
        
        // Save to localStorage
        localStorage.setItem('uploadedFiles', JSON.stringify(this.files));
        localStorage.setItem('knowledgeBase', JSON.stringify(this.knowledgeBase));
        
        // Update UI
        this.updateStats();
        this.loadRecentFiles();
        this.updateKnowledgeGraph();
        
        // Hide progress
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            this.showNotification(`Processed ${files.length} file(s) successfully!`, 'success');
        }, 500);
    }

    async simulateProcessing(file) {
        // Simulate realistic processing time based on file size
        const processingTime = Math.min(Math.max(file.size / 10000, 1000), 5000);
        return new Promise(resolve => setTimeout(resolve, processingTime));
    }

    async extractFileContent(file) {
        // Simulate content extraction based on file type
        const fileName = file.name.toLowerCase();
        
        if (fileName.endsWith('.txt')) {
            return `Sample text content from ${file.name}. This document contains important information that the AI will learn from.`;
        } else if (fileName.endsWith('.pdf')) {
            return `PDF document: ${file.name}. This PDF contains structured information with multiple sections that will be processed by the AI.`;
        } else if (fileName.endsWith('.docx')) {
            return `Word document: ${file.name}. This document contains formatted text and structured content for AI analysis.`;
        } else if (fileName.endsWith('.csv')) {
            return `CSV data file: ${file.name}. This spreadsheet contains tabular data with multiple rows and columns for analysis.`;
        } else if (fileName.endsWith('.json')) {
            return `JSON data file: ${file.name}. This structured data file contains key-value pairs and nested objects for AI processing.`;
        }
        
        return `File: ${file.name}. Content extracted and processed for AI learning.`;
    }

    addToKnowledgeBase(fileData) {
        // Extract key concepts and create knowledge nodes
        const concepts = this.extractConcepts(fileData.content);
        
        concepts.forEach(concept => {
            if (!this.knowledgeBase[concept]) {
                this.knowledgeBase[concept] = {
                    files: [],
                    frequency: 0,
                    relatedConcepts: []
                };
            }
            
            this.knowledgeBase[concept].files.push(fileData.id);
            this.knowledgeBase[concept].frequency++;
        });
        
        // Add file-specific knowledge
        this.knowledgeBase[`file_${fileData.id}`] = {
            name: fileData.name,
            type: fileData.type,
            content: fileData.content,
            concepts: concepts
        };
    }

    extractConcepts(text) {
        // Simple concept extraction - in a real system, this would use NLP
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        const stopWords = new Set(['this', 'that', 'with', 'from', 'file', 'document', 'content', 'contains', 'information']);
        const concepts = words.filter(word => !stopWords.has(word));
        
        // Return unique concepts, limited to 10
        return [...new Set(concepts)].slice(0, 10);
    }

    loadRecentFiles() {
        const container = document.getElementById('recent-files');
        const recentFiles = this.files.slice(-5).reverse(); // Last 5 files
        
        if (recentFiles.length === 0) {
            container.innerHTML = '<p class="text-xs text-slate-500 text-center">No files uploaded yet</p>';
            return;
        }
        
        container.innerHTML = recentFiles.map(file => `
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                    <div class="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0">
                        ${this.getFileIcon(file.name)}
                    </div>
                    <span class="text-xs text-slate-700 truncate">${file.name}</span>
                </div>
                <span class="text-xs text-green-600 font-medium">✓</span>
            </div>
        `).join('');
    }

    getFileIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📄',
            'docx': '📝',
            'txt': '📄',
            'csv': '📊',
            'json': '💾'
        };
        return icons[ext] || '📄';
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Generate AI response
        this.generateResponse(message);
    }

    addMessage(content, sender) {
        const container = document.getElementById('chat-messages-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-bubble';
        
        const timestamp = new Date().toLocaleTimeString();
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3 justify-end">
                    <div class="bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg p-3 max-w-xs">
                        <p class="text-sm">${content}</p>
                        <p class="text-xs opacity-75 mt-1">${timestamp}</p>
                    </div>
                    <div class="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-xs font-bold">U</span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-xs font-bold">AI</span>
                    </div>
                    <div class="bg-slate-100 rounded-lg p-3 max-w-xs">
                        <p class="text-sm text-slate-800">${content}</p>
                        <p class="text-xs text-slate-500 mt-1">${timestamp}</p>
                    </div>
                </div>
            `;
        }
        
        container.querySelector('.space-y-4').appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // Save message
        this.messages.push({ content, sender, timestamp });
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        
        this.updateStats();
    }

    async generateResponse(userMessage) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Remove typing indicator
        this.hideTypingIndicator();
        
        // Generate intelligent response based on knowledge base
        const response = this.createIntelligentResponse(userMessage);
        
        // Add AI response
        this.addMessage(response, 'ai');
    }

    createIntelligentResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check if we have relevant knowledge
        const relevantConcepts = this.findRelevantConcepts(lowerMessage);
        
        if (relevantConcepts.length > 0) {
            // Create response based on learned knowledge
            const concept = relevantConcepts[0];
            const files = this.knowledgeBase[concept].files;
            const fileNames = files.map(fileId => 
                this.knowledgeBase[`file_${fileId}`].name
            ).slice(0, 2);
            
            return `Based on what I've learned from ${fileNames.join(' and ')}, I can tell you that ${concept} is an important concept in your documents. ${this.generateFollowUpQuestion(concept)}`;
        }
        
        // Generic responses based on message content
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! I\'m ready to help you with any questions about your uploaded documents. What would you like to know?';
        } else if (lowerMessage.includes('file') || lowerMessage.includes('document')) {
            return `I can see you have ${this.files.length} file(s) uploaded. I\'ve learned from their content and can answer questions about the information they contain.`;
        } else if (lowerMessage.includes('learn') || lowerMessage.includes('learning')) {
            return 'I continuously learn from your uploaded documents. Each file is processed to extract key concepts and build a knowledge base for intelligent responses.';
        } else if (lowerMessage.includes('process') || lowerMessage.includes('processing')) {
            return 'When you upload files, I extract their content, identify key concepts, and build connections between related information to provide contextual responses.';
        } else {
            // Generate contextual response
            return this.generateContextualResponse(message);
        }
    }

    findRelevantConcepts(message) {
        return Object.keys(this.knowledgeBase).filter(concept => 
            !concept.startsWith('file_') && message.includes(concept.toLowerCase())
        );
    }

    generateFollowUpQuestion(concept) {
        const questions = [
            `Would you like me to elaborate on ${concept}?`,
            `How does ${concept} relate to your other documents?`,
            `What specific aspect of ${concept} interests you most?`,
            `Should I search for more information about ${concept}?`
        ];
        return questions[Math.floor(Math.random() * questions.length)];
    }

    generateContextualResponse(message) {
        const responses = [
            `That's an interesting question about "${message.substring(0, 30)}...". Based on my analysis of your documents, I can provide insights on related topics.`,
            `I understand you're asking about "${message.substring(0, 30)}...". Let me check what I've learned from your uploaded files.`,
            `From the knowledge I've gained processing your documents, I can help with questions about ${message.substring(0, 30)}...`,
            `I've analyzed your documents and can provide information related to your question about ${message.substring(0, 30)}...`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showTypingIndicator() {
        const container = document.getElementById('chat-messages-container');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-bubble';
        typingDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">AI</span>
                </div>
                <div class="bg-slate-100 rounded-lg p-3">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-slate-400 rounded-full typing"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full typing" style="animation-delay: 0.2s;"></div>
                        <div class="w-2 h-2 bg-slate-400 rounded-full typing" style="animation-delay: 0.4s;"></div>
                    </div>
                </div>
            </div>
        `;
        
        container.querySelector('.space-y-4').appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateStats() {
        document.getElementById('files-processed').textContent = this.files.length;
        document.getElementById('knowledge-nodes').textContent = Object.keys(this.knowledgeBase).length;
        document.getElementById('chat-messages').textContent = this.messages.length;
        
        // Animate counters
        this.animateCounter('files-processed', this.files.length);
        this.animateCounter('knowledge-nodes', Object.keys(this.knowledgeBase).length);
        this.animateCounter('chat-messages', this.messages.length);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        let currentValue = 0;
        const increment = targetValue / 30;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 50);
    }

    initializeKnowledgeGraph() {
        const chartDom = document.getElementById('knowledge-chart');
        const myChart = echarts.init(chartDom);
        
        this.knowledgeChart = myChart;
        this.updateKnowledgeGraph();
    }

    updateKnowledgeGraph() {
        if (!this.knowledgeChart) return;
        
        const concepts = Object.keys(this.knowledgeBase).filter(key => !key.startsWith('file_'));
        
        const nodes = concepts.slice(0, 10).map((concept, index) => ({
            id: index,
            name: concept,
            symbolSize: Math.min(this.knowledgeBase[concept].frequency * 5 + 10, 30),
            itemStyle: {
                color: `hsl(${200 + index * 20}, 70%, 60%)`
            }
        }));
        
        const links = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.7) {
                    links.push({
                        source: i,
                        target: j,
                        lineStyle: { opacity: 0.3 }
                    });
                }
            }
        }
        
        const option = {
            series: [{
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                force: {
                    repulsion: 100,
                    gravity: 0.1,
                    edgeLength: 50
                },
                label: {
                    show: true,
                    fontSize: 10
                }
            }]
        };
        
        this.knowledgeChart.setOption(option);
    }

    setupP5Background() {
        new p5((p) => {
            let particles = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, 400);
                canvas.parent('p5-canvas');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-1, 1),
                        vy: p.random(-1, 1),
                        size: p.random(2, 6)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(13, 148, 136, 100);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                });
                
                // Draw connections
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            p.stroke(13, 148, 136, 50);
                            p.strokeWeight(1);
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, 400);
            };
        });
    }

    initializeAnimations() {
        // Animate elements on page load
        anime({
            targets: '.chat-bubble',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuart'
        });
        
        anime({
            targets: '.glass',
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutQuart'
        });
    }

    loadChatHistory() {
        if (this.messages.length === 0) return;
        
        const container = document.getElementById('chat-messages-container');
        const messagesContainer = container.querySelector('.space-y-4');
        
        // Clear existing messages (except welcome message)
        messagesContainer.innerHTML = messagesContainer.firstElementChild.outerHTML;
        
        // Add saved messages
        this.messages.forEach(message => {
            this.addMessageToContainer(message.content, message.sender, message.timestamp);
        });
    }

    addMessageToContainer(content, sender, timestamp) {
        const container = document.getElementById('chat-messages-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-bubble';
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3 justify-end">
                    <div class="bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg p-3 max-w-xs">
                        <p class="text-sm">${content}</p>
                        <p class="text-xs opacity-75 mt-1">${timestamp}</p>
                    </div>
                    <div class="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-xs font-bold">U</span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-xs font-bold">AI</span>
                    </div>
                    <div class="bg-slate-100 rounded-lg p-3 max-w-xs">
                        <p class="text-sm text-slate-800">${content}</p>
                        <p class="text-xs text-slate-500 mt-1">${timestamp}</p>
                    </div>
                </div>
            `;
        }
        
        container.querySelector('.space-y-4').appendChild(messageDiv);
    }

    clearChat() {
        if (confirm('Are you sure you want to clear all chat history?')) {
            this.messages = [];
            localStorage.removeItem('chatMessages');
            
            // Clear chat display except welcome message
            const container = document.getElementById('chat-messages-container');
            const messagesContainer = container.querySelector('.space-y-4');
            messagesContainer.innerHTML = messagesContainer.firstElementChild.outerHTML;
            
            this.updateStats();
            this.showNotification('Chat history cleared!', 'success');
        }
    }

    exportKnowledge() {
        const knowledgeData = {
            files: this.files,
            knowledgeBase: this.knowledgeBase,
            exportDate: new Date().toISOString(),
            stats: {
                totalFiles: this.files.length,
                totalConcepts: Object.keys(this.knowledgeBase).length,
                totalMessages: this.messages.length
            }
        };
        
        const blob = new Blob([JSON.stringify(knowledgeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Knowledge base exported successfully!', 'success');
    }

    reprocessAllFiles() {
        if (this.files.length === 0) {
            this.showNotification('No files to reprocess!', 'warning');
            return;
        }
        
        if (confirm('Reprocessing all files will rebuild the knowledge base. Continue?')) {
            // Clear knowledge base
            this.knowledgeBase = {};
            
            // Reprocess each file
            this.files.forEach(file => {
                this.addToKnowledgeBase(file);
            });
            
            // Save updated knowledge base
            localStorage.setItem('knowledgeBase', JSON.stringify(this.knowledgeBase));
            
            // Update UI
            this.updateKnowledgeGraph();
            this.updateStats();
            
            this.showNotification('All files reprocessed successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
});