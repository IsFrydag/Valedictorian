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
        alert('Admin registration not supported yet.');
        return;
    } else {
        alert('Invalid account type.');
        return;
    }

    // Email domain validation
    if (!email.endsWith(domain)) {
        alert(`Email must end with ${domain}`);
        return;
    }

    // Extract 6-digit ID from email (e.g. 123456@student.belgiumcampus.ac.za)
    const match = email.match(/^(\d{6})@/);
    if (!match) {
        alert('Email must begin with a 6-digit ID.');
        return;
    }
    userID = match[1];

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

    let expectedUserType = '';
    let domain = '';
    let userID = '';

    if (type === 'optStudent') {
        domain = '@student.belgiumcampus.ac.za';
        expectedUserType = 'Student';
    } else if (type === 'optTutor') {
        domain = '@tutor.belgiumcampus.ac.za';
        expectedUserType = 'Tutor';
    } else if (type === 'optAdmin') {
        domain = '@admin.belgiumcampus.ac.za';
        expectedUserType = 'Admin';
    } else {
        alert('Invalid account type.');
        return;
    }

    if (!email.endsWith(domain)) {
        alert(`Email must end with ${domain}`);
        return;
    }

    const match = email.match(/^(\d{6})@/);
    if (!match) {
        alert('Email must start with a 6-digit user ID.');
        return;
    }

    userID = match[1];

    try {
        const users = await apiRequest('/Reg/GetUsers', 'GET');
        const user = users.find(u => u.userID === userID && u.email === email);

        if (!user) {
            throw new Error('User not found.');
        }

        if (user.password !== password) {
            throw new Error('Incorrect password.');
        }

        if (user.userType !== expectedUserType) {
            throw new Error(`You're trying to log in as a ${expectedUserType}, but your account is a ${user.userType}.`);
        }

        localStorage.setItem('userId', user.userID);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userSurname', user.surname);
        localStorage.setItem('userType', user.userType);

        alert(`Welcome back, ${user.name}!`);
        loginForm.reset();
        window.location.href = '../HTML/Home.html';

    } catch (err) {
        alert(err.message || 'Login failed.');
        console.error('Login error:', err);
    }
});