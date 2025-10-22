// Sample posts data
const posts = [
    {
        id: 1,
        title: "Python list comprehension not working as expected",
        author: "Alex Chen",
        authorAvatar: "AC",
        flair: "help",
        content: "I'm trying to create a list comprehension that filters and transforms data, but I'm getting unexpected results. Here's my code:\n\n```python\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nresult = [x * 2 for x in numbers if x % 2 == 0 and x > 5]\nprint(result)  # Expected: [12, 14, 16, 20]\n```\n\nThe output is `[12, 14, 16, 20]` which seems correct, but when I try to use this in my actual project with different data, it's not filtering properly. Any ideas?",
        votes: 45,
        comments: 12,
        time: "4 hours ago",
        image: null,
        solved: false
    },
    {
        id: 2,
        title: "React useState hook causing infinite re-renders",
        author: "Maria Rodriguez",
        authorAvatar: "MR",
        flair: "help",
        content: "I have a React component that's stuck in an infinite loop when I update state. The component fetches data and then updates the state, but it keeps re-rendering.\n\nI've tried using useEffect with dependencies but can't figure out the right combination. What's the proper way to handle async data fetching with useState?",
        votes: 32,
        comments: 8,
        time: "6 hours ago",
        image: null,
        solved: true
    },
    {
        id: 3,
        title: "Best VS Code extensions for web development in 2025",
        author: "David Kim",
        authorAvatar: "DK",
        flair: "resource",
        content: "After using VS Code for 3 years, here are my top extensions that have significantly improved my workflow:\n\n🎯 Essential Extensions:\n• Live Server - Instant browser refresh\n• Prettier - Code formatting\n• ESLint - Code linting\n• Auto Rename Tag - HTML tag renaming\n• Bracket Pair Colorizer - Visual bracket matching\n• GitLens - Git superpowers\n• Thunder Client - API testing\n• Docker - Container management\n\nWhat are your favorite extensions? Share in the comments!",
        votes: 128,
        comments: 23,
        time: "1 day ago",
        image: null,
        solved: false
    },
    {
        id: 4,
        title: "SQL query optimization - need help with JOIN performance",
        author: "James Wilson",
        authorAvatar: "JW",
        flair: "help",
        content: "I'm working with a large database and my JOIN queries are running very slowly. Here's the query:\n\n```sql\nSELECT u.name, u.email, o.total, o.created_at\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= '2024-01-01'\nORDER BY o.created_at DESC;\n```\n\nThe users table has ~100k records and orders table has ~500k records. The query takes about 8 seconds to run. I've added indexes on user_id and created_at columns but it's still slow. Any optimization tips?",
        votes: 67,
        comments: 15,
        time: "2 days ago",
        image: null,
        solved: false
    },
    {
        id: 5,
        title: "Setting up Git workflow for team projects",
        author: "Sarah Thompson",
        authorAvatar: "ST",
        flair: "discussion",
        content: "Our team is growing and we need to establish a proper Git workflow. Currently everyone commits directly to main and it's becoming chaotic.\n\nWe're considering:\n1. Git Flow with feature branches\n2. GitHub Flow with PRs\n3. Trunk-based development\n\nWhat workflow does your team use? What are the pros and cons you've experienced?",
        votes: 89,
        comments: 31,
        time: "3 days ago",
        image: null,
        solved: false
    },
    {
        id: 6,
        title: "Debugging JavaScript async/await errors",
        author: "Michael Brown",
        authorAvatar: "MB",
        flair: "resource",
        content: "Common async/await pitfalls and how to fix them:\n\n🐛 Problem 1: Forgetting to handle errors\n✅ Solution: Always wrap await calls in try-catch blocks\n\n🐛 Problem 2: Not waiting for parallel operations\n✅ Solution: Use Promise.all() for concurrent operations\n\n🐛 Problem 3: Mixing callbacks with async/await\n✅ Solution: Stick to one async pattern consistently\n\nFull guide with examples: [link in comments]",
        votes: 156,
        comments: 42,
        time: "4 days ago",
        image: null,
        solved: false
    }
];

