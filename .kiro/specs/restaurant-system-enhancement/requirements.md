# Requirements Document: Restaurant Management System Enhancement

## Introduction

This document specifies requirements for enhancing an existing production-grade restaurant management system. The system currently supports user authentication, product management, cart operations, order processing, table management, reservations, and promo codes. This enhancement project adds 8 major phases including critical bug fixes, inventory management, data archival, analytics, enhanced order cancellation, category management, payment gateway integration, and staff management.

The system is built with Node.js/Express/MongoDB backend and React/TypeScript frontend using Zustand for state management. The enhancement follows a strict constraint: backend code modifications are provided as suggestions only, while frontend changes are implemented directly.

## Glossary

- **System**: The Restaurant Management System application (backend + frontend)
- **Backend**: Node.js/Express/MongoDB server application
- **Frontend**: React/TypeScript client application
- **Admin**: User with administrative privileges (role: "admin")
- **Customer**: Regular user with customer privileges (role: "customer")
- **Staff**: New user role for restaurant employees (chef, waiter, manager, cleaner)
- **Order**: A collection of products purchased by a customer
- **Product**: A menu item available for purchase
- **Inventory**: Stock tracking system for products
- **Stock_Quantity**: Current available quantity of a product
- **Low_Stock_Threshold**: Minimum quantity before low stock alert triggers
- **SKU**: Stock Keeping Unit - unique identifier for products
- **Inventory_Transaction**: Audit record of stock changes
- **Archived_Order**: Order moved to archive storage (1+ years old)
- **Fiscal_Year**: 12-month accounting period for data organization
- **Analytics_Dashboard**: Visual interface displaying business metrics
- **Cancellation_Window**: Time period during which order cancellation is allowed
- **Payment_Gateway**: Third-party service for processing payments (Stripe/Razorpay)
- **Payment_Method**: Method of payment (card, UPI, cash, wallet)
- **Invoice**: Payment receipt document
- **Webhook**: HTTP callback for async payment notifications
- **Refund**: Return of payment to customer
- **Category**: Product classification (appetizers, mains, desserts, beverages)
- **Shift**: Work period assigned to staff members
- **Permission**: Access control rule for system features
- **Cron_Job**: Scheduled automated task

## Requirements

### Requirement 1: Critical System Fixes

**User Story:** As a system administrator, I want critical bugs fixed and performance optimized, so that the system operates reliably and efficiently.

#### Acceptance Criteria

1. WHEN an admin filters orders by date range (startDate and endDate parameters), THE System SHALL return only orders within that date range

### Requirement 2: Inventory Management - Data Model

**User Story:** As a restaurant manager, I want to track product inventory, so that I can prevent stockouts and manage supply efficiently.

#### Acceptance Criteria

1. THE Product model SHALL include a stock_quantity field (type: Number, default: 0, min: 0)
2. THE Product model SHALL include a low_stock_threshold field (type: Number, default: 10, min: 0)
3. THE Product model SHALL include a sku field (type: String, unique: true, required: true)
4. THE System SHALL create an InventoryTransaction model with fields: product_id, transaction_type, quantity_change, previous_quantity, new_quantity, reason, performed_by, timestamp
5. THE InventoryTransaction model SHALL support transaction types: "restock", "deduction", "adjustment", "return"
6. WHEN a product is created, THE System SHALL generate a unique SKU if not provided

### Requirement 3: Inventory Management - Stock Operations

**User Story:** As a restaurant manager, I want stock to automatically deduct when orders are confirmed, so that inventory stays accurate without manual updates.

#### Acceptance Criteria

1. WHEN an order status changes to "confirmed", THE System SHALL deduct stock_quantity for each product in the order
2. WHEN stock deduction occurs, THE System SHALL create an InventoryTransaction record with transaction_type "deduction"
3. IF a product has insufficient stock (stock_quantity < order quantity), THEN THE System SHALL prevent order confirmation and return error message "Insufficient stock for [product_name]"
4. WHEN an order is cancelled, THE System SHALL restore stock_quantity for each product in the order
5. WHEN stock restoration occurs, THE System SHALL create an InventoryTransaction record with transaction_type "return"
6. THE System SHALL ensure stock_quantity never becomes negative

