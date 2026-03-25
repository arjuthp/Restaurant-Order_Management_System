# Implementation Plan: Restaurant Management System Enhancement

## Overview

This implementation plan breaks down the 8-phase restaurant system enhancement into discrete, actionable coding tasks. Each phase builds on the previous, with tasks organized to enable incremental progress and early validation through testing.

**CRITICAL CONSTRAINT**: Backend code modifications are provided as suggestions in chat only and never implemented directly. Frontend changes are implemented directly.

**Implementation Order**: Phases must be completed sequentially (1 → 8) as later phases depend on earlier infrastructure.

## Tasks

### Phase 1: Critical Fixes

- [x] 1. Fix date filtering bug in order service
  - Review existing `getAllOrders` and `getMyOrders` methods in `src/service/order.service.js`
  - **Backend Suggestion**: Add date range filtering logic using `createdAt` field with `$gte` and `$lte` operators
  - **Backend Suggestion**: Handle end date by setting time to 23:59:59.999 for inclusive filtering
  - Test with various date ranges to verify filtering works correctly
  - _Requirements: 1.1_

- [x] 1.1 Write property test for date range filtering
  - **Property 1: Date Range Filtering Correctness**
  - **Validates: Requirements 1.1**
  - Generate random date ranges and orders
  - Verify all returned orders fall within the specified range
  - _Requirements: 1.1_

- [x] 2. Checkpoint - Verify Phase 1 completion
  - Ensure date filtering works correctly with test queries
  - Ask user if any questions arise

### Phase 2: Inventory Management

- [ ] 3. Enhance Product model with inventory fields
  - **Backend Suggestion**: Add `stock_quantity`, `low_stock_threshold`, and `sku` fields to product schema
  - **Backend Suggestion**: Add pre-save hook to auto-generate SKU if not provided
  - _Requirements: 2.1, 2.2, 2.3, 2.6_

- [ ] 3.1 Write property test for SKU uniqueness
  - **Property 2: SKU Uniqueness**
  - **Validates: Requirements 2.6**
  - _Requirements: 2.6_

- [ ] 4. Create InventoryTransaction model
  - **Backend Suggestion**: Create `src/models/inventoryTransaction.model.js`
  - **Backend Suggestion**: Define schema with product_id, transaction_type, quantity_change, previous_quantity, new_quantity, reason, performed_by, order_id fields
  - **Backend Suggestion**: Add enum validation for transaction_type
  - _Requirements: 2.4, 2.5_

- [ ] 6. Implement inventory service for stock operations
  - **Backend Suggestion**: Create `src/service/inventory.service.js`
  - **Backend Suggestion**: Implement `deductStock` method with MongoDB transaction for atomicity
  - **Backend Suggestion**: Implement `restoreStock` method for order cancellations
  - **Backend Suggestion**: Implement `getLowStockProducts` method
  - **Backend Suggestion**: Implement `adjustStock` method for manual adjustments
  - **Backend Suggestion**: Add error handling for insufficient stock
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 6.1 Write property test for stock deduction and restoration round trip
  - **Property 3: Stock Deduction and Restoration Round Trip**
  - **Validates: Requirements 3.1, 3.4**
  - _Requirements: 3.1, 3.4_

- [ ] 6.2 Write property test for inventory transaction audit trail
  - **Property 4: Inventory Transaction Audit Trail Completeness**
  - **Validates: Requirements 3.2, 3.5**
  - _Requirements: 3.2, 3.5_

- [ ] 6.3 Write property test for insufficient stock prevention
  - **Property 5: Insufficient Stock Prevention**
  - **Validates: Requirements 3.3**
  - _Requirements: 3.3_

- [ ] 6.4 Write property test for stock quantity non-negativity invariant
  - **Property 6: Stock Quantity Non-Negativity Invariant**
  - **Validates: Requirements 3.6**
  - _Requirements: 3.6_


- [ ] 7. Integrate inventory service with order service
  - **Backend Suggestion**: Modify `updateOrderStatus` in `src/service/order.service.js` to call `inventoryService.deductStock` when status changes to "confirmed"
  - **Backend Suggestion**: Modify `cancelOrder` to call `inventoryService.restoreStock` for confirmed/preparing orders
  - **Backend Suggestion**: Add error handling and transaction rollback on failures
  - _Requirements: 3.1, 3.4_

- [ ] 8. Create inventory management API endpoints
  - **Backend Suggestion**: Create `src/controllers/inventory.controller.js`
  - **Backend Suggestion**: Add GET `/admin/inventory` endpoint for listing products with stock info
  - **Backend Suggestion**: Add GET `/admin/inventory/low-stock` endpoint
  - **Backend Suggestion**: Add POST `/admin/inventory/:id/adjust` endpoint for manual stock adjustments
  - **Backend Suggestion**: Add GET `/admin/inventory/:id/transactions` endpoint for transaction history
  - **Backend Suggestion**: Add routes to `src/routes/` with admin authentication middleware
  - _Requirements: 4.2, 5.1_

- [ ] 9. Implement Inventory Management Page component
  - Create `client/src/features/admin/pages/InventoryManagementPage.tsx`
  - Implement table view with columns: name, SKU, stock quantity, threshold, category, actions
  - Add filter dropdown for "All" vs "Low Stock Only"
  - Add search bar for product name or SKU
  - Implement pagination for large product lists
  - Add "Update Stock" button for each product
  - _Requirements: 5.1, 5.2, 5.7, 5.8_

- [ ] 10. Create Stock Update Modal component
  - Create `client/src/features/admin/components/StockUpdateModal.tsx`
  - Implement form with quantity input and reason textarea
  - Add validation for positive numbers
  - Call API to update stock and create transaction record
  - Show success/error messages
  - Refresh inventory list on success
  - _Requirements: 5.3, 5.4_

