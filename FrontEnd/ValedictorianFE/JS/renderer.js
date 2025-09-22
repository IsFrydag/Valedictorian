//rendering includes DOM, done after html&css parsing
//below handles user registration...
// takes email&password enetered in reigstration form & sends them to a server to cretae a new user account
const axios = require('axios');

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  try {
    const response = await axios.post('https://localhost:5001/api/auth/register', {
      email,
      password
    });
    message.textContent = response.data.message; // e.g., "User registered!"
    message.style.color = 'green';
  } catch (error) {
    message.textContent = 'Registration failed: ' + (error.response?.data || 'Server error');
    message.style.color = 'red';
  }
});