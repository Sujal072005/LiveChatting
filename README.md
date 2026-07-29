# LiveChatting — MERN Real-Time Messaging Application

A modern, highly responsive, full-stack real-time chat application built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Socket.io**, and styled with **Premium Glassmorphism Design**.

---

## ✨ Features & Capabilities

### 🎨 Design & Visual Polish
- **Premium Glassmorphic UI**: Beautiful blurred glass panels, dynamic ambient background glow, and polished typography.
- **Theme Switcher**: Instant toggle between **Dark Glassmorphism (`🌙`)** and **Light Glassmorphism (`☀️`)** modes with `localStorage` persistence.
- **Animated Page & Chat Transitions**: Smooth fade-in entrance animations for login, sign up, and directional entrance animations for chat bubbles.
- **Slide-Out Profile Drawer**: Click your avatar at the top of the sidebar to inspect your full user profile card (Avatar, Full Name, Username, Gender, and Membership date).
- **Dice Avatar Randomizer**: Instantly randomize your profile picture with cute DiceBear avatars (`🎲`).

### 💬 Messaging & Real-Time Interaction
- **Real-Time Messaging & Online Status**: Instant messaging and live online presence indicators powered by **Socket.io**.
- **Message Reactions**: Hover over any chat bubble to react with emojis (`👍 ❤️ 😂 🔥 😢`), saved instantly to the database.
- **Image Sharing**: Easily send image files (up to 5MB) with inline image preview thumbnails.
- **Interactive Emoji Picker**: Integrated 80+ emoji selector grid (`😀`) right inside the chat input bar.
- **Relative Timestamps**: Human-friendly message times (`"just now"`, `"2m ago"`, `"1h ago"`) for recent messages.
- **Scroll-to-Bottom Button**: Floating animated arrow button appears when scrolling through chat history to jump to the newest message.

### 🛡️ Privacy & Security
- **Block & Mute Controls**: 
  - **`🛡️ Block / 🚫 Blocked`**: Block users from sending you messages. Incoming API requests from blocked users are rejected with `403 Forbidden`.
  - **`🔔 Mute / 🔇 Muted`**: Silences notification sounds for muted contacts while displaying cute visual status badges (`🚫` / `🔇`) directly in your contacts list.
- **Password Visibility Toggles**: Clickable eye icons (`👁`) on Login and Sign Up forms.
- **Authentication & Security**: JWT-based authentication, password hashing with bcryptjs, Helmet security headers, and API rate limiting.

### 💾 Dual Database Setup & Live Inspector
- **MongoDB Atlas Cloud Ready**: Simple `.env` configuration to connect to any cloud cluster.
- **Automatic Embedded Persistent Fallback**: If a standalone MongoDB instance is not detected, the backend automatically boots an embedded persistent database engine—saving data permanently in `.mongodb-data` with zero extra configuration.
- **Built-In Live Database Inspector**: Inspect your database tables directly from your web browser:
  - **Visual Dashboard**: `http://localhost:5001/api/db`
  - **Raw JSON Export**: `http://localhost:5001/api/db/json`

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Sujal072005/LiveChatting.git
cd LiveChatting
```

### 2. Configure `.env` File
Create a `.env` file in the root directory:
```env
PORT=5001
NODE_ENV=development
MONGO_DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-chat-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: If you omit `MONGO_DB_URI` or connect locally, the app automatically switches to the embedded persistent local database!)*

### 3. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 4. Build & Run
```bash
# Build the React frontend production bundle
npm run build --prefix frontend

# Start the full-stack server
npm start
```

Visit **[http://localhost:5001](http://localhost:5001)** in your web browser!

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite), TailwindCSS, DaisyUI, Zustand, Socket.io-client, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JSON Web Token (JWT), Bcrypt.js, Helmet, Express Rate Limit
- **Database Fallback**: MongoDB Memory Server (WiredTiger Persistent Storage Engine)
