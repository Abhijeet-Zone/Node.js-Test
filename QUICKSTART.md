# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

The server will start at **http://localhost:5000**

### Step 3: Open Your Browser
Navigate to: **http://localhost:5000/login.html**

### Step 4: Create an Account
1. Click **"Create one"**
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
   - Confirm Password: password123
3. Click **"Create Account"**

### Step 5: Explore the Application

You'll be automatically redirected to the dashboard. Now you can:

#### View Dashboard
- See statistics, charts, and stock alerts
- Navigate using the sidebar on the left

#### Manage Products
1. Click **"Products"** in the sidebar
2. Click **"Add Product"** button
3. Create a test product:
   - Name: Laptop
   - Price: 999
   - Initial Stock: 50
4. Click **"Create Product"**

#### Buy Stock (Restock)
1. Find your product in the table
2. Click the **green + icon**
3. Enter quantity to buy: 100
4. Click **"Buy Stock"**
5. Stock will increase to 150

#### Sell Product
1. Find your product
2. Click the **red cart icon**
3. Enter quantity to sell: 20
4. Click **"Sell Product"**
5. Stock will decrease to 130

#### View Transactions
1. Click **"Transfer"** in the sidebar
2. See all your buy/sell transactions
3. Filter by type (All/Purchases/Sales)
4. Search by product name

## 📋 Test Data

Here are some sample products you can add:

| Product          | Price    | Stock |
|------------------|----------|-------|
| Laptop           | 999.00   | 50    |
| Wireless Mouse   | 29.99    | 200   |
| USB Cable        | 9.99     | 500   |
| Monitor          | 299.00   | 30    |
| Keyboard         | 79.99    | 100   |
| Headphones       | 149.99   | 75    |

## 🔍 Navigation Guide

### Sidebar Menu
- **Dashboard** — Overview with charts and statistics
- **Products** — Manage inventory, buy/sell
- **Transfer** — View all transactions
- **Adjustment** — (Coming soon)
- **Expenses** — (Coming soon)
- **Quotations** — (Coming soon)
- **Purchases** — (Coming soon)
- **Sales** — (Coming soon)

### Top Bar Actions
- **POS** button — Point of Sale (coming soon)
- **Download** icon — Export data (coming soon)
- **Search** icon — Global search (coming soon)
- **Notifications** — Alerts (3 unread)
- **Settings** — Application settings
- **Logout** — Sign out of account

## 💡 Usage Tips

### Products Page
- Use **search bar** to find products quickly
- **Green + icon** = Buy more stock
- **Red cart icon** = Sell product
- **Blue clock icon** = View transaction history

### Transactions Page
- **Filter dropdown** — Show only buys or sells
- **Search** — Find specific product transactions
- **Refresh button** — Reload all transactions

### Dashboard
- Hover over **chart bars** to see exact values
- **Pie chart legend** is interactive
- **Stock alerts** show products needing restock

## 🔒 Security Notes

- Your password is **hashed** before storage (bcryptjs)
- Login creates a **JWT token** valid for 7 days
- All API calls require authentication
- Logout clears your token from localStorage

## 🐛 Troubleshooting

### Cannot connect to server
```bash
# Check if MongoDB is running
mongod --version

# Restart the server
npm run dev
```

### Login not working
1. Check browser console (F12) for errors
2. Verify .env file has JWT_SECRET set
3. Clear localStorage: `localStorage.clear()` in console
4. Try registering a new account

### Products not showing
1. Check browser console for errors
2. Verify you're logged in (check localStorage for 'inv_token')
3. Refresh the page (Ctrl+F5)

### Charts not displaying
1. Check internet connection (Chart.js loads from CDN)
2. Wait a few seconds for charts to render
3. Check console for JavaScript errors

## 📞 Need Help?

- Check the main **README.md** for detailed documentation
- See **FEATURES.md** for complete feature list
- Open browser console (F12) to see error messages
- Verify MongoDB is running and accessible

## 🎉 You're All Set!

You now have a fully functional inventory management system with:
- ✅ User authentication
- ✅ Product management
- ✅ Buy/sell operations
- ✅ Transaction tracking
- ✅ Dashboard with charts
- ✅ Professional light theme UI

Happy managing! 🚀
