// ==========================================
//  Inventory Management System — Auth JS
//  Login, Register & Token Management
// ==========================================

const AUTH_API = '/api/auth';

// ============ Page Init ============

(function checkAuth() {
  const token = localStorage.getItem('inv_token');
  if (token) {
    // Already logged in, redirect to dashboard
    window.location.href = '/';
  }
})();

// ============ Form Toggling ============

function showRegister(e) {
  e.preventDefault();
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');

  loginSection.style.opacity = '0';
  loginSection.style.transform = 'translateX(-20px)';
  setTimeout(() => {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    // Trigger reflow
    registerSection.offsetHeight;
    registerSection.style.opacity = '1';
    registerSection.style.transform = 'translateX(0)';
    document.getElementById('register-name').focus();
  }, 250);
}

function showLogin(e) {
  e.preventDefault();
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');

  registerSection.style.opacity = '0';
  registerSection.style.transform = 'translateX(20px)';
  setTimeout(() => {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    // Trigger reflow
    loginSection.offsetHeight;
    loginSection.style.opacity = '1';
    loginSection.style.transform = 'translateX(0)';
    document.getElementById('login-email').focus();
  }, 250);
}

// ============ Password Toggle ============

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const eyeOpen = btn.querySelector('.eye-open');
  const eyeClosed = btn.querySelector('.eye-closed');

  if (input.type === 'password') {
    input.type = 'text';
    eyeOpen.style.display = 'none';
    eyeClosed.style.display = 'block';
  } else {
    input.type = 'password';
    eyeOpen.style.display = 'block';
    eyeClosed.style.display = 'none';
  }
}

// ============ Login Handler ============

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-login');
  const btnText = btn.querySelector('.btn-text');
  const btnSpinner = btn.querySelector('.btn-spinner');

  btn.disabled = true;
  btnText.textContent = 'Signing in...';
  btnSpinner.style.display = 'inline-flex';

  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('login-email').value.trim(),
        password: document.getElementById('login-password').value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // Clear any previous user data first
      localStorage.clear();
      
      // Store new token and user data
      localStorage.setItem('inv_token', data.token);
      localStorage.setItem('inv_user', JSON.stringify(data.data));
      
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 800);
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Connection failed. Is the server running?', 'error');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Sign In';
    btnSpinner.style.display = 'none';
  }
}

// ============ Register Handler ============

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-register');
  const btnText = btn.querySelector('.btn-text');
  const btnSpinner = btn.querySelector('.btn-spinner');

  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Client-side password match check
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  btn.disabled = true;
  btnText.textContent = 'Creating account...';
  btnSpinner.style.display = 'inline-flex';

  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('register-name').value.trim(),
        email: document.getElementById('register-email').value.trim(),
        password: password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // Clear any previous user data first
      localStorage.clear();
      
      // Store new token and user data
      localStorage.setItem('inv_token', data.token);
      localStorage.setItem('inv_user', JSON.stringify(data.data));
      
      showToast('Account created! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 800);
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Connection failed. Is the server running?', 'error');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Create Account';
    btnSpinner.style.display = 'none';
  }
}

// ============ Toast (reused from main app) ============

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon =
    type === 'success'
      ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
      : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

  toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