- [ ] 11. Create Low Stock Alert component
  - Create `client/src/features/admin/components/LowStockAlert.tsx`
  - Fetch low stock products on mount
  - Display alert banner with count of low stock products
  - Add link to filter inventory by low stock
  - _Requirements: 4.5, 4.6_

- [ ] 11.1 Write property test for low stock detection
  - **Property 7: Low Stock Detection**
  - **Validates: Requirements 4.1, 4.3**
  - _Requirements: 4.1, 4.3_

- [ ] 11.2 Write property test for low stock alert display completeness
  - **Property 8: Low Stock Alert Display Completeness**
  - **Validates: Requirements 4.6**
  - _Requirements: 4.6_

- [ ] 12. Add low stock badge to admin product list
  - Modify `client/src/features/admin/components/ProductCard.tsx` or equivalent
  - Add conditional rendering of badge when stock_quantity <= low_stock_threshold
  - Style badge with warning color (orange/yellow)
  - _Requirements: 4.4_

- [ ] 12.1 Write property test for low stock badge visibility
  - **Property 9: Low Stock Badge Visibility**
  - **Validates: Requirements 4.4**
  - _Requirements: 4.4_

- [ ] 13. Create Inventory Transaction History component
  - Create `client/src/features/admin/components/InventoryTransactionHistory.tsx`
  - Display table with columns: date, type, quantity change, reason, performed by
  - Add filtering by transaction type
  - Add date range filter
  - _Requirements: 5.6_

- [ ] 14. Integrate Low Stock Alert into Admin Dashboard
  - Modify `client/src/features/admin/pages/AdminDashboardPage.tsx`
  - Add LowStockAlert component at the top of dashboard
  - Ensure it's visible on dashboard load
  - _Requirements: 4.5_

- [ ] 15. Checkpoint - Verify Phase 2 completion
  - Test stock deduction when order is confirmed
  - Test stock restoration when order is cancelled
  - Test low stock alerts appear correctly
  - Test manual stock adjustments
  - Verify transaction history is recorded
  - Ask user if any questions arise

### Phase 3: Data Archival

- [ ] 16. Enhance Order model with archival fields
  - **Backend Suggestion**: Add `is_archived`, `archived_at`, and `fiscal_year` fields to order schema
  - **Backend Suggestion**: Set default values (is_archived: false, others: null)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 17. Create archival cron job
  - **Backend Suggestion**: Create `src/jobs/archiveOrders.js`
  - **Backend Suggestion**: Implement logic to find orders older than 1 year with is_archived: false
  - **Backend Suggestion**: Update orders with archival fields
  - **Backend Suggestion**: Add logging for archived count
  - **Backend Suggestion**: Add error handling and retry logic
  - **Backend Suggestion**: Schedule cron job for 1st of month at 2:00 AM using node-cron
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

- [ ] 17.1 Write property test for archival query correctness
  - **Property 10: Archival Query Correctness**
  - **Validates: Requirements 7.2**
  - _Requirements: 7.2_

- [ ] 17.2 Write property test for archival field updates
  - **Property 11: Archival Field Updates**
  - **Validates: Requirements 7.3**
  - _Requirements: 7.3_

- [ ] 18. Modify order service to exclude archived orders by default
  - **Backend Suggestion**: Update `getAllOrders` and `getMyOrders` to add `is_archived: false` to filter
  - **Backend Suggestion**: Create `getArchivedOrders` method with `is_archived: true` filter
  - **Backend Suggestion**: Add fiscal_year filtering support
  - _Requirements: 8.1, 8.2_

- [ ] 18.1 Write property test for default query exclusion of archived orders
  - **Property 12: Default Query Exclusion of Archived Orders**
  - **Validates: Requirements 8.1**
  - _Requirements: 8.1_

- [ ] 19. Create archived orders API endpoints
  - **Backend Suggestion**: Add GET `/admin/orders/archived` endpoint
  - **Backend Suggestion**: Support fiscal_year query parameter
  - **Backend Suggestion**: Support search by order ID or customer name
  - **Backend Suggestion**: Add pagination support
  - _Requirements: 8.2, 8.6_

- [ ] 20. Implement Archived Orders Page component
  - Create `client/src/features/admin/pages/ArchivedOrdersPage.tsx`
  - Implement table view with columns: order ID, customer, date, total, archived date, fiscal year
  - Add fiscal year filter dropdown
  - Add search bar for order ID or customer name
  - Implement pagination
  - Add "View Details" button for each order
  - _Requirements: 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 21. Add navigation link to archived orders
  - Modify admin navigation menu to include "Archived Orders" link
  - Ensure link is only visible to admin users
  - _Requirements: 8.3_

- [ ] 22. Implement admin notification for archival completion
  - **Backend Suggestion**: Create notification service or use existing email service
  - **Backend Suggestion**: Send email to all admin users after archival job completes
  - **Backend Suggestion**: Include count of archived orders in notification
  - _Requirements: 7.5_

- [ ] 23. Checkpoint - Verify Phase 3 completion
  - Test that new orders are not archived
  - Test that old orders (1+ years) are archived by cron job
  - Test that archived orders don't appear in default queries
  - Test archived orders page displays correctly
  - Ask user if any questions arise


### Phase 4: Analytics Dashboard

- [ ] 24. Create analytics service for metrics calculation
  - **Backend Suggestion**: Create `src/service/analytics.service.js`
  - **Backend Suggestion**: Implement `getDailyMetrics` method (total orders, revenue, average order value, top products)
  - **Backend Suggestion**: Implement `getTrendData` method with daily/weekly/monthly aggregation
  - **Backend Suggestion**: Implement `getCategoryAnalytics` method
  - **Backend Suggestion**: Implement `getInventoryMovement` method
  - **Backend Suggestion**: Exclude cancelled and archived orders from calculations
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 11.1, 11.2, 11.3_

- [ ] 24.1 Write property test for order count calculation accuracy
  - **Property 13: Order Count Calculation Accuracy**
  - **Validates: Requirements 9.1**
  - _Requirements: 9.1_