### Requirement 4: Inventory Management - Low Stock Alerts

**User Story:** As a restaurant manager, I want to receive alerts when products are running low, so that I can restock before running out.

#### Acceptance Criteria

1. WHEN stock_quantity falls below or equals low_stock_threshold, THE System SHALL mark the product as "low stock"
2. THE System SHALL provide an API endpoint to retrieve all low stock products
3. WHEN an admin requests low stock products, THE System SHALL return products where stock_quantity <= low_stock_threshold
4. THE Frontend SHALL display a low stock badge on products in the admin product list
5. THE Frontend SHALL display a low stock alerts section in the admin dashboard
6. WHEN a low stock alert is displayed, THE System SHALL show product name, current stock, and threshold

### Requirement 5: Inventory Management - Stock Management UI

**User Story:** As a restaurant manager, I want a UI to manage inventory, so that I can easily update stock levels and view inventory status.

#### Acceptance Criteria

1. THE Frontend SHALL provide a stock management page accessible only to admins
2. WHEN an admin views the stock management page, THE System SHALL display all products with their stock_quantity, low_stock_threshold, and SKU
3. THE Frontend SHALL provide a form to update stock_quantity for a product
4. WHEN an admin updates stock_quantity, THE System SHALL create an InventoryTransaction record with transaction_type "adjustment"
5. THE Frontend SHALL provide a form to update low_stock_threshold for a product
6. THE Frontend SHALL display an inventory transaction history for each product
7. THE Frontend SHALL allow filtering inventory by low stock status
8. THE Frontend SHALL allow searching inventory by product name or SKU

### Requirement 6: Data Archival Strategy - Data Model

**User Story:** As a system administrator, I want to archive old orders, so that the active database remains performant while preserving historical data.

#### Acceptance Criteria

1. THE Order model SHALL include an is_archived field (type: Boolean, default: false)
2. THE Order model SHALL include an archived_at field (type: Date, default: null)
3. THE Order model SHALL include a fiscal_year field (type: String, default: null)
4. WHEN an order is archived, THE System SHALL set is_archived to true, archived_at to current timestamp, and fiscal_year to the order's year

### Requirement 7: Data Archival Strategy - Archival Process

**User Story:** As a system administrator, I want orders older than 1 year to be automatically archived monthly, so that the system maintains optimal performance.

#### Acceptance Criteria

1. THE System SHALL implement a monthly cron job that runs on the 1st day of each month at 2:00 AM
2. WHEN the archival cron job runs, THE System SHALL identify all orders where createdAt is more than 1 year old and is_archived is false
3. WHEN orders are identified for archival, THE System SHALL update is_archived to true, set archived_at to current timestamp, and set fiscal_year
4. THE System SHALL log the number of orders archived in each cron job execution
5. THE System SHALL send a notification to admins after archival completion with count of archived orders
6. IF the archival process fails, THEN THE System SHALL log the error and retry on the next scheduled run

### Requirement 8: Data Archival Strategy - Archived Orders Access

**User Story:** As an admin, I want to view archived orders separately from active orders, so that I can access historical data when needed without cluttering active order views.

#### Acceptance Criteria

1. WHEN querying orders, THE System SHALL exclude archived orders (is_archived: false) by default
2. THE System SHALL provide an API endpoint to retrieve archived orders with pagination
3. THE Frontend SHALL provide an "Archived Orders" page accessible only to admins
4. WHEN an admin views archived orders, THE System SHALL display orders with is_archived: true
5. THE Frontend SHALL allow filtering archived orders by fiscal_year
6. THE Frontend SHALL allow searching archived orders by order ID or customer name
7. THE Frontend SHALL display archived_at timestamp for each archived order

### Requirement 9: Analytics Dashboard - Daily Metrics

**User Story:** As a restaurant manager, I want to view daily business metrics, so that I can monitor performance and make informed decisions.

#### Acceptance Criteria

