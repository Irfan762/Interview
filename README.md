# 🧠 Irfan's 1-4-7 Revision Tracker

A full-stack revision tracking application using the 1-4-7 learning technique. Built with React (Vite) frontend and Node.js/Express/MongoDB backend.

## 🚀 Features

- **1-4-7 Revision System**: Learn → Revise (Day 3) → Master (Day 6)
- **28-Day Study Plan**: Structured DSA, Aptitude, CS Fundamentals, HR prep
- **Progress Tracking**: Visual progress bars, completion percentages
- **Filtering**: By status (pending/done), subject tags (DSA, APT, CS, etc.)
- **Two Views**: Calendar view (by day) and List view (all tasks)
- **Data Persistence**: MongoDB backend + localStorage fallback
- **Responsive Design**: Dark theme with gradient backgrounds

## 📁 Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── Progress.js          # MongoDB schema
│   ├── routes/
│   │   └── tracker.js           # API routes
│   └── server.js                # Express server
├── src/
│   ├── services/
│   │   └── api.js               # API client
│   ├── App.jsx                  # Main React component
│   └── main.jsx                 # React entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your MongoDB URI:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/irfan_tracker
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

### Running the Application

**Development mode (both frontend and backend):**
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Run separately:**
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

**Production build:**
```bash
npm run build
npm run preview
```

## 🔌 API Endpoints

### Progress Management

- `GET /api/tracker/progress/:userId` - Get all progress
- `POST /api/tracker/progress/:userId/toggle` - Toggle task completion
  ```json
  { "taskId": "0-L" }
  ```
- `POST /api/tracker/progress/:userId/bulk` - Bulk update progress
  ```json
  { "progressData": { "0-L": true, "0-R1": false } }
  ```
- `GET /api/tracker/stats/:userId` - Get statistics

### Health Check

- `GET /api/health` - Server health status

## 🎨 Features Breakdown

### Frontend (React + Vite)

- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: localStorage + backend sync
- **Filtering**: Multi-level filtering by status and subject
- **Views**: Toggle between calendar and list views
- **Responsive**: Mobile-friendly design

### Backend (Node.js + Express + MongoDB)

- **RESTful API**: CRUD operations for progress tracking
- **MongoDB**: Persistent data storage
- **Mongoose**: ODM for MongoDB
- **CORS**: Cross-origin resource sharing enabled

## 📊 Study Plan Overview

- **28 Days**: June 12 - July 9, 2026
- **Subjects**: DSA, Aptitude, CS Fundamentals, English, HR, Mock Tests
- **Revision Pattern**: Learn (Day 1) → Revise (Day 4) → Master (Day 7)
- **Total Tasks**: 84 entries (28 topics × 3 phases)

## 🔧 Customization

### Modify Topics

Edit the `topics` array in `src/App.jsx`:

```javascript
const topics = [
  { day: 1, topic: "Your Topic", tag: "DSA", tip: "Your tip" },
  // Add more topics...
];
```

### Change Colors

Update `TAG_COLORS` and `TYPE_CONFIG` in `src/App.jsx`.

### Adjust Start Date

```javascript
const START_DATE = new Date(2026, 5, 12); // June 12 2026
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/Heroku)

Set environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: Auto-assigned by platform

## 📝 License

MIT License - feel free to use for your own revision tracking!

## 👨‍💻 Author

**Irfan** - IIT KGP Hackathon Winner · EY Top 1.5% · LeetCode 1356+ rating

---

**Good luck with your preparation! 🎯**
