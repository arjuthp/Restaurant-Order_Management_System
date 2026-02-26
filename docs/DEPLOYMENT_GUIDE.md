# 🚀 Deployment Guide - Single Port Setup

## Problem Solved
Previously, the backend ran on `http://localhost:5000` and React frontend on `http://localhost:3001`, causing confusion with two different URLs.

Now everything runs on **one URL**: `http://localhost:5000`

---

## 📋 How It Works

### Development Mode (Two Servers)
```bash
npm start
```
- Backend: `http://localhost:5000` (Express API)
- Frontend: `http://localhost:3001` (Vite dev server with hot reload)
- API calls proxied from frontend to backend

### Production Mode (One Server)
```bash
npm run prod
```
- Everything on: `http://localhost:5000`
- React app built and served by Express
- No separate frontend server needed

---

## 🛠️ Commands

### Install Dependencies
```bash
npm run install-all
```

### Development (Hot Reload)
```bash
npm start
```
- Use this while developing
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000/api

### Build React App
```bash
npm run build
```
- Creates production-ready files in `client/dist/`

### Production (Single Port)
```bash
npm run prod
```
- Builds React app
- Starts backend server
- Access everything at: http://localhost:5000

### Seed Database
```bash
npm run seed
```

---

## 🔧 What Changed

### 1. `src/app.js`
- API routes defined BEFORE static files
- Serves React build from `client/dist/`
- Catch-all route sends all non-API requests to React app

### 2. `client/src/services/api.js`
- Uses relative URL `/api` in production
- Uses `http://localhost:5000/api` in development

### 3. `package.json`
- Added `build` script to build React
- Added `prod` script for production mode

---

## 📁 File Structure

```
project/
├── client/
│   ├── dist/              # Built React app (created by npm run build)
│   ├── src/               # React source code
│   └── package.json
├── src/
│   ├── app.js             # Express app (serves React in production)
│   ├── server.js          # Server entry point
│   └── ...
└── package.json           # Root scripts
```

---

## 🌐 URL Structure

### Development
- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:5000/api`

### Production
- Everything: `http://localhost:5000`
- API: `http://localhost:5000/api/*`
- React App: `http://localhost:5000/*` (all other routes)

---

## ✅ Testing Production Build

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start only the backend:
   ```bash
   cd src && npm start
   ```

3. Open browser:
   ```
   http://localhost:5000
   ```

4. You should see the React app served from the backend!

---

## 🚨 Important Notes

- Always run `npm run build` before deploying
- The `client/dist/` folder is gitignored (generated on build)
- In production, Express serves both API and React app
- API routes must start with `/api` to avoid conflicts
