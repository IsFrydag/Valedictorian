import { apiRequest } from '../JS/api.js';

const container = document.getElementById('container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');

// Toggle between login and registration forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('my-dropdown').value;
    let domain, userType;

    if (type === 'optStudent') { 
        domain = '@student.belgiumcampus.ac.za'; 
        userType = 'student'; 
    } else if (type === 'optTutor') { 
        domain = '@tutor.belgiumcampus.ac.za'; 
        userType = 'tutor'; 
    } else if (type === 'optAdmin') { 
        domain = '@admin.belgiumcampus.ac.za'; 
        userType = 'admin'; 
    }

    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!name || !surname || !email || !password) { 
        alert('All fields are required'); 
        return; 
    }
    if (!email.endsWith(domain)) { 
        alert('Email must end with the correct domain, example@<accountType>.belgiumcampus.ac.za'); 
        return; 
    }

    try {
        // Prepare the data to send to the backend
        const formData = {
            name,
            surname,
            email,
            password,
            userType
        };

        // Make a POST request to send the form data
        let response = await apiRequest('/Reg/Register', 'POST', formData);
        
        // Expecting response like { message: "Registration successful", name: "...", surname: "..." }
        alert(`Thank you for registering, ${response.name} ${response.surname}`);
        registerForm.reset();
        container.classList.remove("active"); // Switch to login form after registration
    } catch (err) {
        alert(err.message || 'API connection failed - check console for details');
        console.error('Registration error:', err);
    }
});

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('login-dropdown').value;
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!type || !email || !password) { 
        alert('All fields are required'); 
        return; 
    }

    let domain, userType, id;
    if (type === 'optStudent') {
        domain = '@student.belgiumcampus.ac.za';
        userType = 'student';
        const match = email.match(/^(\d{6})@student\.belgiumcampus\.ac\.za$/);
        if (!match) {
            alert('Student email must be 6 digits followed by @student.belgiumcampus.ac.za');
            return;
        }
        id = match[1]; // Extract 6 digits
    } else if (type === 'optTutor') {
        domain = '@tutor.belgiumcampus.ac.za';
        userType = 'tutor';
        const match = email.match(/^(\d{6})@tutor\.belgiumcampus\.ac\.za$/);
        if (!match) {
            alert('Tutor email must be 6 digits followed by @tutor.belgiumcampus.ac.za');
            return;
        }
        id = match[1]; // Extract 6 digits
    } else if (type === 'optAdmin') {
        domain = '@admin.belgiumcampus.ac.za';
        userType = 'admin';
        if (!email.endsWith(domain)) {
            alert('Admin email must end with @admin.belgiumcampus.ac.za');
            return;
        }
        id = email; // Use full email as ID for admins
    }

    try {
        // Prepare the data to send to the backend
        const formData = {
            email,
            password
        };

        // Make a POST request to send the login data
        let response = await apiRequest('/Auth/Login', 'POST', formData);
        
        // Store the extracted ID in localStorage
        localStorage.setItem('studentId', id);
        localStorage.setItem('userType', userType); // Store userType for potential use

        // Show welcome message with the extracted ID
        alert(`Welcome back, ${userType.charAt(0).toUpperCase() + userType.slice(1)} ${id}`);
        loginForm.reset();
        window.location.href = "../HTML/Home.html";
    } catch (err) {
        alert(err.message || 'API connection failed - check console for details');
        console.error('Login error:', err);
    }
});