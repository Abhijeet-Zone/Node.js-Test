// ==========================================
// Products Page JavaScript
// Industrial Level - Buy/Sell Management
// ==========================================

const API_BASE = '/api/products';
let currentUser = null;
let allProducts = [];

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
      return;
    }
    
    const data = await res.json();
    if (data.success) {
      allProducts = data.data;
      renderProducts(allProducts);
      updateStats(allProducts);
    }
  } catch (error) {
    showToast('Failed to load products', 'error');
  }
}

async function createProduct(productData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return res.json();
}

async function sellProduct(productId, quantity) {
  const res = await fetch(`${API_BASE}/purchase`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

async function buyStock(productId, quantity) {
  const res = await fetch(`${API_BASE}/restock`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

async function fetchHistory(productId) {
  const res = await fetch(`${API_BASE}/${productId}/history`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

// ============ Rendering ============

function renderProducts(products) {
  const tbody = document.getElementById('products-tbody');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const tableWrapper = document.getElementById('table-wrapper');

  loadingState.style.display = 'none';

  if (products.length === 0) {
    emptyState.style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  tableWrapper.style.display = 'block';

  tbody.innerHTML = products.map(product => `
    <tr>
      <td style="font-weight: 600;">${escapeHtml(product.name)}</td>
      <td style="color: var(--brand-primary); font-weight: 600;">$ ${formatNumber(product.price)}</td>
      <td>${product.availableStock}</td>
      <td>${getStockBadge(product.availableStock)}</td>
      <td style="color: var(--text-muted); font-size: 0.875rem;">${formatDate(product.createdAt)}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="icon-btn" style="width: 36px; height: 36px;" onclick="openSellModal('${product._id}', '${escapeAttr(product.name)}', ${product.availableStock})" title="Sell Product">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 16px; height: 16px; color: var(--danger);">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <button class="icon-btn" style="width: 36px; height: 36px;" onclick="openBuyModal('${product._id}', '${escapeAttr(product.name)}', ${product.availableStock})" title="Buy Stock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 16px; height: 16px; color: var(--success);">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button class="icon-btn" style="width: 36px; height: 36px;" onclick="openHistoryModal('${product._id}', '${escapeAttr(product.name)}')" title="View History">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 16px; height: 16px; color: var(--info);">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStats(products) {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.availableStock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.availableStock), 0);

  document.getElementById('stat-total-products').textContent = totalProducts;
  document.getElementById('stat-total-stock').textContent = formatNumber(totalStock);
  document.getElementById('stat-total-value').textContent = '$ ' + formatNumber(totalValue);
}

function getStockBadge(stock) {
  if (stock === 0) {
    return `<span class="badge badge-danger">Out of Stock</span>`;
  } else if (stock <= 10) {
    return `<span class="badge badge-warning">Low Stock</span>`;
  } else {
    return `<span class="badge badge-success">In Stock</span>`;
  }
}

// ============ Modal Functions ============

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openAddProductModal() {
  document.getElementById('form-add-product').reset();
  openModal('modal-add-product');
}

function openSellModal(productId, productName, stock) {
  document.getElementById('sell-product-id').value = productId;
  document.getElementById('sell-product-name').value = productName;
  document.getElementById('sell-available-stock').value = stock + ' units';
  document.getElementById('sell-quantity').value = '';
  document.getElementById('sell-quantity').max = stock;
  openModal('modal-sell');
}

function openBuyModal(productId, productName, stock) {
  document.getElementById('buy-product-id').value = productId;
  document.getElementById('buy-product-name').value = productName;
  document.getElementById('buy-current-stock').value = stock + ' units';
  document.getElementById('buy-quantity').value = '';
  openModal('modal-buy');
}

async function openHistoryModal(productId, productName) {
  openModal('modal-history');
  document.getElementById('history-title').textContent = `Transaction History - ${productName}`;
  document.getElementById('history-loading').style.display = 'block';
  document.getElementById('history-empty').style.display = 'none';
  document.getElementById('history-table-wrapper').style.display = 'none';

  try {
    const data = await fetchHistory(productId);
    document.getElementById('history-loading').style.display = 'none';

    if (data.success && data.data.length > 0) {
      const tbody = document.getElementById('history-tbody');
      tbody.innerHTML = data.data.map(tx => `
        <tr>
          <td>
            <span class="badge ${tx.type === 'purchase' ? 'badge-danger' : 'badge-success'}">
              ${tx.type === 'purchase' ? 'Sold' : 'Bought'}
            </span>
          </td>
          <td>${tx.quantity} units</td>
          <td style="color: var(--text-muted);">${formatDateTime(tx.createdAt)}</td>
        </tr>
      `).join('');
      document.getElementById('history-table-wrapper').style.display = 'block';
    } else {
      document.getElementById('history-empty').style.display = 'block';
    }
  } catch (error) {
    document.getElementById('history-loading').style.display = 'none';
    document.getElementById('history-empty').style.display = 'block';
    showToast('Failed to load history', 'error');
  }
}

// ============ Form Handlers ============

async function handleAddProduct(event) {
  event.preventDefault();
  
  const btn = document.getElementById('btn-submit-product');
  btn.disabled = true;
  btn.textContent = 'Creating...';

  try {
    const productData = {
      name: document.getElementById('input-product-name').value.trim(),
      price: parseFloat(document.getElementById('input-product-price').value),
      availableStock: parseInt(document.getElementById('input-product-stock').value)
    };

    const data = await createProduct(productData);

    if (data.success) {
      showToast('Product created successfully', 'success');
      closeModal('modal-add-product');
      fetchProducts();
    } else {
      showToast(data.message || 'Failed to create product', 'error');
    }
  } catch (error) {
    showToast('Error creating product', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Product';
  }
}

async function handleSell(event) {
  event.preventDefault();
  
  const productId = document.getElementById('sell-product-id').value;
  const quantity = parseInt(document.getElementById('sell-quantity').value);
  const availableStock = parseInt(document.getElementById('sell-available-stock').value);

  if (quantity > availableStock) {
    showToast('Quantity exceeds available stock', 'error');
    return;
  }

  try {
    const data = await sellProduct(productId, quantity);

    if (data.success) {
      showToast('Product sold successfully', 'success');
      closeModal('modal-sell');
      fetchProducts();
    } else {
      showToast(data.message || 'Failed to sell product', 'error');
    }
  } catch (error) {
    showToast('Error selling product', 'error');
  }
}

async function handleBuy(event) {
  event.preventDefault();
  
  const productId = document.getElementById('buy-product-id').value;
  const quantity = parseInt(document.getElementById('buy-quantity').value);

  try {
    const data = await buyStock(productId, quantity);

    if (data.success) {
      showToast('Stock purchased successfully', 'success');
      closeModal('modal-buy');
      fetchProducts();
    } else {
      showToast(data.message || 'Failed to buy stock', 'error');
    }
  } catch (error) {
    showToast('Error buying stock', 'error');
  }
}

// ============ Search/Filter ============

function filterProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  
  if (searchTerm === '') {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
  }
}

// ============ Utilities ============

function formatNumber(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

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

function escapeAttr(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
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
    warning: '<svg class="toast-icon" style="color: #f59e0b;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
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
    fetchProducts();
  }
});

// Close modals on background click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