1. THE System SHALL calculate total orders count for a given date range
2. THE System SHALL calculate total revenue (sum of order total_price) for a given date range
3. THE System SHALL calculate average order value (total revenue / total orders) for a given date range
4. THE System SHALL identify top 10 selling products by quantity for a given date range
5. THE System SHALL identify top 10 selling products by revenue for a given date range
6. THE System SHALL provide an API endpoint to retrieve daily metrics with date range parameters
7. WHEN calculating metrics, THE System SHALL exclude cancelled orders
8. WHEN calculating metrics, THE System SHALL exclude archived orders unless explicitly requested

### Requirement 10: Analytics Dashboard - Trends and Charts

**User Story:** As a restaurant manager, I want to view sales trends over time, so that I can identify patterns and plan accordingly.

#### Acceptance Criteria

1. THE System SHALL provide daily sales data (date, order count, revenue) for a given date range
2. THE System SHALL provide weekly sales data aggregated by week for a given date range
3. THE System SHALL provide monthly sales data aggregated by month for a given date range
4. THE Frontend SHALL display a line chart showing revenue trends over time
5. THE Frontend SHALL display a bar chart showing order count trends over time
6. THE Frontend SHALL allow switching between daily, weekly, and monthly views
7. THE Frontend SHALL display a pie chart showing revenue distribution by product category
8. THE Frontend SHALL display a table showing top selling products with quantity and revenue

### Requirement 11: Analytics Dashboard - Inventory Reports

**User Story:** As a restaurant manager, I want to view inventory movement reports, so that I can understand stock usage patterns.

#### Acceptance Criteria

1. THE System SHALL provide inventory movement data showing stock changes over time for each product
2. THE System SHALL calculate total stock deductions by product for a given date range
3. THE System SHALL calculate total stock additions (restocks) by product for a given date range
4. THE Frontend SHALL display an inventory movement chart showing stock levels over time
5. THE Frontend SHALL display a list of products with highest stock deductions
6. THE Frontend SHALL display a list of products approaching low stock threshold
7. THE Frontend SHALL allow filtering inventory reports by product category

### Requirement 12: Analytics Dashboard - Data Export

**User Story:** As a restaurant manager, I want to export analytics data, so that I can use it in external tools or share with stakeholders.

#### Acceptance Criteria

1. THE Frontend SHALL provide an "Export to PDF" button on the analytics dashboard
2. WHEN an admin clicks "Export to PDF", THE System SHALL generate a PDF report containing current dashboard data
3. THE Frontend SHALL provide an "Export to Excel" button on the analytics dashboard
4. WHEN an admin clicks "Export to Excel", THE System SHALL generate an Excel file containing current dashboard data
5. THE exported PDF SHALL include charts, tables, and summary metrics
6. THE exported Excel SHALL include raw data in tabular format with proper column headers
7. THE System SHALL include date range and generation timestamp in exported files

### Requirement 13: Enhanced Order Cancellation - Time-Based Rules

**User Story:** As a customer, I want to cancel confirmed orders within a time limit, so that I can change my mind shortly after ordering.

#### Acceptance Criteria

1. THE System SHALL define a cancellation_time_limit configuration value (default: 5 minutes)
2. WHEN a customer attempts to cancel an order with status "confirmed", THE System SHALL check if current time is within cancellation_time_limit from order confirmation time
3. IF current time is within cancellation_time_limit, THEN THE System SHALL allow cancellation
4. IF current time exceeds cancellation_time_limit, THEN THE System SHALL reject cancellation with message "Cancellation window has expired"
5. WHEN an order is cancelled, THE System SHALL update status to "cancelled" and record cancellation_timestamp
6. THE System SHALL allow admins to cancel orders at any time regardless of time limit

### Requirement 14: Enhanced Order Cancellation - Cancellation Tracking

**User Story:** As a restaurant manager, I want to track why orders are cancelled, so that I can identify and address common issues.

#### Acceptance Criteria

