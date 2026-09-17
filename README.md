# 📦 Industrial Inventory Management System

A full-stack, production-ready inventory management system with user authentication, real-time dashboard, and complete data isolation between users.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Express](https://img.shields.io/badge/Express-v4.18+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **Product Management** - Create, view, and manage products with pricing and stock levels
- ✅ **Buy/Sell Operations** - Separate interfaces for purchasing stock and selling products
- ✅ **Transaction History** - Complete audit trail of all buy/sell operations
- ✅ **Real-time Dashboard** - Dynamic statistics and charts based on actual user data
- ✅ **User Data Isolation** - Each user has completely independent inventory
- ✅ **Stock Alerts** - Automatic alerts for low-stock products (≤10 items)
- ✅ **Responsive Design** - Professional light theme UI that works on all devices

### Dashboard Features
- 📊 **Real-time Statistics** - Revenue, purchases, profit, and inventory value
- 📈 **Sales & Purchase Charts** - 7-month historical bar chart
- 🥧 **Product Distribution** - Pie chart showing top products by value
- ⚠️ **Stock Alerts** - Low-stock product notifications
- 🏆 **Top Products** - Top 5 products by inventory value

### Technical Features
- 🔐 **Secure Authentication** - JWT tokens with HTTP-only cookies support
- 🗄️ **MongoDB Integration** - NoSQL database with Mongoose ODM
- 🔄 **RESTful API** - Clean, documented API endpoints
- 🎨 **Modern UI/UX** - Professional light theme with smooth animations
- 📱 **Mobile Responsive** - Works seamlessly on all screen sizes
- 🚀 **Production Ready** - Error handling, validation, and security best practices

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB installation)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Abhijeet-Zone/Node.js-Test.git
cd Node.js-Test
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

4. **Run database migration** (if you have existing data)
```bash
node backend/scripts/migrate-add-userid.js
```

5. **Start the server**
```bash
npm start
```

6. **Open your browser**
```
http://localhost:5000
```

The app will redirect you to the login page. Create an account to get started!

## 📁 Project Structure

```
Node.js-Test/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product CRUD operations
│   │   └── dashboardController.js # Dashboard statistics
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── Transaction.js        # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   └── dashboardRoutes.js    # Dashboard endpoints
│   ├── scripts/
│   │   └── migrate-add-userid.js # Database migration script
│   └── server.js                 # Express app setup
├── frontend/
│   ├── css/
│   │   ├── main.css              # Main stylesheet
│   │   ├── style.css             # Additional styles
│   │   └── dashboard.css         # Dashboard specific styles
│   ├── js/
│   │   ├── auth.js               # Login/register logic
│   │   ├── main-dashboard.js     # Dashboard functionality
│   │   ├── app.js                # Products page logic
│   │   ├── transfer.js           # Transactions page logic
│   │   └── profile.js            # User profile logic
│   ├── login.html                # Login/register page
│   ├── main-dashboard.html       # Main dashboard
│   ├── index.html                # Products page
│   ├── transfer.html             # Transactions page
│   └── profile.html              # User profile page
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all user's products
- `POST /api/products` - Create new product
- `POST /api/products/purchase` - Sell product (reduce stock)
- `POST /api/products/restock` - Buy stock (increase stock)
- `GET /api/products/:productId/history` - Get transaction history

### Dashboard
- `GET /api/dashboard/stats` - Get user-specific dashboard statistics

## 🎨 Screenshots

### Login Page
Clean, professional authentication with split-screen design and animated background.

### Dashboard
Real-time statistics, interactive charts, and data tables showing actual user data.

### Products Page
Comprehensive product management with separate buy/sell modals.

### Transaction History
Complete audit trail of all inventory movements.

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ HTTP-only cookie support
- ✅ Input validation and sanitization
- ✅ MongoDB injection protection
- ✅ User data isolation at database level
- ✅ Protected API routes with middleware
- ✅ Error handling without exposing sensitive data

## 🧪 Testing

### Manual Testing Checklist
1. Register a new user account
2. Login with credentials
3. Create multiple products
4. Make buy (restock) transactions
5. Make sell (purchase) transactions
6. View transaction history
7. Check dashboard updates in real-time
8. Logout and login with different user
9. Verify complete data isolation

See `TESTING-CHECKLIST.md` for detailed testing instructions.

## 📚 Documentation

- **MIGRATION-GUIDE.md** - Database migration instructions
- **USER-ISOLATION-FIX.md** - User data isolation implementation
- **DASHBOARD-REAL-DATA-FIX.md** - Dashboard real-time data implementation
- **TESTING-CHECKLIST.md** - Complete testing procedures

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with custom properties
- **JavaScript (ES6+)** - Client-side logic
- **Chart.js** - Data visualization
- **Fetch API** - HTTP requests

## 🚀 Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-key-min-32-characters
JWT_EXPIRE=7d
NODE_ENV=production
```

### Deployment Platforms
- **Heroku** - Easy deployment with Git integration
- **Railway** - Modern cloud platform
- **Render** - Free tier available
- **DigitalOcean** - VPS deployment
- **AWS EC2** - Scalable cloud compute

## 📝 Development

### Running in Development Mode
```bash
# Install dependencies
npm install

# Start with nodemon (auto-restart on changes)
npm run dev

# Start normally
npm start
```

### Database Migration
If you have existing data without userId fields:
```bash
node backend/scripts/migrate-add-userid.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Abhijeet Acharya**
- GitHub: [@Abhijeet-Zone](https://github.com/Abhijeet-Zone)
- Repository: [Node.js-Test](https://github.com/Abhijeet-Zone/Node.js-Test)

## 🙏 Acknowledgments

- Chart.js for beautiful data visualizations
- MongoDB Atlas for database hosting
- Express.js community for excellent documentation

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation files in the repository
2. Open an issue on GitHub
3. Review the testing checklist for common solutions

---

**Built with ❤️ using Node.js, Express, and MongoDB**