let currentFilter = 'hot';
let userVotes = {};

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
                for (let i = 0; i < 60; i++) {
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
                    this.speedX = p.random(-0.8, 0.8);
                    this.speedY = p.random(-0.8, 0.8);
                }

                move() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > p.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > p.height) this.speedY *= -1;
                }

                display() {
                    p.noStroke();
                    p.fill(255, 215, 0, 150);
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

// Display posts
function displayPosts(filteredPosts = posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = filteredPosts.map(post => `
        <div class="post-card">
            <div class="post-content">
                <div class="post-header">
                    <div class="user-avatar">${post.authorAvatar}</div>
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${post.time}</div>
                    ${post.flair ? `<div class="post-flair">${post.flair}</div>` : ''}
                    ${post.solved ? '<div class="post-flair" style="background: #58D68D;">Solved</div>' : ''}
                </div>
                <h3 class="post-title" onclick="viewPost(${post.id})">${post.title}</h3>
                <div class="post-body">${formatContent(post.content)}</div>
                ${post.image ? `<div class="post-media"><img src="${post.image}" alt="Post image" class="post-image"></div>` : ''}
                <div class="post-footer">
                    <div class="vote-buttons">
                        <button class="vote-btn upvote" onclick="vote(${post.id}, 'up')" data-post-id="${post.id}">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                        </button>
                        <div class="vote-count" id="votes-${post.id}">${post.votes}</div>
                        <button class="vote-btn downvote" onclick="vote(${post.id}, 'down')" data-post-id="${post.id}">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="post-action" onclick="viewPost(${post.id})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>${post.comments} Comments</span>
                    </div>
                    <div class="post-action" onclick="sharePost(${post.id})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        <span>Share</span>
                    </div>
                    <div class="post-action" onclick="savePost(${post.id})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <span>Save</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Format content for display
function formatContent(content) {
    return content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Handle voting
function vote(postId, direction) {
    const post = posts.find(p => p.id === postId);
    const voteKey = `${postId}`;
    
    if (userVotes[voteKey] === direction) {
        // Remove vote
        if (direction === 'up') post.votes--;
        else post.votes++;
        delete userVotes[voteKey];
    } else {
        // Add or change vote
        if (userVotes[voteKey] === 'up') post.votes--;
        if (userVotes[voteKey] === 'down') post.votes++;
        
        if (direction === 'up') post.votes++;
        else post.votes--;
        userVotes[voteKey] = direction;
    }
    
    document.getElementById(`votes-${postId}`).textContent = post.votes;
    updateVoteButtons(postId);
}

// Update vote button states
function updateVoteButtons(postId) {
    const upvoteBtn = document.querySelector(`[onclick="vote(${postId}, 'up')"]`);
    const downvoteBtn = document.querySelector(`[onclick="vote(${postId}, 'down')"]`);
    const voteKey = `${postId}`;
    
    // Reset styles
    upvoteBtn.style.background = '';
    downvoteBtn.style.background = '';
    
    if (userVotes[voteKey] === 'up') {
        upvoteBtn.style.background = 'var(--upvote)';
        upvoteBtn.style.color = '#ffffff';
    } else if (userVotes[voteKey] === 'down') {
        downvoteBtn.style.background = 'var(--downvote)';
        downvoteBtn.style.color = '#ffffff';
    }
}

// Filter posts
function filterPosts(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    let filteredPosts = [...posts];
    
    switch(filter) {
        case 'new':
            filteredPosts.sort((a, b) => {
                const timeA = getTimeInHours(a.time);
                const timeB = getTimeInHours(b.time);
                return timeA - timeB;
            });
            break;
        case 'hot':
            filteredPosts.sort((a, b) => {
                const hotA = a.votes * 2 + a.comments;
                const hotB = b.votes * 2 + b.comments;
                return hotB - hotA;
            });
            break;
        case 'top':
            filteredPosts.sort((a, b) => b.votes - a.votes);
            break;
        case 'rising':
            filteredPosts.sort((a, b) => {
                const risingA = a.votes / (getTimeInHours(a.time) + 1);
                const risingB = b.votes / (getTimeInHours(b.time) + 1);
                return risingB - risingA;
            });
            break;
    }
    
    displayPosts(filteredPosts);
}

// Convert time string to hours
function getTimeInHours(timeStr) {
    if (timeStr.includes('hour')) return parseInt(timeStr);
    if (timeStr.includes('day')) return parseInt(timeStr) * 24;
    return 0;
}

// Modal functions
function openCreatePostModal() {
    document.getElementById('create-post-modal').style.display = 'block';
}

function closeCreatePostModal() {
    document.getElementById('create-post-modal').style.display = 'none';
    document.getElementById('create-post-form').reset();
    document.querySelectorAll('.flair-option').forEach(option => {
        option.classList.remove('selected');
    });
}

// Post actions
function viewPost(id) {
    alert(`Opening post ${id}. In a real implementation, this would navigate to the full post page with comments.`);
}

function sharePost(id) {
    alert(`Share post ${id}. In a real implementation, this would show sharing options.`);
}

function savePost(id) {
    alert(`Post ${id} saved. In a real implementation, this would save the post to your account.`);
}

// Handle form submission
function handleFormSubmission() {
    document.getElementById('create-post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const selectedFlair = document.querySelector('.flair-option.selected');
        const flair = selectedFlair ? selectedFlair.dataset.flair : '';
        
        alert(`New post created:\nTitle: ${title}\nFlair: ${flair}\nContent: ${content.substring(0, 100)}...`);
        
        closeCreatePostModal();
    });
}

// Flair selection
function initializeFlairSelection() {
    document.querySelectorAll('.flair-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.flair-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    displayPosts();
    initializeParticles();
    handleFormSubmission();
    initializeFlairSelection();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterPosts(btn.dataset.filter);
        });
    });
    
    // Close modal when clicking outside
    document.getElementById('create-post-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeCreatePostModal();
        }
    });
});