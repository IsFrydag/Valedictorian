import { apiRequest } from './api.js';

const categories = [
    {
        id: 'general',
        title: 'General Discussion',
        description: 'Chat about anything and everything related to student life and beyond.',
        icon: '💬',
        posts: 1156,
        color: '#5DADE2'
    },
    {
        id: 'academics',
        title: 'Academics',
        description: 'Discuss courses, assignments, exams, and academic challenges.',
        icon: '📚',
        posts: 892,
        color: '#D4A574'
    },
    {
        id: 'technical',
        title: 'Technical Support',
        description: 'Get help with coding problems, software issues, and tech questions.',
        icon: '🔧',
        posts: 743,
        color: '#58D68D'
    },
    {
        id: 'career',
        title: 'Career & Jobs',
        description: 'Share job opportunities, career advice, and internship experiences.',
        icon: '💼',
        posts: 445,
        color: '#BB8FCE'
    },
    {
        id: 'projects',
        title: 'Projects & Portfolio',
        description: 'Showcase your projects, get feedback, and collaborate with others.',
        icon: '🚀',
        posts: 312,
        color: '#F7DC6F'
    },
    {
        id: 'events',
        title: 'Events & Meetups',
        description: 'Organize study groups, hackathons, and social events.',
        icon: '🎉',
        posts: 189,
        color: '#F1948A'
    },
    {
        id: 'resources',
        title: 'Resources & Tutorials',
        description: 'Share useful learning materials, tutorials, and study guides.',
        icon: '📖',
        posts: 567,
        color: '#85C1E9'
    },
    {
        id: 'lifestyle',
        title: 'Student Life',
        description: 'Everything about campus life, housing, and student experiences.',
        icon: '🏫',
        posts: 298,
        color: '#F8C471'
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
    initializeParticles();
    handleFormSubmission();
   
});


// API FOR TOPICS 


document.addEventListener('DOMContentLoaded', async () => {
  const topicList = document.querySelector('#topic-list');
  const createBtn = document.querySelector('#create-topic-btn');
  const modal = document.querySelector('#topic-modal');
  const form = document.querySelector('#topic-form');
  const moduleSelect = document.querySelector('#module-select');

  // Open modal
  createBtn.addEventListener('click', async () => {
    await loadModules();
    modal.style.display = 'block';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      form.reset();
    }
  });

  // Load modules into dropdown
  async function loadModules() {
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

  // Load and render topics
  async function loadTopics() {
    try {
      const topics = await apiRequest('/Topics/GetTopics', 'GET');
      topicList.innerHTML = topics.map(t => `
        <div class="discussion-card">
          <div class="discussion-header">
            <span class="discussion-category">${t.moduleName || 'General'}</span>
          </div>
          <h3 class="discussion-title">${t.topicTitle}</h3>
          <p class="discussion-excerpt">${t.topicDescription || ''}</p>
        </div>
      `).join('');
    } catch (err) {
      console.error('Error loading topics:', err);
      topicList.innerHTML = `<p style="color:white;">Failed to load topics</p>`;
    }
  }

  // Handle topic submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const moduleID = parseInt(moduleSelect.value);
    const topicTitle = form.querySelector('#topic-title').value.trim();
    const topicDescription = form.querySelector('#topic-desc').value.trim();

    if (!moduleID || !topicTitle) {
      alert('Please select a module and enter a topic title.');
      return;
    }

    const body = { ModuleID: moduleID, TopicTitle: topicTitle, TopicDescription: topicDescription };

    try {
      await apiRequest('/Topics/AddTopic', 'POST', body);
      modal.style.display = 'none';
      form.reset();
      await loadTopics();
      alert('✅ Topic added successfully');
    } catch (err) {
      console.error('Failed to submit topic:', err);
      alert('❌ Failed to create topic. Please try again.');
    }
  });

  // Initial load
  await loadTopics();
});