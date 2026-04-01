# Port Configuration

## Current Setup

This project now uses the following ports to avoid conflicts with other repositories:

- **Frontend:** Port 3002 → `http://localhost:3002`
- **Backend:** Port 5002 → `http://localhost:5002`

## Configuration Files Updated

### 1. Backend Port - `src/.env`
```env
PORT=5002
FRONTEND_URL=http://localhost:3002
```

### 2. Frontend API URL - `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5002/api
```

### 3. Frontend Dev Server - `client/vite.config.ts`
```typescript
server: {
  port: 3002,
  proxy: {
    '/api': {
      target: 'http://localhost:5002',
      changeOrigin: true,
    },
  },
}
```

## How to Start

### Backend (Port 5002):
```bash
cd src
npm start
```
Backend will be available at: `http://localhost:5002`

### Frontend (Port 3002):
```bash
cd client
npm run dev
```
Frontend will be available at: `http://localhost:3002`

## Testing

### Test Backend:
```bash
curl http://localhost:5002/api/products
```

### Test Frontend:
Open browser: `http://localhost:3002`

## Port Conflicts

If you still get port conflicts, you can change to any available ports:

### Quick Port Check:
```bash
# Check if ports are available
lsof -i :3002  # Frontend
lsof -i :5002  # Backend
```

### Change Ports:
1. Update `src/.env` → Change `PORT=5002` to your desired port
2. Update `client/.env` → Change `VITE_API_BASE_URL` to match
3. Update `client/vite.config.ts` → Change `port` and `proxy.target`
4. Restart both servers

## Other Repos Using:
- Port 3000 - Other frontend
- Port 3001 - Other frontend
- Port 5000 - Other backend
- Port 5001 - (Available)

## Current Restaurant App:
- Port 3002 - Frontend ✅
- Port 5002 - Backend ✅
