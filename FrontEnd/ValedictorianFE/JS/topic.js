import { apiRequest } from './api.js';

let currentPosts = [];
let currentFiltered = [];
let currentFilter = 'hot';
let userVotes = {};
let topicId = null;
let isLoggedIn = false;
let currentUser = { id: null, name: '', initials: '' };

// Time ago utility
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

// Get age in hours
function getAgeInHours(dateString) {
    return (new Date() - new Date(dateString)) / 3600000 + 1;
}

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
                for (let i = 0; i < 80; i++) particles.push(new Particle());
            };
            p.draw = () => {
                p.clear();
                particles.forEach(particle => particle.move() || particle.display());
            };
            p.windowResized = () => {
                const container = document.getElementById('particle-bg');
                if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
            };
            class Particle {
                constructor() { this.x = p.random(p.width); this.y = p.random(p.height); this.size = p.random(2, 4); this.speedX = p.random(-1, 1); this.speedY = p.random(-1, 1); }
                move() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > p.width) this.speedX *= -1; if (this.y < 0 || this.y > p.height) this.speedY *= -1; }
                display() { p.noStroke(); p.fill(255, 215, 0, 180); p.circle(this.x, this.y, this.size); }
            }
        });
    }
}

// Initialize animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('revealed')), { threshold: 0.1 });
    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));
}

