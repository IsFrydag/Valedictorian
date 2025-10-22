// Calendar and booking system functionality
let currentDate = new Date();
let selectedDate = null;
let currentStep = 1;
let bookingData = {};

// Sample tutors data
const tutorsData = {
    'computer-science': [
        { id: 1, name: 'Dr. Sarah Chen', specialty: 'Algorithms & Data Structures', avatar: 'SC' },
        { id: 2, name: 'Prof. Michael Rodriguez', specialty: 'Software Architecture', avatar: 'MR' },
        { id: 3, name: 'Dr. Emily Watson', specialty: 'Database Systems', avatar: 'EW' }
    ],
    'artificial-intelligence': [
        { id: 4, name: 'Dr. James Liu', specialty: 'Machine Learning', avatar: 'JL' },
        { id: 5, name: 'Prof. Anna Kowalski', specialty: 'Neural Networks', avatar: 'AK' },
        { id: 6, name: 'Dr. Robert Singh', specialty: 'Computer Vision', avatar: 'RS' }
    ],
    'cybersecurity': [
        { id: 7, name: 'Dr. Lisa Anderson', specialty: 'Network Security', avatar: 'LA' },
        { id: 8, name: 'Prof. David Kim', specialty: 'Cryptography', avatar: 'DK' },
        { id: 9, name: 'Dr. Maria Gonzalez', specialty: 'Ethical Hacking', avatar: 'MG' }
    ],
    'data-science': [
        { id: 10, name: 'Dr. Thomas Brown', specialty: 'Statistical Analysis', avatar: 'TB' },
        { id: 11, name: 'Prof. Rachel Green', specialty: 'Big Data Analytics', avatar: 'RG' },
        { id: 12, name: 'Dr. Kevin Park', specialty: 'Data Visualization', avatar: 'KP' }
    ],
    'software-engineering': [
        { id: 13, name: 'Dr. Amanda Taylor', specialty: 'Agile Development', avatar: 'AT' },
        { id: 14, name: 'Prof. Christopher Lee', specialty: 'DevOps & CI/CD', avatar: 'CL' },
        { id: 15, name: 'Dr. Jennifer White', specialty: 'Software Testing', avatar: 'JW' }
    ],
    'cloud-computing': [
        { id: 16, name: 'Dr. Alex Johnson', specialty: 'AWS & Azure', avatar: 'AJ' },
        { id: 17, name: 'Prof. Sophie Martin', specialty: 'Cloud Architecture', avatar: 'SM' },
        { id: 18, name: 'Dr. Daniel Garcia', specialty: 'Serverless Computing', avatar: 'DG' }
    ],
    'digital-business': [
        { id: 19, name: 'Dr. Patricia Miller', specialty: 'Digital Transformation', avatar: 'PM' },
        { id: 20, name: 'Prof. Mark Thompson', specialty: 'E-commerce Systems', avatar: 'MT' },
        { id: 21, name: 'Dr. Laura Wilson', specialty: 'Business Analytics', avatar: 'LW' }
    ],
    'iot-embedded': [
        { id: 22, name: 'Dr. Steven Clark', specialty: 'IoT Architecture', avatar: 'SC' },
        { id: 23, name: 'Prof. Nancy Adams', specialty: 'Embedded Systems', avatar: 'NA' },
        { id: 24, name: 'Dr. Frank Moore', specialty: 'Sensor Networks', avatar: 'FM' }
    ],
    'mathematics': [
        { id: 25, name: 'Dr. Barbara Harris', specialty: 'Calculus & Analysis', avatar: 'BH' },
        { id: 26, name: 'Prof. Charles King', specialty: 'Linear Algebra', avatar: 'CK' },
        { id: 27, name: 'Dr. Diana Wright', specialty: 'Discrete Mathematics', avatar: 'DW' }
    ],
    'statistics': [
        { id: 28, name: 'Dr. Edward Scott', specialty: 'Probability Theory', avatar: 'ES' },
        { id: 29, name: 'Prof. Helen Baker', specialty: 'Statistical Modeling', avatar: 'HB' },
        { id: 30, name: 'Dr. George Carter', specialty: 'Data Analysis', avatar: 'GC' }
    ]
};

// Sample booked meetings
let bookedMeetings = [
    {
        id: 1,
        date: '2025-12-15',
        module: 'Computer Science',
        tutor: 'Dr. Sarah Chen',
        type: 'face-to-face',
        status: 'accepted',
        description: 'Help with binary search tree implementation'
    },
    {
        id: 2,
        date: '2025-12-18',
        module: 'Data Science',
        tutor: 'Dr. Thomas Brown',
        type: 'online',
        status: 'pending',
        description: 'Statistical analysis project guidance'
    },
    {
        id: 3,
        date: '2025-12-20',
        module: 'Cybersecurity',
        tutor: 'Dr. Lisa Anderson',
        type: 'face-to-face',
        status: 'accepted',
        description: 'Network security protocols review'
    }
];

// Initialize the calendar
function initCalendar() {
    generateCalendar();
    renderMeetings();
    
    // Event listeners
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });

    // Module selection change
    document.getElementById('module-select').addEventListener('change', function() {
        const module = this.value;
        const nextBtn = document.getElementById('next-1');
        
        if (module) {
            nextBtn.disabled = false;
            bookingData.module = module;
        } else {
            nextBtn.disabled = true;
        }
    });

    // Meeting type selection
    document.querySelectorAll('.meeting-type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.meeting-type-option').forEach(opt => 
                opt.classList.remove('selected'));
            this.classList.add('selected');
            
            bookingData.meetingType = this.dataset.type;
            document.getElementById('next-2').disabled = false;
        });
    });

    // Issue description
    document.getElementById('issue-description').addEventListener('input', function() {
        const bookBtn = document.getElementById('book-btn');
        if (this.value.trim().length > 10) {
            bookBtn.disabled = false;
            bookingData.description = this.value;
        } else {
            bookBtn.disabled = true;
        }
    });
}

function generateCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('current-month');
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
        const isToday = date.toDateString() === new Date().toDateString();
        const hasMeeting = bookedMeetings.some(meeting => 
            meeting.date === date.toISOString().split('T')[0]);
        
        if (!isCurrentMonth) {
            dayElement.classList.add('other-month');
        } else {
            dayElement.classList.add('available');
        }
        
        if (hasMeeting) {
            dayElement.classList.add('has-meeting');
        }
        
        if (isToday) {
            dayElement.style.border = '2px solid var(--gold)';
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            ${hasMeeting ? '<div class="day-meetings">• Meeting</div>' : ''}
        `;
        
        if (isCurrentMonth && date >= new Date()) {
            dayElement.addEventListener('click', () => selectDate(date));
        }
        
        grid.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    
    // Show booking form
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('booking-form').classList.add('active');
    
    // Update selected date display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('selected-date-text').textContent = 
        `Booking for ${date.toLocaleDateString('en-US', options)}`;
    
    bookingData.date = date.toISOString().split('T')[0];
    
    // Reset form
    resetBookingForm();
}

function resetBookingForm() {
    currentStep = 1;
    bookingData = { date: bookingData.date };
    
    // Reset all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step-1').classList.add('active');
    
    // Reset form fields
    document.getElementById('module-select').value = '';
    document.getElementById('issue-description').value = '';
    document.querySelectorAll('.meeting-type-option').forEach(opt => 
        opt.classList.remove('selected'));
    document.querySelectorAll('.tutor-option').forEach(opt => 
        opt.classList.remove('selected'));
    
    // Reset buttons
    document.getElementById('next-1').disabled = true;
    document.getElementById('next-2').disabled = true;
    document.getElementById('next-3').disabled = true;
    document.getElementById('book-btn').disabled = true;
}

function nextStep(step) {
    if (step === 3) {
        populateTutors();
    }
    
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function populateTutors() {
    const module = bookingData.module;
    const tutorGrid = document.getElementById('tutor-grid');
    const tutors = tutorsData[module] || [];
    
    tutorGrid.innerHTML = '';
    
    tutors.forEach(tutor => {
        const tutorOption = document.createElement('div');
        tutorOption.className = 'tutor-option';
        tutorOption.innerHTML = `
            <div class="tutor-avatar">${tutor.avatar}</div>
            <div class="tutor-info">
                <div class="tutor-name">${tutor.name}</div>
                <div class="tutor-specialty">${tutor.specialty}</div>
            </div>
        `;
        
        tutorOption.addEventListener('click', function() {
            document.querySelectorAll('.tutor-option').forEach(opt => 
                opt.classList.remove('selected'));
            this.classList.add('selected');
            
            bookingData.tutor = tutor;
            document.getElementById('next-3').disabled = false;
        });
        
        tutorGrid.appendChild(tutorOption);
    });
}

function bookSession() {
    const newMeeting = {
        id: Date.now(),
        date: bookingData.date,
        module: getModuleName(bookingData.module),
        tutor: bookingData.tutor.name,
        type: bookingData.meetingType,
        status: 'pending',
        description: bookingData.description
    };
    
    bookedMeetings.push(newMeeting);
    
    // Show success message
    alert('Session booked successfully! You will receive a confirmation email shortly.');
    
    // Reset and refresh
    document.getElementById('booking-form').classList.remove('active');
    document.getElementById('empty-state').style.display = 'block';
    generateCalendar();
    renderMeetings();
}

function getModuleName(moduleKey) {
    const moduleNames = {
        'computer-science': 'Computer Science',
        'artificial-intelligence': 'Artificial Intelligence',
        'cybersecurity': 'Cybersecurity',
        'data-science': 'Data Science',
        'software-engineering': 'Software Engineering',
        'cloud-computing': 'Cloud Computing',
        'digital-business': 'Digital Business',
        'iot-embedded': 'IoT & Embedded Systems',
        'mathematics': 'Mathematics',
        'statistics': 'Statistics'
    };
    return moduleNames[moduleKey] || moduleKey;
}

function renderMeetings() {
    const container = document.getElementById('meetings-container');
    const upcomingMeetings = bookedMeetings
        .filter(meeting => new Date(meeting.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcomingMeetings.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">No upcoming sessions</p>';
        return;
    }
    
    container.innerHTML = upcomingMeetings.map(meeting => {
        const date = new Date(meeting.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="meeting-item">
                <div class="meeting-header">
                    <div class="meeting-title">${meeting.module}</div>
                    <div class="meeting-status status-${meeting.status}">
                        ${meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </div>
                </div>
                <div class="meeting-details">
                    <strong>${dateStr}</strong> • ${meeting.tutor}<br>
                    ${meeting.type === 'face-to-face' ? '🏫 Face to Face' : '💻 Online'}<br>
                    <em>${meeting.description}</em>
                </div>
            </div>
        `;
    }).join('');
}

// Particle background animation
function initParticles() {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    initParticles();
});