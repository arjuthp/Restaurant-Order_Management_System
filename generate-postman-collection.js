#!/usr/bin/env node

/**
 * Generate Comprehensive Postman Collection
 * Run: node generate-postman-collection.js
 * Output: restaurant-api-complete.postman_collection.json
 */

const fs = require('fs');

console.log('🚀 Generating Postman Collection...\n');

const collection = {
  info: {
    name: "Restaurant API - Complete Test Suite",
    description: "Comprehensive API tests - Admin & Customer scenarios",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:5000/api", type: "string" },
    { key: "customerToken", value: "", type: "string" },
    { key: "customerRefreshToken", value: "", type: "string" },
    { key: "customerId", value: "", type: "string" },
    { key: "adminToken", value: "", type: "string" },
    { key: "adminRefreshToken", value: "", type: "string" },
    { key: "adminId", value: "", type: "string" },
    { key: "productId", value: "", type: "string" },
    { key: "productId2", value: "", type: "string" },
    { key: "orderId", value: "", type: "string" }
  ],
  item: []
};

// Helper to create request
function req(name, method, path, body = null, auth = null, tests = []) {
  const headers = [{ key: "Content-Type", value: "application/json" }];
  if (auth === 'customer') headers.push({ key: "Authorization", value: "Bearer {{customerToken}}" });
  if (auth === 'admin') headers.push({ key: "Authorization", value: "Bearer {{adminToken}}" });

  const request = {
    name,
    event: tests.length > 0 ? [{ listen: "test", script: { exec: tests, type: "text/javascript" }}] : [],
    request: {
      method,
      header: headers,
      url: { raw: `{{baseUrl}}${path}`, host: ["{{baseUrl}}"], path: path.split('/').filter(p => p) }
    }
  };

  if (body) request.request.body = { mode: "raw", raw: JSON.stringify(body, null, 2) };
  return request;
}

// CUSTOMER FLOW
collection.item.push({
  name: "CUSTOMER FLOW",
  item: [
    {
      name: "1. Authentication",
      item: [
        req("Register Customer", "POST", "/auth/register", 
          { name: "Test Customer", email: "customer{{$timestamp}}@test.com", password: "password123" },
          null,
          ["pm.test('Registration successful', () => { pm.response.to.have.status(201); const res = pm.response.json(); pm.collectionVariables.set('customerToken', res.accessToken); pm.collectionVariables.set('customerRefreshToken', res.refreshToken); pm.collectionVariables.set('customerId', res.user._id); });"]),
        req("Login Customer", "POST", "/auth/login",
          { email: "john@example.com", password: "password123" },
          null,
          ["pm.test('Login successful', () => { pm.response.to.have.status(200); const res = pm.response.json(); pm.collectionVariables.set('customerToken', res.accessToken); });"]),
        req("Logout Customer", "POST", "/auth/logout",
          { refreshToken: "{{customerRefreshToken}}" },
          null,
          ["pm.test('Logout successful', () => { pm.response.to.have.status(200); });"])
      ]
    },
    {
      name: "2. Browse Products",
      item: [
        req("Get All Products", "GET", "/products", null, null,
          ["pm.test('Get products', () => { pm.response.to.have.status(200); const p = pm.response.json(); if(p.length>0) pm.collectionVariables.set('productId', p[0]._id); if(p.length>1) pm.collectionVariables.set('productId2', p[1]._id); });"]),
        req("Get Product by ID", "GET", "/products/{{productId}}", null, null,
          ["pm.test('Get product by ID', () => { pm.response.to.have.status(200); });"])
      ]
    },
    {
      name: "3. Cart Operations",
      item: [
        req("Add Item to Cart (Qty 2)", "POST", "/cart",
          { product_id: "{{productId}}", quantity: 2 },
          'customer',
          ["pm.test('Add to cart', () => { pm.response.to.have.status(200); const cart = pm.response.json(); const item = cart.items[0]; pm.expect(item.quantity).to.equal(2); pm.expect(item.unit_price).to.equal(item.product_id.price * 2); });"]),
        req("Add Same Item (Qty 3) - Should Update to 5", "POST", "/cart",
          { product_id: "{{productId}}", quantity: 3 },
          'customer',
          ["pm.test('❗ No duplicates', () => { pm.response.to.have.status(200); const cart = pm.response.json(); pm.expect(cart.items.length).to.equal(1); pm.expect(cart.items[0].quantity).to.equal(5); const item = cart.items[0]; pm.expect(item.unit_price).to.equal(item.product_id.price * 5); });"]),
        req("Add Different Product", "POST", "/cart",
          { product_id: "{{productId2}}", quantity: 1 },
          'customer',
          ["pm.test('Different product added', () => { pm.response.to.have.status(200); const cart = pm.response.json(); pm.expect(cart.items.length).to.equal(2); });"]),
        req("Get Cart", "GET", "/cart", null, 'customer',
          ["pm.test('Get cart', () => { pm.response.to.have.status(200); });"]),
        req("Update Item Quantity", "PUT", "/cart/{{productId}}",
          { quantity: 10 },
          'customer',
          ["pm.test('Quantity updated', () => { pm.response.to.have.status(200); });"]),
        req("Remove Item", "DELETE", "/cart/{{productId2}}", null, 'customer',
          ["pm.test('Item removed', () => { pm.response.to.have.status(200); });"]),
        req("Clear Cart", "DELETE", "/cart", null, 'customer',
          ["pm.test('Cart cleared', () => { pm.response.to.have.status(200); });"])
      ]
    },
    {
      name: "4. Order Management",
      item: [
        req("Create Order", "POST", "/orders",
          { delivery_address: "123 Test Street, Test City" },
          'customer',
          ["pm.test('Order created', () => { pm.response.to.have.status(201); const order = pm.response.json(); pm.collectionVariables.set('orderId', order._id); });"]),
        req("Get My Orders", "GET", "/orders", null, 'customer',
          ["pm.test('Get orders', () => { pm.response.to.have.status(200); });"]),
        req("Get Order by ID", "GET", "/orders/{{orderId}}", null, 'customer',
          ["pm.test('Get order by ID', () => { pm.response.to.have.status(200); });"])
      ]
    }
  ]
});

