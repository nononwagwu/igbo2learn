const BACKEND_URL = 'http://localhost:3000';

// Register form submit
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;

  const res = await fetch(`${BACKEND_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  document.getElementById('register-message').textContent = data.message || data.error || 'Unknown error';
});

// Login form submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem('token', data.token);  // Save token for future authenticated requests
    document.getElementById('login-message').textContent = 'Login successful!';
  } else {
    document.getElementById('login-message').textContent = data.error || 'Login failed';
  }
});
