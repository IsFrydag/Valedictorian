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

let users = JSON.parse(localStorage.getItem('users')) || [];

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Registration
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('my-dropdown').value;
  let domain, userType;

  if (type === 'optStudent') { domain = '@student.belgiumcampus.ac.za'; userType = 'student'; }
  else if (type === 'optTutor') { domain = '@tutor.belgiumcampus.ac.za'; userType = 'tutor'; }
  else if (type === 'optAdmin') { domain = '@admin.belgiumcampus.ac.za'; userType = 'admin'; }

  const name = document.getElementById('reg-name').value.trim();
  const surname = document.getElementById('reg-surname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!name || !surname || !email || !password) { alert('All fields are required'); return; }
  if (!email.endsWith(domain)) { alert('Email must end with the correct domain, example@<accountType>.belgiumcampus.ac.za'); return; }
  if (users.some(u => u.email === email)) { alert('Email already registered'); return; }

  const hashedPassword = await hashPassword(password);
  users.push({ name, surname, email, type: userType, hashedPassword });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful');
  registerForm.reset();
  window.location.href = "../HTML/login_reg.html";

});

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    // Make a test API call to verify connection (no data needed)
    const response = await apiRequest('/api/test', 'POST', {});
    
    // Expecting response like { message: "API connection successful" }
    alert(response.message);
    loginForm.reset();
    window.location.href = "../HTML/Home.html";
  } catch (err) {
    alert(err.message || 'API connection failed - check console for details');
  }
});