// Format content
function formatContent(content) {
    return content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Display posts
function displayPosts(postsToDisplay) {
    const container = document.getElementById('posts-container');
    if (!postsToDisplay.length) {
        container.innerHTML = '<p style="color: white; text-align: center;">No posts yet. Be the first!</p>';
        return;
    }
    container.innerHTML = postsToDisplay.map(post => `
        <div class="post-card">
            <div class="post-content">
                <div class="post-header">
                    <div class="user-avatar">${post.AuthorInitials || '??'}</div>
                    <div class="post-author">${post.AuthorName || 'Unknown'}</div>
                    <div class="post-time">${timeAgo(post.CreatedAt)}</div>
                    ${post.Status === 'solved' ? '<div class="post-flair" style="background: #58D68D;">Solved</div>' : ''}
                </div>
                <h3 class="post-title" onclick="viewPost(${post.PostID})">${post.PostName}</h3>
                <div class="post-body">${formatContent(post.PostBody)}</div>
                ${currentUser.id === post.UserID ? `<button class="status-toggle-btn" onclick="toggleStatus(${post.PostID}, '${post.Status || ''}')">Toggle Solved</button>` : ''}
                <div class="post-footer">
                    <div class="vote-buttons">
                        <button class="vote-btn upvote" onclick="vote(${post.PostID}, 'up')">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                        </button>
                        <div class="vote-count" id="votes-${post.PostID}">${post.Upvotes || 0}</div>
                        <button class="vote-btn downvote" onclick="vote(${post.PostID}, 'down')">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="post-action" onclick="viewPost(${post.PostID})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>${post.PostReplies || 0} Comments</span>
                    </div>
                    <div class="post-action" onclick="sharePost(${post.PostID})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        <span>Share</span>
                    </div>
                    <div class="post-action" onclick="savePost(${post.PostID})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <span>Save</span>
                    </div>
                    <!-- 🔹 Delete button now always shown -->
                    <div class="post-action delete-btn" onclick="deletePost(${post.PostID}, ${currentUser.id})">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    updateAllVoteButtons();
}

// Toggle status
async function toggleStatus(postId, currentStatus) {
    if (!isLoggedIn) {
        alert('Please log in to update status.');
        return;
    }
    const newStatus = currentStatus === 'solved' ? null : 'solved';
    try {
        await apiRequest(`/Posts/UpdatePostStatus/${postId}`, 'PUT', newStatus);
        await loadPosts();
        alert(`Status updated to ${newStatus ? 'solved' : 'unsolved'}.`);
    } catch (err) {
        console.error('Failed to update status:', err);
        alert('❌ Failed to update status.');
    }
}

// Handle voting
function vote(postId, direction) {
    if (!isLoggedIn) {
        alert('Please log in to vote.');
        return;
    }
    const post = currentPosts.find(p => p.PostID === postId);
    if (!post) return;
    const existing = userVotes[postId];
    if (existing === direction) {
        post.Upvotes = (post.Upvotes || 0) + (direction === 'up' ? -1 : 1);
        delete userVotes[postId];
    } else {
        if (existing === 'up') post.Upvotes = (post.Upvotes || 0) - 1;
        if (existing === 'down') post.Upvotes = (post.Upvotes || 0) + 1;
        post.Upvotes = (post.Upvotes || 0) + (direction === 'up' ? 1 : -1);
        userVotes[postId] = direction;
    }
    filterPosts(currentFilter);
}

// Update vote button states
function updateAllVoteButtons() {
    currentFiltered.forEach(post => {
        const upBtn = document.querySelector(`[onclick="vote(${post.PostID}, 'up')"]`);
        const downBtn = document.querySelector(`[onclick="vote(${post.PostID}, 'down')"]`);
        if (!upBtn || !downBtn) return;
        upBtn.style.background = '';
        upBtn.style.color = '';
        downBtn.style.background = '';
        downBtn.style.color = '';
        const vote = userVotes[post.PostID];
        if (vote === 'up') { upBtn.style.background = 'var(--upvote)'; upBtn.style.color = '#ffffff'; }
        else if (vote === 'down') { downBtn.style.background = 'var(--downvote)'; downBtn.style.color = '#ffffff'; }
    });
}

// Filter and sort posts
function filterPosts(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    currentFiltered = currentPosts.filter(p => p.TopicID === parseInt(topicId));
    currentFiltered.sort((a, b) => {
        switch (filter) {
            case 'new': return new Date(b.CreatedAt) - new Date(a.CreatedAt);
            case 'hot': return ((b.Upvotes || 0) * 2 + (b.PostReplies || 0)) - ((a.Upvotes || 0) * 2 + (a.PostReplies || 0));
            case 'top': return (b.Upvotes || 0) - (a.Upvotes || 0);
            case 'rising': return ((b.Upvotes || 0) / getAgeInHours(b.CreatedAt)) - ((a.Upvotes || 0) / getAgeInHours(a.CreatedAt));
            default: return 0;
        }
    });
    displayPosts(currentFiltered);
}

// Load posts
async function loadPosts() {
    try {
        const posts = await apiRequest(`/Posts/GetPostsByTopic/${topicId}`, 'GET');
        currentPosts = posts.map(p => ({
            PostID: p.postID,
            TopicID: p.topicID,
            PostName: p.postName,
            PostBody: p.postBody,
            CreatedAt: p.createdAt || new Date().toISOString(), // 🔹 fallback in case backend returns null
            AuthorName: p.authorName,
            AuthorInitials: p.authorInitials,
            Status: p.status,
            PostReplies: p.postReplies,
            Upvotes: p.upvotes,
            UserID: p.userID // 🔹 ensure ownership comparisons still work
        }));
        filterPosts(currentFilter);
    } catch (err) {
        console.error('Error loading posts:', err);
        document.getElementById('posts-container').innerHTML =
            '<p style="color: white; text-align: center;">Failed to load posts. Check server logs.</p>';
    }
}

// Load topic
async function loadTopic() {
    try {
        const topics = await apiRequest('/Topics/GetTopics', 'GET');
        console.log('Topic ID from URL:', topicId); // Debug the input
        console.log('Topics response:', topics); // Debug the full response
        const topic = topics.find(t => t.topicID === parseInt(topicId)); // Match case with claritas.js
        if (!topic) {
            throw new Error(`Topic with ID ${topicId} not found. Available IDs: ${topics.map(t => t.topicID).join(', ')}`);
        }
        const slug = topic.topicTitle.toLowerCase().replace(/\s+/g, '');
        document.getElementById('topic-icon').textContent = '📌';
        document.getElementById('topic-name').textContent = `r/${slug}`;
        document.title = `r/${slug} - Valedictorian`;
        document.getElementById('topic-meta').textContent = `${topic.topicTitle} Community`;
        document.getElementById('topic-description').textContent = topic.topicDescription || 'No description available.';
    } catch (err) {
        console.error('Error loading topic:', err);
        document.getElementById('topic-description').textContent = err.message;
    }
}

// Open create post modal
function openCreatePostModal() {
    if (!isLoggedIn) {
        alert('Please log in to create a post.');
        window.location.href = '../HTML/login.html';
        return;
    }
    document.getElementById('create-post-modal').style.display = 'block';
}

function closeCreatePostModal() {
    document.getElementById('create-post-modal').style.display = 'none';
    document.getElementById('create-post-form').reset();
}

// Post actions
function viewPost(id) {
    window.location.href = `../HTML/post.html?postId=${id}`;
    
}

function sharePost(id) {
    alert(`Sharing post ${id}.`);
}

function savePost(id) {
    alert(`Post ${id} saved.`);
}

// Handle post submission
async function handlePostSubmission() {
    const form = document.getElementById('create-post-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const postName = document.getElementById('post-title').value.trim();
        const postBody = document.getElementById('post-content').value.trim();
        if (!postName || !postBody) {
            alert('Post name and body are required.');
            return;
        }
        const body = {
            topicID: parseInt(topicId),
            userID: parseInt(currentUser.id),
            postName: postName,
            postBody: postBody,
            status: "Unresolved",
            postReplies: 0,
            upvotes: 0,
            createdAt: new Date().toISOString() // 🔹 add current timestamp
        };
        try {
            await apiRequest('/Posts/AddPost', 'POST', body);
            closeCreatePostModal();
            await loadPosts();
            alert('✅ Post created successfully!');
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('❌ Failed to create post. Please try again.');
        }
    });
}

// Setup login check
function setupLoginCheck() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || '';
    const userSurname = localStorage.getItem('userSurname') || '';
    isLoggedIn = !!userId;
    if (isLoggedIn) {
        currentUser = { id: parseInt(userId, 10), name: `${userName} ${userSurname}`, initials: (userName[0] || '?') + (userSurname[0] || '?') };
        document.getElementById('user-avatar').textContent = currentUser.initials;
        document.querySelector('.create-post-input').onclick = openCreatePostModal;
        document.getElementById('text-post-btn').onclick = openCreatePostModal;
    } else {
        document.getElementById('user-avatar').textContent = '??';
        document.querySelector('.create-post-input').placeholder = 'Log in to create a post';
        document.querySelector('.create-post-input').onclick = () => alert('Please log in to create a post.');
        document.getElementById('text-post-btn').onclick = () => alert('Please log in to create a post.');
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
    topicId = new URLSearchParams(window.location.search).get('topicId');
    console.log('Parsed topicId:', topicId); // Debug the URL parameter
    if (!topicId) {
        alert('No topic selected.');
        window.location.href = '../HTML/claritas.html';
        return;
    }
    setupLoginCheck();
    initializeAnimations();
    initializeParticles();
    handlePostSubmission();
    await loadTopic();
    await loadPosts();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterPosts(btn.dataset.filter));
    });

    document.getElementById('create-post-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeCreatePostModal();
    });
    document.querySelector('.close-btn').addEventListener('click', closeCreatePostModal);
});

window.vote = vote;
window.toggleStatus = toggleStatus;
window.viewPost = viewPost;
window.sharePost = sharePost;
window.savePost = savePost;

async function deletePost(postId, userId) {
    if (!confirm("🗑️ Are you sure you want to delete this post? This action cannot be undone.")) {
        return;
    }

    try {
        const response = await apiRequest(`/Posts/DeletePost/${postId}?userId=${userId}`, "DELETE");

        if (response && response.message) {
            alert(response.message);
            // Refresh posts list
            await loadPosts();
        } else {
            alert("Failed to delete post (no response message).");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete post. You can only delete your own posts.");
    }
}

window.deletePost = deletePost;

window.addEventListener('load', async () => {
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (!subscribeBtn) {
        console.error('❌ Subscribe button not found even after load');
        return;
    }

    const topicId = new URLSearchParams(window.location.search).get('topicId');
    const userId = localStorage.getItem('userId'); // however you store it
    if (!topicId || !userId) {
        console.error('Missing topicId or userId');
        return;
    }

    // Helper to check and update button state
    async function updateSubscribeButton() {
        try {
        const res = await fetch(`https://localhost:7161/api/Topics/IsSubscribed/${topicId}?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch subscription state');
        const data = await res.json();
        subscribeBtn.textContent = data.subscribed ? 'Unsubscribe' : 'Subscribe';
        } catch (err) {
        console.error('Failed to check subscription:', err);
        }
    }

    subscribeBtn.addEventListener('click', async () => {
        console.log('✅ Subscribe button clicked');
        try {
        const isUnsubscribing = subscribeBtn.textContent === 'Unsubscribe';
        const endpoint = isUnsubscribing
            ? `https://localhost:7161/api/Topics/Unsubscribe/${topicId}?userId=${userId}`
            : `https://localhost:7161/api/Topics/Subscribe/${topicId}?userId=${userId}`;

        const method = isUnsubscribing ? 'DELETE' : 'POST';
        const res = await fetch(endpoint, { method });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert(isUnsubscribing ? 'Unsubscribed from topic' : 'Subscribed to topic');
        await updateSubscribeButton();
        } catch (err) {
        console.error('Subscription toggle failed:', err);
        }
    });

    // Initialize button state
    await updateSubscribeButton();
});