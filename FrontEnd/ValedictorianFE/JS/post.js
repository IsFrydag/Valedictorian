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
    if (!date) return '';
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

// Normalize incoming API object to consistent camel/UpperCase property names used by backend DTO
function normalizePostObject(post) {
    if (!post) return null;
    // Accept either casing from backend, produce canonical object with PostID etc.
    return {
        PostID: post.PostID ?? post.postID ?? post.id ?? null,
        TopicID: post.TopicID ?? post.topicID ?? post.topicId ?? null,
        PostName: post.PostName ?? post.postName ?? post.postTitle ?? '',
        PostBody: post.PostBody ?? post.postBody ?? post.body ?? '',
        Upvotes: post.Upvotes ?? post.upvotes ?? 0,
        PostReplies: post.PostReplies ?? post.postReplies ?? post.postRepliesCount ?? 0,
        AuthorName: post.AuthorName ?? post.authorName ?? post.author ?? '',
        AuthorInitials: post.AuthorInitials ?? post.authorInitials ?? (() => {
            const n = post.AuthorName ?? post.authorName ?? '';
            const parts = n.split(' ').filter(Boolean);
            return (parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '?');
        })(),
        CreatedAt: post.CreatedAt ?? post.createdAt ?? post.createdAtUtc ?? null,
        // keep raw as well if needed
        __raw: post
    };
}

// Load post details
async function loadPost(postId) {
    try {
        const postFromApi = await apiRequest(`/Posts/GetPost/${postId}`, 'GET');
        const post = normalizePostObject(postFromApi);
        if (!post || !post.PostID) {
            console.error('Invalid post object from API:', postFromApi);
            throw new Error('Invalid post data');
        }

        currentPost = post;

        // update DOM using canonical keys
        document.title = `${post.PostName} - Valedictorian`;
        const titleEl = document.getElementById('post-title');
        const bodyEl = document.getElementById('post-body');
        const authorNameEl = document.getElementById('author-name');
        const authorAvatarEl = document.getElementById('author-avatar');
        const postTimeEl = document.getElementById('post-time');
        const postVotesEl = document.getElementById('post-votes');

        if (titleEl) titleEl.textContent = post.PostName;
        if (bodyEl) bodyEl.innerHTML = (post.PostBody || '').replace(/\n/g, '<br>');
        if (authorNameEl) authorNameEl.textContent = post.AuthorName;
        if (authorAvatarEl) authorAvatarEl.textContent = post.AuthorInitials;
        if (postTimeEl) postTimeEl.textContent = timeAgo(post.CreatedAt);
        if (postVotesEl) postVotesEl.textContent = post.Upvotes ?? 0;

        // load topic for breadcrumb/link — normalize topic response too
        if (post.TopicID) {
            try {
                const topicRaw = await apiRequest(`/Topics/GetTopic/${post.TopicID}`, 'GET');
                const topicTitle = topicRaw.TopicTitle ?? topicRaw.topicTitle ?? 'Unknown';
                const communityLink = document.getElementById('community-link');
                if (communityLink) {
                    communityLink.textContent = `r/${topicTitle}`;
                    communityLink.href = `../HTML/topic.html?topicId=${post.TopicID}`;
                }
                const backButton = document.getElementById('back-button');
                if (backButton) {
                    backButton.href = `../HTML/topic.html?topicId=${post.TopicID}`;
                    backButton.target = '_self';
                }
            } catch (err) {
                // non-fatal
                console.warn('Failed to load topic for post:', err);
            }
        }

        // load replies and related posts
        await loadReplies(post.PostID);
        await loadRelatedPosts(post.TopicID, post.PostID);
    } catch (err) {
        console.error('Error loading post:', err);
        alert('Failed to load post.');
    }
}

