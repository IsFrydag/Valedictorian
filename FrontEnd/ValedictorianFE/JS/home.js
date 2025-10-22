// CampusLearn - Main JavaScript File
// Handles navigation, animations, and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initScrollEffects();
    initNotificationSystem();
    initAnnouncementAnimations();
    initSmoothScrolling();
    initCardHoverEffects();
    
    console.log('CampusLearn initialized successfully');
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) {
        console.error('Navigation elements not found');
        return;
    }
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll Effects and Navbar Behavior
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Add scrolling class for smooth transitions
        navbar.classList.add('scrolling');
        
        // Hide/show navbar based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background blur effect when scrolled
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--primary)';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Remove scrolling class after scroll ends
        scrollTimeout = setTimeout(() => {
            navbar.classList.remove('scrolling');
        }, 150);
    });
    
    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate cards with stagger effect
                const cards = entry.target.querySelectorAll('.announcement-card, .quick-access-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.announcements, .quick-access');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Notification System
function initNotificationSystem() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBadge = notificationBtn.querySelector('.notification-badge');
    
    if (!notificationBtn || !notificationBadge) {
        console.error('Notification elements not found');
        return;
    }
    
    let notificationCount = parseInt(notificationBadge.textContent) || 0;
    
    notificationBtn.addEventListener('click', function() {
        // Create notification popup
        showNotificationPopup();
        
        // Clear notification count
        notificationCount = 0;
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Simulate receiving new notifications
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            notificationCount++;
            notificationBadge.textContent = notificationCount;
            notificationBadge.style.display = 'flex';
            
            // Animate badge
            notificationBadge.style.animation = 'bounce 0.5s ease-in-out';
            setTimeout(() => {
                notificationBadge.style.animation = '';
            }, 500);
        }
    }, 30000); // Check every 30 seconds
}

// Notification Popup
function showNotificationPopup() {
    // Remove existing popup
    const existingPopup = document.querySelector('.notification-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <div class="popup-header">
            <h3>Notifications</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="popup-content">
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <div class="notification-text">
                    <h4>New announcement posted</h4>
                    <p>Check out the latest updates from your department</p>
                    <span class="notification-time">2 hours ago</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-calendar"></i>
                </div>
                <div class="notification-text">
                    <h4>Upcoming deadline</h4>
                    <p>Assignment due tomorrow at 11:59 PM</p>
                    <span class="notification-time">4 hours ago</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="notification-text">
                    <h4>New message received</h4>
                    <p>You have a new message from your professor</p>
                    <span class="notification-time">1 day ago</span>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 90px;
        right: 30px;
        width: 350px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-height: 500px;
        overflow-y: auto;
    `;
    
    document.body.appendChild(popup);
    
    // Close functionality
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        popup.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => popup.remove(), 300);
    });
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && !notificationBtn.contains(e.target)) {
                popup.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => popup.remove(), 300);
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

// Announcement Animations
function initAnnouncementAnimations() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                // Show message
                showMessage('More announcements coming soon!', 'info');
                
                // Reset button
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Add hover animations to announcement cards
    const announcementCards = document.querySelectorAll('.announcement-card');
    announcementCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add entrance animation
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        }, index * 100);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Card Hover Effects
function initCardHoverEffects() {
    const quickAccessCards = document.querySelectorAll('.quick-access-card');
    
    quickAccessCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Utility Functions
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'info' ? 'var(--accent)' : 'var(--secondary)'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -10px, 0);
        }
        70% {
            transform: translate3d(0, -5px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    .notification-popup .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 0;
        border-bottom: 1px solid #eee;
        margin-bottom: 0;
    }
    
    .notification-popup .popup-header h3 {
        margin: 0;
        color: var(--primary);
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .notification-popup .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-light);
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition);
    }
    
    .notification-popup .close-btn:hover {
        background-color: var(--neutral);
        color: var(--primary);
    }
    
    .notification-popup .popup-content {
        padding: 0;
    }
    
    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
        transition: var(--transition);
    }
    
    .notification-item:hover {
        background-color: var(--neutral);
    }
    
    .notification-item:last-child {
        border-bottom: none;
    }
    
    .notification-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, var(--accent), var(--secondary));
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.9rem;
        flex-shrink: 0;
    }
    
    .notification-text h4 {
        margin: 0 0 4px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--primary);
    }
    
    .notification-text p {
        margin: 0 0 4px;
        font-size: 0.85rem;
        color: var(--text-light);
        line-height: 1.4;
    }
    
    .notification-time {
        font-size: 0.75rem;
        color: var(--text-light);
        font-weight: 500;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out both;
    }
    
    .message {
        animation: slideDown 0.3s ease-out;
    }
`;

document.head.appendChild(style);

// Performance optimization
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

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showMessage,
        debounce
    };
}
