#!/bin/bash

# Test script for authentication

echo "=== Testing Backend Authentication ==="
echo ""

# Generate unique email
TIMESTAMP=$(date +%s)
EMAIL="testuser${TIMESTAMP}@example.com"

echo "1. Testing Registration with email: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"test123\"}")

echo "Response: $REGISTER_RESPONSE"
echo ""

# Extract tokens if successful
if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Registration successful!"
    echo ""
    echo "2. Testing Login with same credentials"
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$EMAIL\",\"password\":\"test123\"}")
    
    echo "Response: $LOGIN_RESPONSE"
    echo ""
    
    if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
        echo "✅ Login successful!"
        echo ""
        echo "=== Test Credentials ==="
        echo "Email: $EMAIL"
        echo "Password: test123"
        echo ""
        echo "You can use these credentials in the frontend!"
    else
        echo "❌ Login failed"
    fi
else
    echo "❌ Registration failed"
    echo "Trying to login with existing user: test@example.com"
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"test123"}')
    echo "Response: $LOGIN_RESPONSE"
fi