1. THE Order model SHALL include a cancellation_reason field (type: String, default: null)
2. THE Order model SHALL include a cancelled_at field (type: Date, default: null)
3. THE Order model SHALL include a cancelled_by field (type: ObjectId, ref: 'User', default: null)
4. WHEN an order is cancelled, THE System SHALL require a cancellation_reason
5. THE System SHALL support predefined cancellation reasons: "changed_mind", "wrong_order", "too_expensive", "long_wait_time", "other"
6. WHEN cancellation_reason is "other", THE System SHALL allow a custom text explanation
7. THE System SHALL record cancelled_at timestamp and cancelled_by user ID when order is cancelled

### Requirement 15: Enhanced Order Cancellation - Inventory Restoration

**User Story:** As a restaurant manager, I want inventory automatically restored when orders are cancelled, so that stock levels remain accurate.

#### Acceptance Criteria

1. WHEN an order with status "confirmed" or "preparing" is cancelled, THE System SHALL restore stock_quantity for each product in the order
2. WHEN stock restoration occurs, THE System SHALL create an InventoryTransaction record with transaction_type "return" and reason "order_cancelled"
3. THE System SHALL ensure stock restoration only occurs once per order cancellation
4. WHEN an order with status "pending" is cancelled, THE System SHALL NOT restore stock (stock was never deducted)
5. WHEN an order with status "delivered" is cancelled, THE System SHALL handle as a refund case without stock restoration

### Requirement 16: Enhanced Order Cancellation - Refund Tracking

**User Story:** As a customer, I want to know the refund status when I cancel an order, so that I can track when I'll receive my money back.

#### Acceptance Criteria

1. THE Order model SHALL include a refund_status field (type: String, enum: ["not_applicable", "pending", "processing", "completed", "failed"], default: "not_applicable")
2. THE Order model SHALL include a refund_amount field (type: Number, default: 0)
3. THE Order model SHALL include a refund_processed_at field (type: Date, default: null)
4. WHEN a paid order is cancelled, THE System SHALL set refund_status to "pending" and refund_amount to order total_price
5. THE Frontend SHALL display refund status on cancelled orders
6. THE Frontend SHALL display estimated refund time based on payment method
7. THE System SHALL allow admins to update refund_status manually

### Requirement 17: Enhanced Order Cancellation - Frontend UI

**User Story:** As a customer, I want a clear cancellation interface, so that I can easily cancel orders when needed.

#### Acceptance Criteria

1. THE Frontend SHALL display a "Cancel Order" button on order detail page for cancellable orders
2. WHEN cancellation time limit applies, THE Frontend SHALL display remaining time for cancellation
3. WHEN a customer clicks "Cancel Order", THE Frontend SHALL display a modal with cancellation reason options
4. THE Frontend SHALL require selection of a cancellation reason before confirming cancellation
5. WHEN cancellation_reason is "other", THE Frontend SHALL display a text input for custom explanation
6. THE Frontend SHALL display a confirmation message after successful cancellation
7. THE Frontend SHALL display refund information after cancellation if payment was made

### Requirement 18: Category Management - Admin Filtering

**User Story:** As an admin, I want to filter products by category, so that I can manage products more efficiently.

#### Acceptance Criteria

1. THE Frontend SHALL display a category filter dropdown on the admin products page
2. WHEN an admin selects a category, THE Frontend SHALL display only products in that category
3. THE Frontend SHALL include an "All Categories" option to show all products
4. THE Frontend SHALL display the count of products in each category in the dropdown
5. THE Frontend SHALL persist the selected category filter when navigating away and returning
6. THE Frontend SHALL update the product list immediately when category filter changes

### Requirement 19: Category Management - Category Model (Optional)

**User Story:** As an admin, I want to manage product categories centrally, so that I can maintain consistent categorization across the system.

#### Acceptance Criteria

1. THE System SHALL create a Category model with fields: name, description, display_order, is_active, image_url
2. THE Category model SHALL ensure unique category names (case-insensitive)
3. THE Product model SHALL reference Category model instead of storing category as string
4. THE System SHALL provide API endpoints for CRUD operations on categories
5. THE System SHALL prevent deletion of categories that have associated products
6. THE System SHALL allow marking categories as inactive instead of deleting
7. THE Frontend SHALL display categories in order specified by display_order field

