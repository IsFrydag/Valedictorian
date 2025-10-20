const faqData = [
    {
        id: 1,
        category: 'admissions',
        question: 'What are the admission requirements for international students?',
        answer: 'International students need a valid secondary school diploma equivalent to Belgian ASO with mathematics (4+ hours/week in final 2 years), English proficiency (IELTS 6.5+ or TOEFL 79+), and specific program prerequisites. We also require a motivation letter and academic transcripts.',
        helpful: 245
    },
    {
        id: 2,
        category: 'admissions',
        question: 'When are the application deadlines?',
        answer: 'For EU students: September intake deadline is August 15th, February intake deadline is January 15th. Non-EU students should apply by June 1st for September intake and November 1st for February intake to allow sufficient time for visa processing.',
        helpful: 189
    },
    {
        id: 3,
        category: 'admissions',
        question: 'Do I need to speak Dutch or French to study here?',
        answer: 'No, all our IT programs are taught entirely in English. However, learning basic Dutch or French is highly recommended for daily life in Belgium and can improve your job prospects after graduation.',
        helpful: 156
    },
    {
        id: 4,
        category: 'admissions',
        question: 'What documents are required for the application?',
        answer: 'Required documents include: certified copies of diplomas and transcripts, English proficiency certificate, motivation letter, CV/resume, copy of passport, and portfolio (for design-related programs).',
        helpful: 134
    },
    {
        id: 5,
        category: 'programs',
        question: 'What IT programs do you offer?',
        answer: 'We offer 8 specialized programs: Computer Science, Artificial Intelligence, Cybersecurity, Data Science, Software Engineering, Cloud Computing, Digital Business, and IoT & Embedded Systems. Each program is 3 years (180 ECTS).',
        helpful: 312
    },
    {
        id: 6,
        category: 'programs',
        question: 'Can I switch programs after starting?',
        answer: 'Yes, program transfers are possible within the first semester without losing credits. After the first semester, transfers may require additional coursework. We provide academic counseling to ensure smooth transitions.',
        helpful: 87
    },
    {
        id: 7,
        category: 'programs',
        question: 'Are there internship opportunities?',
        answer: 'Yes, all programs include mandatory internships in the 2nd and 3rd years. We have partnerships with 150+ companies including Deloitte, Microsoft, SAP, and local tech startups.',
        helpful: 203
    },
    {
        id: 8,
        category: 'programs',
        question: 'What programming languages are taught?',
        answer: 'Core languages include Python, Java, JavaScript, and C++. Specialized programs add R (Data Science), Go (Cloud Computing), or Assembly (IoT). We focus on modern frameworks relevant to industry demands.',
        helpful: 167
    },
    {
        id: 9,
        category: 'tuition',
        question: 'What are the tuition fees for international students?',
        answer: 'Tuition fees vary by program: €3,500-4,200 per year for EU students, €8,500-12,000 per year for non-EU students. Additional costs include registration fees (€299) and study materials (€500-800/year).',
        helpful: 445
    },
    {
        id: 10,
        category: 'tuition',
        question: 'Are scholarships available?',
        answer: 'Yes, we offer merit-based scholarships (€1,000-5,000), need-based grants, and country-specific scholarships. The Belgium Government also offers scholarships for certain nationalities.',
        helpful: 267
    },
    {
        id: 11,
        category: 'tuition',
        question: 'Can I work part-time while studying?',
        answer: 'International students can work up to 20 hours/week during semester and full-time during holidays. EU students have no restrictions. Campus jobs and external positions are available.',
        helpful: 178
    },
    {
        id: 12,
        category: 'tuition',
        question: 'What payment options are available?',
        answer: 'Payment can be made in full (2% discount), semester installments, or monthly payments (€50 admin fee). We accept bank transfers, credit cards, and international payment platforms.',
        helpful: 89
    },
    {
        id: 13,
        category: 'career',
        question: 'What is the job placement rate after graduation?',
        answer: 'Our job placement rate is 95% within 6 months of graduation, with 78% of students receiving job offers before completing their studies. Average starting salary is €55,000-72,000.',
        helpful: 356
    },
    {
        id: 14,
        category: 'career',
        question: 'Which companies hire your graduates?',
        answer: 'Top employers include Deloitte, PwC, Microsoft, SAP, Proximus, KBC Bank, ING, Colruyt Group, and numerous startups. Our graduates work across finance, healthcare, government, and technology sectors.',
        helpful: 234
    },
    {
        id: 15,
        category: 'career',
        question: 'Can international students work in Belgium after graduation?',
        answer: 'Yes, international graduates can apply for a "search year" visa allowing 12 months to find employment. Once employed, you can transition to a work permit. Our international office provides guidance.',
        helpful: 189
    },
    {
        id: 16,
        category: 'career',
        question: 'Do you provide career counseling services?',
        answer: 'Yes, our Career Services Center offers personalized counseling, resume workshops, interview preparation, salary negotiation support, and career fairs. Services are available to current students and alumni.',
        helpful: 123
    }
];

