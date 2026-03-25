const fc = require('fast-check');
const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const OrderService = require('../service/order.service');

// Install chai if not present
try {
  require('chai');
} catch (e) {
  console.error('Please install chai: npm install --save-dev chai');
  process.exit(1);
}

describe('Order Service - Property-Based Tests', function() {
  this.timeout(30000); // Increase timeout for property tests
  
  let testUserId;
  let testProductId;
  const orderService = new OrderService();
  
  before(async function() {
    // Connect to test database
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/restaurant_test';
    await mongoose.connect(mongoUri);
    
    // Create a test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      phone: '1234567890',
      role: 'customer'
    });
    testUserId = testUser._id;
    
    // Create a test product
    const testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 10,
      category: 'Test',
      is_available: true
    });
    testProductId = testProduct._id;
  });
  
  after(async function() {
    // Clean up
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
  });
  
  beforeEach(async function() {
    // Clear orders before each test
    await Order.deleteMany({});
  });
  
  /**
   * Property 1: Date Range Filtering Correctness
   * 
   * For any date range (startDate, endDate) and any set of orders,
   * when filtering orders by that date range, all returned orders
   * should have createdAt timestamps within the range (inclusive),
   * and no orders within the range should be excluded.
   * 
   * Validates: Requirements 1.1
   */
  describe('Property 1: Date Range Filtering Correctness', function() {
    it('should return only orders within the specified date range (getAllOrders)', async function() {
      await fc.assert(
        fc.asyncProperty(
          // Generate a random date range
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          // Generate a random number of orders (1-15)
          fc.integer({ min: 1, max: 15 }),
          async (date1, date2, orderCount) => {
            // Filter out invalid dates
            fc.pre(date1 instanceof Date && !isNaN(date1.getTime()));
            fc.pre(date2 instanceof Date && !isNaN(date2.getTime()));
            // Clean up orders before this iteration
            await Order.deleteMany({});
            
            // Ensure startDate <= endDate
            const startDate = date1 < date2 ? date1 : date2;
            const endDate = date1 < date2 ? date2 : date1;
            
            // Create date boundaries for filtering
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(endDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            
            // Generate orders with random dates
            const orders = [];
            const dateRange = endOfDay.getTime() - startOfDay.getTime();
            const beforeRange = startOfDay.getTime() - (365 * 24 * 60 * 60 * 1000); // 1 year before
            const afterRange = endOfDay.getTime() + (365 * 24 * 60 * 60 * 1000); // 1 year after
            
            for (let i = 0; i < orderCount; i++) {
              // Create orders: some inside range, some outside
              let orderDate;
              const rand = Math.random();
              
              if (rand < 0.5) {
                // 50% inside the range
                orderDate = new Date(startOfDay.getTime() + Math.random() * dateRange);
              } else if (rand < 0.75) {
                // 25% before the range
                orderDate = new Date(beforeRange + Math.random() * (startOfDay.getTime() - beforeRange));
              } else {
                // 25% after the range
                orderDate = new Date(endOfDay.getTime() + Math.random() * (afterRange - endOfDay.getTime()));
              }
              
              const order = await Order.create({
                user_id: testUserId,
                items: [{
                  product_id: testProductId,
                  product_name: 'Test Product',
                  quantity: 1,
                  unit_price: 10
                }],
                total_price: 10,
                status: 'pending',
                createdAt: orderDate
              });
              
              orders.push(order);
            }
            
            // Query orders with date range filter
            const queryParams = {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              limit: 100 // Ensure we get all orders, not just paginated results
            };
            
            const result = await orderService.getAllOrders(queryParams);
            const filteredOrders = result.orders;
            
            // Property 1: All returned orders should be within the date range
            for (const order of filteredOrders) {
              const orderDate = new Date(order.createdAt);
              
              expect(orderDate.getTime()).to.be.at.least(startOfDay.getTime(),
                `Order ${order._id} created at ${orderDate.toISOString()} is before start date ${startOfDay.toISOString()}`);
              expect(orderDate.getTime()).to.be.at.most(endOfDay.getTime(),
                `Order ${order._id} created at ${orderDate.toISOString()} is after end date ${endOfDay.toISOString()}`);
            }
            
            // Property 2: No orders within the range should be excluded
            const ordersInRange = orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              
              return orderDate.getTime() >= startOfDay.getTime() && 
                     orderDate.getTime() <= endOfDay.getTime();
            });
            
            expect(filteredOrders.length).to.equal(ordersInRange.length,
              `Expected ${ordersInRange.length} orders in range, but got ${filteredOrders.length}`);
          }
        ),
        { numRuns: 50 } // Run 50 random test cases
      );
    });
    
    it('should handle edge case: same start and end date', async function() {
      await fc.assert(
        fc.asyncProperty(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          fc.integer({ min: 1, max: 10 }),
          async (targetDate, orderCount) => {
            // Filter out invalid dates
            fc.pre(targetDate instanceof Date && !isNaN(targetDate.getTime()));
            // Clean up orders before this iteration
            await Order.deleteMany({});
            
            // Create date boundaries
            const targetDayStart = new Date(targetDate);
            targetDayStart.setUTCHours(0, 0, 0, 0);
            const targetDayEnd = new Date(targetDate);
            targetDayEnd.setUTCHours(23, 59, 59, 999);
            
            // Create orders on the target date and adjacent dates
            const orders = [];
            
            for (let i = 0; i < orderCount; i++) {
              const dayOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1 day
              
              // Create order date by adding days to the target date start
              const orderDate = new Date(targetDayStart.getTime() + (dayOffset * 24 * 60 * 60 * 1000));
              
              // Add random hours/minutes within the day
              const randomMs = Math.random() * (24 * 60 * 60 * 1000 - 1); // Random time within the day
              orderDate.setTime(orderDate.getTime() + randomMs);
              
              await Order.create({
                user_id: testUserId,
                items: [{
                  product_id: testProductId,
                  product_name: 'Test Product',
                  quantity: 1,
                  unit_price: 10
                }],
                total_price: 10,
                status: 'pending',
                createdAt: orderDate
              });
              
              orders.push({ date: orderDate, offset: dayOffset });
            }
            
            // Query with same start and end date
            const queryParams = {
              startDate: targetDate.toISOString().split('T')[0],
              endDate: targetDate.toISOString().split('T')[0],
              limit: 100 // Ensure we get all orders
            };
            
            const result = await orderService.getAllOrders(queryParams);
            const filteredOrders = result.orders;
            
            // All returned orders should be on the target date
            for (const order of filteredOrders) {
              const orderDate = new Date(order.createdAt);
              
              expect(orderDate.getTime()).to.be.at.least(targetDayStart.getTime(),
                `Order created at ${orderDate.toISOString()} is before target date start ${targetDayStart.toISOString()}`);
              expect(orderDate.getTime()).to.be.at.most(targetDayEnd.getTime(),
                `Order created at ${orderDate.toISOString()} is after target date end ${targetDayEnd.toISOString()}`);
            }
            
            // Count should match orders on target date
            const expectedCount = orders.filter(o => o.offset === 0).length;
            expect(filteredOrders.length).to.equal(expectedCount,
              `Expected ${expectedCount} orders on target date, but got ${filteredOrders.length}`);
          }
        ),
        { numRuns: 30 }
      );
    });
    
    it('should handle edge case: no orders in date range', async function() {
      await fc.assert(
        fc.asyncProperty(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2021-12-31') }),
          fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
          async (oldDate, futureDate) => {
            // Filter out invalid dates
            fc.pre(oldDate instanceof Date && !isNaN(oldDate.getTime()));
            fc.pre(futureDate instanceof Date && !isNaN(futureDate.getTime()));
            // Clean up orders before this iteration
            await Order.deleteMany({});
            
            // Create orders outside the query range
            await Order.create({
              user_id: testUserId,
              items: [{
                product_id: testProductId,
                product_name: 'Test Product',
                quantity: 1,
                unit_price: 10
              }],
              total_price: 10,
              status: 'pending',
              createdAt: oldDate
            });
            
            // Query with a date range that has no orders
            const queryParams = {
              startDate: new Date('2022-01-01').toISOString().split('T')[0],
              endDate: new Date('2023-12-31').toISOString().split('T')[0]
            };
            
            const result = await orderService.getAllOrders(queryParams);
            
            expect(result.orders).to.be.an('array');
            expect(result.orders.length).to.equal(0,
              'Should return empty array when no orders in date range');
          }
        ),
        { numRuns: 20 }
      );
    });
    
    it('should return only orders within the specified date range (getMyOrders)', async function() {
      await fc.assert(
        fc.asyncProperty(
          // Generate a random date range
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          // Generate a random number of orders (1-15)
          fc.integer({ min: 1, max: 15 }),
          async (date1, date2, orderCount) => {
            // Filter out invalid dates
            fc.pre(date1 instanceof Date && !isNaN(date1.getTime()));
            fc.pre(date2 instanceof Date && !isNaN(date2.getTime()));
            // Clean up orders before this iteration
            await Order.deleteMany({});
            
            // Ensure startDate <= endDate
            const startDate = date1 < date2 ? date1 : date2;
            const endDate = date1 < date2 ? date2 : date1;
            
            // Create date boundaries for filtering
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(endDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            
            // Generate orders with random dates
            const orders = [];
            const dateRange = endOfDay.getTime() - startOfDay.getTime();
            const beforeRange = startOfDay.getTime() - (365 * 24 * 60 * 60 * 1000); // 1 year before
            const afterRange = endOfDay.getTime() + (365 * 24 * 60 * 60 * 1000); // 1 year after
            
            for (let i = 0; i < orderCount; i++) {
              // Create orders: some inside range, some outside
              let orderDate;
              const rand = Math.random();
              
              if (rand < 0.5) {
                // 50% inside the range
                orderDate = new Date(startOfDay.getTime() + Math.random() * dateRange);
              } else if (rand < 0.75) {
                // 25% before the range
                orderDate = new Date(beforeRange + Math.random() * (startOfDay.getTime() - beforeRange));
              } else {
                // 25% after the range
                orderDate = new Date(endOfDay.getTime() + Math.random() * (afterRange - endOfDay.getTime()));
              }
              
              const order = await Order.create({
                user_id: testUserId,
                items: [{
                  product_id: testProductId,
                  product_name: 'Test Product',
                  quantity: 1,
                  unit_price: 10
                }],
                total_price: 10,
                status: 'pending',
                createdAt: orderDate
              });
              
              orders.push(order);
            }
            
            // Query orders with date range filter using getMyOrders
            const queryParams = {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              limit: 100 // Ensure we get all orders, not just paginated results
            };
            
            const result = await orderService.getMyOrders(testUserId, queryParams);
            const filteredOrders = result.orders;
            
            // Property 1: All returned orders should be within the date range
            for (const order of filteredOrders) {
              const orderDate = new Date(order.createdAt);
              
              expect(orderDate.getTime()).to.be.at.least(startOfDay.getTime(),
                `Order ${order._id} created at ${orderDate.toISOString()} is before start date ${startOfDay.toISOString()}`);
              expect(orderDate.getTime()).to.be.at.most(endOfDay.getTime(),
                `Order ${order._id} created at ${orderDate.toISOString()} is after end date ${endOfDay.toISOString()}`);
            }
            
            // Property 2: No orders within the range should be excluded
            const ordersInRange = orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              
              return orderDate.getTime() >= startOfDay.getTime() && 
                     orderDate.getTime() <= endOfDay.getTime();
            });
            
            expect(filteredOrders.length).to.equal(ordersInRange.length,
              `Expected ${ordersInRange.length} orders in range, but got ${filteredOrders.length}`);
          }
        ),
        { numRuns: 50 } // Run 50 random test cases
      );
    });
  });
});
