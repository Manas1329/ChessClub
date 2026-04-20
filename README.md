# ♟ ChessClub — Full Stack Application

A complete full-stack Chess Club website built with **React**, **Node.js + Express**, and **MongoDB**. Converts your original static HTML/CSS into a fully dynamic application without changing a single class name or CSS rule.

##manasfsd123
manas
chessclub123
---

## 📁 Project Structure

```
chess-club/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT auth middleware
│   ├── models/
│   │   ├── Member.js
│   │   ├── Article.js
│   │   ├── Event.js
│   │   ├── Product.js
│   │   └── Gallery.js
│   ├── routes/
│   │   ├── auth.js              # POST /api/admin/login
│   │   ├── members.js           # GET/POST/PATCH/DELETE /api/members
│   │   ├── articles.js          # GET/POST/PUT/DELETE /api/articles
│   │   ├── events.js            # GET/POST/DELETE /api/events
│   │   ├── products.js          # GET/POST/PUT/DELETE /api/products
│   │   └── gallery.js           # GET/POST/DELETE /api/gallery
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Hero.js
    │   │   ├── ArticleCard.js
    │   │   ├── ArticleList.js
    │   │   ├── Leaderboard.js
    │   │   ├── Calendar.js
    │   │   └── Sidebar.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Register.js
    │   │   ├── Login.js
    │   │   ├── AdminDashboard.js
    │   │   ├── Merch.js
    │   │   └── Gallery.js
    │   ├── styles/
    │   │   ├── homepage.css      # Exact copy of your original CSS
    │   │   ├── restPage.css      # Exact copy of your original CSS
    │   │   └── extraPages.css    # Merch, Gallery, Admin styles
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

---

### 1. Set Up the Backend

```bash
cd chess-club/backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/chessclub
JWT_SECRET=your_super_secret_key_change_this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
PORT=5000
```

Start the backend:
```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Backend runs at: **http://localhost:5000**

---

### 2. Set Up the Frontend

```bash
cd chess-club/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `frontend/package.json` automatically forwards all `/api` calls to the backend — no CORS issues in development.

---

### 3. Add Your Media Files

Copy your original media into the React public folder:
```bash
cp chess-club-original/media/Chess2.jpg  chess-club/frontend/public/media/Chess2.jpg
cp chess-club-original/media/article1.jpg chess-club/frontend/public/media/article1.jpg
```

---

## 🔑 Admin Access

1. Go to **http://localhost:3000/login**
2. Login with credentials from your `.env`:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to the Admin Dashboard at `/admin`

From the dashboard you can:
- **Articles tab** — Add/edit/delete articles (news, events, puzzles, etc.)
- **Members tab** — View all registered members, update ELO ratings, toggle paid status
- **Events tab** — Add calendar events that appear in the sidebar calendar
- **Products tab** — Add merchandise for the Merch page
- **Gallery tab** — Add images for the Gallery page

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/login` | ❌ | Admin login, returns JWT |
| POST | `/api/register` | ❌ | Register new member |
| GET | `/api/members` | ❌ | All members sorted by ELO (leaderboard) |
| PATCH | `/api/members/:id` | ✅ | Update member ELO / paid status |
| DELETE | `/api/members/:id` | ✅ | Remove member |
| GET | `/api/articles` | ❌ | All articles (newest first) |
| POST | `/api/articles` | ✅ | Create article |
| PUT | `/api/articles/:id` | ✅ | Update article |
| DELETE | `/api/articles/:id` | ✅ | Delete article |
| GET | `/api/events` | ❌ | All events (soonest first) |
| POST | `/api/events` | ✅ | Create event |
| DELETE | `/api/events/:id` | ✅ | Delete event |
| GET | `/api/products` | ❌ | All products |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |
| GET | `/api/gallery` | ❌ | All gallery images |
| POST | `/api/gallery` | ✅ | Add gallery image |
| DELETE | `/api/gallery/:id` | ✅ | Delete gallery image |

---

## 🛒 Cart System

The Merch page uses `localStorage` for the cart (no payment integration):
- Items persist across page refreshes
- Cart count shown as a floating badge
- Key: `chessClubCart` in localStorage

---

## 🏗 Production Build

```bash
# Build React frontend
cd frontend && npm run build

# Serve static files from Express (add to server.js):
# const path = require('path');
# app.use(express.static(path.join(__dirname, '../frontend/build')));
# app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```

---

## 🎨 Design Notes

- **Zero CSS changes** — All class names are identical to your original HTML
- `homepage.css` and `restPage.css` are direct copies of your originals
- `extraPages.css` adds styles for Merch, Gallery, and Admin pages, following the same dark theme
- The Leaderboard reads directly from the Members collection sorted by `eloRating` — no separate collection needed