let currentCategory = 'all';
let searchQuery = '';

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
                    p.fill(255, 215, 0, 180); // Gold particles, matches moduleList
                    p.circle(this.x, this.y, this.size);
                }
            }
        });
    }
}

function initializeChatbase() {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
            if (!window.chatbase.q) {
                window.chatbase.q = [];
            }
            window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
            get(target, prop) {
                if (prop === "q") {
                    return target.q;
                }
                return (...args) => target(prop, ...args);
            }
        });
    }
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "EikTFqQGFuY4aizTDzUOu";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
}

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

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.toLowerCase();
        displayFAQs();
    }, 300));
}

function initializeCategoryFilters() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            setActiveCategory(category);
        });
    });
}

function setActiveCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    displayFAQs();
}

function displayFAQs() {
    const container = document.getElementById('faq-container');
    const noResults = document.getElementById('no-results');
    let filteredFAQs = faqData;
    if (currentCategory !== 'all') {
        filteredFAQs = filteredFAQs.filter(faq => faq.category === currentCategory);
    }
    if (searchQuery) {
        filteredFAQs = filteredFAQs.filter(faq => 
            faq.question.toLowerCase().includes(searchQuery) ||
            faq.answer.toLowerCase().includes(searchQuery)
        );
    }
    if (filteredFAQs.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    noResults.classList.add('hidden');
    filteredFAQs.sort((a, b) => b.helpful - a.helpful);
    container.innerHTML = filteredFAQs.map(faq => createFAQCard(faq)).join('');
    container.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
    });
    anime({
        targets: '.faq-card',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutQuart',
        duration: 600,
        delay: anime.stagger(50)
    });
}

function createFAQCard(faq) {
    return `
        <div class="faq-card">
            <div class="faq-question">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold mb-2 pr-4">${faq.question}</h3>
                        <div class="flex items-center space-x-4 text-sm">
                            <span class="capitalize px-2 py-1 rounded-full text-xs">${faq.category}</span>
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                ${faq.helpful} found helpful
                            </span>
                        </div>
                    </div>
                    <div class="faq-icon">
                        <svg class="icon-size" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="faq-answer">
                <div class="p-6">
                    <p class="leading-relaxed mb-4">${faq.answer}</p>
                    <div class="flex items-center justify-between">
                        <div class="text-sm">Was this helpful?</div>
                        <div class="flex space-x-2">
                            <button class="helpful-btn bg-green-50" data-helpful="yes">Yes</button>
                            <button class="helpful-btn bg-red-50" data-helpful="no">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleFAQ(questionElement) {
    const card = questionElement.closest('.faq-card');
    const answer = card.querySelector('.faq-answer');
    const icon = card.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('open');
    if (isOpen) {
        answer.classList.remove('open');
        icon.style.transform = 'rotate(0deg)';
    } else {
        document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
            openAnswer.classList.remove('open');
            const openCard = openAnswer.closest('.faq-card');
            openCard.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
        });
        answer.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('helpful-btn')) {
        const action = e.target.dataset.helpful;
        e.target.textContent = action === 'yes' ? 'Thanks!' : 'Thanks for feedback';
        e.target.disabled = true;
        setTimeout(() => {
            e.target.textContent = action === 'yes' ? 'Yes' : 'No';
            e.target.disabled = false;
        }, 2000);
    }
});

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
    initializeSearch();
    initializeCategoryFilters();
    displayFAQs();
    initializeParticles();
    initializeChatbase();
});
