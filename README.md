# 📦 Inventory Manager — Node.js Intern Assignment

A full-stack **Inventory Management System** built with **Node.js, Express, and MongoDB** on the backend and vanilla **HTML/CSS/JavaScript** on the frontend. Every user gets a secure account and a completely isolated inventory: products they add, stock they buy/sell, and the transaction history behind it are visible only to them.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## 🌟 Overview

This project is a REST API + web dashboard for tracking product inventory. A user registers, logs in, and can then:

- Add products with a name, price, and starting stock quantity.
- **Restock** (buy) products to increase available stock.
- **Purchase** (sell) products to decrease available stock, with a guard against overselling.
- View a full transaction history per product.
- View a live dashboard (revenue, purchases, profit, inventory value, monthly sales/purchase chart, low-stock alerts, top products by value).

All data is scoped to the logged-in user via `userId` on every `Product` and `Transaction` document, so two different accounts never see each other's inventory.

---

## ✅ Features

### Core functionality
- **User authentication** — registration & login secured with JWT tokens and bcrypt-hashed passwords.
- **Product management** — create products and list all products belonging to the logged-in user.
- **Buy / Sell operations** — dedicated `restock` (increase stock) and `purchase` (decrease stock) endpoints, each backed by its own validation (no negative stock, no overselling).
- **Transaction history** — every restock/purchase is recorded in a `Transaction` collection and can be retrieved per product.
- **Per-user data isolation** — every query is filtered by the authenticated user's ID at the database level (see `USER-ISOLATION-FIX.md`).
- **Live dashboard analytics** — revenue, purchase cost, profit, inventory value, total products/stock, a 7-month sales-vs-purchases chart, low-stock alerts (≤10 units), and top products ranked by inventory value.

