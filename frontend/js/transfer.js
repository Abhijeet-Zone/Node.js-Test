// ==========================================
// Transactions Page JavaScript
// View All Buy/Sell Transactions
// ==========================================

const API_BASE = '/api/products';
let currentUser = null;
let allTransactions = [];
let products = [];

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
    updateUserDisplay(currentUser);
    return true;
  } catch (error) {
    localStorage.clear();
    window.location.href = '/login.html';
    return false;
  }
}

function updateUserDisplay(user) {
  const userName = user.name || 'User';
  const initial = userName.charAt(0).toUpperCase();
  
  const avatarElem = document.getElementById('sidebar-avatar');
  const usernameElem = document.getElementById('sidebar-username');
  
  if (avatarElem) avatarElem.textContent = initial;
  if (usernameElem) usernameElem.textContent = userName.split(' ')[0];
}

function toggleUserMenu() {
  showToast('User menu clicked', 'info');
}

function handleLogout() {
  localStorage.clear();
  showToast('Logging out...', 'success');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
}

// ============ API Functions ============

function getAuthHeaders() {
  const token = localStorage.getItem('inv_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

async function fetchProducts() {
  try {
    const res = await fetch(API_BASE, {
      headers: getAuthHeaders()
    });
    
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/login.html';
      return [];
    }
    
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function fetchHistory(productId) {
  try {
    const res = await fetch(`${API_BASE}/${productId}/history`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}

// ============ Load Transactions ============

async function loadTransactions() {
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const tableWrapper = document.getElementById('table-wrapper');

  loadingState.style.display = 'block';
  emptyState.style.display = 'none';
  tableWrapper.style.display = 'none';

  try {
    // Fetch all products
    products = await fetchProducts();
    
    // Fetch transactions for each product
    const transactionPromises = products.map(async (product) => {
      const transactions = await fetchHistory(product._id);
      return transactions.map(tx => ({
        ...tx,
        productName: product.name,
        productId: product._id
      }));
    });

    const transactionArrays = await Promise.all(transactionPromises);
    allTransactions = transactionArrays.flat();
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    loadingState.style.display = 'none';
    
    if (allTransactions.length === 0) {
      emptyState.style.display = 'block';
    } else {
      renderTransactions(allTransactions);
      updateStats(allTransactions);
    }
  } catch (error) {
    loadingState.style.display = 'none';
    emptyState.style.display = 'block';
    showToast('Failed to load transactions', 'error');
  }
}

// ============ Rendering ============

function renderTransactions(transactions) {
  const tbody = document.getElementById('transactions-tbody');
  const tableWrapper = document.getElementById('table-wrapper');

  if (transactions.length === 0) {
    document.getElementById('empty-state').style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }

  document.getElementById('empty-state').style.display = 'none';
  tableWrapper.style.display = 'block';

  tbody.innerHTML = transactions.map(tx => `
    <tr>
      <td>
        <span class="badge ${tx.type === 'purchase' ? 'badge-danger' : 'badge-success'}">
          ${tx.type === 'purchase' ? 'Sold' : 'Bought'}
        </span>
      </td>
      <td style="font-weight: 600;">${escapeHtml(tx.productName)}</td>
      <td>${tx.quantity} units</td>
      <td style="color: var(--text-muted); font-size: 0.875rem;">${formatDateTime(tx.createdAt)}</td>
    </tr>
  `).join('');
}

function updateStats(transactions) {
  const totalTransactions = transactions.length;
  const totalBought = transactions
    .filter(tx => tx.type === 'restock')
    .reduce((sum, tx) => sum + tx.quantity, 0);
  const totalSold = transactions
    .filter(tx => tx.type === 'purchase')
    .reduce((sum, tx) => sum + tx.quantity, 0);

  document.getElementById('stat-total-transactions').textContent = totalTransactions;
  document.getElementById('stat-total-bought').textContent = totalBought + ' units';
  document.getElementById('stat-total-sold').textContent = totalSold + ' units';
}

// ============ Filters ============

function applyFilters() {
  const filterType = document.getElementById('filter-type').value;
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  let filtered = allTransactions;

  // Filter by type
  if (filterType !== 'all') {
    filtered = filtered.filter(tx => tx.type === filterType);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(tx => 
      tx.productName.toLowerCase().includes(searchTerm)
    );
  }

  renderTransactions(filtered);
}

// ============ Utilities ============

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

// ============ Initialize ============

document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    loadTransactions();
  }
});
