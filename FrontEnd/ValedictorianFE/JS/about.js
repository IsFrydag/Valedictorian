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

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(counter => {
    statsObserver.observe(counter.parentElement);
});

function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = parseInt(counter.dataset.count);
        anime({
            targets: counter,
            innerHTML: [0, target],
            duration: 2000,
            easing: 'easeOutQuart',
            round: 1
        });
    });
}

class aboutManager{

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
document.addEventListener('DOMContentLoaded', () => new aboutManager());