### Frontend pages
| Page | File | Description |
|---|---|---|
| Login / Register | `login.html` | Split-screen auth screen with sign-in and account-creation forms |
| Dashboard | `dashboard.html`, `main-dashboard.html` | KPI cards, sales/purchases bar chart, top-products donut chart |
| Products | `index.html`, `products.html` | Product inventory table, "Add Product" modal, buy/sell/history actions |
| Profile | `profile.html` | Account details, activity summary, edit profile / change password / logout |
| Transfer | `transfer.html` | Full transaction history log across products |
| Purchases, Sales, Expenses, Quotations, Adjustment | `purchases.html`, `sales.html`, `expenses.html`, `quotations.html`, `adjustment.html` | Sidebar-linked sections scaffolded in the UI for future expansion (see [Roadmap](#-known-limitations--roadmap)) |

---

## 🖼 Screenshots

### 1. Sign In
Split-screen login with product highlights on the left and a credentials form on the right.

![Login screen](docs/screenshots/login.png)

### 2. Create Account
New users register with their name, email, and a password (min. 6 characters, confirmed twice).

![Create account screen](docs/screenshots/register.png)

### 3. Dashboard
Real-time KPIs (Revenue, Purchases, Sales Return, Profit) plus a monthly Sales vs. Purchases bar chart and a Top Selling Products donut chart.

![Dashboard](docs/screenshots/dashboard.png)

### 4. Products — Empty State
A fresh account starts with zero products and a friendly empty state prompting the first product to be added.

![Empty product inventory](docs/screenshots/products-empty.png)

### 5. Products — Populated
Once a product is created, the inventory table shows price, available stock, status (`In Stock` / `Low Stock`), creation date, and quick actions (sell, restock, history).

![Product inventory with a product](docs/screenshots/products-list.png)

### 6. My Profile
Account details (name, email, role, member-since date), an activity summary (products added, total sales, total purchases, last login), and account actions.

![Profile page](docs/screenshots/profile.png)

---

## 🛠 Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) — JavaScript runtime
- [Express 5](https://expressjs.com/) — web framework & routing
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — database & ODM
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — stateless authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — password hashing
- [dotenv](https://www.npmjs.com/package/dotenv) — environment configuration
- [cors](https://www.npmjs.com/package/cors) — cross-origin resource sharing
- [nodemon](https://www.npmjs.com/package/nodemon) — dev-time auto-restart

**Frontend**
- Static HTML5 / CSS3 (custom design system in `css/main.css`, `css/dashboard.css`, `css/style.css`)
- Vanilla JavaScript (ES6+), no framework — one script per page (`auth.js`, `main-dashboard.js`, `app.js`, `transfer.js`, `profile.js`)
- `fetch()` for all API communication, JWT stored in `localStorage`
- Charting rendered on `<canvas>` for the dashboard's bar/donut charts

---

## 📁 Project Structure

```
Node.js Intern Assignment/
├── backend/
│   ├── config/
│   │   └── db.js                    # Mongoose connection to MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js        # register / login / getMe
│   │   ├── productController.js     # create / list / purchase / restock / history
│   │   └── dashboardController.js   # aggregated dashboard statistics
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification ("protect" middleware)
│   │   └── errorHandler.js          # centralized error responses
│   ├── models/
│   │   ├── User.js                  # name, email, hashed password
│   │   ├── Product.js               # userId, name, price, availableStock
│   │   └── Transaction.js           # userId, productId, type, quantity, date
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── productRoutes.js         # /api/products/*
│   │   └── dashboardRoutes.js       # /api/dashboard/*
│   ├── scripts/
│   │   └── migrate-add-userid.js    # one-off migration for legacy data
│   └── server.js                    # Express app bootstrap & static file serving
├── frontend/
│   ├── css/                         # main.css, style.css, dashboard.css
│   ├── js/                          # auth.js, main-dashboard.js, app.js, products.js, transfer.js, profile.js, dashboard.js
│   ├── login.html                   # Sign in / Create account
│   ├── dashboard.html / main-dashboard.html
│   ├── index.html / products.html   # Product inventory
│   ├── profile.html
│   ├── transfer.html                # Transaction history
│   └── purchases.html, sales.html, expenses.html, quotations.html, adjustment.html
├── docs/
│   └── screenshots/                 # Images used in this README
├── .env                             # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md                        # This file
```

---

## 🗃 Data Models

### `User`
| Field | Type | Notes |
|---|---|---|
| `name` | String | required, max 50 chars |
| `email` | String | required, unique, lowercase, validated format |
| `password` | String | required, min 6 chars, hashed with bcrypt (10 salt rounds), never returned by default (`select: false`) |
| `createdAt` / `updatedAt` | Date | via `timestamps: true` |

### `Product`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → `User` | required, indexed — scopes the product to its owner |
| `name` | String | required |
| `price` | Number | required, must be > 0 |
| `availableStock` | Number | required, default `0`, cannot be negative |

A compound unique index on `{ userId, name }` prevents the same user from creating two products with the same name (case-insensitive check is also enforced in the controller).

### `Transaction`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → `User` | required, indexed |
| `productId` | ObjectId → `Product` | required |
| `transactionType` | String | `"purchase"` (sell) or `"restock"` (buy) |
| `quantity` | Number | required, must be ≥ 1 |
| `transactionDate` | Date | defaults to `Date.now` |

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

All **Products** and **Dashboard** routes require an `Authorization: Bearer <token>` header. Tokens are issued by `/auth/register` and `/auth/login`.

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create a new account. Body: `{ name, email, password }`. Returns the user + JWT. |
| `POST` | `/login` | Public | Authenticate. Body: `{ email, password }`. Returns the user + JWT. |
| `GET` | `/me` | Private | Returns the currently authenticated user's profile. |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Private | Create a product. Body: `{ name, price, availableStock }`. Rejects duplicate names per user. |
| `GET` | `/` | Private | List every product owned by the logged-in user, newest first. |
| `POST` | `/purchase` | Private | Sell stock. Body: `{ productId, quantity }`. Fails if `quantity` exceeds `availableStock`. Decrements stock and logs a `purchase` transaction. |
| `POST` | `/restock` | Private | Buy stock. Body: `{ productId, quantity }`. Increments stock and logs a `restock` transaction. |
| `GET` | `/:productId/history` | Private | Full transaction history for one product, newest first. |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/stats` | Private | Returns aggregated statistics for the logged-in user: `stats` (revenue, purchases cost, profit, inventory value, total products/stock), `lowStockProducts` (≤10 units, top 5), `topProducts` (by inventory value, top 5), `monthlyData` (last 7 months of sales vs. purchases), and `productDistribution` (top 4 products by value, as percentages for the donut chart). |

**Example — Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Abhijeet Acharya","email":"abhijeetachar@gmail.com","password":"secret123"}'
```

**Example — Create a product**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Headphone","price":2000,"availableStock":100}'
```

All responses follow a consistent shape:
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- A MongoDB connection string (MongoDB Atlas or local `mongod`)
- npm

### Installation

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd "Node.js Intern Assignment"

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below), then run a migration
#    only if you're bringing in data created before the userId field existed
node backend/scripts/migrate-add-userid.js

# 4. Start the server
npm start          # production
npm run dev        # development, auto-restarts with nodemon
```

Then open **http://localhost:5000** — the root route redirects to the dashboard, which itself redirects to `login.html` if no valid session is found.

---

## 🔐 Environment Variables

Create a `.env` file in the project root (already git-ignored):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
JWT_EXPIRE=7d
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (defaults to `5000`) | Port the Express server listens on |
| `MONGODB_URI` | Yes | Mongo connection string (Atlas SRV URI or local) |
| `JWT_SECRET` | Yes | Signing secret for JWTs — keep this private and long |
| `JWT_EXPIRE` | No (defaults to `7d`) | JWT expiry, e.g. `7d`, `12h` |

> ⚠️ Never commit real credentials. Rotate `MONGODB_URI` and `JWT_SECRET` if they were ever pushed to a public repository.

---

## 🔄 Application Flow

1. **Register / Sign in** (`login.html` → `POST /api/auth/register` or `/login`) — a JWT and the user object are stored in `localStorage` on success.
2. **Dashboard** (`main-dashboard.html` → `GET /api/dashboard/stats`) — renders KPI cards and charts from live data.
3. **Products** (`index.html`/`products.html` → `GET/POST /api/products`) — add a product, then use the row actions to sell (`/purchase`), buy (`/restock`), or view history (`/:productId/history`).
4. **Transfer / History** (`transfer.html`) — lists every transaction across all products for the account.
5. **Profile** (`profile.html` → `GET /api/auth/me`) — shows account info and a running activity summary; logout clears `localStorage` and redirects to the login page.

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 salt rounds) — plaintext is never stored or returned.
- Passwords are excluded from queries by default (`select: false` on the schema) and only pulled in explicitly during login.
- **JWT** issued on register/login, required as a `Bearer` token on every protected route via the `protect` middleware.
- **Per-user data isolation** — every product/transaction query is filtered by `req.user.id`, so no user can read or mutate another user's records even with a guessed ID.
- Server-side **validation** on every write endpoint (required fields, positive price, non-negative stock, sufficient stock before a sale, quantity ≥ 1).
- Centralized **error handler** normalizes Mongoose validation errors, duplicate-key errors, and invalid ObjectId errors into clean JSON responses instead of leaking stack traces.

---

## ⚠️ Error Handling

`backend/middleware/errorHandler.js` catches errors passed via `next(error)` and returns consistent JSON:

| Error type | HTTP Status | Example message |
|---|---|---|
| Mongoose `ValidationError` | 400 | Field-specific messages joined together |
| Duplicate key (`code 11000`) | 409 | `A product with this name already exists` |
| Invalid ObjectId (`CastError`) | 400 | `Invalid product ID format` |
| Missing/invalid JWT | 401 | `Not authorized — no token provided` / `invalid token` |
| Insufficient stock on sale | 400 | `Insufficient stock. Available: X, Requested: Y` |
| Uncaught/other | 500 | `Internal Server Error` |

---

## 🧭 Known Limitations / Roadmap

The sidebar exposes **Purchases, Sales, Expenses, Quotations, and Adjustment** pages that are scaffolded in the frontend (shared layout, navigation, styling) but not yet wired up to dedicated backend endpoints — the current API only implements Auth, Products (with buy/sell/history), and Dashboard stats. Planned next steps:

- Dedicated Purchase Orders and Sales Orders (as distinct entities from simple restock/purchase transactions)
- Expense tracking module
- Quotation generation and PDF export
- Stock adjustment/write-off workflow with reason codes
- Role-based access control (the profile page already displays a `Role` field for this)
- "Sales Return" is currently hard-coded to `0` in dashboard stats pending a returns feature

---

## 📚 Additional Docs in This Repo

- `QUICKSTART.md` — condensed setup guide
- `PROJECT-SUMMARY.md` — high-level project summary
- `FEATURES.md` — detailed feature breakdown
- `MIGRATION-GUIDE.md` — how to run the `userId` backfill migration
- `USER-ISOLATION-FIX.md` — write-up of the per-user data isolation implementation
- `DASHBOARD-REAL-DATA-FIX.md` — how dashboard stats were wired to real, live data
- `UPDATED.md` — changelog of notable updates

---

## 👤 Author

**Abhijeet Acharya**
Built as a Node.js Intern Assignment — a full-stack inventory management REST API and dashboard using Node.js, Express, MongoDB, and vanilla JavaScript.