- [ ] 24.2 Write property test for revenue calculation accuracy
  - **Property 14: Revenue Calculation Accuracy**
  - **Validates: Requirements 9.2**
  - _Requirements: 9.2_

- [ ] 24.3 Write property test for average order value calculation
  - **Property 15: Average Order Value Calculation Accuracy**
  - **Validates: Requirements 9.3**
  - _Requirements: 9.3_

- [ ] 24.4 Write property test for top products ranking correctness
  - **Property 16: Top Products Ranking Correctness**
  - **Validates: Requirements 9.4, 9.5**
  - _Requirements: 9.4, 9.5_

- [ ] 24.5 Write property test for trend data aggregation correctness
  - **Property 17: Trend Data Aggregation Correctness**
  - **Validates: Requirements 10.1, 10.2, 10.3**
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 24.6 Write property test for inventory movement calculation accuracy
  - **Property 18: Inventory Movement Calculation Accuracy**
  - **Validates: Requirements 11.2, 11.3**
  - _Requirements: 11.2, 11.3_

- [ ] 25. Create analytics API endpoints
  - **Backend Suggestion**: Create `src/controllers/analytics.controller.js`
  - **Backend Suggestion**: Add GET `/admin/analytics/metrics` endpoint with date range params
  - **Backend Suggestion**: Add GET `/admin/analytics/trends` endpoint with groupBy param
  - **Backend Suggestion**: Add GET `/admin/analytics/categories` endpoint
  - **Backend Suggestion**: Add GET `/admin/analytics/inventory-movement` endpoint
  - **Backend Suggestion**: Add routes with admin authentication
  - _Requirements: 9.6_

- [ ] 26. Implement Analytics Dashboard Page component
  - Create `client/src/features/admin/pages/AnalyticsDashboardPage.tsx`
  - Add date range picker component
  - Add view mode selector (daily/weekly/monthly)
  - Implement metrics cards section (total orders, revenue, avg order value)
  - Add loading states and error handling
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 27. Create Metrics Cards component
  - Create `client/src/features/admin/components/MetricsCards.tsx`
  - Display total orders, total revenue, average order value in card layout
  - Add icons and styling for visual appeal
  - Show percentage change from previous period (optional)
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 28. Implement Revenue Trends Chart component
  - Create `client/src/features/admin/components/RevenueTrendsChart.tsx`
  - Use Recharts LineChart to display revenue over time
  - Support daily/weekly/monthly views
  - Add tooltips showing exact values
  - Add responsive design for mobile
  - _Requirements: 10.4, 10.6_

- [ ] 29. Implement Order Count Chart component
  - Create `client/src/features/admin/components/OrderCountChart.tsx`
  - Use Recharts BarChart to display order counts
  - Support daily/weekly/monthly views
  - Add tooltips and legends
  - _Requirements: 10.5, 10.6_

- [ ] 30. Implement Category Revenue Pie Chart component
  - Create `client/src/features/admin/components/CategoryRevenuePieChart.tsx`
  - Use Recharts PieChart to show revenue distribution by category
  - Add labels with percentages
  - Add legend with category names
  - _Requirements: 10.7_

- [ ] 31. Create Top Products Table component
  - Create `client/src/features/admin/components/TopProductsTable.tsx`
  - Display table with columns: rank, product name, quantity sold, revenue
  - Support sorting by quantity or revenue
  - Show top 10 products
  - _Requirements: 9.4, 9.5, 10.8_

- [ ] 32. Implement Inventory Movement Chart component
  - Create `client/src/features/admin/components/InventoryMovementChart.tsx`
  - Display chart showing stock deductions and restocks over time
  - Add filtering by product category
  - Show products with highest deductions
  - _Requirements: 11.4, 11.5_

- [ ] 33. Create Low Stock Products List component
  - Create `client/src/features/admin/components/LowStockProductsList.tsx`
  - Display products approaching low stock threshold
  - Show current stock, threshold, and days until stockout (estimated)
  - Add link to inventory management page
  - _Requirements: 11.6_

- [ ] 34. Implement export to PDF functionality
  - Create `client/src/features/admin/utils/exportAnalytics.ts`
  - Install jsPDF library
  - Implement `exportToPDF` function
  - Include metrics, charts (as images), and tables in PDF
  - Add date range and generation timestamp
  - Trigger download on button click
  - _Requirements: 12.1, 12.2, 12.5, 12.7_

- [ ] 35. Implement export to Excel functionality
  - Install xlsx library
  - Implement `exportToExcel` function in `exportAnalytics.ts`
  - Create separate sheets for metrics, trends, top products, inventory
  - Format data in tabular format with headers
  - Add date range and timestamp
  - Trigger download on button click
  - _Requirements: 12.3, 12.4, 12.6, 12.7_

- [ ] 36. Add Export Buttons component
  - Create `client/src/features/admin/components/ExportButtons.tsx`
  - Add "Export to PDF" and "Export to Excel" buttons
  - Show loading state during export generation
  - Handle export errors gracefully
  - _Requirements: 12.1, 12.3_

- [ ] 37. Integrate all components into Analytics Dashboard
  - Add all chart and table components to AnalyticsDashboardPage
  - Implement responsive grid layout
  - Add export buttons at the top
  - Ensure data fetching is coordinated
  - Add refresh button to reload data
  - _Requirements: 10.4, 10.5, 10.7, 10.8_

- [ ] 38. Add navigation link to analytics dashboard
  - Modify admin navigation menu to include "Analytics" link
  - Ensure link is only visible to admin users
  - _Requirements: 9.6_

- [ ] 39. Checkpoint - Verify Phase 4 completion
  - Test metrics calculations with various date ranges
  - Test chart rendering with different view modes
  - Test export to PDF and Excel
  - Verify data accuracy against database
  - Ask user if any questions arise


### Phase 5: Enhanced Order Cancellation

