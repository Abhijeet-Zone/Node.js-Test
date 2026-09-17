// ==========================================
// Dashboard JavaScript - Light Theme
// Industrial Level Inventory Management
// ==========================================

const API_BASE = '/api';
let currentUser = null;
let salesChart = null;
let pieChart = null;

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
  
  // Update sidebar avatar
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const sidebarUsername = document.getElementById('sidebar-username');
  const topbarAvatar = document.getElementById('topbar-avatar');
  
  if (sidebarAvatar) sidebarAvatar.textContent = initial;
  if (sidebarUsername) sidebarUsername.textContent = userName.split(' ')[0];
  if (topbarAvatar) topbarAvatar.textContent = initial;
  
  // Update dropdown
  const infoName = document.getElementById('user-info-name');
  const infoEmail = document.getElementById('user-info-email');
  if (infoName) infoName.textContent = userName;
  if (infoEmail) infoEmail.textContent = user.email || '';
}

function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function handleLogout() {
  // Clear all localStorage data
  localStorage.clear();
  
  // Clear any session storage as well
  sessionStorage.clear();
  
  showToast('Logged out successfully', 'success');
  
  setTimeout(() => {
    // Force complete page reload to clear any cached data
    window.location.replace('/login.html');
  }, 500);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userMenu && dropdown && !userMenu.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

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
    const res = await fetch(`${API_BASE}/products`, {
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

// ============ Charts ============

function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Sales',
          data: [1600, 2100, 1500, 2700, 2000, 3100, 2600],
          backgroundColor: '#8b7cff',
          borderRadius: 8,
          barThickness: 30,
        },
        {
          label: 'Purchases',
          data: [1800, 1600, 2100, 2300, 1700, 3300, 2100],
          backgroundColor: '#6366f1',
          borderRadius: 8,
          barThickness: 30,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13
          },
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            font: {
              size: 12,
              weight: '500'
            },
            color: '#718096'
          }
        },
        y: {
          border: {
            display: false
          },
          grid: {
            color: '#f0f0f0',
            drawTicks: false
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#718096',
            padding: 10,
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

function initPieChart() {
  const ctx = document.getElementById('pieChart');
  if (!ctx) return;

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Macbook pro', 'sunglasses', 'earphones', 'unsalted gray'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: [
          '#6366f1',
          '#d97ce8',
          '#ffa726',
          '#8b7cff'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            font: {
              size: 12,
              weight: '500',
              family: "'Inter', sans-serif"
            },
            color: '#4a5568',
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13
          },
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

// ============ Load Dashboard Data ============

async function loadDashboardData() {
  try {
    const products = await fetchProducts();
    
    if (products && products.length > 0) {
      // Calculate real stats
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.availableStock), 0);
      
      // Update profit stat with real data
      const profitElem = document.querySelector('.stat-profit .stat-value');
      if (profitElem && totalValue > 0) {
        profitElem.textContent = '$ ' + totalValue.toFixed(2);
      }
      
      // Load stock alerts
      loadStockAlerts(products);
      
      // Load top products
      loadTopProducts(products);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function loadStockAlerts(products) {
  const tbody = document.getElementById('stock-alert-tbody');
  if (!tbody || products.length === 0) return;
  
  const lowStock = products.filter(p => p.availableStock <= 10).slice(0, 3);
  
  if (lowStock.length > 0) {
    tbody.innerHTML = lowStock.map(product => `
      <tr>
        <td>${generateProductCode()}</td>
        <td>${escapeHtml(product.name)}</td>
        <td>Warehouse 1</td>
        <td>${product.availableStock}</td>
        <td><span class="alert-badge">${product.availableStock}</span></td>
      </tr>
    `).join('');
  }
}

function loadTopProducts(products) {
  const tbody = document.getElementById('top-products-tbody');
  if (!tbody || products.length === 0) return;
  
  const topProducts = products
    .map(p => ({
      name: p.name,
      stock: p.availableStock,
      value: p.price * p.availableStock
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  if (topProducts.length > 0) {
    tbody.innerHTML = topProducts.map(product => `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>${product.stock.toFixed(2)} pc</td>
        <td>$ ${product.value.toFixed(2)}</td>
      </tr>
    `).join('');
  }
}

function generateProductCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// ============ Toast Notifications ============

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '<svg class="toast-icon" style="color: #10b981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg class="toast-icon" style="color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
  };
  
  toast.innerHTML = `
    ${icons[type] || icons.success}
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

// ============ Navigation ============

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const page = item.dataset.page;
    
    if (page === 'products') {
      window.location.href = '/index.html';
    }
  });
});

// ============ Initialize ============

document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    initSalesChart();
    initPieChart();
    loadDashboardData();
  }
});


// ============ Navigation Helper ============

function navigateToPage(event, page) {
  event.preventDefault();
  window.location.href = page;
  return false;
}
