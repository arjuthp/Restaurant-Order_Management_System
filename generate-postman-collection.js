#!/usr/bin/env node

/**
 * Generate Comprehensive Postman Collection
 * Run: node generate-postman-collection.js
 */

const fs = require('fs');

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

// Helper function to create request
function createRequest(name, method, path, body = null, useCustomerAuth = false, useAdminAuth = false, tests = []) {
  const headers = [{ key: "Content-Type", value: "application/json" }];
  
  if (useCustomerAuth) {
    headers.push({ key: "Authorization", value: "Bearer {{customerToken}}" });
  }
  if (useAdminAuth) {
    headers.push({ key: "Authorization", value: "Bearer {{adminToken}}" });
  }

  const request = {
    name,
    event: tests.length > 0 ? [{
      listen: "test",
      script: {
        exec: tests,
        type: "text/javascript"
      }
    }] : [],
    request: {
      method,
      header: headers,
      url: {
        raw: `{{baseUrl}}${path}`,
        host: ["{{baseUrl}}"],
        path: path.split('/').filter(p => p)
      }
    }
  };

  if (body) {
    request.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 2)
    };
  }

  return request;
}

// CUSTOMER FLOW
const customerFlow = {
  name: "CUSTOMER FLOW",
  item: []
};