- [ ] 40. Enhance Order model with cancellation fields
  - **Backend Suggestion**: Add cancellation_reason, cancellation_explanation, cancelled_at, cancelled_by, confirmed_at fields
  - **Backend Suggestion**: Add refund_status, refund_amount, refund_processed_at fields
  - **Backend Suggestion**: Add enum validation for cancellation_reason and refund_status
  - _Requirements: 13.5, 14.1, 14.2, 14.3, 14.4, 16.1, 16.2, 16.3_

- [ ] 41. Implement time-based cancellation logic in order service
  - **Backend Suggestion**: Modify `cancelOrder` method in `src/service/order.service.js`
  - **Backend Suggestion**: Add cancellation_time_limit configuration (default 5 minutes)
  - **Backend Suggestion**: Check time elapsed since confirmed_at for confirmed orders
  - **Backend Suggestion**: Allow cancellation within time window, reject outside window
  - **Backend Suggestion**: Bypass time check for admin users
  - **Backend Suggestion**: Record cancellation data (reason, timestamp, user)
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.5, 14.6, 14.7_

- [ ] 41.1 Write property test for time-based cancellation window enforcement
  - **Property 19: Time-Based Cancellation Window Enforcement**
  - **Validates: Requirements 13.2, 13.3, 13.4**
  - _Requirements: 13.2, 13.3, 13.4_

- [ ] 41.2 Write property test for admin cancellation bypass
  - **Property 20: Admin Cancellation Bypass**
  - **Validates: Requirements 13.6**
  - _Requirements: 13.6_

- [ ] 41.3 Write property test for cancellation state update completeness
  - **Property 21: Cancellation State Update Completeness**
  - **Validates: Requirements 13.5, 14.7**
  - _Requirements: 13.5, 14.7_

- [ ] 42. Implement conditional stock restoration logic
  - **Backend Suggestion**: In `cancelOrder`, check order status before restoring stock
  - **Backend Suggestion**: Restore stock for "confirmed" and "preparing" orders
  - **Backend Suggestion**: Skip restoration for "pending" orders (stock never deducted)
  - **Backend Suggestion**: Skip restoration for "delivered" orders (handle as refund)
  - **Backend Suggestion**: Ensure idempotency - restore stock only once
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 42.1 Write property test for conditional stock restoration
  - **Property 22: Conditional Stock Restoration Based on Status**
  - **Validates: Requirements 15.1, 15.4, 15.5**
  - _Requirements: 15.1, 15.4, 15.5_

- [ ] 42.2 Write property test for stock restoration transaction record
  - **Property 23: Stock Restoration Transaction Record**
  - **Validates: Requirements 15.2**
  - _Requirements: 15.2_

- [ ] 42.3 Write property test for stock restoration idempotency
  - **Property 24: Stock Restoration Idempotency**
  - **Validates: Requirements 15.3**
  - _Requirements: 15.3_

- [ ] 43. Implement refund status tracking
  - **Backend Suggestion**: In `cancelOrder`, set refund_status to "pending" if payment_status is "paid"
  - **Backend Suggestion**: Set refund_amount to order total_price
  - **Backend Suggestion**: Create method to update refund status manually by admin
  - _Requirements: 16.4, 16.7_

- [ ] 44. Update order cancellation API endpoint
  - **Backend Suggestion**: Modify POST `/orders/:id/cancel` endpoint
  - **Backend Suggestion**: Accept cancellation_reason and cancellation_explanation in request body
  - **Backend Suggestion**: Return updated order with cancellation and refund info
  - **Backend Suggestion**: Handle time window expiration errors
  - _Requirements: 14.4, 14.6_

- [ ] 45. Implement Cancel Order Modal component
  - Create `client/src/features/orders/components/CancelOrderModal.tsx`
  - Add radio buttons for cancellation reasons
  - Add text area for "other" reason explanation
  - Display time remaining for cancellation if applicable
  - Show refund information if order is paid
  - Add confirmation button
  - Handle API errors (time window expired, etc.)
  - _Requirements: 17.2, 17.3, 17.4, 17.5, 17.7_

- [ ] 46. Add Cancel Order button to Order Detail Page
  - Modify `client/src/features/orders/pages/OrderDetailPage.tsx`
  - Add "Cancel Order" button for cancellable orders
  - Show button only for pending/confirmed/preparing orders
  - Display remaining time for cancellation if applicable
  - Open CancelOrderModal on button click
  - _Requirements: 17.1, 17.2_

- [ ] 47. Display refund status on cancelled orders
  - Modify order detail and order list components
  - Show refund_status badge (pending, processing, completed, failed)
  - Display refund_amount
  - Show estimated refund time based on payment method
  - _Requirements: 16.5, 16.6_

- [ ] 48. Create admin refund management interface
  - Create `client/src/features/admin/components/RefundManagement.tsx`
  - Display list of orders with pending refunds
  - Allow admin to update refund status manually
  - Show refund processing history
  - _Requirements: 16.7_

- [ ] 49. Checkpoint - Verify Phase 5 completion
  - Test time-based cancellation within and outside window
  - Test admin can cancel at any time
  - Test stock restoration for different order statuses
  - Test refund status tracking
  - Verify cancellation reasons are recorded
  - Ask user if any questions arise

### Phase 6: Category Management

- [ ] 50. Create Category model (optional advanced feature)
  - **Backend Suggestion**: Create `src/models/category.model.js`
  - **Backend Suggestion**: Define schema with name, description, display_order, is_active, image_url
  - **Backend Suggestion**: Ensure unique category names
  - **Backend Suggestion**: Modify Product model to reference Category (or keep as string for simpler implementation)
  - _Requirements: 19.1, 19.2, 19.3_

