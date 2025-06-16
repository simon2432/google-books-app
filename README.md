# 📚 Google Books App

This project is a full‑stack application that allows users to search for books through the Google Books API and save favorites with personal notes.  
The repository is divided into two parts:

- **server** – Node.js/Express backend using Prisma and JWT-based authentication.  
- **client** – React Native (Expo) frontend built with expo-router.

---

## ✨ Features

### Backend

- User registration and login with hashed passwords.
- JWT authentication middleware.
- CRUD endpoints for saving, updating, and deleting favorite books.
- Prisma ORM with a PostgreSQL database.
- Environment-driven configuration (`DATABASE_URL`, `JWT_SECRET`, etc.).

### Frontend

- Login and registration screens.
- Home screen displaying user profile and favorite books.
- Book search using the Google Books API.
- Ability to add, edit comments, and remove favorites.
- React Native components styled for both mobile and web via Expo.

---

## 📁 Project Structure

```
google-books-app/
├── client/    # Expo React Native application
│   ├── app/   # Screens and routing
│   ├── components/
│   ├── constants/
│   └── ...
└── server/    # Express API server
    ├── src/
    │   ├── controllers/
    │   ├── middlewares/
    │   └── routes/
    └── prisma/  # Prisma schema
```

---

## 📦 Prerequisites

- Node.js (18+ recommended)  
- npm or yarn  
- PostgreSQL database  
- *(Optional)* Expo Go or a device/emulator for running the mobile app

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd google-books-app
```

### 2. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `server/` with at least:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=4000
```

In the client, edit `client/constants/config.js` and set `API_URL` to the backend URL (e.g., `http://localhost:4000`).

### 4. Initialize the database

From the `server/` directory run:

```bash
npx prisma migrate deploy
```

This will create the required tables as defined in `server/prisma/schema.prisma`.

### 5. Start the backend

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:4000` (or the port you specified).

### 6. Start the frontend

```bash
cd client
npx expo start
```

Use the presented options to run the app on an emulator, device, or in a web browser.

---

## 🚀 Usage

1. Launch the app and register a new account (or log in if you already have one).  
2. After logging in, search for books by title.  
3. Select a book, add an optional comment, and save it to your favorites.  
4. View and manage your saved books on the Home screen — update comments or remove entries as needed.
