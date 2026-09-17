# Inventory Management System

An **industrial-level** full-stack inventory management system with a modern **light theme** UI, comprehensive **buy/sell operations**, **transaction tracking**, and complete **authentication & authorization**. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🎯 Key Features

### 📊 Dashboard & Analytics
- **Professional Dashboard** — Light-themed UI matching modern inventory systems
- **Real-time Statistics** — Revenue, purchases, sales returns, and profit tracking
- **Interactive Charts** — Weekly sales/purchases bar chart and product distribution pie chart (Chart.js)
- **Stock Alerts** — Low stock warnings with warehouse-level tracking
- **Top Products** — Best-selling products with revenue metrics

### 🛍️ Product Management
- **Complete CRUD** — Create, view, search, and manage products
- **Buy Stock** — Purchase inventory with quantity tracking
- **Sell Products** — Process sales with real-time stock validation
- **Stock Status** — Visual badges for in-stock, low-stock, and out-of-stock items
- **Real-time Search** — Filter products instantly as you type

### 📝 Transaction System
- **Centralized Transactions Page** — View all buy/sell operations in one place
- **Transaction Filtering** — Filter by type (all, purchases, sales)
- **Search Transactions** — Find specific transactions by product name
- **Transaction History** — Complete audit trail per product with timestamps
- **Statistics Dashboard** — Total transactions, stock purchased, and stock sold

### 🔐 Authentication & Security
- **User Registration** — Secure account creation with validation
- **JWT Authentication** — Token-based authentication with 7-day expiration
- **Protected Routes** — All API endpoints require valid authentication
- **Password Hashing** — bcryptjs with salt rounds for secure storage
- **Session Management** — Automatic token validation and refresh

### 🎨 UI/UX Features
- **Light Theme** — Professional, clean, and modern interface
- **Sidebar Navigation** — Persistent navigation with 8 menu sections
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Toast Notifications** — Real-time success/error feedback
- **Modal Dialogs** — Clean forms for all operations
- **Loading States** — Smooth transitions and skeleton loaders
- **Empty States** — Helpful messages when no data exists

## 🛠️ Tech Stack

| Layer          | Technology                |
|----------------|---------------------------|
| Runtime        | Node.js v14+              |
| Framework      | Express.js 5.x            |
| Database       | MongoDB (Mongoose ODM)    |
| Authentication | JWT (jsonwebtoken)        |
| Password Hash  | bcryptjs                  |
| Frontend       | Vanilla HTML5/CSS3/JS     |
| Charts         | Chart.js 4.x              |
| Icons          | Custom SVG Icons          |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

### Installation Steps

```bash
# 1. Navigate to project directory
cd "Node.js Intern Assignment"

# 2. Install all dependencies
npm install

# 3. Configure environment variables
# Edit .env file with your settings:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/inventory_management
# JWT_SECRET=your-super-secret-jwt-key-change-this
# JWT_EXPIRE=7d

# 4. Start MongoDB (if using local installation)
mongod --dbpath /path/to/your/data

# 5. Start the development server with auto-reload
npm run dev
```