- [ ] 51. Create category service for CRUD operations
  - **Backend Suggestion**: Create `src/service/category.service.js`
  - **Backend Suggestion**: Implement getAllCategories, createCategory, updateCategory methods
  - **Backend Suggestion**: Implement deleteCategory with product count check
  - **Backend Suggestion**: Soft delete by marking is_active: false
  - **Backend Suggestion**: Implement getCategoryAnalytics method
  - _Requirements: 19.4, 19.5, 19.6, 20.1, 20.2, 20.3_

- [ ] 51.1 Write property test for category deletion prevention
  - **Property 26: Category Deletion Prevention with Associated Products**
  - **Validates: Requirements 19.5**
  - _Requirements: 19.5_

- [ ] 51.2 Write property test for category analytics calculation
  - **Property 27: Category Analytics Calculation Accuracy**
  - **Validates: Requirements 20.1, 20.2, 20.3**
  - _Requirements: 20.1, 20.2, 20.3_

- [ ] 52. Create category API endpoints
  - **Backend Suggestion**: Create `src/controllers/category.controller.js`
  - **Backend Suggestion**: Add GET `/admin/categories` endpoint
  - **Backend Suggestion**: Add POST `/admin/categories` endpoint
  - **Backend Suggestion**: Add PUT `/admin/categories/:id` endpoint
  - **Backend Suggestion**: Add DELETE `/admin/categories/:id` endpoint
  - **Backend Suggestion**: Add GET `/admin/categories/analytics` endpoint
  - **Backend Suggestion**: Add routes with admin authentication
  - _Requirements: 19.4_

- [ ] 53. Implement Category Filter component
  - Create `client/src/features/admin/components/CategoryFilter.tsx`
  - Add dropdown with "All Categories" and individual categories
  - Display product count for each category
  - Persist selected category in component state or URL params
  - Trigger product list refresh on category change
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [ ] 53.1 Write property test for category filter correctness
  - **Property 25: Category Filter Correctness**
  - **Validates: Requirements 18.1, 18.2**
  - _Requirements: 18.1, 18.2_

- [ ] 54. Add category filter to Admin Products Page
  - Modify `client/src/features/admin/pages/AdminProductsPage.tsx`
  - Add CategoryFilter component above product list
  - Implement filtering logic to show only products in selected category
  - Update product count display
  - _Requirements: 18.1_

- [ ] 55. Implement Category Management Page component
  - Create `client/src/features/admin/pages/CategoryManagementPage.tsx`
  - Display categories in card or table layout
  - Add "Add Category" button
  - Implement drag-and-drop for reordering (display_order)
  - Add edit and delete buttons for each category
  - Show product count for each category
  - _Requirements: 19.7_

- [ ] 56. Create Category Form Modal component
  - Create `client/src/features/admin/components/CategoryFormModal.tsx`
  - Add form fields: name, description, image upload
  - Add validation for required fields
  - Support create and edit modes
  - Call API to save category
  - _Requirements: 19.4_

- [ ] 57. Implement Category Analytics component
  - Create `client/src/features/admin/components/CategoryAnalytics.tsx`
  - Display pie chart for revenue distribution by category
  - Display bar chart for order count by category
  - Add table with category performance metrics
  - Support sorting by revenue, order count, or average order value
  - _Requirements: 20.4, 20.5, 20.6, 20.7_

- [ ] 58. Add category analytics to Analytics Dashboard
  - Integrate CategoryAnalytics component into AnalyticsDashboardPage
  - Add as a separate section below main metrics
  - _Requirements: 20.4, 20.5_

- [ ] 59. Add navigation link to category management
  - Modify admin navigation menu to include "Categories" link
  - Ensure link is only visible to admin users
  - _Requirements: 19.4_

- [ ] 60. Checkpoint - Verify Phase 6 completion
  - Test category filtering on products page
  - Test category CRUD operations
  - Test category deletion prevention
  - Test category analytics calculations
  - Ask user if any questions arise


### Phase 7: Payment Gateway Integration

- [ ] 61. Create Payment model
  - **Backend Suggestion**: Create `src/models/payment.model.js`
  - **Backend Suggestion**: Define schema with order_id, amount, currency, payment_method, payment_gateway, gateway_transaction_id, status, timestamps, failure_reason, gateway_response
  - **Backend Suggestion**: Add enum validation for payment_method, payment_gateway, status
  - _Requirements: 21.1, 21.2, 21.3, 21.4_

- [ ] 62. Enhance Order model with payment fields
  - **Backend Suggestion**: Add payment_id and payment_status fields to order schema
  - **Backend Suggestion**: Add enum validation for payment_status
  - _Requirements: 21.5, 21.6_

- [ ] 63. Configure payment gateway selection
  - **Backend Suggestion**: Add PAYMENT_GATEWAY environment variable (stripe or razorpay)
  - **Backend Suggestion**: Add gateway credentials to .env (STRIPE_SECRET_KEY or RAZORPAY_KEY_ID/SECRET)
  - **Backend Suggestion**: Add gateway initialization in server startup
  - **Backend Suggestion**: Add credential validation on startup
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 64. Create payment service for gateway integration
  - **Backend Suggestion**: Create `src/service/payment.service.js`
  - **Backend Suggestion**: Install stripe and razorpay npm packages
  - **Backend Suggestion**: Implement `createPaymentIntent` method supporting both gateways
  - **Backend Suggestion**: Handle cash payment method (no gateway needed)
  - **Backend Suggestion**: Create Payment record with status "pending"
  - **Backend Suggestion**: Return gateway response with client secret
  - _Requirements: 22.6, 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 64.1 Write property test for payment record creation
  - **Property 28: Payment Record Creation on Order Payment**
  - **Validates: Requirements 23.4**
  - _Requirements: 23.4_

- [ ] 65. Implement webhook handling for payment confirmations
  - **Backend Suggestion**: Create webhook endpoint POST `/webhooks/payment`
  - **Backend Suggestion**: Implement signature verification for Stripe and Razorpay
  - **Backend Suggestion**: Handle payment success events (update Payment and Order status)
  - **Backend Suggestion**: Handle payment failure events (update Payment with failure reason)
  - **Backend Suggestion**: Implement idempotency to handle duplicate webhooks
  - **Backend Suggestion**: Add logging for all webhook events
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6_

