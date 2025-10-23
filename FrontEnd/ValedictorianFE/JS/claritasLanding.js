import { apiRequest } from './api.js';

function navigateToTopic(topicId) {
    window.location.href = `../HTML/topic.html?topicId=${topicId}`;
}

window.navigateToTopic = navigateToTopic;

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

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeParticles();

    // ✅ Role-based button visibility
    const userRole = localStorage.getItem('userRole');
    const addTopicBtn = document.getElementById('addTopicBtn');
    if (addTopicBtn) {
        if (userRole !== 'Admin' && userRole !== 'Tutor') {
            addTopicBtn.style.display = 'none';
        } else {
            addTopicBtn.style.display = 'inline-block';
        }
    }
});

// Topics API Section (dynamic loading)
let allTopics = []; // Global for search if needed

async function loadModules(moduleSelect) {
    moduleSelect.innerHTML = `<option value="">Loading modules...</option>`;
    try {
        const modules = await apiRequest('/Modules/GetModules', 'GET');
        if (!modules.length) {
            moduleSelect.innerHTML = `<option value="">No modules available</option>`;
            return;
        }
        moduleSelect.innerHTML = `<option value="">Select a module</option>`;
        modules.forEach(m => {
            const option = document.createElement('option');
            option.value = m.moduleID;
            option.textContent = m.moduleName;
            moduleSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error loading modules:', err);
        moduleSelect.innerHTML = `<option value="">Failed to load modules</option>`;
    }
}

async function loadTopics(topicList) {
    try {
        const topics = await apiRequest('/Topics/GetTopics', 'GET');
        allTopics = topics; // Store for search if needed
        topicList.innerHTML = topics.map(t => `
            <div class="category-card" onclick="navigateToTopic(${t.topicID})">
                <div class="category-header">
                    <div class="category-icon" style="background: #5DADE2">
                        <span style="font-size: 1.5rem;">📚</span>
                    </div>
                    <div>
                        <h3 class="category-title">${t.topicTitle}</h3>
                    </div>
                </div>
                <p class="category-description">${t.topicDescription || ''}</p>
                <div class="category-stats">
                    <div class="stat-item"></div>
                    <div class="stat-item">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 
                                9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 
                                0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        ${t.posts || 0} posts
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading topics:', err);
        topicList.innerHTML = `<p style="color:white;">Failed to load topics</p>`;
    }
}

async function openTopicModal() {
    const moduleSelect = document.querySelector('#moduleSelect');
    await loadModules(moduleSelect);
    document.getElementById('topicModal').style.display = 'block';
}

function closeTopicModal() {
    document.getElementById('topicModal').style.display = 'none';
    document.getElementById('topicForm').reset();
}

window.openTopicModal = openTopicModal;
window.closeTopicModal = closeTopicModal;

document.addEventListener('DOMContentLoaded', async () => {
    const topicList = document.querySelector('#categories-grid');
    const modal = document.querySelector('#topicModal');
    const form = document.querySelector('#topicForm');

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTopicModal();
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const moduleSelect = document.querySelector('#moduleSelect');
        const moduleID = parseInt(moduleSelect.value);
        const topicTitle = form.querySelector('#topicTitle').value.trim();
        const topicDescription = form.querySelector('#topicDescription').value.trim();

        if (!moduleID || !topicTitle) {
            alert('Please select a module and enter a topic title.');
            return;
        }

        const body = { ModuleID: moduleID, TopicTitle: topicTitle, TopicDescription: topicDescription };

        try {
            await apiRequest('/Topics/AddTopic', 'POST', body);
            closeTopicModal();
            await loadTopics(topicList);
            alert('✅ Topic added successfully');
        } catch (err) {
            console.error('Failed to submit topic:', err);
            alert('❌ Failed to create topic. Please try again.');
        }
    });

    // Initial topics load
    await loadTopics(topicList);
});

// Optional: Fix search if needed (uses allTopics)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allTopics.filter(t => 
            t.topicTitle.toLowerCase().includes(query) ||
            (t.topicDescription || '').toLowerCase().includes(query)
        );
        const topicList = document.querySelector('#categories-grid');
        topicList.innerHTML = filtered.map(t => `
            <!-- same template as in loadTopics -->
        `).join('');
    }, 300));
}
