// Forum data
const categories = [
    {
        id: 'general',
        title: 'General Discussion',
        description: 'Chat about anything and everything related to student life and beyond.',
        icon: '💬',
        discussions: 234,
        posts: 1156,
        color: '#5DADE2'
    },
    {
        id: 'academics',
        title: 'Academics',
        description: 'Discuss courses, assignments, exams, and academic challenges.',
        icon: '📚',
        discussions: 189,
        posts: 892,
        color: '#D4A574'
    },
    {
        id: 'technical',
        title: 'Technical Support',
        description: 'Get help with coding problems, software issues, and tech questions.',
        icon: '🔧',
        discussions: 156,
        posts: 743,
        color: '#58D68D'
    },
    {
        id: 'career',
        title: 'Career & Jobs',
        description: 'Share job opportunities, career advice, and internship experiences.',
        icon: '💼',
        discussions: 98,
        posts: 445,
        color: '#BB8FCE'
    },
    {
        id: 'projects',
        title: 'Projects & Portfolio',
        description: 'Showcase your projects, get feedback, and collaborate with others.',
        icon: '🚀',
        discussions: 87,
        posts: 312,
        color: '#F7DC6F'
    },
    {
        id: 'events',
        title: 'Events & Meetups',
        description: 'Organize study groups, hackathons, and social events.',
        icon: '🎉',
        discussions: 45,
        posts: 189,
        color: '#F1948A'
    },
    {
        id: 'resources',
        title: 'Resources & Tutorials',
        description: 'Share useful learning materials, tutorials, and study guides.',
        icon: '📖',
        discussions: 112,
        posts: 567,
        color: '#85C1E9'
    },
    {
        id: 'lifestyle',
        title: 'Student Life',
        description: 'Everything about campus life, housing, and student experiences.',
        icon: '🏫',
        discussions: 76,
        posts: 298,
        color: '#F8C471'
    }
];

const discussions = [
    {
        id: 1,
        title: 'Best resources for learning Python in 2025?',
        category: 'resources',
        author: 'Sarah Chen',
        authorAvatar: 'SC',
        excerpt: 'I\'m looking for the most up-to-date Python learning resources. What courses, books, or tutorials have you found most helpful?',
        replies: 23,
        views: 156,
        lastActivity: '2 hours ago',
        isSticky: false
    },
    {
        id: 2,
        title: 'Internship opportunities at Microsoft Belgium',
        category: 'career',
        author: 'Alex Kumar',
        authorAvatar: 'AK',
        excerpt: 'Just wanted to share that Microsoft Belgium is looking for summer interns. I applied last week and the process seems very streamlined.',
        replies: 18,
        views: 89,
        lastActivity: '4 hours ago',
        isSticky: false
    },
    {
        id: 3,
        title: 'Study group for Data Structures & Algorithms',
        category: 'academics',
        author: 'Maria Rodriguez',
        authorAvatar: 'MR',
        excerpt: 'Anyone interested in forming a study group for DSA? We could meet twice a week to work through problems together.',
        replies: 31,
        views: 203,
        lastActivity: '6 hours ago',
        isSticky: true
    },
    {
        id: 4,
        title: 'Help with React state management',
        category: 'technical',
        author: 'James Wilson',
        authorAvatar: 'JW',
        excerpt: 'I\'m struggling with state management in my React project. Should I use Context API, Redux, or something else?',
        replies: 15,
        views: 67,
        lastActivity: '8 hours ago',
        isSticky: false
    },
    {
        id: 5,
        title: 'Campus hackathon planning committee',
        category: 'events',
        author: 'Emma Thompson',
        authorAvatar: 'ET',
        excerpt: 'We\'re organizing a 24-hour hackathon next month. Looking for volunteers to help with logistics, sponsorship, and judging.',
        replies: 12,
        views: 45,
        lastActivity: '1 day ago',
        isSticky: false
    },
    {
        id: 6,
        title: 'Portfolio review - seeking feedback',
        category: 'projects',
        author: 'David Kim',
        authorAvatar: 'DK',
        excerpt: 'Just finished updating my portfolio website. Would love to get some constructive feedback from the community.',
        replies: 9,
        views: 34,
        lastActivity: '1 day ago',
        isSticky: false
    }
];

