import { apiRequest } from '../JS/api.js';

const container = document.getElementById('container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');

// Toggle between login and register UI
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// =======================
// REGISTRATION
// =======================
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('my-dropdown').value; // optStudent, optTutor, optAdmin
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!type || !name || !surname || !email || !password) {
        alert('All fields are required.');
        return;
    }

    let userType = '';
    let domain = '';
    let userID = '';

    if (type === 'optStudent') {
        domain = '@student.belgiumcampus.ac.za';
        userType = 'Student';
    } else if (type === 'optTutor') {
        domain = '@tutor.belgiumcampus.ac.za';
        userType = 'Tutor';
    } else if (type === 'optAdmin') {
        domain = '@admin.belgiumcampus.ac.za';
        userType = 'Admin';
    } else {
        alert('Invalid account type.');
        return;
    }

    // ✅ Email domain validation
    if (!email.endsWith(domain)) {
        alert(`Email must end with ${domain}`);
        return;
    }

    // ✅ Only enforce 6-digit rule for Students and Tutors
    if (userType !== 'Admin') {
        const match = email.match(/^(\d{6})@/);
        if (!match) {
            alert('Email must begin with a 6-digit ID (e.g., 123456@student.belgiumcampus.ac.za).');
            return;
        }
        userID = match[1];
    } else {
        // Admins don't need a 6-digit prefix
        userID = 'ADMIN';
    }

    const body = {
        userName: name,
        userSurname: surname,
        userEmail: email,
        password: password,
        role: userType
    };

    try {
        const res = await apiRequest('/Reg/RegisterUser', 'POST', body);
        alert(res.message || 'Registration successful!');
        registerForm.reset();
        container.classList.remove("active");
    } catch (err) {
        alert(err.message || 'Registration failed.');
        console.error('Registration error:', err);
    }
});

// =======================
// LOGIN
// =======================
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('login-dropdown').value;
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!type || !email || !password) {
        alert('All fields are required.');
        return;
    }

    let expectedRole = '';
    let domain = '';

    if (type === 'optStudent') {
        domain = '@student.belgiumcampus.ac.za';
        expectedRole = 'Student';
    } else if (type === 'optTutor') {
        domain = '@tutor.belgiumcampus.ac.za';
        expectedRole = 'Tutor';
    } else if (type === 'optAdmin') {
        domain = '@admin.belgiumcampus.ac.za';
        expectedRole = 'Admin';
    } else {
        alert('Invalid account type.');
        return;
    }

    if (!email.endsWith(domain)) {
        alert(`Email must end with ${domain}`);
        return;
    }

    const body = {
        userEmail: email,
        password: password,
        role: expectedRole
    };

    try {
        const res = await apiRequest('/Auth/Login', 'POST', body);

        // Store returned data
        localStorage.setItem('userId', res.userID);
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('userSurname', res.userSurname);
        localStorage.setItem('userType', res.role);
        

        alert(`Welcome back, ${res.userName}!`);
        loginForm.reset();
        window.location.href = '../HTML/Home.html';
    } catch (err) {
        alert(err.message || 'Login failed.');
        console.error('Login error:', err);
    } 
});