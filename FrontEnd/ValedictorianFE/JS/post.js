import { apiRequest } from './api.js';

// Globals
let currentPost = null;
let replies = [];
let userPostVote = null; // 'up', 'down', or null
let userReplyVotes = {};

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
                for (let i = 0; i < 50; i++) {
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
                    this.size = p.random(2, 3);
                    this.speedX = p.random(-0.6, 0.6);
                    this.speedY = p.random(-0.6, 0.6);
                }

                move() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < 0 || this.x > p.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > p.height) this.speedY *= -1;
                }

                display() {
                    p.noStroke();
                    p.fill(255, 215, 0, 120);
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

// Get postId from URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('postId'));
}

// Relative time
function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return "just now";
}

// Load post details
async function loadPost(postId) {
    try {
        const post = await apiRequest(`/Posts/GetPost/${postId}`, 'GET');
        currentPost = post;

        document.title = `${post.PostName} - Valedictorian`;
        document.getElementById('post-title').textContent = post.PostName;
        document.getElementById('post-body').innerHTML = post.PostBody.replace(/\n/g, '<br>');
        document.getElementById('author-name').textContent = post.AuthorName;
        document.getElementById('author-avatar').textContent = post.AuthorInitials;
        document.getElementById('post-time').textContent = timeAgo(post.CreatedAt);
        document.getElementById('post-votes').textContent = post.Upvotes || 0;
        document.getElementById('post-flair').textContent = post.Status || 'Help';

        const topic = await apiRequest(`/Topics/GetTopic/${post.TopicID}`, 'GET');
        document.getElementById('community-link').textContent = `r/${topic.TopicTitle || 'Unknown'}`;
        document.getElementById('community-link').href = `../HTML/topic.html?topicId=${post.TopicID}`;
        document.getElementById('back-button').href = `../HTML/topic.html?topicId=${post.TopicID}`;
        document.getElementById('community-desc').textContent = topic.TopicDescription || 'No description available.';

        // Placeholder stats
        document.getElementById('members-count').textContent = '2.4k';
        document.getElementById('online-count').textContent = '156';

        await loadReplies(postId);
        await loadRelatedPosts(post.TopicID, postId);
    } catch (err) {
        console.error('Error loading post:', err);
        alert('Failed to load post.');
    }
}

// Load replies
async function loadReplies(postId) {
    try {
        const flatReplies = await apiRequest(`/Replies/GetRepliesByPost/${postId}`, 'GET');
        replies = buildNestedReplies(flatReplies);
        displayComments();
    } catch (err) {
        console.error('Error loading replies:', err);
    }
}

// Build nested replies
function buildNestedReplies(flatReplies) {
    const replyMap = {};
    const rootReplies = [];

    flatReplies.forEach(reply => {
        reply.replies = [];
        replyMap[reply.ReplyID] = reply;
    });

    flatReplies.forEach(reply => {
        if (reply.ParentReplyID) {
            const parent = replyMap[reply.ParentReplyID];
            if (parent) parent.replies.push(reply);
        } else {
            rootReplies.push(reply);
        }
    });

    return rootReplies;
}

// Display comments
function displayComments() {
    const container = document.getElementById('comments-list');
    container.innerHTML = replies.map(reply => createCommentHTML(reply)).join('');
    
    const totalComments = countAllComments(replies);
    document.getElementById('comments-count').textContent = `${totalComments} comments`;
}

// Count all comments
function countAllComments(replyList) {
    let count = replyList.length;
    replyList.forEach(reply => {
        if (reply.replies && reply.replies.length > 0) {
            count += countAllComments(reply.replies);
        }
    });
    return count;
}

// Create comment HTML
function createCommentHTML(reply, level = 0) {
    const marginLeft = level * 2;
    const hasReplies = reply.replies && reply.replies.length > 0;
    
    return `
        <div class="comment-item" style="${level > 0 ? `margin-left: ${marginLeft}rem; border-left: 2px solid rgba(255,255,255,0.1); padding-left: 1rem;` : ''}">
            <div class="comment-content">
                <div class="comment-vote">
                    <button class="comment-vote-btn" onclick="voteReply(${reply.ReplyID}, 'up')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                    </button>
                    <div class="comment-vote-count" id="reply-votes-${reply.ReplyID}">${reply.Upvotes}</div>
                    <button class="comment-vote-btn" onclick="voteReply(${reply.ReplyID}, 'down')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                <div class="comment-main">
                    <div class="comment-header">
                        <div class="comment-author">${reply.AuthorName}</div>
                        <div class="comment-time">${timeAgo(reply.CreatedAt)}</div>
                    </div>
                    <div class="comment-body">${formatCommentContent(reply.Body)}</div>
                    <div class="comment-actions">
                        <button class="comment-action" onclick="replyToComment(${reply.ReplyID})">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                            </svg>
                            <span>Reply</span>
                        </button>
                        <button class="comment-action" onclick="shareComment(${reply.ReplyID})">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                    <div class="reply-form" id="reply-form-${reply.ReplyID}">
                        <textarea class="reply-textarea" placeholder="Write a reply..."></textarea>
                        <div class="reply-actions">
                            <button type="button" class="cancel-btn" onclick="cancelReply(${reply.ReplyID})">Cancel</button>
                            <button type="button" class="submit-comment-btn" onclick="submitReply(${reply.ReplyID})">Reply</button>
                        </div>
                    </div>
                </div>
            </div>
            ${hasReplies ? `<div class="nested-comments">${reply.replies.map(child => createCommentHTML(child, level + 1)).join('')}</div>` : ''}
        </div>
    `;
}

