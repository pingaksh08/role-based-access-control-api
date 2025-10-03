# JWT + RBAC Authentication API

A secure **authentication microservice** built with Node.js, Express, and MongoDB, implementing JWT-based authentication and Role-Based Access Control (RBAC). Designed for learning, resumes, and quick deployment.

---

## 🚀 Features
- User registration & login
- **JWT access tokens** (short-lived)
- **Refresh tokens** (hashed + rotation + stored in DB)
- **Role-based access control** (admin/user)
- Secure cookies for refresh tokens
- Environment-based configuration
- Ready-to-use Postman collection
---

## 📂 Project Structure
```
├─ server.js
├─ config/
│  └─ db.js
├─ models/
│  ├─ User.js
│  └─ RefreshToken.js
├─ routes/
│  └─ auth.js
├─ controllers/
│  └─ authController.js
├─ middlewares/
│  └─ auth.js
├─ utils/
│  └─ tokens.js
├─ .env
└─ README.md
```

---

## ⚡ Setup & Run Locally

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd jwt-rbac-api
npm install
```

### 2. Configure `.env`
Create `.env` in the project root:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jwt_auth
JWT_SECRET=your_generated_secret_here
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
COOKIE_SECURE=false
NODE_ENV=development
```

### 3. Run the App
Dev mode (hot reload):
```bash
npm run dev
```
Prod mode:
```bash
npm start
```

Server runs on **http://localhost:5000**

---

## 🔑 API Endpoints

### Auth Routes
- `POST /api/auth/register` → Register user
- `POST /api/auth/login` → Login, returns `accessToken` + sets `refreshToken` cookie
- `POST /api/auth/refresh` → Refreshes access token
- `POST /api/auth/logout` → Logout, clears cookie + revokes refresh token

### Protected Routes
- `GET /api/auth/profile` → Requires valid `accessToken`
- `GET /api/auth/admin-only` → Requires valid `accessToken` + `role=admin`

---

## 🧪 Testing with Postman
- Import `auth.postman_collection.json`
- Register a new user
- Login to get access token + refresh cookie
- Call `profile` or `admin-only` routes
- Refresh and logout as needed

---

📌 **Author:** Pingaksh Pareek  
📌 **Purpose:** Learning + Resume Showcase