// Load replies
async function loadReplies(postId) {
    try {
        if (!postId) {
            console.warn('loadReplies called with falsy postId', postId);
            return;
        }
        const flatReplies = await apiRequest(`/Replies/GetRepliesByPost/${postId}`, 'GET');
        // Normalize replies' casing (ensure ReplyID, ParentReplyID, Body, Upvotes, CreatedAt)
        const normalized = (flatReplies || []).map(r => ({
            ReplyID: r.ReplyID ?? r.replyID ?? r.id,
            ParentReplyID: r.ParentReplyID ?? r.parentReplyID ?? r.parentId ?? null,
            Body: r.Body ?? r.body ?? '',
            Upvotes: r.Upvotes ?? r.upvotes ?? 0,
            CreatedAt: r.CreatedAt ?? r.createdAt ?? r.CreatedAt,
            AuthorName: r.AuthorName ?? r.authorName ?? r.Author ?? 'Unknown',
            AuthorInitials: r.AuthorInitials ?? r.authorInitials ?? (() => {
                const n = r.AuthorName ?? r.authorName ?? '??';
                const parts = n.split(' ').filter(Boolean);
                return ((parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '?')).toUpperCase();
            })(),
            // keep raw for anything else
            __raw: r
        }));
        replies = buildNestedReplies(normalized);
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
            else rootReplies.push(reply); // parent missing -> treat as root to avoid losing it
        } else {
            rootReplies.push(reply);
        }
    });

    return rootReplies;
}

