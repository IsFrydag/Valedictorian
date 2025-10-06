import { apiRequest } from '../JS/api.js';

const container = document.getElementById('container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const regForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const studentEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.belgiumcampus\.ac\.za$/;

if (regForm) {
    regForm.addEventListener("submit", async e => {
        e.preventDefault();

        const accountType = document.getElementById("my-dropdown").value;
        const name = document.getElementById("reg-name").value.trim();
        const surname = document.getElementById("reg-surname").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        if (!studentEmailRegex.test(email)) {
            alert("Please use a valid student email address");
            return;
        }

        try {
            const result = await apiRequest("/register", "POST", {
                accountType,
                name,
                surname,
                email,
                password
            });
            alert("Registration successful!");
            container.classList.remove("active");
        } catch (err) {
            alert(err.message);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!studentEmailRegex.test(email)) {
            alert("Please use a valid student email address");
            return;
        }

        try {
            const result = await apiRequest("/login", "POST", {
                email,
                password
            });

            localStorage.setItem("authToken", result.token);
            alert("Login successful!");
            window.location.href = "Home.html";
        } catch (err) {
            alert(err.message);
        }
    });
}