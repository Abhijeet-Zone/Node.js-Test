// ==========================================
// Profile Page JavaScript
// ==========================================

const API_BASE = '/api';
let currentUser = null;

// ============ Authentication ============

function checkAuth() {
  const token = localStorage.getItem('inv_token');
  const user = localStorage.getItem('inv_user');

  if (!token || !user) {
    window.location.href = '/login.html';
    return false;
  }

  try {
    currentUser = JSON.parse(user);
    updateProfileDisplay(currentUser);
    return true;
  } catch (error) {
    localStorage.clear();
    window.location.href = '/login.html';
    return false;
  }
}

function updateProfileDisplay(user) {
  const userName = user.name || 'User';
  const userEmail = user.email || '';
  const initial = userName.charAt(0).toUpperCase();
  
  // Update all profile elements
  document.getElementById('sidebar-avatar').textContent = initial;
  document.getElementById('sidebar-username').textContent = userName.split(' ')[0];
  document.getElementById('profile-avatar-large').textContent = initial;
  document.getElementById('profile-name').textContent = userName;
  document.getElementById('profile-email').textContent = userEmail;
  document.getElementById('info-name').textContent = userName;
  document.getElementById('info-email').textContent = userEmail;
  
  // Set created date if available
  if (user.createdAt) {
    const date = new Date(user.createdAt);
    document.getElementById('info-created').textContent = date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
}

function handleLogout() {
  localStorage.clear();
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
}

// ============ Load Activity Data ============

function getAuthHeaders() {
  const token = localStorage.getItem('inv_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

async function loadActivityData() {
  try {
    // Fetch products
    const resProducts = await fetch(`${API_BASE}/products`, {
      headers: getAuthHeaders()
    });
    
    if (resProducts.ok) {
      const data = await resProducts.json();
      if (data.success && data.data) {
        const products = data.data;
        document.getElementById('activity-products').textContent = products.length;
        
        // Calculate total transactions
        let totalSales = 0;
        let totalPurchases = 0;
        
        for (const product of products) {
          try {
            const resHistory = await fetch(`${API_BASE}/products/${product._id}/history`, {
              headers: getAuthHeaders()
            });
            
            if (resHistory.ok) {
              const historyData = await resHistory.json();
              if (historyData.success && historyData.data) {
                totalSales += historyData.data.filter(t => t.type === 'purchase').length;
                totalPurchases += historyData.data.filter(t => t.type === 'restock').length;
              }
            }
          } catch (err) {
            console.error('Error fetching history:', err);
          }
        }
        
        document.getElementById('activity-sales').textContent = totalSales;
        document.getElementById('activity-purchases').textContent = totalPurchases;
      }
    }
  } catch (error) {
    console.error('Error loading activity data:', error);
  }
}

// ============ Toast Notifications ============

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '<svg class="toast-icon" style="color: #10b981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg class="toast-icon" style="color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg class="toast-icon" style="color: #3b82f6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <div class="toast-content">
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============ Initialize ============

document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    loadActivityData();
    document.getElementById('activity-last-login').textContent = 'Just now';
  }
});