// Format comment content
function formatCommentContent(content) {
    return content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Handle post voting
async function votePost(direction) {
    if (!currentPost) return;
    
    try {
        const response = await apiRequest(`/Posts/UpvotePost/${currentPost.PostID}`, 'POST', { Direction: direction });
        document.getElementById('post-votes').textContent = response.Upvotes;
        userPostVote = direction === userPostVote ? null : direction;
        updatePostVoteButtons();
    } catch (err) {
        console.error('Vote error:', err);
    }
}

// Update post vote buttons
function updatePostVoteButtons() {
    const upvoteBtn = document.querySelector('.vote-btn.upvote');
    const downvoteBtn = document.querySelector('.vote-btn.downvote');
    
    upvoteBtn.classList.toggle('active', userPostVote === 'up');
    downvoteBtn.classList.toggle('active', userPostVote === 'down');
}

// Handle reply voting
async function voteReply(replyId, direction) {
    try {
        const response = await apiRequest(`/Replies/UpvoteReply/${replyId}`, 'POST', { Direction: direction });
        document.getElementById(`reply-votes-${replyId}`).textContent = response.Upvotes;
        // Optional: Update local userReplyVotes if tracking
    } catch (err) {
        console.error('Vote error:', err);
    }
}

// Submit comment (top-level reply)
async function submitComment(event) {
    event.preventDefault();
    const commentInput = document.getElementById('comment-input');
    const body = commentInput.value.trim();
    if (!body || !currentPost) return;
    
    try {
        await apiRequest('/Replies/AddReply', 'POST', {
            PostID: currentPost.PostID,
            UserID: parseInt(localStorage.getItem('userId')) || 1, // From login
            Body: body
        });
        commentInput.value = '';
        await loadReplies(currentPost.PostID);
    } catch (err) {
        console.error('Add reply error:', err);
    }
}

// Clear comment
function clearComment() {
    document.getElementById('comment-input').value = '';
}

// Reply to comment
function replyToComment(replyId) {
    document.querySelectorAll('.reply-form').forEach(form => form.classList.remove('active'));
    const replyForm = document.getElementById(`reply-form-${replyId}`);
    replyForm.classList.add('active');
    replyForm.querySelector('textarea').focus();
}

// Cancel reply
function cancelReply(replyId) {
    const replyForm = document.getElementById(`reply-form-${replyId}`);
    replyForm.classList.remove('active');
    replyForm.querySelector('textarea').value = '';
}

// Submit reply (nested)
async function submitReply(parentReplyId) {
    const replyForm = document.getElementById(`reply-form-${parentReplyId}`);
    const body = replyForm.querySelector('textarea').value.trim();
    if (!body || !currentPost) return;
    
    try {
        await apiRequest('/Replies/AddReply', 'POST', {
            PostID: currentPost.PostID,
            UserID: parseInt(localStorage.getItem('userId')) || 1,
            Body: body,
            ParentReplyID: parentReplyId
        });
        cancelReply(parentReplyId);
        await loadReplies(currentPost.PostID);
    } catch (err) {
        console.error('Add reply error:', err);
    }
}

// Post actions (placeholders)
function sharePost() {
    alert('Post shared!');
}

function savePost() {
    alert('Post saved!');
}

function reportPost() {
    alert('Post reported!');
}

function shareComment(replyId) {
    alert(`Comment ${replyId} shared!`);
}

// Load related posts
async function loadRelatedPosts(topicId, currentPostId) {
    try {
        const posts = await apiRequest(`/Posts/GetPostsByTopic/${topicId}`, 'GET');
        const related = posts.filter(p => p.PostID !== currentPostId).slice(0, 4);
        const container = document.getElementById('related-posts');
        container.innerHTML = related.map(p => `
            <div class="related-post" onclick="window.location.href='../HTML/post.html?postId=${p.PostID}'">
                <div class="related-post-title">${p.PostName}</div>
                <div class="related-post-meta">${p.Upvotes || 0} votes • ${p.PostReplies || 0} comments</div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading related posts:', err);
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll to top
window.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scroll-top');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initializeAnimations();
    initializeParticles();
    const postId = getPostIdFromUrl();
    if (postId) {
        await loadPost(postId);
    } else {
        alert('No post ID provided.');
    }
});