document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeContactForm();
    initializeInteractiveElements();
});

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

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmission);
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            anime({
                targets: input,
                scale: [1, 1.02],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        input.addEventListener('blur', () => {
            anime({
                targets: input,
                scale: [1.02, 1],
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });
}

function initializeInteractiveElements() {
    document.getElementById('chat-btn').addEventListener('click', () => {
        showNotification('Live chat feature coming soon! For immediate assistance, please call +32 2 123 4567.');
    });
    document.getElementById('visit-btn').addEventListener('click', () => {
        showNotification('Campus visit scheduling feature coming soon! Please call +32 2 123 4567 to arrange a visit.');
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showSuccessMessage();
        form.reset();
    }, 2000);
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'notification success-notification';
    message.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Message sent successfully! We'll get back to you within 24 hours.</span>
        </div>
    `;
    document.body.appendChild(message);
    anime({
        targets: message,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuart'
    });
    setTimeout(() => {
        anime({
            targets: message,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(message);
            }
        });
    }, 5000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification info-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuart'
    });
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 4000);
}