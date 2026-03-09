#!/bin/bash

echo "=== Getting Admin Token ==="
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | \
  grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:50}..."
echo ""

echo "=== Getting Table 1 Current State ==="
curl -s http://localhost:5000/api/tables/69aa9958c9be0d453b8e1771 | jq '.'
echo ""

echo "=== Updating Table 1 Status to Inactive ==="
curl -s -X PUT http://localhost:5000/api/tables/69aa9958c9be0d453b8e1771 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":1,"capacity":6,"location":"Window side - Updated","status":"inactive"}' | jq '.'
echo ""

echo "=== Verifying Update ==="
curl -s http://localhost:5000/api/tables/69aa9958c9be0d453b8e1771 | jq '.data.status'
