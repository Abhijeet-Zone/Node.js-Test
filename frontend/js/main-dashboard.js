// ==========================================
// Main Dashboard JavaScript
// Industrial Level - Production Ready
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

async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/login.html';
      return null;
    }
    
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}

// ============ Charts Initialization ============

function initSalesChart(monthlyData = null) {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  // Use real data if available, otherwise use placeholder
  const labels = monthlyData ? monthlyData.map(m => m.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const salesData = monthlyData ? monthlyData.map(m => m.sales) : [1600, 2100, 1500, 2700, 2000, 3100, 2600];
  const purchasesData = monthlyData ? monthlyData.map(m => m.purchases) : [1800, 1600, 2100, 2300, 1700, 3300, 2100];

  if (salesChart) {
    salesChart.destroy();
  }

  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Sales',
          data: salesData,
          backgroundColor: '#8b7cff',
          borderRadius: 8,
          barThickness: 30,
        },
        {
          label: 'Purchases',
          data: purchasesData,
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
            display: false,
            dash: [5, 5]
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

function initPieChart(productDistribution = null) {
  const ctx = document.getElementById('pieChart');
  if (!ctx) return;

  // Use real data if available, otherwise use placeholder
  const labels = productDistribution && productDistribution.length > 0
    ? productDistribution.map(p => p.name)
    : ['No products', '', '', ''];
    
  const data = productDistribution && productDistribution.length > 0
    ? productDistribution.map(p => parseFloat(p.percentage))
    : [100, 0, 0, 0];

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
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
              return context.label + ': ' + context.parsed.toFixed(1) + '%';
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
    const dashboardData = await fetchDashboardStats();
    
    if (dashboardData) {
      // Update statistics cards
      updateStats(dashboardData.stats);
      
      // Update charts with real data
      initSalesChart(dashboardData.monthlyData);
      initPieChart(dashboardData.productDistribution);
      
      // Load stock alerts
      loadStockAlerts(dashboardData.lowStockProducts);
      
      // Load top products
      loadTopProducts(dashboardData.topProducts);
    } else {
      // Fallback to basic data if API fails
      initSalesChart();
      initPieChart();
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Load placeholder charts
    initSalesChart();
    initPieChart();
  }
}

function updateStats(stats) {
  // Update all stat cards with real user data
  const revenueElem = document.getElementById('stat-revenue');
  const purchasesElem = document.getElementById('stat-purchases');
  const returnElem = document.getElementById('stat-return');
  const profitElem = document.getElementById('stat-profit');
  
  if (revenueElem) revenueElem.textContent = '$ ' + parseFloat(stats.revenue).toFixed(2);
  if (purchasesElem) purchasesElem.textContent = '$ ' + parseFloat(stats.purchases).toFixed(2);
  if (returnElem) returnElem.textContent = '$ ' + parseFloat(stats.salesReturn).toFixed(2);
  if (profitElem) profitElem.textContent = '$ ' + parseFloat(stats.inventoryValue).toFixed(2);
}

function loadStockAlerts(lowStockProducts) {
  const tbody = document.getElementById('stock-alert-tbody');
  if (!tbody) return;
  
  if (lowStockProducts && lowStockProducts.length > 0) {
    tbody.innerHTML = lowStockProducts.map(product => `
      <tr>
        <td>${generateProductCode()}</td>
        <td>${escapeHtml(product.name)}</td>
        <td>Warehouse 1</td>
        <td>${product.stock}</td>
        <td><span class="badge badge-danger">${product.stock}</span></td>
      </tr>
    `).join('');
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
          No low stock alerts
        </td>
      </tr>
    `;
  }
}

function loadTopProducts(topProducts) {
  const tbody = document.getElementById('top-products-tbody');
  if (!tbody) return;
  
  if (topProducts && topProducts.length > 0) {
    tbody.innerHTML = topProducts.map(product => `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>${product.quantity.toFixed(2)} pc</td>
        <td>$ ${product.value.toFixed(2)}</td>
      </tr>
    `).join('');
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 24px; color: var(--text-muted);">
          No products available
        </td>
      </tr>
    `;
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============ Initialize ============

document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    loadDashboardData();
  }
});
