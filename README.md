# 💰 Personal Expense Management System (MERN)

A full-stack Personal Expense Management System built using the **MERN Stack (MongoDB, Express, React, Node.js)**.
This application allows users to securely manage their daily expenses with authentication and real-time updates.

---
Live Website - https://expense-1-hxad.onrender.com

## 🚀 Features

### 🔐 Authentication

* User Registration
* User Login (JWT-based authentication)
* Secure password hashing using bcrypt
* Persistent login (stored token)

### 💸 Expense Management

* Add new expenses
* View all expenses
* Filter expenses by category (optional)
* Real-time UI updates

### 🎨 Frontend

* Modern responsive UI
* Landing page with animations
* Dashboard with expense list
* Dynamic navbar (Login/Register ↔ Logout)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Tailwind CSS
* Framer Motion (animations)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

---

## 📁 Project Structure

```
expense-manager/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

---

## 🔧 Backend Setup

```
cd backend
npm install
```

### Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run backend:

```
npm start
```

---

## 🎨 Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth Routes

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user

### Expense Routes (Protected)

* `POST /api/expense` → Add expense
* `GET /api/expense` → Get all expenses

---

## 🔐 Authentication Flow

* User logs in → receives JWT token
* Token stored in localStorage
* Token sent in headers:

```
Authorization: Bearer <token>
```

---

## 🚀 Deployment

### Backend

* Hosted on Render

### Frontend

* Hosted on Render (Static Site)

### Database

* MongoDB Atlas

---



## 📌 Future Improvements

* Charts & analytics dashboard
* Budget tracking
* Dark mode
* Pagination
* Mobile app version

---

## 👨‍💻 Author

Santosh

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub and feel free to contribute!