- [ ] 65.1 Write property test for payment status synchronization
  - **Property 29: Payment Status Synchronization**
  - **Validates: Requirements 23.6, 24.3**
  - _Requirements: 23.6, 24.3_

- [ ] 65.2 Write property test for payment failure recording
  - **Property 30: Payment Failure Recording**
  - **Validates: Requirements 23.7, 24.4**
  - _Requirements: 23.7, 24.4_

- [ ] 65.3 Write property test for webhook idempotency
  - **Property 31: Webhook Idempotency**
  - **Validates: Requirements 24.6**
  - _Requirements: 24.6_

- [ ] 66. Implement refund processing through gateway
  - **Backend Suggestion**: Add `processRefund` method to payment service
  - **Backend Suggestion**: Support full and partial refunds
  - **Backend Suggestion**: Call gateway refund API (Stripe or Razorpay)
  - **Backend Suggestion**: Update Payment and Order status based on refund amount
  - **Backend Suggestion**: Record refund_processed_at timestamp
  - _Requirements: 25.1, 25.2, 25.3, 25.5, 25.6_

- [ ] 66.1 Write property test for refund amount calculation
  - **Property 32: Refund Amount Calculation**
  - **Validates: Requirements 25.5**
  - _Requirements: 25.5_

- [ ] 66.2 Write property test for refund status synchronization
  - **Property 33: Refund Status Synchronization**
  - **Validates: Requirements 25.3**
  - _Requirements: 25.3_

- [ ] 67. Implement invoice generation
  - **Backend Suggestion**: Install pdfkit or puppeteer for PDF generation
  - **Backend Suggestion**: Create `generateInvoice` method in payment service
  - **Backend Suggestion**: Include all required invoice data (order, customer, restaurant, payment details)
  - **Backend Suggestion**: Save PDF to uploads/invoices/ directory
  - **Backend Suggestion**: Return file path or URL
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ] 68. Implement invoice email delivery
  - **Backend Suggestion**: Integrate with email service (nodemailer or SendGrid)
  - **Backend Suggestion**: Send invoice PDF as attachment after payment completion
  - **Backend Suggestion**: Include order summary in email body
  - **Backend Suggestion**: Trigger email from webhook handler after payment success
  - _Requirements: 24.7, 26.8_

- [ ] 69. Create payment API endpoints
  - **Backend Suggestion**: Create `src/controllers/payment.controller.js`
  - **Backend Suggestion**: Add POST `/orders/:id/payment` endpoint to initiate payment
  - **Backend Suggestion**: Add GET `/orders/:id/invoice` endpoint to download invoice
  - **Backend Suggestion**: Add POST `/admin/orders/:id/refund` endpoint for admin refunds
  - **Backend Suggestion**: Add routes with appropriate authentication
  - _Requirements: 23.1, 25.1, 26.7_

- [ ] 70. Implement Payment Method Selection Page component
  - Create `client/src/features/orders/pages/PaymentSelectionPage.tsx`
  - Display order summary with total amount
  - Add payment method cards (card, UPI, wallet, cash)
  - Add icons and descriptions for each method
  - Highlight selected method
  - Add "Proceed to Payment" button
  - Handle "Pay Later" for cash option
  - _Requirements: 27.1, 27.2, 27.3, 27.8_

- [ ] 71. Integrate payment gateway SDKs in frontend
  - Install @stripe/stripe-js for Stripe integration
  - Install razorpay SDK for Razorpay integration
  - Create payment gateway wrapper utility
  - Implement Stripe payment confirmation flow
  - Implement Razorpay payment modal flow
  - _Requirements: 27.4_

- [ ] 72. Implement payment processing flow
  - In PaymentSelectionPage, call API to create payment intent
  - For online payments, redirect to gateway or open modal
  - Show loading indicator during payment processing
  - Handle payment success (redirect to success page)
  - Handle payment failure (show error, allow retry)
  - For cash payment, skip gateway and go directly to success page
  - _Requirements: 23.3, 23.5, 27.5, 27.7_

- [ ] 73. Create Payment Success Page component
  - Create `client/src/features/orders/pages/PaymentSuccessPage.tsx`
  - Display success icon and message
  - Show order details and payment confirmation
  - Add "Download Invoice" button
  - Add "View My Orders" button
  - Fetch and display invoice download link
  - _Requirements: 27.6_

- [ ] 74. Implement invoice download functionality
  - Create API call to fetch invoice PDF
  - Trigger browser download on button click
  - Handle download errors
  - Show loading state during download
  - _Requirements: 26.7_

- [ ] 75. Update order creation flow to include payment
  - Modify order creation to redirect to payment selection page
  - Pass order ID to payment page
  - Update order status after successful payment
  - _Requirements: 23.1, 23.2_

- [ ] 76. Create admin refund interface
  - Add "Process Refund" button to admin order detail page
  - Create refund confirmation modal
  - Support full and partial refund amounts
  - Show refund status after processing
  - Display refund history
  - _Requirements: 25.1, 25.4, 25.7_

- [ ] 77. Checkpoint - Verify Phase 7 completion
  - Test payment flow with Stripe/Razorpay in sandbox mode
  - Test cash payment option
  - Test webhook handling for payment confirmations
  - Test invoice generation and download
  - Test refund processing
  - Verify email delivery of invoices
  - Ask user if any questions arise


### Phase 8: Staff Management

- [ ] 78. Create Staff model
  - **Backend Suggestion**: Create `src/models/staff.model.js`
  - **Backend Suggestion**: Define schema with name, email, phone, role, employment_type, hire_date, status, hourly_rate, user_id, profile_image
  - **Backend Suggestion**: Add enum validation for role, employment_type, status
  - **Backend Suggestion**: Ensure unique email addresses
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7_