// Initialize particles
function initializeParticles() {
    if (typeof p5 !== 'undefined') {
        new p5((p) => {
            let particles = [];

            p.setup = () => {
                const container = document.getElementById('particle-bg');
                if (container) {
                    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                    canvas.parent(container);
                }
                for (let i = 0; i < 80; i++) {
                    particles.push(new Particle());
                }
            };

            p.draw = () => {
                p.clear();
                particles.forEach(particle => {
                    particle.move();
                    particle.display();
                });
            };

            p.windowResized = () => {
                const container = document.getElementById('particle-bg');
                if (container) {
                    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
                }
            };

            class Particle {
                constructor() {
                    this.x = p.random(p.width);
                    this.y = p.random(p.height);
                    this.size = p.random(2, 4);
                    this.speedX = p.random(-1, 1);
                    this.speedY = p.random(-1, 1);
                }

                move() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > p.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > p.height) this.speedY *= -1;
                }

                display() {
                    p.noStroke();
                    p.fill(255, 215, 0, 180);
                    p.circle(this.x, this.y, this.size);
                }
            }
        });
    }
}

// Initialize animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal-text').forEach(el => {
        observer.observe(el);
    });
}

// Display categories
function displayCategories() {
    const container = document.getElementById('categories-grid');
    container.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory('${category.id}')">
            <div class="category-header">
                <div class="category-icon" style="background: ${category.color}">
                    <span style="font-size: 1.5rem;">${category.icon}</span>
                </div>
                <div>
                    <h3 class="category-title">${category.title}</h3>
                </div>
            </div>
            <p class="category-description">${category.description}</p>
            <div class="category-stats">
                <div class="stat-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    ${category.discussions} discussions
                </div>
                <div class="stat-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    ${category.posts} posts
                </div>
            </div>
        </div>
    `).join('');
}

// Display discussions
function displayDiscussions(filteredDiscussions = discussions) {
    const container = document.getElementById('discussion-list');
    container.innerHTML = filteredDiscussions.map(discussion => `
        <div class="discussion-card" onclick="viewDiscussion(${discussion.id})">
            <div class="discussion-header">
                <span class="discussion-category">${categories.find(c => c.id === discussion.category)?.title || 'General'}</span>
                ${discussion.isSticky ? '<span style="background: #D4A574; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Pinned</span>' : ''}
            </div>
            <h3 class="discussion-title">${discussion.title}</h3>
            <p class="discussion-excerpt">${discussion.excerpt}</p>
            <div class="discussion-meta">
                <div class="meta-item">
                    <div class="author-avatar">${discussion.authorAvatar}</div>
                    <span>${discussion.author}</span>
                </div>
                <div class="meta-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    ${discussion.replies} replies
                </div>
                <div class="meta-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    ${discussion.views} views
                </div>
                <div class="meta-item">
                    <span>${discussion.lastActivity}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter discussions by category
function filterByCategory(categoryId) {
    const filtered = categoryId === 'all' ? discussions : discussions.filter(d => d.category === categoryId);
    displayDiscussions(filtered);
    // Scroll to discussions section
    document.querySelector('.discussions-section').scrollIntoView({ behavior: 'smooth' });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const filtered = discussions.filter(d => 
            d.title.toLowerCase().includes(query) ||
            d.excerpt.toLowerCase().includes(query) ||
            d.author.toLowerCase().includes(query)
        );
        displayDiscussions(filtered);
    }, 300));
}

// Modal functions
function openNewDiscussionModal() {
    document.getElementById('new-discussion-modal').style.display = 'block';
}

function closeNewDiscussionModal() {
    document.getElementById('new-discussion-modal').style.display = 'none';
    document.getElementById('new-discussion-form').reset();
}

// View discussion (placeholder)
function viewDiscussion(id) {
    alert(`Opening discussion ${id}. In a real implementation, this would navigate to the full discussion page.`);
}

// Handle form submission
function handleFormSubmission() {
    document.getElementById('new-discussion-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('discussion-title').value;
        const category = document.getElementById('discussion-category').value;
        const content = document.getElementById('discussion-content').value;
        
        // In a real implementation, this would send data to a server
        alert(`New discussion created:\nTitle: ${title}\nCategory: ${category}\nContent: ${content.substring(0, 50)}...`);
        
        closeNewDiscussionModal();
    });
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeSearch();
    displayCategories();
    displayDiscussions();
    initializeParticles();
    handleFormSubmission();
    
    // Close modal when clicking outside
    document.getElementById('new-discussion-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeNewDiscussionModal();
        }
    });
});