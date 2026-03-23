#!/bin/bash

# Test script to verify all API endpoints return standardized response formats
# Success format: { success: true, data: {...} }
# Error format: { success: false, error: { message, status } }

echo "Testing API Response Format Standardization"
echo "==========================================="
echo ""

BASE_URL="http://localhost:5000/api"

# Test 1: Success response - GET products
echo "Test 1: GET /products (Success)"
curl -s $BASE_URL/products | jq -c '{success, has_data: (.data != null)}' 2>/dev/null || echo "FAILED"
echo ""

# Test 2: Error response - Invalid product ID
echo "Test 2: GET /products/invalid-id (Error)"
curl -s $BASE_URL/products/invalid-id-12345 | jq -c '{success, has_error: (.error != null), has_message: (.error.message != null), has_status: (.error.status != null)}' 2>/dev/null || echo "FAILED"
echo ""

# Test 3: Auth error - Missing token
echo "Test 3: GET /reservations/my-reservations (Auth Error)"
curl -s $BASE_URL/reservations/my-reservations | jq -c '{success, has_error: (.error != null), has_message: (.error.message != null), has_status: (.error.status != null)}' 2>/dev/null || echo "FAILED"
echo ""

# Test 4: Success response - GET restaurant
echo "Test 4: GET /restaurant (Success)"
curl -s $BASE_URL/restaurant | jq -c '{success, has_data: (.data != null)}' 2>/dev/null || echo "FAILED"
echo ""

# Test 5: Success response - GET tables
echo "Test 5: GET /tables (Success)"
curl -s $BASE_URL/tables | jq -c '{success, has_data: (.data != null)}' 2>/dev/null || echo "FAILED"
echo ""

# Test 6: Error response - Invalid login
echo "Test 6: POST /auth/login (Invalid Credentials)"
curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"email":"invalid@test.com","password":"wrongpass"}' | jq -c '{success, has_error: (.error != null), has_message: (.error.message != null), has_status: (.error.status != null)}' 2>/dev/null || echo "FAILED"
echo ""

echo "==========================================="
echo "All tests completed!"
echo ""
echo "Expected results:"
echo "- Success responses should have: success=true, has_data=true"
echo "- Error responses should have: success=false, has_error=true, has_message=true, has_status=true"