The application will be available at **[http://localhost:5000](http://localhost:5000)**

### First Time Setup

1. Navigate to **[http://localhost:5000/login.html](http://localhost:5000/login.html)**
2. Click **"Create one"** to register a new account
3. Fill in your information (name, email, password)
4. Click **"Create Account"**
5. You'll be automatically logged in and redirected to the dashboard

## 📱 Application Pages

### Main Pages

1. **Login/Registration** (`/login.html`) — User authentication and account creation
2. **Dashboard** (`/main-dashboard.html`) — Statistics, charts, and analytics
3. **Products** (`/products.html`) — Product inventory management with buy/sell
4. **Transactions** (`/transfer.html`) — All buy/sell transaction history
5. **Additional Pages** — Adjustment, Expenses, Quotations, Purchases, Sales (coming soon)

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint              | Description           | Auth Required |
|--------|-----------------------|-----------------------|---------------|
| POST   | `/api/auth/register`  | Create new account    | No            |
| POST   | `/api/auth/login`     | Login user            | No            |
| GET    | `/api/auth/me`        | Get current user      | Yes           |

### Product Routes (All require authentication)

| Method | Endpoint                          | Description                |
|--------|-----------------------------------|----------------------------|
| POST   | `/api/products`                   | Create new product         |
| GET    | `/api/products`                   | Get all products           |
| POST   | `/api/products/purchase`          | Sell product (reduce stock)|
| POST   | `/api/products/restock`           | Buy stock (increase stock) |
| GET    | `/api/products/:productId/history`| Get transaction history    |

## 📁 Project Structure

```
├── .env                              # Environment configuration
├── .gitignore
├── package.json
├── README.md
├── backend/                          # Backend (Node.js + Express)
│   ├── server.js                     # Entry point & middleware
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── models/
│   │   ├── User.js                   # User model with password hashing
│   │   ├── Product.js                # Product model
│   │   └── Transaction.js            # Transaction model
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
│   │   └── productController.js      # Product business logic
│   ├── routes/
│   │   ├── authRoutes.js             # Auth API routes
│   │   └── productRoutes.js          # Product API routes (protected)
│   └── middleware/
│       ├── auth.js                   # JWT verification middleware
│       └── errorHandler.js           # Global error handler
└── frontend/                         # Frontend (HTML/CSS/JS)
    ├── login.html                    # Authentication page
    ├── main-dashboard.html           # Analytics dashboard
    ├── products.html                 # Product management
    ├── transfer.html                 # Transactions page
    ├── css/
    │   ├── main.css                  # Main styles (light theme)
    │   ├── style.css                 # Legacy styles
    │   └── dashboard.css             # Dashboard-specific styles
    └── js/
        ├── auth.js                   # Login/register logic
        ├── main-dashboard.js         # Dashboard with charts
        ├── products.js               # Product management logic
        └── transfer.js               # Transactions logic
```

## 🔐 Security Features

- **Password Hashing** — bcryptjs with salt rounds
- **JWT Tokens** — Secure token generation with expiration
- **Protected Routes** — Middleware-based authentication on all API endpoints
- **Input Validation** — Server-side validation for all inputs
- **XSS Prevention** — HTML escaping in frontend rendering
- **CORS Enabled** — Cross-origin resource sharing configured

## 📋 Business Rules

### Authentication
- Email must be unique and valid format
- Password must be at least 6 characters
- JWT tokens expire after 7 days (configurable)
- Tokens stored in localStorage on client side

### Product Management
- Product name must be unique (case-insensitive)
- Product price must be greater than zero
- Product stock cannot be negative
- Buy/sell quantities must be greater than zero
- Sell is rejected if quantity exceeds available stock
- All buys and sells generate transaction records

### Transactions
- Type can be "purchase" (sell) or "restock" (buy)
- Each transaction links to a product
- Timestamps recorded automatically
- Transaction history preserved indefinitely

## 🎨 UI Design

The application features a **clean light theme** with:
- **Sidebar Navigation** — Fixed left sidebar with icon-based menu
- **Top Bar** — Page title, search, notifications, and user menu
- **Statistics Cards** — Color-coded metrics with icons
- **Charts** — Bar chart for sales trends, pie chart for product distribution
- **Data Tables** — Sortable tables with hover effects
- **Badges** — Color-coded status indicators
- **Modals** — Centered dialogs for forms
- **Toast Notifications** — Slide-in notifications for feedback

## 📝 License

ISC

## 👨‍💻 Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## 🆘 Troubleshooting

**Cannot connect to MongoDB:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB port (default: 27017)

**401 Unauthorized errors:**
- Clear browser localStorage and login again
- Check JWT_SECRET in .env
- Verify token hasn't expired

**Products not loading:**
- Open browser console (F12) for errors
- Verify you're logged in (check localStorage for 'inv_token')
- Ensure backend server is running

**Charts not displaying:**
- Check that Chart.js CDN is loading
- Verify data is being fetched successfully
- Check browser console for JavaScript errors

## 🚀 Deployment Tips

1. Change `JWT_SECRET` to a strong random string in production
2. Use environment variables for MongoDB URI (don't commit credentials)
3. Enable HTTPS in production
4. Set secure cookie flags for tokens
5. Implement rate limiting on API endpoints
6. Add MongoDB indexes for better query performance
7. Use a process manager like PM2 for Node.js
8. Consider using Redis for session storage at scale

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ for efficient inventory management**
#   N o d e . j s - T e s t  
 