- [ ] 79. Create Shift model (optional feature)
  - **Backend Suggestion**: Create `src/models/shift.model.js`
  - **Backend Suggestion**: Define schema with staff_id, shift_date, start_time, end_time, break_duration, status, notes, clock_in_time, clock_out_time
  - **Backend Suggestion**: Add enum validation for status
  - **Backend Suggestion**: Prevent overlapping shifts for same staff member
  - _Requirements: 30.1, 30.2_

- [ ] 80. Enhance Order model with staff assignment
  - **Backend Suggestion**: Add assigned_staff field to order schema (ref: Staff)
  - _Requirements: 31.1_

- [ ] 81. Enhance User model with staff roles
  - **Backend Suggestion**: Extend role enum to include "manager", "chef", "waiter", "cashier"
  - _Requirements: 32.1_

- [ ] 82. Create staff service for CRUD operations
  - **Backend Suggestion**: Create `src/service/staff.service.js`
  - **Backend Suggestion**: Implement createStaff with email uniqueness check
  - **Backend Suggestion**: Implement getAllStaff with filtering (role, status, employment_type) and search
  - **Backend Suggestion**: Implement getStaffById, updateStaff methods
  - **Backend Suggestion**: Implement deleteStaff as soft delete (status: terminated)
  - **Backend Suggestion**: Implement getStaffPerformance method
  - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7, 31.6_

- [ ] 82.1 Write property test for staff email uniqueness
  - **Property 35: Staff Email Uniqueness**
  - **Validates: Requirements 29.1**
  - _Requirements: 29.1_

- [ ] 82.2 Write property test for staff soft delete behavior
  - **Property 36: Staff Soft Delete Behavior**
  - **Validates: Requirements 29.5**
  - _Requirements: 29.5_

- [ ] 82.3 Write property test for staff search correctness
  - **Property 37: Staff Search Correctness**
  - **Validates: Requirements 29.7**
  - _Requirements: 29.7_

- [ ] 82.4 Write property test for staff performance metrics accuracy
  - **Property 39: Staff Performance Metrics Accuracy**
  - **Validates: Requirements 31.6**
  - _Requirements: 31.6_

- [ ] 83. Create shift service for scheduling (optional)
  - **Backend Suggestion**: Create `src/service/shift.service.js`
  - **Backend Suggestion**: Implement createShift with overlap detection
  - **Backend Suggestion**: Implement getShifts with filtering by staff and date range
  - **Backend Suggestion**: Implement updateShift, deleteShift methods
  - **Backend Suggestion**: Implement copyWeekShifts method for duplicating schedules
  - _Requirements: 30.3, 30.4_

- [ ] 83.1 Write property test for shift overlap prevention
  - **Property 38: Shift Overlap Prevention**
  - **Validates: Requirements 30.3**
  - _Requirements: 30.3_

- [ ] 84. Implement permission system
  - **Backend Suggestion**: Create `src/middlewares/checkPermission.js`
  - **Backend Suggestion**: Define permission sets for each role (manager, chef, waiter, cashier)
  - **Backend Suggestion**: Implement middleware to check permissions before endpoint access
  - **Backend Suggestion**: Add permission checks to relevant routes
  - _Requirements: 32.2, 32.3_

- [ ] 84.1 Write property test for permission enforcement
  - **Property 40: Permission Enforcement**
  - **Validates: Requirements 32.3, 32.7**
  - _Requirements: 32.3, 32.7_

- [ ] 84.2 Write property test for role-based order access
  - **Property 41: Role-Based Order Access**
  - **Validates: Requirements 32.5**
  - _Requirements: 32.5_

- [ ] 85. Create staff API endpoints
  - **Backend Suggestion**: Create `src/controllers/staff.controller.js`
  - **Backend Suggestion**: Add GET `/admin/staff` endpoint with filtering and search
  - **Backend Suggestion**: Add POST `/admin/staff` endpoint
  - **Backend Suggestion**: Add GET `/admin/staff/:id` endpoint
  - **Backend Suggestion**: Add PUT `/admin/staff/:id` endpoint
  - **Backend Suggestion**: Add DELETE `/admin/staff/:id` endpoint (soft delete)
  - **Backend Suggestion**: Add GET `/admin/staff/:id/performance` endpoint
  - **Backend Suggestion**: Add routes with admin/manager authentication
  - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 31.6_

- [ ] 86. Create shift API endpoints (optional)
  - **Backend Suggestion**: Add GET `/admin/shifts` endpoint
  - **Backend Suggestion**: Add POST `/admin/shifts` endpoint
  - **Backend Suggestion**: Add PUT `/admin/shifts/:id` endpoint
  - **Backend Suggestion**: Add DELETE `/admin/shifts/:id` endpoint
  - **Backend Suggestion**: Add POST `/admin/shifts/copy-week` endpoint
  - **Backend Suggestion**: Add routes with admin/manager authentication
  - _Requirements: 30.4_

- [ ] 87. Update order API to support staff assignment
  - **Backend Suggestion**: Modify order update endpoint to accept assigned_staff field
  - **Backend Suggestion**: Add filtering by assigned_staff to order queries
  - _Requirements: 31.2, 31.5_

- [ ] 88. Implement Staff Directory Page component
  - Create `client/src/features/admin/pages/StaffDirectoryPage.tsx`
  - Display staff in card or table layout with photo, name, role, status
  - Add "Add Staff Member" button
  - Implement filters for role, status, employment type
  - Add search bar for name, email, or phone
  - Add click handler to navigate to staff detail page
  - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6_

- [ ] 89. Create Staff Card component
  - Create `client/src/features/admin/components/StaffCard.tsx`
  - Display staff photo, name, role, status
  - Add status badge with color coding
  - Add click handler for navigation
  - _Requirements: 33.2_

