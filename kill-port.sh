#!/bin/bash

# Kill process on port 5000
PORT=5000

echo "🔍 Checking for processes on port $PORT..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "✅ Port $PORT is free"
else
    echo "🔪 Killing process $PID on port $PORT..."
    kill -9 $PID
    echo "✅ Port $PORT is now free"
fi