### Requirement 20: Category Management - Category Analytics

**User Story:** As a restaurant manager, I want to view sales analytics by category, so that I can understand which categories perform best.

#### Acceptance Criteria

1. THE System SHALL calculate total revenue by category for a given date range
2. THE System SHALL calculate total orders by category for a given date range
3. THE System SHALL calculate average order value by category for a given date range
4. THE Frontend SHALL display a pie chart showing revenue distribution by category
5. THE Frontend SHALL display a bar chart showing order count by category
6. THE Frontend SHALL display a table with category performance metrics
7. THE Frontend SHALL allow sorting categories by revenue, order count, or average order value

### Requirement 21: Payment Gateway Integration - Payment Model

**User Story:** As a system administrator, I want a structured payment data model, so that payment information is properly tracked and auditable.

#### Acceptance Criteria

1. THE System SHALL create a Payment model with fields: order_id, amount, currency, payment_method, payment_gateway, gateway_transaction_id, status, payment_initiated_at, payment_completed_at, failure_reason
2. THE Payment model SHALL support payment statuses: "pending", "processing", "completed", "failed", "refunded", "partially_refunded"
3. THE Payment model SHALL support payment methods: "card", "upi", "cash", "wallet", "net_banking"
4. THE Payment model SHALL support payment gateways: "stripe", "razorpay", "cash"
5. THE Order model SHALL include a payment_id field (type: ObjectId, ref: 'Payment', default: null)
6. THE Order model SHALL include a payment_status field (type: String, enum: ["unpaid", "paid", "refunded", "partially_refunded"], default: "unpaid")

### Requirement 22: Payment Gateway Integration - Gateway Selection

**User Story:** As a system administrator, I want to configure which payment gateway to use, so that I can choose the best option for my region and requirements.

#### Acceptance Criteria

1. THE System SHALL support configuration of payment gateway via environment variable (PAYMENT_GATEWAY: "stripe" or "razorpay")
2. THE System SHALL load appropriate gateway credentials from environment variables
3. THE System SHALL initialize the selected payment gateway on application startup
4. THE System SHALL validate gateway credentials on initialization
5. IF gateway credentials are invalid, THEN THE System SHALL log error and disable online payments
6. THE System SHALL always support "cash" payment method regardless of gateway configuration

### Requirement 23: Payment Gateway Integration - Payment Processing

**User Story:** As a customer, I want to pay for orders using my preferred payment method, so that I can complete purchases conveniently.

#### Acceptance Criteria

1. WHEN a customer creates an order, THE Frontend SHALL display payment method selection
2. THE Frontend SHALL display available payment methods based on gateway configuration
3. WHEN a customer selects a card/UPI/wallet payment method, THE System SHALL create a payment intent with the payment gateway
4. THE System SHALL create a Payment record with status "pending" when payment is initiated
5. THE Frontend SHALL redirect customer to payment gateway interface for payment completion
6. WHEN payment is completed, THE System SHALL update Payment status to "completed" and Order payment_status to "paid"
7. WHEN payment fails, THE System SHALL update Payment status to "failed" and record failure_reason

### Requirement 24: Payment Gateway Integration - Webhook Handling

**User Story:** As a system administrator, I want payment status updates handled asynchronously via webhooks, so that payment confirmations are reliable even if the customer closes their browser.

#### Acceptance Criteria

1. THE System SHALL implement a webhook endpoint for payment gateway callbacks
2. THE System SHALL verify webhook signatures to ensure authenticity
3. WHEN a payment success webhook is received, THE System SHALL update Payment status to "completed" and Order payment_status to "paid"
4. WHEN a payment failure webhook is received, THE System SHALL update Payment status to "failed"
5. THE System SHALL log all webhook events for audit purposes
6. THE System SHALL handle duplicate webhook events idempotently
7. THE System SHALL send email notification to customer after payment confirmation

### Requirement 25: Payment Gateway Integration - Refund Processing

**User Story:** As an admin, I want to process refunds through the payment gateway, so that customers receive their money back when orders are cancelled.

#### Acceptance Criteria

