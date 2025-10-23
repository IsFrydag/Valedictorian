const API_BASE = "https://localhost:7161/api";

async function apiRequest(endpoint, method = "GET", data) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: data ? JSON.stringify(data) : undefined
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Request failed");
        return result;
    } catch (err) {
        console.error("API Error:", err.message || err);
        throw err;
    }
}

class ModuleListManager {
    constructor() {
        this.modules = [];
        this.filteredModules = [];
        this.hiddenModuleIds = JSON.parse(localStorage.getItem('hiddenModuleIds')) || [];
        this.initialize();
    }

    initialize() {
        this.cacheDOM();
        this.bindEvents();
        this.loadModules();
        this.initializeTextAnimations();
        this.initializeParticles();
        this.populateProfileName();
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
        this.statsCounter = document.querySelector('.stats-counter');
    }

    bindEvents() {
        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', () => {
                if (this.profileDropdown) this.profileDropdown.classList.toggle('hidden');
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

    populateProfileName() {
        const nameEl = document.getElementById('profileName');
        const userName = localStorage.getItem('userName');
        const userSurname = localStorage.getItem('userSurname');
        if (nameEl && userName && userSurname) nameEl.textContent = `${userName} ${userSurname}`;
    }

    async loadModules() {
        try {
            if (this.modulesGrid) this.modulesGrid.innerHTML = `<p class="text-white/70">Loading modules...</p>`;
            const data = await apiRequest('/Modules/GetModules', 'GET');
            this.modules = Array.isArray(data) ? data : [];
            this.filteredModules = [...this.modules];
            this.renderModules();
            this.updateStats();
        } catch (err) {
            console.error('Failed to load modules', err);
            if (this.modulesGrid) this.modulesGrid.innerHTML = `<p class="text-red-400">Failed to load modules.</p>`;
        }
    }

    openModal() {
        if (!this.addModuleModal) return;
        this.addModuleModal.classList.remove('hidden');
        const modalDialog = this.addModuleModal.querySelector('.scale-95');
        if (modalDialog) {
            modalDialog.classList.remove('opacity-0');
            modalDialog.classList.remove('scale-95');
            modalDialog.classList.add('opacity-100');
            modalDialog.classList.add('scale-100');
        }
    }

    closeModalWindow() {
        if (!this.addModuleModal) return;
        this.addModuleModal.classList.add('hidden');
        this.addModuleForm.reset();
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const nameInput = this.addModuleForm.querySelector('#moduleName');
        const descInput = this.addModuleForm.querySelector('#moduleDescription');

        const moduleName = nameInput ? nameInput.value.trim() : '';
        const moduleDescription = descInput ? descInput.value.trim() : '';

        if (!moduleName || !moduleDescription) {
            alert('Module name and description are required.');
            return;
        }

        try {
            await apiRequest('/Modules/AddModule', 'POST', {
                ModuleName: moduleName,
                ModuleDescription: moduleDescription
            });

            this.closeModalWindow();
            await this.loadModules();
        } catch (err) {
            console.error('Add module error:', err);
            alert(err.message || 'Failed to add module.');
        }
    }

    renderModules() {
        if (!this.modulesGrid) return;
        const query = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
        const activeFilter = Array.from(this.filterChips).find(ch => ch.classList.contains('active'))?.dataset?.filter || 'all';

        let list = [...this.modules];

        if (activeFilter === 'hiddenModules') {
            list = this.modules.filter(m => this.hiddenModuleIds.includes(this._idOf(m)));
        } else if (activeFilter !== 'all') {
            list = list.filter(m => {
                const category = (m.moduleCategory || m.category || '').toString().toLowerCase();
                return category === activeFilter;
            });
            // list = list.filter(m => !this.hiddenModuleIds.includes(this._idOf(m)));
        } else {
            // list = list.filter(m => !this.hiddenModuleIds.includes(this._idOf(m)));
        }

        if (query) {
            list = list.filter(m => {
                const name = (m.moduleName || m.ModuleName || m.moduleName)?.toString().toLowerCase() || '';
                const desc = (m.moduleDescription || m.ModuleDescription || '')?.toString().toLowerCase() || '';
                return name.includes(query) || desc.includes(query);
            });
        }

        this.filteredModules = list;

        this.modulesGrid.innerHTML = '';
        if (this.filteredModules.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        } else {
            this.emptyState.classList.add('hidden');
        }

        this.filteredModules.forEach(m => {
            const id = this._idOf(m);
            const name = m.moduleName || m.ModuleName || 'Untitled';
            const desc = m.moduleDescription || m.ModuleDescription || '';
            const material = m.uploadedMaterial || m.UploadedMaterial || 'N/A';

            const card = document.createElement('div');
            card.className = 'module-card p-6 rounded-2xl shadow-lg';
            card.innerHTML = `
                <div class="flex flex-col h-full">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-white mb-2">${this._escape(name)}</h3>
                        <p class="text-white/80 mb-4">${this._escape(desc)}</p>
                    </div>
                    <div class="flex items-center justify-between pt-4">
                        <div class="flex items-center gap-2">
                            <button class="btn-hide px-3 py-1 rounded-full text-sm border border-white/20 bg-transparent">Hide</button>
                            <button class="btn-delete px-3 py-1 rounded-full text-sm border border-red-500 text-red-500 bg-transparent">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            const hideBtn = card.querySelector('.btn-hide');
            hideBtn.addEventListener('click', () => this.toggleHideModule(id));

            const delBtn = card.querySelector('.btn-delete');
            delBtn.addEventListener('click', () => this.deleteModule(id));

            this.modulesGrid.appendChild(card);
        });

        this.updateStats();
    }

    _escape(str) {
        return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    _idOf(m) {
        return m.moduleID ?? m.ModuleID ?? m.id ?? null;
    }

    toggleHideModule(id) {
        if (!id) return;
        const idx = this.hiddenModuleIds.indexOf(id);
        if (idx === -1) {
            this.hiddenModuleIds.push(id);
        } else {
            this.hiddenModuleIds.splice(idx, 1);
        }
        localStorage.setItem('hiddenModuleIds', JSON.stringify(this.hiddenModuleIds));
        this.renderModules();
    }

    async deleteModule(id) {
        if (!confirm('Delete this module? This cannot be undone.')) return;
        try {
            await apiRequest(`/Modules/DeleteModule/${id}`, 'DELETE');
            await this.loadModules();
        } catch (err) {
            console.error('Delete error', err);
            alert('Failed to delete module.');
        }
    }

    handleSearch(e) {
        this.renderModules();
    }

    handleFilterClick(e) {
        this.filterChips.forEach(chip => chip.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const filter = e.currentTarget.dataset.filter;
        if (filter === 'hiddenModules') {
            this.renderModules();
        } else {
            this.renderModules();
        }
    }

    updateStats() {
        const total = this.modules.length;
        if (this.statsCounter) {
            this.statsCounter.dataset.count = total;
            this.statsCounter.textContent = total;
        }
    }

    initializeTextAnimations() {
        if (typeof Splitting === 'function') {
            Splitting();
            if (typeof anime !== 'undefined') {
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
                    for (let i = 0; i < 80; i++) particles.push(new Particle());
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

document.addEventListener('DOMContentLoaded', () => new ModuleListManager());