// Display comments
function displayComments() {
    const container = document.getElementById('comments-list');
    if (!container) return;
    container.innerHTML = replies.map(reply => createCommentHTML(reply)).join('');
    
    const totalComments = countAllComments(replies);
    const countEl = document.getElementById('comments-count');
    if (countEl) countEl.textContent = `${totalComments} comments`;
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
                        <div class="comment-author">${escapeHtml(reply.AuthorName)}</div>
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

// Simple HTML escape
function escapeHtml(str = '') {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Format comment content (keeps simple markup)
function formatCommentContent(content) {
    return escapeHtml(content || '').replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
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
    if (upvoteBtn) upvoteBtn.classList.toggle('active', userPostVote === 'up');
    if (downvoteBtn) downvoteBtn.classList.toggle('active', userPostVote === 'down');
}

// Handle reply voting
const replyVotes = {}; // { replyId: 'up' | 'down' }

async function voteReply(replyId, direction) {
    const voteCountEl = document.getElementById(`reply-votes-${replyId}`);
    let count = parseInt(voteCountEl.textContent) || 0;

    const previousVote = replyVotes[replyId];

    // Toggle logic
    if (previousVote === direction) {
        // Undo vote
        replyVotes[replyId] = null;
        count += (direction === 'up' ? -1 : 1);
    } else {
        // New vote or flipped
        if (previousVote === 'up') count -= 1;
        if (previousVote === 'down') count += 1;
        replyVotes[replyId] = direction;
        count += (direction === 'up' ? 1 : -1);
    }

    // Update UI immediately
    voteCountEl.textContent = count;

    // Update colors (optional)
    updateReplyVoteButtons(replyId);

    // Send to backend
    try {
        await fetch(`${API_BASE}/Replies/UpvoteReply/${replyId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Direction: direction })
        });
    } catch (err) {
        console.error("Vote error:", err);
    }
}

function updateReplyVoteButtons(replyId) {
    const upBtn = document.querySelector(`#reply-votes-${replyId}`).closest('.comment-vote').querySelector('button:nth-child(1)');
    const downBtn = document.querySelector(`#reply-votes-${replyId}`).closest('.comment-vote').querySelector('button:nth-child(3)');
    
    upBtn.classList.toggle('active', replyVotes[replyId] === 'up');
    downBtn.classList.toggle('active', replyVotes[replyId] === 'down');
}

window.voteReply = voteReply;

// Submit top-level comment helper (used by form listener)
async function submitComment(postId, userId, body, parentReplyId = null) {
    const replyData = {
        PostID: postId,
        UserID: userId,
        Body: body,
        ParentReplyID: parentReplyId,
        Uploads: null,
        UploadFormat: null,
        CreatedAt: new Date().toISOString()
    };

    console.log("Sending reply: ", replyData);

    try {
        const result = await apiRequest(`/Replies/AddReply`, "POST", replyData);
        console.log("Reply created:", result);

        // Optional: reload replies or update UI
        await loadReplies(postId);
    } catch (error) {
        console.error("Add reply error:", error);
    }
}

// Clear comment
function clearComment() {
    const el = document.getElementById('comment-input');
    if (el) el.value = '';
}

// Reply to comment
function replyToComment(replyId) {
    document.querySelectorAll('.reply-form').forEach(form => form.classList.remove('active'));
    const replyForm = document.getElementById(`reply-form-${replyId}`);
    if (replyForm) {
        replyForm.classList.add('active');
        const ta = replyForm.querySelector('textarea');
        if (ta) ta.focus();
    }
}

// Cancel reply
function cancelReply(replyId) {
    const replyForm = document.getElementById(`reply-form-${replyId}`);
    if (replyForm) {
        replyForm.classList.remove('active');
        const ta = replyForm.querySelector('textarea');
        if (ta) ta.value = '';
    }
}

// Submit nested reply
async function submitReply(parentReplyId) {
    const replyForm = document.getElementById(`reply-form-${parentReplyId}`);
    if (!replyForm || !currentPost) return;
    const body = replyForm.querySelector('textarea').value.trim();
    if (!body) return;
    
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
function sharePost() { alert('Post shared!'); }
function savePost() { alert('Post saved!'); }
function reportPost() { alert('Post reported!'); }
function shareComment(replyId) { alert(`Comment ${replyId} shared!`); }

// Load related posts
async function loadRelatedPosts(topicId, currentPostId) {
    try {
        if (!topicId) return;
        const posts = await apiRequest(`/Posts/GetPostsByTopic/${topicId}`, 'GET');
        const related = (posts || []).filter(p => (p.PostID ?? p.postID) !== currentPostId).slice(0, 4);
        const container = document.getElementById('related-posts');
        if (!container) return;
        container.innerHTML = related.map(p => {
            const pid = p.PostID ?? p.postID;
            const name = p.PostName ?? p.postName;
            return `
                <div class="related-post" onclick="window.location.href='../HTML/post.html?postId=${pid}'">
                    <div class="related-post-title">${escapeHtml(name)}</div>
                    <div class="related-post-meta">${p.Upvotes ?? p.upvotes ?? 0} votes • ${p.PostReplies ?? p.postReplies ?? 0} comments</div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading related posts:', err);
    }
}

// Scroll to top
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Show/hide scroll to top
window.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scroll-top');
    if (!scrollTop) return;
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

    // Attach comment submit listener (top-level comments)
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const commentInput = document.getElementById('comment-input');
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            const userId = parseInt(localStorage.getItem('userId')) || 1;
            const parentReplyId = commentInput.dataset.parentReplyId ? parseInt(commentInput.dataset.parentReplyId) : null;

            await submitComment(currentPost.PostID, userId, commentText, parentReplyId);
            commentInput.value = "";
            commentInput.placeholder = "Write a comment...";
            delete commentInput.dataset.parentReplyId; // clear reply mode

            await loadReplies(currentPost.PostID);
        });
    }
});

let userVotes = {};
let isLoggedIn = !!localStorage.getItem('userId');
let currentUser = {
    id: localStorage.getItem('userId'),
    name: `${localStorage.getItem('userName') || ''} ${localStorage.getItem('userSurname') || ''}`,
    initials: (localStorage.getItem('userName')?.[0] || '?') + (localStorage.getItem('userSurname')?.[0] || '?')
};

function vote(postId, direction) {
    if (!isLoggedIn) {
        alert('Please log in to vote.');
        return;
    }

    const voteCountElement = document.getElementById(`votes-${postId}`);
    if (!voteCountElement) return;
    let count = parseInt(voteCountElement.textContent) || 0;
    const existing = userVotes[postId];

    if (existing === direction) {
        count += (direction === 'up' ? -1 : 1);
        delete userVotes[postId];
    } else {
        if (existing === 'up') count--;
        if (existing === 'down') count++;
        count += (direction === 'up' ? 1 : -1);
        userVotes[postId] = direction;
    }

    voteCountElement.textContent = count;
}
window.votePost = votePost;

async function deletePost(postId, userId) {
    if (!confirm("🗑️ Are you sure you want to delete this post? This action cannot be undone.")) {
        return;
    }

    try {
        const response = await apiRequest(`Posts/DeletePost/${postId}?userId=${userId}`, "DELETE");
        if (response && response.message) {
            alert(response.message);
            window.location.href = `topic.html?topicId=${getTopicIdFromUrl()}`;
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete post. You can only delete your own posts.");
    }
}

window.replyToComment = function (parentReplyId) {
    const replyBox = document.getElementById('comment-input');
    replyBox.placeholder = "Replying to comment #" + parentReplyId;
    replyBox.dataset.parentReplyId = parentReplyId; // store it for later use
    replyBox.focus();
};