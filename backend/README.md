# 🔮 MemePredict

> **Vote on funny predictions. No money. Just vibes.**

A full-stack web app where users vote YES or NO on meme-worthy predictions like "Will GTA 6 release this year?" Built for learning full-stack development with React, Node.js, Express, and MongoDB.

---

## 🗂️ Project Structure

```
memepredict/
├── backend/                    # Node.js + Express API
│   ├── controllers/            # Business logic
│   │   ├── authController.js   # Register, Login, GetMe
│   │   ├── predictionController.js
│   │   └── commentController.js
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Prediction.js
│   │   ├── Vote.js
│   │   └── Comment.js
│   ├── routes/                 # API route definitions
│   │   ├── auth.js
│   │   ├── predictions.js
│   │   └── comments.js
│   ├── middleware/
│   │   └── auth.js             # JWT protection middleware
│   ├── seed.js                 # Sample data script
│   ├── server.js               # Entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
└── frontend/                   # React + Vite app
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PredictionCard.jsx
    │   │   ├── VoteButtons.jsx
    │   │   └── CommentSection.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── PredictionDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreatePrediction.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js          # All API calls (axios)
    │   ├── utils/
    │   │   └── AuthContext.jsx  # Global auth state (React Context)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18+ → [Download](https://nodejs.org)
- **MongoDB** → Either [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud) or [local MongoDB](https://www.mongodb.com/try/download/community)

---

### Step 1: Clone or download the project

```bash
# If using git:
git clone <your-repo-url>
cd memepredict
```

---

### Step 2: Set up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
MONGO_URI=mongodb://localhost:27017/memepredict
JWT_SECRET=any_long_random_string_you_make_up
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> **Using MongoDB Atlas?** Replace MONGO_URI with your Atlas connection string.
> It looks like: `mongodb+srv://username:password@cluster.mongodb.net/memepredict`

```bash
# (Optional) Seed the database with sample predictions
node seed.js

# Start the backend server
npm run dev
```

✅ Backend should now be running at `http://localhost:5000`

Test it: Open `http://localhost:5000/api/health` in your browser. You should see: `{"status":"OK"}`

---

### Step 3: Set up the Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173`

---

### Step 4: Open the App!

Go to **http://localhost:5173** in your browser. 🎉

---

## 🔌 API Reference

### Authentication

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login with email/password | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Register request body:**
```json
{
  "username": "CoolUser",
  "email": "user@example.com",
  "password": "mypassword"
}
```

**Login request body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

**Both return:**
```json
{
  "token": "eyJhbGc...",
  "user": { "_id": "...", "username": "CoolUser", "email": "..." }
}
```

---

### Predictions

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| GET | `/api/predictions` | Get all predictions | No |
| GET | `/api/predictions/:id` | Get single prediction | No |
| POST | `/api/predictions` | Create prediction | Yes |
| POST | `/api/predictions/:id/vote` | Vote on prediction | Yes |
| GET | `/api/predictions/:id/comments` | Get comments | No |

**Query params for GET /api/predictions:**
- `?category=Gaming` - Filter by category
- `?page=2` - Pagination (10 per page)

**Create prediction body:**
```json
{
  "title": "Will GTA 6 release in 2026?",
  "description": "Optional extra info",
  "category": "Gaming",
  "endDate": "2026-12-31"
}
```

**Vote body:**
```json
{
  "voteType": "yes"
}
```

---

### Comments

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| POST | `/api/comments` | Post a comment | Yes |

**Request body:**
```json
{
  "predictionId": "64abc123...",
  "text": "This is definitely happening!"
}
```

---

## 🧠 How Authentication Works

1. User registers/logs in → Server creates a **JWT token**
2. Token is stored in **localStorage** on the frontend
3. Every API request automatically adds `Authorization: Bearer <token>` header
4. Protected routes on the backend verify the token using `middleware/auth.js`

```
[User logs in] → [Server returns JWT] → [Frontend stores token]
      ↓
[User makes request] → [Axios adds token to header] → [Backend verifies token] → [Request succeeds]
```

---

## 🗄️ Database Models

### User
```
_id, username, email, password (hashed), createdAt
```

### Prediction
```
_id, title, description, category, createdBy (ref: User),
yesVotes, noVotes, endDate, createdAt
```

### Vote
```
_id, userId (ref: User), predictionId (ref: Prediction), voteType ('yes'|'no')
```
> Unique index on `(userId, predictionId)` prevents double voting!

### Comment
```
_id, userId (ref: User), predictionId (ref: Prediction), text, createdAt
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Password | bcryptjs (hashing) |

---

## 📚 Learning Topics Covered

- ✅ REST API design with Express
- ✅ MongoDB schemas and relationships
- ✅ Password hashing with bcrypt
- ✅ JWT authentication flow
- ✅ React Context API for global state
- ✅ Axios interceptors (auto-attach tokens)
- ✅ Protected routes in React Router
- ✅ Optimistic UI updates (voting)
- ✅ Pagination
- ✅ Form handling and validation

---

## 🎯 Next Steps to Extend the Project

Once you're comfortable, try adding:

1. **User avatars** - Upload profile pictures
2. **Search** - Search predictions by keyword
3. **Trending** - Sort by most voted in last 24h
4. **Notifications** - Alert when someone comments on your prediction
5. **Admin panel** - Delete/moderate predictions
6. **Social sharing** - Share predictions to Twitter/X
7. **Real-time updates** - Use Socket.io to show live vote counts
8. **Dark/Light mode toggle**

---

## 🐛 Common Issues

**"MongoDB connection error"**
→ Make sure MongoDB is running. For local: `mongod --dbpath /data/db`. For Atlas: check your connection string in `.env`

**"Cannot GET /api/..."**
→ Make sure the backend server is running (`npm run dev` in the backend folder)

**"CORS error"**
→ Check that `FRONTEND_URL` in `.env` matches where your frontend is running

**Frontend shows blank page**
→ Check the browser console for errors. Make sure `npm run dev` is running in the frontend folder.

---

Happy coding! 🚀