1. WHEN an admin initiates a refund for a paid order, THE System SHALL create a refund request with the payment gateway
2. THE System SHALL update Order refund_status to "processing" when refund is initiated
3. WHEN refund is successful, THE System SHALL update Order refund_status to "completed" and payment_status to "refunded"
4. WHEN refund fails, THE System SHALL update Order refund_status to "failed" and log the error
5. THE System SHALL support partial refunds by specifying refund amount
6. THE System SHALL record refund_processed_at timestamp when refund completes
7. THE System SHALL send email notification to customer after refund completion

### Requirement 26: Payment Gateway Integration - Invoice Generation

**User Story:** As a customer, I want to receive an invoice after payment, so that I have a record of my purchase for accounting purposes.

#### Acceptance Criteria

1. WHEN an order payment is completed, THE System SHALL generate an invoice PDF
2. THE invoice SHALL include order details: order ID, date, items, quantities, prices, subtotal, discounts, total
3. THE invoice SHALL include customer details: name, email, phone, address
4. THE invoice SHALL include restaurant details: name, address, phone, tax ID
5. THE invoice SHALL include payment details: payment method, transaction ID, payment date
6. THE System SHALL store invoice PDF in a secure location accessible by the customer
7. THE Frontend SHALL provide a "Download Invoice" button on paid orders
8. THE System SHALL send invoice PDF as email attachment to customer after payment

### Requirement 27: Payment Gateway Integration - Frontend Payment Flow

**User Story:** As a customer, I want a smooth payment experience, so that I can complete purchases quickly and confidently.

#### Acceptance Criteria

1. THE Frontend SHALL display a payment method selection page after order creation
2. THE Frontend SHALL display payment method icons and descriptions
3. WHEN a customer selects an online payment method, THE Frontend SHALL display payment amount and order summary
4. THE Frontend SHALL integrate payment gateway SDK for seamless payment experience
5. THE Frontend SHALL display a loading indicator during payment processing
6. WHEN payment is successful, THE Frontend SHALL display a success page with order details and invoice download link
7. WHEN payment fails, THE Frontend SHALL display an error message and allow retry
8. THE Frontend SHALL provide a "Pay Later" option for cash payment method

### Requirement 28: Staff Management - Staff Model

**User Story:** As a restaurant manager, I want to manage staff information, so that I can track employees and their roles.

#### Acceptance Criteria

1. THE System SHALL create a Staff model with fields: name, email, phone, role, employment_type, hire_date, status, hourly_rate, user_id
2. THE Staff model SHALL support roles: "manager", "chef", "waiter", "cleaner", "cashier", "delivery_driver"
3. THE Staff model SHALL support employment types: "full_time", "part_time", "contract"
4. THE Staff model SHALL support statuses: "active", "inactive", "on_leave", "terminated"
5. THE Staff model SHALL include an optional user_id field to link staff to User accounts
6. THE Staff model SHALL ensure unique email addresses
7. THE Staff model SHALL include timestamps for created_at and updated_at

### Requirement 29: Staff Management - Staff CRUD Operations

**User Story:** As a restaurant manager, I want to create, view, update, and delete staff records, so that I can maintain accurate employee information.

#### Acceptance Criteria

1. THE System SHALL provide an API endpoint to create new staff records
2. THE System SHALL provide an API endpoint to retrieve all staff with pagination
3. THE System SHALL provide an API endpoint to retrieve a single staff record by ID
4. THE System SHALL provide an API endpoint to update staff records
5. THE System SHALL provide an API endpoint to delete staff records (soft delete by setting status to "terminated")
6. THE System SHALL allow filtering staff by role, status, and employment_type
7. THE System SHALL allow searching staff by name, email, or phone

### Requirement 30: Staff Management - Shift Scheduling (Optional)

**User Story:** As a restaurant manager, I want to schedule staff shifts, so that I can ensure adequate coverage during operating hours.

#### Acceptance Criteria

