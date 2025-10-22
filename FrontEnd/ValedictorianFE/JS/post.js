// Sample comments data
const comments = [
    {
        id: 1,
        author: "Sarah Chen",
        authorAvatar: "SC",
        content: "I think I see the issue! In your step-by-step breakdown, you're filtering `even_numbers` for values greater than 5, but in your original list comprehension, you're filtering the original `numbers` list.\n\nThe difference is that in your original code, you're checking `x > 5` on the original numbers (6, 8, 10), but in your step-by-step, you're checking it on the even numbers (6, 8, 10). The results should be the same, so there might be something else going on.",
        votes: 12,
        time: "3 hours ago",
        replies: [
            {
                id: 11,
                author: "Alex Chen",
                authorAvatar: "AC",
                content: "Thanks for pointing that out! You're absolutely right. I think I was overcomplicating it. The issue might be with my actual project data then, not the logic itself.",
                votes: 5,
                time: "2 hours ago",
                replies: []
            },
            {
                id: 12,
                author: "Mike Johnson",
                authorAvatar: "MJ",
                content: "Actually, I think there's a mistake in your expected output. You said you expected [12, 14, 16, 20] but based on your conditions (even AND > 5), it should be [12, 16, 20]. Where did 14 come from?",
                votes: 8,
                time: "2 hours ago",
                replies: [
                    {
                        id: 121,
                        author: "Alex Chen",
                        authorAvatar: "AC",
                        content: "Oh wow, you're right! I was thinking of 7*2=14, but 7 is odd so it wouldn't be included. That's probably where my confusion was coming from. Thanks!",
                        votes: 3,
                        time: "1 hour ago",
                        replies: []
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        author: "David Kim",
        authorAvatar: "DK",
        content: "Your list comprehension syntax is correct. The issue might be with your understanding of the logic. Let me break it down:\n\n1. `x % 2 == 0` - filters even numbers: [2, 4, 6, 8, 10]\n2. `x > 5` - from those even numbers, keep only ones > 5: [6, 8, 10]\n3. `x * 2` - multiply those by 2: [12, 16, 20]\n\nSo your expected output [12, 14, 16, 20] is wrong. 14 would come from 7, but 7 is odd and gets filtered out in step 1.",
        votes: 18,
        time: "3 hours ago",
        replies: [
            {
                id: 21,
                author: "Alex Chen",
                authorAvatar: "AC",
                content: "This is exactly what I needed! I was mistakenly thinking 7 would be included. The logic is working correctly - it was my expectation that was wrong.",
                votes: 6,
                time: "2 hours ago",
                replies: []
            }
        ]
    },
    {
        id: 3,
        author: "Lisa Wang",
        authorAvatar: "LW",
        content: "Pro tip: When debugging list comprehensions, try breaking them down like you did, but also add print statements to see what's happening at each step:\n\n```python\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# See what gets filtered\nfiltered = [x for x in numbers if x % 2 == 0 and x > 5]\nprint(f\"Filtered: {filtered}\")  # [6, 8, 10]\n\n# See the final result\nresult = [x * 2 for x in filtered]\nprint(f\"Result: {result}\")  # [12, 16, 20]\n```\n\nThis helps you understand exactly what's happening at each stage.",
        votes: 15,
        time: "2 hours ago",
        replies: []
    },
    {
        id: 4,
        author: "Tom Rodriguez",
        authorAvatar: "TR",
        content: "If you want to include numbers like 7 (which would give you 14), you need to adjust your condition. Right now you're filtering out odd numbers before checking if they're greater than 5.\n\nMaybe you want something like:\n```python\n# Include odd numbers greater than 5 too\nresult = [x * 2 for x in numbers if x > 5]\n# This would give you [12, 14, 16, 18, 20]\n```\n\nOr if you want only even numbers from the original list that are greater than 5, your current code is correct.",
        votes: 9,
        time: "1 hour ago",
        replies: []
    },
    {
        id: 5,
        author: "Emma Thompson",
        authorAvatar: "ET",
        content: "I love how the community came together to solve this! This is exactly why I love this subreddit. Everyone's explanation helped me understand list comprehensions better too. Thanks for asking the question, Alex!",
        votes: 7,
        time: "30 minutes ago",
        replies: []
    }
];

let postVotes = 45;
let commentVotes = {};
let userVotes = {};
let userCommentVotes = {};

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

// Display comments
function displayComments() {
    const container = document.getElementById('comments-list');
    container.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
    
    // Update comments count
    const totalComments = countAllComments(comments);
    document.getElementById('comments-count').textContent = `${totalComments} comments`;
}

// Count all comments including replies
function countAllComments(commentList) {
    let count = commentList.length;
    commentList.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
            count += countAllComments(comment.replies);
        }
    });
    return count;
}

// Create comment HTML
function createCommentHTML(comment, level = 0) {
    const marginLeft = level * 2;
    const hasReplies = comment.replies && comment.replies.length > 0;
    
    return `
        <div class="comment-item" style="${level > 0 ? `margin-left: ${marginLeft}rem; border-left: 2px solid rgba(255,255,255,0.1); padding-left: 1rem;` : ''}">
            <div class="comment-content">
                <div class="comment-vote">
                    <button class="comment-vote-btn" onclick="voteComment(${comment.id}, 'up')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                    </button>
                    <div class="comment-vote-count" id="comment-votes-${comment.id}">${comment.votes}</div>
                    <button class="comment-vote-btn" onclick="voteComment(${comment.id}, 'down')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                <div class="comment-main">
                    <div class="comment-header">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-time">${comment.time}</div>
                    </div>
                    <div class="comment-body">${formatCommentContent(comment.content)}</div>
                    <div class="comment-actions">
                        <button class="comment-action" onclick="replyToComment(${comment.id})">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                            </svg>
                            <span>Reply</span>
                        </button>
                        <button class="comment-action" onclick="shareComment(${comment.id})">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                    <div class="reply-form" id="reply-form-${comment.id}">
                        <textarea class="reply-textarea" placeholder="Write a reply..."></textarea>
                        <div class="reply-actions">
                            <button type="button" class="cancel-btn" onclick="cancelReply(${comment.id})">Cancel</button>
                            <button type="button" class="submit-comment-btn" onclick="submitReply(${comment.id})">Reply</button>
                        </div>
                    </div>
                </div>
            </div>
            ${hasReplies ? `<div class="nested-comments">${comment.replies.map(reply => createCommentHTML(reply, level + 1)).join('')}</div>` : ''}
        </div>
    `;
}

// Format comment content
function formatCommentContent(content) {
    return content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

// Handle post voting
function votePost(direction) {
    const voteKey = 'post';
    
    if (userVotes[voteKey] === direction) {
        if (direction === 'up') postVotes--;
        else postVotes++;
        delete userVotes[voteKey];
    } else {
        if (userVotes[voteKey] === 'up') postVotes--;
        if (userVotes[voteKey] === 'down') postVotes++;
        
        if (direction === 'up') postVotes++;
        else postVotes--;
        userVotes[voteKey] = direction;
    }
    
    document.getElementById('post-votes').textContent = postVotes;
    updatePostVoteButtons();
}

// Update post vote button states
function updatePostVoteButtons() {
    const upvoteBtn = document.querySelector('.vote-btn.upvote');
    const downvoteBtn = document.querySelector('.vote-btn.downvote');
    const voteKey = 'post';
    
    upvoteBtn.classList.remove('active');
    downvoteBtn.classList.remove('active');
    
    if (userVotes[voteKey] === 'up') {
        upvoteBtn.classList.add('active');
    } else if (userVotes[voteKey] === 'down') {
        downvoteBtn.classList.add('active');
    }
}

// Handle comment voting
function voteComment(commentId, direction) {
    const comment = findCommentById(comments, commentId);
    if (!comment) return;
    
    const voteKey = `comment-${commentId}`;
    
    if (userCommentVotes[voteKey] === direction) {
        if (direction === 'up') comment.votes--;
        else comment.votes++;
        delete userCommentVotes[voteKey];
    } else {
        if (userCommentVotes[voteKey] === 'up') comment.votes--;
        if (userCommentVotes[voteKey] === 'down') comment.votes++;
        
        if (direction === 'up') comment.votes++;
        else comment.votes--;
        userCommentVotes[voteKey] = direction;
    }
    
    document.getElementById(`comment-votes-${commentId}`).textContent = comment.votes;
}

// Find comment by ID
function findCommentById(commentList, id) {
    for (let comment of commentList) {
        if (comment.id === id) return comment;
        if (comment.replies && comment.replies.length > 0) {
            const found = findCommentById(comment.replies, id);
            if (found) return found;
        }
    }
    return null;
}

// Submit comment
function submitComment(event) {
    event.preventDefault();
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    
    if (commentText) {
        const newComment = {
            id: Date.now(),
            author: "John Doe",
            authorAvatar: "JD",
            content: commentText,
            votes: 1,
            time: "just now",
            replies: []
        };
        
        comments.unshift(newComment);
        displayComments();
        commentInput.value = '';
        
        // Show success message
        alert('Comment posted successfully!');
    }
}

// Clear comment
function clearComment() {
    document.getElementById('comment-input').value = '';
}

// Reply to comment
function replyToComment(commentId) {
    // Hide all other reply forms
    document.querySelectorAll('.reply-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Show the specific reply form
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    replyForm.classList.add('active');
    replyForm.querySelector('textarea').focus();
}

// Cancel reply
function cancelReply(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    replyForm.classList.remove('active');
    replyForm.querySelector('textarea').value = '';
}

// Submit reply
function submitReply(parentCommentId) {
    const replyForm = document.getElementById(`reply-form-${parentCommentId}`);
    const replyText = replyForm.querySelector('textarea').value.trim();
    
    if (replyText) {
        const newReply = {
            id: Date.now(),
            author: "John Doe",
            authorAvatar: "JD",
            content: replyText,
            votes: 1,
            time: "just now",
            replies: []
        };
        
        const parentComment = findCommentById(comments, parentCommentId);
        if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(newReply);
            displayComments();
            cancelReply(parentCommentId);
            
            // Show success message
            alert('Reply posted successfully!');
        }
    }
}

// Post actions
function sharePost() {
    alert('Post shared! In a real implementation, this would show sharing options.');
}

function savePost() {
    alert('Post saved! In a real implementation, this would save the post to your account.');
}

function reportPost() {
    alert('Post reported! In a real implementation, this would send a report to moderators.');
}

function shareComment(commentId) {
    alert(`Comment ${commentId} shared! In a real implementation, this would show sharing options.`);
}

// Related posts
function viewRelatedPost(id) {
    alert(`Opening related post ${id}. In a real implementation, this would navigate to the post.`);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scroll-top');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    displayComments();
    initializeParticles();
});