class ModuleListManager {
    constructor() {
        this.modules = JSON.parse(localStorage.getItem('modules')) || [];
        this.filteredModules = [...this.modules];
        this.initialize();
    }

    initialize() {
        this.cacheDOM();
        this.bindEvents();
        this.renderModules();
        this.initializeTextAnimations();
        this.initializeParticles();
    }

    cacheDOM() {
        this.profileBtn = document.getElementById('profileBtn');
        this.profileDropdown = document.getElementById('profileDropdown');
        this.addModuleBtn = document.getElementById('addModuleBtn');
        this.addModuleModal = document.getElementById('addModuleModal');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.addModuleForm = document.getElementById('addModuleForm');
        this.modulesGrid = document.getElementById('modulesGrid');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.filterChips = document.querySelectorAll('.filter-chip');
    }

    bindEvents() {
        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', () => {
                this.profileDropdown.classList.toggle('hidden');
            });
        }

        if (this.addModuleBtn) {
            this.addModuleBtn.addEventListener('click', () => this.openModal());
        }

        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.closeModalWindow());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeModalWindow());
        }

        if (this.addModuleForm) {
            this.addModuleForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        this.filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => this.handleFilterClick(e));
        });
    }

    openModal() {
        this.addModuleModal.classList.remove('hidden');
    }

    closeModalWindow() {
        this.addModuleModal.classList.add('hidden');
        this.addModuleForm.reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const module = {
            id: Date.now(),
            name: this.addModuleForm.querySelector('#moduleName').value.trim(),
            code: this.addModuleForm.querySelector('#moduleCode').value.trim(),
            category: this.addModuleForm.querySelector('#moduleCategory').value.trim().toLowerCase(),
            image: '../assets/images/default-module.jpg'
        };

        this.modules.push(module);
        localStorage.setItem('modules', JSON.stringify(this.modules));

        this.closeModalWindow();
        this.renderModules();
    }

    renderModules() {
        this.modulesGrid.innerHTML = '';

        if (this.modules.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.filteredModules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `
                <img src="${module.image}" alt="${module.name}" class="module-img">
                <div class="module-info">
                    <h3>${module.name}</h3>
                    <p>${module.code}</p>
                    <span class="category-tag">${module.category}</span>
                </div>
            `;
            this.modulesGrid.appendChild(card);
        });
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        this.filteredModules = this.modules.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.code.toLowerCase().includes(query)
        );
        this.renderModules();
    }

    handleFilterClick(e) {
        this.filterChips.forEach(chip => chip.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.dataset.filter;
        if (category === 'all') {
            this.filteredModules = [...this.modules];
        } else {
            this.filteredModules = this.modules.filter(m => m.category === category);
        }

        this.renderModules();
    }

    initializeTextAnimations() {
        if (typeof Splitting === 'function') {
            Splitting();
            anime({
                targets: '.char',
                opacity: [0, 1],
                translateY: [40, 0],
                delay: anime.stagger(30),
                duration: 900,
                easing: 'easeOutCubic'
            });
        }
    }

    initializeParticles() {
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new ModuleListManager());