1. THE System SHALL create a Shift model with fields: staff_id, shift_date, start_time, end_time, break_duration, status, notes
2. THE Shift model SHALL support statuses: "scheduled", "in_progress", "completed", "cancelled", "no_show"
3. THE System SHALL prevent overlapping shifts for the same staff member
4. THE System SHALL provide API endpoints for CRUD operations on shifts
5. THE Frontend SHALL display a weekly shift calendar view
6. THE Frontend SHALL allow drag-and-drop shift scheduling
7. THE Frontend SHALL display shift conflicts and warnings

### Requirement 31: Staff Management - Staff Assignment to Orders

**User Story:** As a restaurant manager, I want to assign staff to orders, so that I can track who is responsible for each order.

#### Acceptance Criteria

1. THE Order model SHALL include an assigned_staff field (type: ObjectId, ref: 'Staff', default: null)
2. THE System SHALL allow admins to assign staff to orders
3. THE Frontend SHALL display a staff assignment dropdown on order detail page for admins
4. THE Frontend SHALL display assigned staff name on order cards in admin order list
5. THE System SHALL allow filtering orders by assigned staff
6. THE System SHALL track staff performance metrics (orders handled, average completion time)

### Requirement 32: Staff Management - Permission System

**User Story:** As a system administrator, I want granular permission control, so that staff members only access features relevant to their role.

#### Acceptance Criteria

1. THE System SHALL extend the User model role enum to include staff roles: "manager", "chef", "waiter", "cashier"
2. THE System SHALL define permission sets for each role (e.g., chef can view orders but not modify prices)
3. THE System SHALL implement middleware to check permissions before allowing access to endpoints
4. THE Frontend SHALL hide UI elements that the current user doesn't have permission to access
5. THE System SHALL allow managers to view all orders, chefs to view kitchen orders, waiters to view their assigned orders
6. THE System SHALL allow cashiers to process payments but not modify orders
7. THE System SHALL log all permission-denied attempts for security auditing

### Requirement 33: Staff Management - Frontend Staff Directory

**User Story:** As a restaurant manager, I want a staff directory interface, so that I can easily view and manage all employees.

#### Acceptance Criteria

1. THE Frontend SHALL provide a staff directory page accessible only to admins and managers
2. THE Frontend SHALL display staff in a card or table layout with photo, name, role, and status
3. THE Frontend SHALL provide filters for role, status, and employment type
4. THE Frontend SHALL provide a search bar to find staff by name, email, or phone
5. THE Frontend SHALL display a "Add New Staff" button that opens a staff creation form
6. THE Frontend SHALL allow clicking on a staff card to view detailed information
7. THE Frontend SHALL display staff performance metrics on detail page

### Requirement 34: Staff Management - Staff CRUD Forms

**User Story:** As a restaurant manager, I want intuitive forms to add and edit staff, so that I can quickly update employee information.

#### Acceptance Criteria

1. THE Frontend SHALL provide a staff creation form with fields: name, email, phone, role, employment_type, hire_date, hourly_rate
2. THE Frontend SHALL validate all required fields before submission
3. THE Frontend SHALL validate email format and phone number format
4. THE Frontend SHALL provide a staff edit form pre-populated with existing data
5. THE Frontend SHALL display a confirmation dialog before deleting staff
6. THE Frontend SHALL show success/error messages after form submission
7. THE Frontend SHALL redirect to staff detail page after successful creation

### Requirement 35: Staff Management - Shift Scheduling UI (Optional)

**User Story:** As a restaurant manager, I want a visual shift scheduling interface, so that I can easily plan staff coverage.

#### Acceptance Criteria

1. THE Frontend SHALL provide a shift scheduling page with weekly calendar view
2. THE Frontend SHALL display staff names on the left and days of the week across the top
3. THE Frontend SHALL allow clicking on a time slot to create a new shift
4. THE Frontend SHALL display a shift creation modal with fields: staff, date, start_time, end_time, break_duration
5. THE Frontend SHALL display existing shifts as colored blocks on the calendar
6. THE Frontend SHALL allow clicking on a shift to edit or delete it
7. THE Frontend SHALL highlight shift conflicts in red
8. THE Frontend SHALL provide a "Copy Previous Week" button to duplicate shift patterns