- [ ] 90. Create Staff Filters component
  - Create `client/src/features/admin/components/StaffFilters.tsx`
  - Add dropdowns for role, status, employment type
  - Add search input
  - Trigger filter change callback on selection
  - _Requirements: 33.3, 33.4_

- [ ] 91. Create Staff Form Modal component
  - Create `client/src/features/admin/components/StaffFormModal.tsx`
  - Add form fields: name, email, phone, role, employment_type, hire_date, hourly_rate
  - Add profile image upload
  - Add validation for required fields and formats
  - Support create and edit modes
  - Call API to save staff
  - Show success/error messages
  - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.6_

- [ ] 92. Implement Staff Detail Page component
  - Create `client/src/features/admin/pages/StaffDetailPage.tsx`
  - Display staff profile with all details
  - Add tabs for Performance, Shifts, Assigned Orders
  - Add "Edit" and "Delete" buttons
  - Show confirmation dialog before deletion
  - _Requirements: 33.6, 34.5_

- [ ] 93. Create Staff Profile component
  - Create `client/src/features/admin/components/StaffProfile.tsx`
  - Display staff photo, name, email, phone, role, employment type, hire date, status
  - Show hourly rate for managers
  - Add edit button
  - _Requirements: 33.7_

- [ ] 94. Create Performance Metrics component
  - Create `client/src/features/admin/components/PerformanceMetrics.tsx`
  - Add date range picker
  - Display metrics: total orders, completed orders, total revenue, avg completion time
  - Show metrics in card layout
  - Fetch data from API on date range change
  - _Requirements: 31.6, 33.7_

- [ ] 95. Create Shift Calendar component (optional)
  - Create `client/src/features/admin/components/ShiftCalendar.tsx`
  - Display weekly calendar grid (staff rows, day columns)
  - Show shifts as colored blocks with time labels
  - Add click handler to create new shift
  - Add click handler on shift to edit/delete
  - Highlight shift conflicts in red
  - _Requirements: 30.5, 35.2, 35.3, 35.7_

- [ ] 96. Implement Shift Scheduling Page component (optional)
  - Create `client/src/features/admin/pages/ShiftSchedulingPage.tsx`
  - Add week selector to navigate between weeks
  - Add "Copy Previous Week" button
  - Integrate ShiftCalendar component
  - Add shift creation/edit modal
  - _Requirements: 30.5, 35.1, 35.8_

- [ ] 97. Create Shift Form Modal component (optional)
  - Create `client/src/features/admin/components/ShiftFormModal.tsx`
  - Add form fields: staff, date, start_time, end_time, break_duration, notes
  - Add validation for time ranges and overlaps
  - Call API to save shift
  - Show conflict warnings
  - _Requirements: 35.4, 35.7_

- [ ] 98. Add staff assignment to order management
  - Modify admin order detail page
  - Add staff assignment dropdown
  - Fetch available staff from API
  - Call API to update order with assigned staff
  - Display assigned staff name on order cards in list
  - _Requirements: 31.2, 31.3, 31.4_

- [ ] 99. Create Assigned Orders List component
  - Create `client/src/features/admin/components/AssignedOrdersList.tsx`
  - Display orders assigned to specific staff member
  - Show order ID, customer, date, status, total
  - Add link to order detail page
  - _Requirements: 31.4_

- [ ] 100. Implement permission-based UI hiding
  - Create permission checking utility function
  - Modify navigation menu to hide links based on user role
  - Hide action buttons based on permissions
  - Show "Access Denied" message for unauthorized pages
  - _Requirements: 32.4_

- [ ] 101. Add navigation links for staff management
  - Modify admin navigation menu to include "Staff Directory" link
  - Add "Shift Scheduling" link (if implementing optional feature)
  - Ensure links are only visible to admin and manager users
  - _Requirements: 33.1_

- [ ] 102. Checkpoint - Verify Phase 8 completion
  - Test staff CRUD operations
  - Test staff search and filtering
  - Test shift scheduling and overlap prevention (if implemented)
  - Test staff assignment to orders
  - Test permission system for different roles
  - Verify performance metrics calculations
  - Ask user if any questions arise

### Final Integration and Testing

- [ ] 103. Run comprehensive test suite
  - Run all unit tests across backend and frontend
  - Run all property-based tests with 100+ iterations
  - Verify test coverage meets targets (80%+ for services)
  - Fix any failing tests
  - _Requirements: All_

- [ ] 104. Perform integration testing
  - Test complete user flows (order → payment → fulfillment)
  - Test admin workflows (inventory → analytics → staff)
  - Test error scenarios and edge cases
  - Verify data consistency across all operations
  - _Requirements: All_

- [ ] 105. Verify all 8 phases are complete
  - Phase 1: Date filtering and indexes working
  - Phase 2: Inventory management fully functional
  - Phase 3: Archival system operational
  - Phase 4: Analytics dashboard displaying correctly
  - Phase 5: Enhanced cancellation with refunds working
  - Phase 6: Category management functional
  - Phase 7: Payment gateway integrated and tested
  - Phase 8: Staff management operational
  - _Requirements: All_

- [ ] 106. Final checkpoint - Project completion
  - Review all implemented features with user
  - Demonstrate key functionality
  - Address any remaining questions or concerns
  - Provide documentation for backend suggestions
  - Confirm user satisfaction with implementation

## Notes

- **Backend Constraint**: All backend code changes are suggestions only. They must be reviewed and implemented by the user or their backend team.
- **Frontend Implementation**: All frontend tasks are implemented directly as part of this project.
- **Testing**: Tasks marked with `*` are optional test tasks. They can be skipped for faster MVP delivery but are recommended for production quality.
- **Phase Dependencies**: Phases must be completed in order (1 → 8) as later phases depend on earlier infrastructure.
- **Checkpoints**: Each phase includes a checkpoint task to verify completion before proceeding.
- **Property Tests**: Each property test references a specific property from the design document for traceability.
- **Requirements Traceability**: Each task references specific requirements for validation.