// ADMIN FLOW
collection.item.push({
  name: "ADMIN FLOW",
  item: [
    {
      name: "1. Admin Authentication",
      item: [
        req("Admin Login", "POST", "/auth/admin/login",
          { email: "admin@example.com", password: "admin123" },
          null,
          ["pm.test('Admin login', () => { pm.response.to.have.status(200); const res = pm.response.json(); pm.collectionVariables.set('adminToken', res.accessToken); pm.collectionVariables.set('adminRefreshToken', res.refreshToken); });"])
      ]
    },
    {
      name: "2. Product Management",
      item: [
        req("Create Product", "POST", "/products",
          { name: "Test Pizza", description: "Delicious", price: 12.99, category: "Main Course", is_available: true },
          'admin',
          ["pm.test('Product created', () => { pm.response.to.have.status(201); });"]),
        req("Update Product", "PUT", "/products/{{productId}}",
          { price: 15.99, is_available: true },
          'admin',
          ["pm.test('Product updated', () => { pm.response.to.have.status(200); });"]),
        req("Delete Product", "DELETE", "/products/{{productId}}", null, 'admin',
          ["pm.test('Product deleted', () => { pm.response.to.have.status(200); });"])
      ]
    },
    {
      name: "3. Order Management",
      item: [
        req("Get All Orders", "GET", "/admin/orders", null, 'admin',
          ["pm.test('Get all orders', () => { pm.response.to.have.status(200); });"]),
        req("Update Order Status", "PUT", "/admin/orders/{{orderId}}",
          { status: "preparing" },
          'admin',
          ["pm.test('Order status updated', () => { pm.response.to.have.status(200); });"])
      ]
    },
    {
      name: "4. User Management",
      item: [
        req("Get All Users", "GET", "/admin/users", null, 'admin',
          ["pm.test('Get all users', () => { pm.response.to.have.status(200); });"]),
        req("Get User by ID", "GET", "/admin/users/{{customerId}}", null, 'admin',
          ["pm.test('Get user by ID', () => { pm.response.to.have.status(200); });"])
      ]
    }
  ]
});

// Write to file
const filename = 'restaurant-api-complete.postman_collection.json';
fs.writeFileSync(filename, JSON.stringify(collection, null, 2));

console.log('✅ Collection generated successfully!');
console.log(`📁 File: ${filename}`);
console.log('\n📥 Import this file into Postman to get started!\n');
