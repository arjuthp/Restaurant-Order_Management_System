# Design Document: Restaurant Management System Enhancement

## Overview

This design document outlines the technical implementation for enhancing an existing restaurant management system with 8 major feature phases. The system follows a strict architectural constraint: backend modifications are provided as suggestions only (never implemented directly), while frontend changes are implemented directly.

The enhancement adds critical bug fixes, comprehensive inventory management, automated data archival, business analytics, enhanced order cancellation with refunds, category management, payment gateway integration, and staff management with permissions.

### Technology Stack

**Backend (Suggestions Only):**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT authentication with refresh tokens
- Node-cron for scheduled tasks
- Payment gateway SDKs (Stripe/Razorpay)

**Frontend (Direct Implementation):**
- React 18 with TypeScript
- Zustand for state management
- Vite for build tooling
- Recharts for analytics visualization
- React Router for navigation
- Axios for API communication

### Design Principles

1. **Backend Constraint**: All backend code changes are documented as suggestions in chat, never implemented directly
2. **Incremental Enhancement**: Each phase builds on previous phases without breaking existing functionality
3. **Data Integrity**: All stock operations and payment transactions maintain ACID properties
4. **Performance**: Query optimization for sub-second response times
5. **Audit Trail**: Complete transaction history for inventory and payments
6. **User Experience**: Intuitive interfaces with real-time feedback and error handling

## Architecture

### System Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  React/TypeScript + Zustand + Recharts + React Router   │
└─────────────────────────────────────────────────────────┘
                           │
                    HTTPS/REST API
                           │
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                         │
│    Express.js + JWT Auth + Business Logic + Cron        │
└─────────────────────────────────────────────────────────┘
                           │
                    Mongoose ODM
                           │
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│              MongoDB + Transactions                      │
└─────────────────────────────────────────────────────────┘
                           │
                    External Services
                           │
┌─────────────────────────────────────────────────────────┐
│              Payment Gateway (Stripe/Razorpay)           │
│              Email Service (SMTP/SendGrid)               │
│              PDF Generation (PDFKit/Puppeteer)           │
└─────────────────────────────────────────────────────────┘
```

### Phase Implementation Order


Phases are designed to be implemented sequentially, with each phase building on the previous:

1. **Phase 1 (Critical Fixes)**: Foundation - fixes bugs and optimizes performance
2. **Phase 2 (Inventory)**: Core feature - enables stock tracking
3. **Phase 3 (Archival)**: Performance - maintains system speed as data grows
4. **Phase 4 (Analytics)**: Business intelligence - provides insights
5. **Phase 5 (Cancellation)**: Customer experience - improves order management
6. **Phase 6 (Categories)**: Organization - enhances product management
7. **Phase 7 (Payments)**: Revenue - enables online transactions
8. **Phase 8 (Staff)**: Operations - manages workforce

### Data Flow Patterns

**Inventory Deduction Flow:**
```
Order Status Change → Validate Stock → Deduct Stock → Create Transaction Record → Update Order
```

**Payment Processing Flow:**
```
Order Creation → Payment Method Selection → Gateway Integration → Webhook Confirmation → Invoice Generation → Email Notification
```

**Archival Flow:**
```
Cron Trigger → Query Old Orders → Update Archive Flags → Log Results → Notify Admins
```

## Components and Interfaces

### Phase 1: Critical Fixes

#### Backend Suggestions

**Order Service Enhancement (order.service.js):**
```javascript
// Suggestion: Add date filtering to getAllOrders and getMyOrders methods
async getAllOrders(queryParams = {}) {
  const filter = {};
  
  // Add status filter
  if (queryParams.status) {
    filter.status = queryParams.status;
  }
  
  // FIX: Add date range filtering
  if (queryParams.startDate || queryParams.endDate) {
    filter.createdAt = {};
    if (queryParams.startDate) {
      filter.createdAt.$gte = new Date(queryParams.startDate);
    }
    if (queryParams.endDate) {
      // Set to end of day
      const endDate = new Date(queryParams.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }
  
  // ... rest of method
}
```


#### Frontend Implementation

No frontend changes required for Phase 1. The date filtering will be used by admin order management pages in later phases.

### Phase 2: Inventory Management

#### Backend Suggestions

**Enhanced Product Model (product.model.js):**
```javascript
// Suggestion: Add inventory fields to Product schema
const productSchema = new mongoose.Schema({
  // ... existing fields
  stock_quantity: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  low_stock_threshold: {
    type: Number,
    default: 10,
    min: 0,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  }
}, { timestamps: true });

// Auto-generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});
```


**New InventoryTransaction Model:**
```javascript
// Suggestion: Create new model for inventory audit trail
// File: src/models/inventoryTransaction.model.js

const inventoryTransactionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  transaction_type: {
    type: String,
    enum: ['restock', 'deduction', 'adjustment', 'return'],
    required: true
  },
  quantity_change: {
    type: Number,
    required: true
  },
  previous_quantity: {
    type: Number,
    required: true
  },
  new_quantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  performed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
```

**Inventory Service:**
```javascript
// Suggestion: Create inventory service
// File: src/service/inventory.service.js

class InventoryService {
  async deductStock(orderId, userId) {
    const order = await Order.findById(orderId).populate('items.product_id');
    
    // Start MongoDB transaction for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      for (const item of order.items) {
        const product = await Product.findById(item.product_id);
        
        // Check stock availability
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        const previousQty = product.stock_quantity;
        const newQty = previousQty - item.quantity;
        
        // Update product stock
        product.stock_quantity = newQty;
        await product.save({ session });
        
        // Create transaction record
        await InventoryTransaction.create([{
          product_id: product._id,
          transaction_type: 'deduction',
          quantity_change: -item.quantity,
          previous_quantity: previousQty,
          new_quantity: newQty,
          reason: 'order_confirmed',
          performed_by: userId,
          order_id: orderId
        }], { session });
      }
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  async restoreStock(orderId, userId, reason = 'order_cancelled') {
    // Similar implementation with transaction_type: 'return'
  }
  
  async getLowStockProducts() {
    return await Product.find({
      $expr: { $lte: ['$stock_quantity', '$low_stock_threshold'] },
      is_deleted: false
    }).sort({ stock_quantity: 1 });
  }
}
```


**Order Service Enhancement:**
```javascript
// Suggestion: Modify updateOrderStatus to handle inventory
async updateOrderStatus(orderId, newStatus, userId) {
  const order = await Order.findById(orderId);
  const previousStatus = order.status;
  
  // If changing to confirmed, deduct stock
  if (newStatus === 'confirmed' && previousStatus === 'pending') {
    await inventoryService.deductStock(orderId, userId);
  }
  
  order.status = newStatus;
  await order.save();
  
  return order;
}
```

#### Frontend Implementation

**Inventory Management Page Component:**
```typescript
// File: client/src/features/admin/pages/InventoryManagementPage.tsx

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  category: string;
  price: number;
}

export const InventoryManagementPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'low_stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch inventory data
  // Display table with stock levels
  // Provide update stock modal
  // Show low stock badges
  // Display transaction history
};
```

**Low Stock Alert Component:**
```typescript
// File: client/src/features/admin/components/LowStockAlert.tsx

export const LowStockAlert: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
  useEffect(() => {
    fetchLowStockProducts();
  }, []);
  
  return (
    <div className="low-stock-alert">
      {lowStockProducts.length > 0 && (
        <Alert severity="warning">
          {lowStockProducts.length} products are running low on stock
        </Alert>
      )}
    </div>
  );
};
```

**Stock Update Modal:**
```typescript
// File: client/src/features/admin/components/StockUpdateModal.tsx

interface StockUpdateModalProps {
  product: InventoryItem;
  onClose: () => void;
  onUpdate: () => void;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  product,
  onClose,
  onUpdate
}) => {
  const [quantity, setQuantity] = useState(product.stock_quantity);
  const [reason, setReason] = useState('');
  
  const handleSubmit = async () => {
    await api.post(`/admin/inventory/${product._id}/adjust`, {
      new_quantity: quantity,
      reason
    });
    onUpdate();
    onClose();
  };
  
  // Render form with quantity input and reason textarea
};
```


### Phase 3: Data Archival

#### Backend Suggestions

**Enhanced Order Model:**
```javascript
// Suggestion: Add archival fields to Order schema
const orderSchema = new mongoose.Schema({
  // ... existing fields
  is_archived: {
    type: Boolean,
    default: false
  },
  archived_at: {
    type: Date,
    default: null
  },
  fiscal_year: {
    type: String,
    default: null
  }
}, { timestamps: true });
```

**Archival Cron Job:**
```javascript
// Suggestion: Create archival cron job
// File: src/jobs/archiveOrders.js

const cron = require('node-cron');

const archiveOldOrders = async () => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const result = await Order.updateMany(
      {
        createdAt: { $lt: oneYearAgo },
        is_archived: false
      },
      {
        $set: {
          is_archived: true,
          archived_at: new Date(),
          fiscal_year: new Date().getFullYear().toString()
        }
      }
    );
    
    console.log(`✅ Archived ${result.modifiedCount} orders`);
    
    // Send notification to admins
    await notificationService.notifyAdmins(
      'Order Archival Complete',
      `${result.modifiedCount} orders have been archived`
    );
  } catch (error) {
    console.error('❌ Archival job failed:', error);
  }
};

// Run on 1st of every month at 2:00 AM
cron.schedule('0 2 1 * *', archiveOldOrders);
```

**Order Service Enhancement:**
```javascript
// Suggestion: Add archived orders query methods
async getArchivedOrders(queryParams = {}) {
  const filter = { is_archived: true };
  
  if (queryParams.fiscal_year) {
    filter.fiscal_year = queryParams.fiscal_year;
  }
  
  // ... pagination and query logic
}

// Modify existing methods to exclude archived by default
async getAllOrders(queryParams = {}) {
  const filter = { is_archived: false }; // Add this line
  // ... rest of method
}
```

#### Frontend Implementation

**Archived Orders Page:**
```typescript
// File: client/src/features/admin/pages/ArchivedOrdersPage.tsx

export const ArchivedOrdersPage: React.FC = () => {
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [fiscalYears, setFiscalYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  // Fetch archived orders with fiscal year filter
  // Display in table format
  // Show archived_at timestamp
  // Provide search by order ID or customer name
};
```


### Phase 4: Analytics Dashboard

#### Backend Suggestions

**Analytics Service:**
```javascript
// Suggestion: Create analytics service
// File: src/service/analytics.service.js

class AnalyticsService {
  async getDailyMetrics(startDate, endDate) {
    const filter = {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: { $ne: 'cancelled' },
      is_archived: false
    };
    
    const orders = await Order.find(filter);
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = {
            name: item.product_name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.product_id].quantity += item.quantity;
        productSales[item.product_id].revenue += item.unit_price * item.quantity;
      });
    });
    
    const topProductsByQuantity = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    const topProductsByRevenue = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topProductsByQuantity,
      topProductsByRevenue
    };
  }
  
  async getTrendData(startDate, endDate, groupBy = 'daily') {
    // Aggregate orders by day/week/month
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: { $ne: 'cancelled' },
          is_archived: false
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupBy === 'daily' ? '%Y-%m-%d' : 
                      groupBy === 'weekly' ? '%Y-W%V' : '%Y-%m',
              date: '$createdAt'
            }
          },
          orderCount: { $sum: 1 },
          revenue: { $sum: '$total_price' }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    return await Order.aggregate(pipeline);
  }
  
  async getCategoryAnalytics(startDate, endDate) {
    // Aggregate revenue by product category
  }
  
  async getInventoryMovement(startDate, endDate) {
    return await InventoryTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$product_id',
          totalDeductions: {
            $sum: {
              $cond: [{ $eq: ['$transaction_type', 'deduction'] }, '$quantity_change', 0]
            }
          },
          totalRestocks: {
            $sum: {
              $cond: [{ $eq: ['$transaction_type', 'restock'] }, '$quantity_change', 0]
            }
          }
        }
      }
    ]);
  }
}
```


#### Frontend Implementation

**Analytics Dashboard Page:**
```typescript
// File: client/src/features/admin/pages/AnalyticsDashboardPage.tsx

import { LineChart, BarChart, PieChart } from 'recharts';

export const AnalyticsDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const fetchAnalytics = async () => {
    const metricsData = await api.get('/admin/analytics/metrics', {
      params: { startDate: dateRange.start, endDate: dateRange.end }
    });
    
    const trendsData = await api.get('/admin/analytics/trends', {
      params: { startDate: dateRange.start, endDate: dateRange.end, groupBy: viewMode }
    });
    
    setMetrics(metricsData.data);
    setTrendData(trendsData.data);
  };
  
  return (
    <div className="analytics-dashboard">
      <DateRangePicker onChange={setDateRange} />
      
      <MetricsCards metrics={metrics} />
      
      <div className="charts-grid">
        <LineChart data={trendData} title="Revenue Trends" />
        <BarChart data={trendData} title="Order Count" />
        <PieChart data={metrics?.categoryRevenue} title="Revenue by Category" />
      </div>
      
      <TopProductsTable products={metrics?.topProducts} />
      
      <ExportButtons onExportPDF={exportToPDF} onExportExcel={exportToExcel} />
    </div>
  );
};
```

**Export Functionality:**
```typescript
// File: client/src/features/admin/utils/exportAnalytics.ts

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: AnalyticsData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Analytics Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Date Range: ${data.startDate} to ${data.endDate}`, 20, 30);
  
  // Add metrics
  doc.text(`Total Orders: ${data.totalOrders}`, 20, 50);
  doc.text(`Total Revenue: $${data.totalRevenue}`, 20, 60);
  doc.text(`Average Order Value: $${data.averageOrderValue}`, 20, 70);
  
  // Add charts as images (using html2canvas)
  // Add tables
  
  doc.save(`analytics-${Date.now()}.pdf`);
};

export const exportToExcel = (data: AnalyticsData) => {
  const workbook = XLSX.utils.book_new();
  
  // Create sheets for different data
  const metricsSheet = XLSX.utils.json_to_sheet([data.metrics]);
  const trendsSheet = XLSX.utils.json_to_sheet(data.trends);
  const productsSheet = XLSX.utils.json_to_sheet(data.topProducts);
  
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Metrics');
  XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Trends');
  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Products');
  
  XLSX.writeFile(workbook, `analytics-${Date.now()}.xlsx`);
};
```


### Phase 5: Enhanced Order Cancellation

#### Backend Suggestions

**Enhanced Order Model:**
```javascript
// Suggestion: Add cancellation fields to Order schema
const orderSchema = new mongoose.Schema({
  // ... existing fields
  cancellation_reason: {
    type: String,
    enum: ['changed_mind', 'wrong_order', 'too_expensive', 'long_wait_time', 'other'],
    default: null
  },
  cancellation_explanation: {
    type: String,
    default: null
  },
  cancelled_at: {
    type: Date,
    default: null
  },
  cancelled_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  confirmed_at: {
    type: Date,
    default: null
  },
  refund_status: {
    type: String,
    enum: ['not_applicable', 'pending', 'processing', 'completed', 'failed'],
    default: 'not_applicable'
  },
  refund_amount: {
    type: Number,
    default: 0
  },
  refund_processed_at: {
    type: Date,
    default: null
  }
}, { timestamps: true });
```

**Order Service Enhancement:**
```javascript
// Suggestion: Enhanced cancelOrder method with time-based rules
async cancelOrder(userId, orderId, cancellationData) {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw { status: 404, message: 'Order not found' };
  }
  
  // Check ownership (customers can only cancel their own orders)
  const user = await User.findById(userId);
  if (user.role === 'customer' && order.user_id.toString() !== userId) {
    throw { status: 403, message: 'Access denied' };
  }
  
  // Check if order is cancellable
  if (!['pending', 'confirmed', 'preparing'].includes(order.status)) {
    throw { status: 400, message: `Cannot cancel order with status: ${order.status}` };
  }
  
  // Time-based cancellation check for confirmed orders (customers only)
  if (user.role === 'customer' && order.status === 'confirmed') {
    const CANCELLATION_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
    const timeSinceConfirmation = Date.now() - order.confirmed_at.getTime();
    
    if (timeSinceConfirmation > CANCELLATION_WINDOW) {
      throw {
        status: 400,
        message: 'Cancellation window has expired. Please contact support.'
      };
    }
  }
  
  // Restore inventory if stock was deducted
  if (['confirmed', 'preparing'].includes(order.status)) {
    await inventoryService.restoreStock(orderId, userId, 'order_cancelled');
  }
  
  // Update order
  order.status = 'cancelled';
  order.cancellation_reason = cancellationData.reason;
  order.cancellation_explanation = cancellationData.explanation;
  order.cancelled_at = new Date();
  order.cancelled_by = userId;
  
  // Set refund status if payment was made
  if (order.payment_status === 'paid') {
    order.refund_status = 'pending';
    order.refund_amount = order.total_price;
  }
  
  await order.save();
  
  return order;
}
```


#### Frontend Implementation

**Cancel Order Modal:**
```typescript
// File: client/src/features/orders/components/CancelOrderModal.tsx

interface CancelOrderModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  order,
  onClose,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    if (order.status === 'confirmed' && order.confirmed_at) {
      const WINDOW = 5 * 60 * 1000; // 5 minutes
      const elapsed = Date.now() - new Date(order.confirmed_at).getTime();
      const remaining = WINDOW - elapsed;
      
      if (remaining > 0) {
        setTimeRemaining(remaining);
        const timer = setInterval(() => {
          setTimeRemaining(prev => prev ? prev - 1000 : 0);
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [order]);
  
  const handleSubmit = async () => {
    try {
      await api.post(`/orders/${order._id}/cancel`, {
        reason,
        explanation: reason === 'other' ? explanation : null
      });
      onSuccess();
      onClose();
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Modal open onClose={onClose}>
      <h2>Cancel Order</h2>
      
      {timeRemaining !== null && (
        <Alert severity="info">
          Time remaining to cancel: {formatTime(timeRemaining)}
        </Alert>
      )}
      
      <FormControl>
        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          <FormControlLabel value="changed_mind" control={<Radio />} label="Changed my mind" />
          <FormControlLabel value="wrong_order" control={<Radio />} label="Ordered wrong items" />
          <FormControlLabel value="too_expensive" control={<Radio />} label="Too expensive" />
          <FormControlLabel value="long_wait_time" control={<Radio />} label="Wait time too long" />
          <FormControlLabel value="other" control={<Radio />} label="Other reason" />
        </RadioGroup>
      </FormControl>
      
      {reason === 'other' && (
        <TextField
          multiline
          rows={3}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Please explain..."
        />
      )}
      
      {order.payment_status === 'paid' && (
        <Alert severity="info">
          A refund of ${order.total_price} will be processed to your original payment method.
          Refunds typically take 5-7 business days.
        </Alert>
      )}
      
      <Button onClick={handleSubmit} disabled={!reason}>
        Confirm Cancellation
      </Button>
    </Modal>
  );
};
```


### Phase 6: Category Management

#### Backend Suggestions

**Optional Category Model:**
```javascript
// Suggestion: Create Category model for advanced management
// File: src/models/category.model.js

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  display_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  image_url: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Ensure unique category names
module.exports = mongoose.model('Category', categorySchema);
```

**Product Model Enhancement (if using Category model):**
```javascript
// Suggestion: Change category field to reference
const productSchema = new mongoose.Schema({
  // ... other fields
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
  // OR keep as string for simpler implementation
  // category: {
  //   type: String,
  //   required: true
  // }
});
```

**Category Service:**
```javascript
// Suggestion: Create category service
// File: src/service/category.service.js

class CategoryService {
  async getAllCategories() {
    return await Category.find({ is_active: true })
      .sort({ display_order: 1, name: 1 });
  }
  
  async createCategory(data) {
    return await Category.create(data);
  }
  
  async updateCategory(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }
  
  async deleteCategory(id) {
    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: id });
    
    if (productCount > 0) {
      throw {
        status: 400,
        message: `Cannot delete category. ${productCount} products are using it.`
      };
    }
    
    // Soft delete by marking inactive
    return await Category.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true }
    );
  }
  
  async getCategoryAnalytics(startDate, endDate) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unit_price'] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' }
        }
      }
    ]);
  }
}
```


#### Frontend Implementation

**Category Filter Component:**
```typescript
// File: client/src/features/admin/components/CategoryFilter.tsx

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    fetchCategories();
    fetchCategoryCounts();
  }, []);
  
  return (
    <FormControl>
      <Select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        <MenuItem value="all">
          All Categories ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
        </MenuItem>
        {categories.map(cat => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name} ({categoryCounts[cat._id] || 0})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
```

**Category Management Page:**
```typescript
// File: client/src/features/admin/pages/CategoryManagementPage.tsx

export const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleCreateCategory = async (data: CategoryFormData) => {
    await api.post('/admin/categories', data);
    fetchCategories();
  };
  
  const handleUpdateCategory = async (id: string, data: CategoryFormData) => {
    await api.put(`/admin/categories/${id}`, data);
    fetchCategories();
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure? This will mark the category as inactive.')) {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    }
  };
  
  return (
    <div className="category-management">
      <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      
      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {categories.map((cat, index) => (
                <Draggable key={cat._id} draggableId={cat._id} index={index}>
                  {(provided) => (
                    <CategoryCard
                      category={cat}
                      onEdit={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                      onDelete={() => handleDeleteCategory(cat._id)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <CategoryFormModal
        open={isModalOpen}
        category={editingCategory}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
      />
    </div>
  );
};
```


### Phase 7: Payment Gateway Integration

#### Backend Suggestions

**Payment Model:**
```javascript
// Suggestion: Create Payment model
// File: src/models/payment.model.js

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  payment_method: {
    type: String,
    enum: ['card', 'upi', 'cash', 'wallet', 'net_banking'],
    required: true
  },
  payment_gateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'cash'],
    required: true
  },
  gateway_transaction_id: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  payment_initiated_at: {
    type: Date,
    default: Date.now
  },
  payment_completed_at: {
    type: Date,
    default: null
  },
  failure_reason: {
    type: String,
    default: null
  },
  gateway_response: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
```

**Enhanced Order Model:**
```javascript
// Suggestion: Add payment fields to Order schema
const orderSchema = new mongoose.Schema({
  // ... existing fields
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'partially_refunded'],
    default: 'unpaid'
  }
}, { timestamps: true });
```

**Payment Service:**
```javascript
// Suggestion: Create payment service
// File: src/service/payment.service.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');

class PaymentService {
  constructor() {
    this.gateway = process.env.PAYMENT_GATEWAY || 'stripe';
    
    if (this.gateway === 'razorpay') {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    }
  }
  
  async createPaymentIntent(orderId, amount, paymentMethod) {
    const order = await Order.findById(orderId);
    
    // Create payment record
    const payment = await Payment.create({
      order_id: orderId,
      amount,
      payment_method: paymentMethod,
      payment_gateway: paymentMethod === 'cash' ? 'cash' : this.gateway,
      status: 'pending'
    });
    
    // Handle cash payment
    if (paymentMethod === 'cash') {
      payment.status = 'completed';
      payment.payment_completed_at = new Date();
      await payment.save();
      
      order.payment_id = payment._id;
      order.payment_status = 'paid';
      await order.save();
      
      return { payment, requiresAction: false };
    }
    
    // Create gateway payment intent
    let gatewayResponse;
    
    if (this.gateway === 'stripe') {
      gatewayResponse = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: [paymentMethod === 'card' ? 'card' : 'us_bank_account'],
        metadata: { order_id: orderId, payment_id: payment._id.toString() }
      });
      
      payment.gateway_transaction_id = gatewayResponse.id;
    } else if (this.gateway === 'razorpay') {
      gatewayResponse = await this.razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: { order_id: orderId, payment_id: payment._id.toString() }
      });
      
      payment.gateway_transaction_id = gatewayResponse.id;
    }
    
    payment.gateway_response = gatewayResponse;
    await payment.save();
    
    order.payment_id = payment._id;
    await order.save();
    
    return { payment, gatewayResponse, requiresAction: true };
  }
  
  async handleWebhook(gatewayEvent) {
    if (this.gateway === 'stripe') {
      return await this.handleStripeWebhook(gatewayEvent);
    } else if (this.gateway === 'razorpay') {
      return await this.handleRazorpayWebhook(gatewayEvent);
    }
  }
  
  async handleStripeWebhook(event) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.metadata.payment_id;
      
      const payment = await Payment.findById(paymentId);
      payment.status = 'completed';
      payment.payment_completed_at = new Date();
      await payment.save();
      
      const order = await Order.findById(payment.order_id);
      order.payment_status = 'paid';
      await order.save();
      
      // Generate and send invoice
      await this.generateInvoice(order._id);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.metadata.payment_id;
      
      const payment = await Payment.findById(paymentId);
      payment.status = 'failed';
      payment.failure_reason = paymentIntent.last_payment_error?.message;
      await payment.save();
    }
  }
  
  async processRefund(orderId, amount = null) {
    const order = await Order.findById(orderId).populate('payment_id');
    const payment = order.payment_id;
    
    if (!payment || payment.status !== 'completed') {
      throw { status: 400, message: 'No completed payment found for this order' };
    }
    
    const refundAmount = amount || payment.amount;
    
    let refundResponse;
    
    if (this.gateway === 'stripe') {
      refundResponse = await stripe.refunds.create({
        payment_intent: payment.gateway_transaction_id,
        amount: Math.round(refundAmount * 100)
      });
    } else if (this.gateway === 'razorpay') {
      refundResponse = await this.razorpay.payments.refund(
        payment.gateway_transaction_id,
        { amount: Math.round(refundAmount * 100) }
      );
    }
    
    // Update payment status
    if (refundAmount === payment.amount) {
      payment.status = 'refunded';
      order.payment_status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
      order.payment_status = 'partially_refunded';
    }
    
    order.refund_status = 'completed';
    order.refund_processed_at = new Date();
    
    await payment.save();
    await order.save();
    
    return { payment, refundResponse };
  }
  
  async generateInvoice(orderId) {
    // Generate PDF invoice using PDFKit or Puppeteer
    // Store in uploads/invoices/
    // Send email with attachment
  }
}
```


#### Frontend Implementation

**Payment Method Selection Page:**
```typescript
// File: client/src/features/orders/pages/PaymentSelectionPage.tsx

export const PaymentSelectionPage: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
    { id: 'cash', name: 'Cash on Delivery', icon: '💵' }
  ];
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await api.post(`/orders/${orderId}/payment`, {
        payment_method: selectedMethod
      });
      
      if (response.data.requiresAction) {
        // Redirect to payment gateway
        if (response.data.gateway === 'stripe') {
          const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
          await stripe.confirmCardPayment(response.data.clientSecret);
        } else if (response.data.gateway === 'razorpay') {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            order_id: response.data.gateway_order_id,
            handler: (response) => {
              // Payment successful
              navigate(`/orders/${orderId}/success`);
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } else {
        // Cash payment - no gateway needed
        navigate(`/orders/${orderId}/success`);
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="payment-selection">
      <OrderSummary order={order} />
      
      <div className="payment-methods">
        {paymentMethods.map(method => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onSelect={() => setSelectedMethod(method.id)}
          />
        ))}
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
        loading={isProcessing}
      >
        {selectedMethod === 'cash' ? 'Place Order' : 'Proceed to Payment'}
      </Button>
    </div>
  );
};
```

**Payment Success Page:**
```typescript
// File: client/src/features/orders/pages/PaymentSuccessPage.tsx

export const PaymentSuccessPage: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  
  const downloadInvoice = async () => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  
  return (
    <div className="payment-success">
      <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
      <h1>Payment Successful!</h1>
      <p>Your order has been confirmed.</p>
      
      <OrderDetails order={order} />
      
      <Button onClick={downloadInvoice}>Download Invoice</Button>
      <Button onClick={() => navigate('/orders')}>View My Orders</Button>
    </div>
  );
};
```


### Phase 8: Staff Management

#### Backend Suggestions

**Staff Model:**
```javascript
// Suggestion: Create Staff model
// File: src/models/staff.model.js

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'chef', 'waiter', 'cleaner', 'cashier', 'delivery_driver'],
    required: true
  },
  employment_type: {
    type: String,
    enum: ['full_time', 'part_time', 'contract'],
    required: true
  },
  hire_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  },
  hourly_rate: {
    type: Number,
    default: 0,
    min: 0
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  profile_image: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
```

**Shift Model (Optional):**
```javascript
// Suggestion: Create Shift model for scheduling
// File: src/models/shift.model.js

const shiftSchema = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  shift_date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  break_duration: {
    type: Number,
    default: 30,
    min: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    default: null
  },
  clock_in_time: {
    type: Date,
    default: null
  },
  clock_out_time: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);
```

**Enhanced Order Model:**
```javascript
// Suggestion: Add staff assignment to Order schema
const orderSchema = new mongoose.Schema({
  // ... existing fields
  assigned_staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  }
}, { timestamps: true });
```

**Enhanced User Model:**
```javascript
// Suggestion: Extend User role enum
const userSchema = new mongoose.Schema({
  // ... existing fields
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager', 'chef', 'waiter', 'cashier'],
    default: 'customer'
  }
}, { timestamps: true });
```


**Staff Service:**
```javascript
// Suggestion: Create staff service
// File: src/service/staff.service.js

class StaffService {
  async createStaff(data) {
    // Check if email already exists
    const existing = await Staff.findOne({ email: data.email });
    if (existing) {
      throw { status: 400, message: 'Email already in use' };
    }
    
    return await Staff.create(data);
  }
  
  async getAllStaff(queryParams = {}) {
    const filter = {};
    
    if (queryParams.role) {
      filter.role = queryParams.role;
    }
    
    if (queryParams.status) {
      filter.status = queryParams.status;
    }
    
    if (queryParams.employment_type) {
      filter.employment_type = queryParams.employment_type;
    }
    
    if (queryParams.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { email: { $regex: queryParams.search, $options: 'i' } },
        { phone: { $regex: queryParams.search, $options: 'i' } }
      ];
    }
    
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 20;
    const skip = (page - 1) * limit;
    
    const totalStaff = await Staff.countDocuments(filter);
    const staff = await Staff.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    return {
      staff,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStaff / limit),
        totalItems: totalStaff,
        itemsPerPage: limit
      }
    };
  }
  
  async getStaffById(id) {
    const staff = await Staff.findById(id);
    if (!staff) {
      throw { status: 404, message: 'Staff member not found' };
    }
    return staff;
  }
  
  async updateStaff(id, data) {
    const staff = await Staff.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    
    if (!staff) {
      throw { status: 404, message: 'Staff member not found' };
    }
    
    return staff;
  }
  
  async deleteStaff(id) {
    // Soft delete by setting status to terminated
    return await Staff.findByIdAndUpdate(
      id,
      { status: 'terminated' },
      { new: true }
    );
  }
  
  async getStaffPerformance(staffId, startDate, endDate) {
    const orders = await Order.find({
      assigned_staff: staffId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
    
    // Calculate average completion time
    const completionTimes = orders
      .filter(o => o.status === 'delivered')
      .map(o => o.updatedAt - o.createdAt);
    
    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;
    
    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      avgCompletionTime: Math.round(avgCompletionTime / 60000) // Convert to minutes
    };
  }
}
```

**Permission Middleware:**
```javascript
// Suggestion: Create permission middleware
// File: src/middlewares/checkPermission.js

const permissions = {
  manager: ['*'], // All permissions
  chef: ['view_orders', 'update_order_status'],
  waiter: ['view_orders', 'create_order', 'view_assigned_orders'],
  cashier: ['view_orders', 'process_payment', 'view_payments'],
  admin: ['*']
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = permissions[userRole] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
  };
};

module.exports = checkPermission;
```


#### Frontend Implementation

**Staff Directory Page:**
```typescript
// File: client/src/features/admin/pages/StaffDirectoryPage.tsx

export const StaffDirectoryPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    employment_type: 'all',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchStaff = async () => {
    const response = await api.get('/admin/staff', { params: filters });
    setStaff(response.data.data);
  };
  
  return (
    <div className="staff-directory">
      <div className="header">
        <h1>Staff Directory</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Staff Member</Button>
      </div>
      
      <StaffFilters filters={filters} onChange={setFilters} />
      
      <div className="staff-grid">
        {staff.map(member => (
          <StaffCard
            key={member._id}
            staff={member}
            onClick={() => navigate(`/admin/staff/${member._id}`)}
          />
        ))}
      </div>
      
      <StaffFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStaff}
      />
    </div>
  );
};
```

**Staff Detail Page:**
```typescript
// File: client/src/features/admin/pages/StaffDetailPage.tsx

export const StaffDetailPage: React.FC = () => {
  const { staffId } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [performance, setPerformance] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const fetchPerformance = async () => {
    const response = await api.get(`/admin/staff/${staffId}/performance`, {
      params: { startDate: dateRange.start, endDate: dateRange.end }
    });
    setPerformance(response.data.data);
  };
  
  return (
    <div className="staff-detail">
      <StaffProfile staff={staff} />
      
      <Tabs>
        <Tab label="Performance">
          <DateRangePicker onChange={setDateRange} />
          <PerformanceMetrics data={performance} />
        </Tab>
        
        <Tab label="Shifts">
          <ShiftCalendar staffId={staffId} />
        </Tab>
        
        <Tab label="Assigned Orders">
          <AssignedOrdersList staffId={staffId} />
        </Tab>
      </Tabs>
    </div>
  );
};
```

**Shift Scheduling Page (Optional):**
```typescript
// File: client/src/features/admin/pages/ShiftSchedulingPage.tsx

export const ShiftSchedulingPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const handleCreateShift = async (shiftData: ShiftFormData) => {
    await api.post('/admin/shifts', shiftData);
    fetchShifts();
  };
  
  const handleCopyPreviousWeek = async () => {
    await api.post('/admin/shifts/copy-week', {
      sourceWeek: getPreviousWeek(selectedWeek),
      targetWeek: selectedWeek
    });
    fetchShifts();
  };
  
  return (
    <div className="shift-scheduling">
      <WeekSelector value={selectedWeek} onChange={setSelectedWeek} />
      <Button onClick={handleCopyPreviousWeek}>Copy Previous Week</Button>
      
      <ShiftCalendar
        shifts={shifts}
        staff={staff}
        week={selectedWeek}
        onCreateShift={handleCreateShift}
        onUpdateShift={handleUpdateShift}
        onDeleteShift={handleDeleteShift}
      />
    </div>
  );
};
```

## Data Models

### Complete Data Model Diagram

```
User
├── _id
├── name
├── email
├── password
├── phone
├── address
├── role (customer, admin, manager, chef, waiter, cashier)
└── timestamps

Product
├── _id
├── name
├── description
├── price
├── category (ref: Category or String)
├── image_url
├── is_available
├── is_deleted
├── deleted_at
├── stock_quantity (NEW)
├── low_stock_threshold (NEW)
├── sku (NEW)
└── timestamps

InventoryTransaction (NEW)
├── _id
├── product_id (ref: Product)
├── transaction_type (restock, deduction, adjustment, return)
├── quantity_change
├── previous_quantity
├── new_quantity
├── reason
├── performed_by (ref: User)
├── order_id (ref: Order)
└── timestamps

Order
├── _id
├── user_id (ref: User)
├── items[]
│   ├── product_id (ref: Product)
│   ├── product_name
│   ├── quantity
│   └── unit_price
├── orderType (dine-in, takeout, delivery)
├── table (ref: Table)
├── reservation (ref: Reservation)
├── deliveryAddress
├── deliveryFee
├── subtotal
├── promoCode
├── discountAmount
├── pickupTime
├── status (pending, confirmed, preparing, delivered, cancelled)
├── total_price
├── notes
├── assigned_staff (ref: Staff) (NEW)
├── is_archived (NEW)
├── archived_at (NEW)
├── fiscal_year (NEW)
├── cancellation_reason (NEW)
├── cancellation_explanation (NEW)
├── cancelled_at (NEW)
├── cancelled_by (ref: User) (NEW)
├── confirmed_at (NEW)
├── refund_status (NEW)
├── refund_amount (NEW)
├── refund_processed_at (NEW)
├── payment_id (ref: Payment) (NEW)
├── payment_status (NEW)
└── timestamps

Payment (NEW)
├── _id
├── order_id (ref: Order)
├── amount
├── currency
├── payment_method (card, upi, cash, wallet, net_banking)
├── payment_gateway (stripe, razorpay, cash)
├── gateway_transaction_id
├── status (pending, processing, completed, failed, refunded, partially_refunded)
├── payment_initiated_at
├── payment_completed_at
├── failure_reason
├── gateway_response
└── timestamps

Category (NEW - Optional)
├── _id
├── name
├── description
├── display_order
├── is_active
├── image_url
└── timestamps

Staff (NEW)
├── _id
├── name
├── email
├── phone
├── role (manager, chef, waiter, cleaner, cashier, delivery_driver)
├── employment_type (full_time, part_time, contract)
├── hire_date
├── status (active, inactive, on_leave, terminated)
├── hourly_rate
├── user_id (ref: User)
├── profile_image
└── timestamps

Shift (NEW - Optional)
├── _id
├── staff_id (ref: Staff)
├── shift_date
├── start_time
├── end_time
├── break_duration
├── status (scheduled, in_progress, completed, cancelled, no_show)
├── notes
├── clock_in_time
├── clock_out_time
└── timestamps
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection Analysis

Before defining properties, I analyzed the acceptance criteria to identify redundancies:

**Redundancy Elimination:**
- Properties 3.1 (stock deduction on confirm) and 3.4 (stock restoration on cancel) can be combined into a single round-trip property
- Properties 3.2 and 3.5 (transaction record creation) can be combined into one property about audit trail completeness
- Properties 13.2, 13.3, and 13.4 (time-based cancellation checks) can be combined into one comprehensive time window property
- Properties 9.1, 9.2, and 9.3 (analytics calculations) are related but test different aspects, so they remain separate
- Properties 15.1, 15.4, and 15.5 (conditional stock restoration) can be combined into one property with status-based logic

**Properties Retained:**
Each remaining property provides unique validation value and tests distinct system behaviors.

### Phase 1: Critical Fixes

**Property 1: Date Range Filtering Correctness**
*For any* date range (startDate, endDate) and any set of orders, when filtering orders by that date range, all returned orders should have createdAt timestamps within the range (inclusive), and no orders within the range should be excluded.
**Validates: Requirements 1.1**

### Phase 2: Inventory Management

**Property 2: SKU Uniqueness**
*For any* set of products created without explicit SKUs, all auto-generated SKUs should be unique across the entire product collection.
**Validates: Requirements 2.6**

**Property 3: Stock Deduction and Restoration Round Trip**
*For any* order with available stock, confirming the order (deducting stock) and then cancelling it (restoring stock) should return all product stock quantities to their original values.
**Validates: Requirements 3.1, 3.4**

**Property 4: Inventory Transaction Audit Trail Completeness**
*For any* stock operation (deduction, restoration, adjustment, restock), an InventoryTransaction record should be created with the correct transaction_type, quantity_change, previous_quantity, new_quantity, and reason fields.
**Validates: Requirements 3.2, 3.5**

**Property 5: Insufficient Stock Prevention**
*For any* order where at least one product has order quantity > stock_quantity, attempting to confirm the order should fail with an error message containing "Insufficient stock for" and the product name.
**Validates: Requirements 3.3**

**Property 6: Stock Quantity Non-Negativity Invariant**
*For any* sequence of stock operations (deductions, restorations, adjustments), the stock_quantity field should never become negative for any product.
**Validates: Requirements 3.6**

**Property 7: Low Stock Detection**
*For any* product where stock_quantity <= low_stock_threshold, the product should be included in the low stock products list, and any product where stock_quantity > low_stock_threshold should be excluded.
**Validates: Requirements 4.1, 4.3**

**Property 8: Low Stock Alert Display Completeness**
*For any* low stock alert displayed in the UI, it should contain the product name, current stock_quantity value, and low_stock_threshold value.
**Validates: Requirements 4.6**

**Property 9: Low Stock Badge Visibility**
*For any* product in the admin product list where stock_quantity <= low_stock_threshold, a low stock badge should be visible in the UI.
**Validates: Requirements 4.4**


### Phase 3: Data Archival

**Property 10: Archival Query Correctness**
*For any* set of orders, when the archival process runs, it should identify exactly those orders where createdAt is more than 1 year old and is_archived is false, excluding all other orders.
**Validates: Requirements 7.2**

**Property 11: Archival Field Updates**
*For any* order identified for archival, after the archival process completes, the order should have is_archived set to true, archived_at set to a valid timestamp, and fiscal_year set to the order's creation year.
**Validates: Requirements 7.3**

**Property 12: Default Query Exclusion of Archived Orders**
*For any* order query without explicit archived filter, all returned orders should have is_archived set to false, and no orders with is_archived true should be included.
**Validates: Requirements 8.1**

### Phase 4: Analytics Dashboard

**Property 13: Order Count Calculation Accuracy**
*For any* date range and set of orders, the calculated total order count should equal the number of non-cancelled, non-archived orders with createdAt within the date range.
**Validates: Requirements 9.1**

**Property 14: Revenue Calculation Accuracy**
*For any* date range and set of orders, the calculated total revenue should equal the sum of total_price for all non-cancelled, non-archived orders with createdAt within the date range.
**Validates: Requirements 9.2**

**Property 15: Average Order Value Calculation Accuracy**
*For any* date range with at least one order, the calculated average order value should equal total revenue divided by total order count, and for date ranges with zero orders, it should be 0.
**Validates: Requirements 9.3**

**Property 16: Top Products Ranking Correctness**
*For any* date range and ranking criteria (quantity or revenue), the top N products list should be sorted in descending order by the specified criteria, and all products in the list should have higher values than any products not in the list.
**Validates: Requirements 9.4, 9.5**

**Property 17: Trend Data Aggregation Correctness**
*For any* date range and grouping period (daily, weekly, monthly), each aggregated data point should contain the correct order count and revenue sum for orders within that time period, with no orders counted multiple times or omitted.
**Validates: Requirements 10.1, 10.2, 10.3**

**Property 18: Inventory Movement Calculation Accuracy**
*For any* date range and product, the calculated total deductions should equal the sum of all negative quantity_change values in InventoryTransactions for that product, and total restocks should equal the sum of all positive quantity_change values.
**Validates: Requirements 11.2, 11.3**

### Phase 5: Enhanced Order Cancellation

**Property 19: Time-Based Cancellation Window Enforcement**
*For any* confirmed order and customer cancellation attempt, if the time elapsed since confirmed_at is less than or equal to cancellation_time_limit, the cancellation should succeed; if the time elapsed exceeds cancellation_time_limit, the cancellation should fail with message "Cancellation window has expired".
**Validates: Requirements 13.2, 13.3, 13.4**

**Property 20: Admin Cancellation Bypass**
*For any* order and admin user, the cancellation should succeed regardless of the time elapsed since confirmation or the order status (except already cancelled or delivered).
**Validates: Requirements 13.6**

**Property 21: Cancellation State Update Completeness**
*For any* successfully cancelled order, the order should have status set to "cancelled", cancelled_at set to a valid timestamp, cancelled_by set to the cancelling user's ID, and cancellation_reason set to the provided reason.
**Validates: Requirements 13.5, 14.7**

**Property 22: Conditional Stock Restoration Based on Status**
*For any* cancelled order, if the original status was "confirmed" or "preparing", stock should be restored for all products; if the original status was "pending", no stock restoration should occur; if the original status was "delivered", no stock restoration should occur.
**Validates: Requirements 15.1, 15.4, 15.5**

**Property 23: Stock Restoration Transaction Record**
*For any* order cancellation that triggers stock restoration, an InventoryTransaction record should be created for each product with transaction_type "return", reason "order_cancelled", and quantity_change equal to the order item quantity.
**Validates: Requirements 15.2**

**Property 24: Stock Restoration Idempotency**
*For any* order, if cancellation is attempted multiple times (even if the first succeeds), stock restoration should occur exactly once, preventing duplicate stock additions.
**Validates: Requirements 15.3**


### Phase 6: Category Management

**Property 25: Category Filter Correctness**
*For any* selected category and product list, when filtering by that category, all returned products should belong to the selected category, and no products from other categories should be included.
**Validates: Requirements 18.1, 18.2**

**Property 26: Category Deletion Prevention with Associated Products**
*For any* category with at least one associated product, attempting to delete the category should fail with an error message indicating the number of products using it.
**Validates: Requirements 19.5**

**Property 27: Category Analytics Calculation Accuracy**
*For any* date range and category, the calculated revenue should equal the sum of (quantity × unit_price) for all order items of products in that category, and the order count should equal the number of distinct orders containing products from that category.
**Validates: Requirements 20.1, 20.2, 20.3**

### Phase 7: Payment Gateway Integration

**Property 28: Payment Record Creation on Order Payment**
*For any* order payment initiation, a Payment record should be created with the correct order_id, amount, payment_method, payment_gateway, and status "pending".
**Validates: Requirements 23.4**

**Property 29: Payment Status Synchronization**
*For any* payment that transitions to "completed" status, the associated order's payment_status should be updated to "paid", and the order's payment_id should reference the payment record.
**Validates: Requirements 23.6, 24.3**

**Property 30: Payment Failure Recording**
*For any* payment that fails, the Payment record should have status "failed" and failure_reason populated with the error message from the gateway.
**Validates: Requirements 23.7, 24.4**

**Property 31: Webhook Idempotency**
*For any* payment webhook event received multiple times (duplicate events), the payment and order status should be updated exactly once, preventing duplicate state changes.
**Validates: Requirements 24.6**

**Property 32: Refund Amount Calculation**
*For any* refund request, if no specific amount is provided, the refund_amount should equal the original payment amount; if a partial amount is provided, the refund_amount should equal the specified amount and be less than or equal to the original payment amount.
**Validates: Requirements 25.5**

**Property 33: Refund Status Synchronization**
*For any* successful refund, if the refund amount equals the original payment amount, both Payment status and Order payment_status should be "refunded"; if the refund amount is less than the original, both should be "partially_refunded".
**Validates: Requirements 25.3**

**Property 34: Invoice Data Completeness**
*For any* generated invoice, it should contain all required fields: order details (ID, date, items, quantities, prices, subtotal, discounts, total), customer details (name, email, phone, address), restaurant details (name, address, phone), and payment details (method, transaction ID, date).
**Validates: Requirements 26.2, 26.3, 26.4, 26.5**

### Phase 8: Staff Management

**Property 35: Staff Email Uniqueness**
*For any* staff creation or update operation, if the email address is already in use by another staff member, the operation should fail with an error message "Email already in use".
**Validates: Requirements 29.1**

**Property 36: Staff Soft Delete Behavior**
*For any* staff deletion operation, instead of removing the record, the staff status should be updated to "terminated", preserving the record for historical reference.
**Validates: Requirements 29.5**

**Property 37: Staff Search Correctness**
*For any* search term, all returned staff members should have the search term present (case-insensitive) in their name, email, or phone fields, and no staff members matching the term should be excluded.
**Validates: Requirements 29.7**

**Property 38: Shift Overlap Prevention**
*For any* staff member and new shift, if there exists another shift for the same staff member on the same date with overlapping time ranges, the new shift creation should fail with an error indicating the conflict.
**Validates: Requirements 30.3**

**Property 39: Staff Performance Metrics Accuracy**
*For any* staff member and date range, the calculated total orders should equal the count of orders assigned to that staff member within the range, and the total revenue should equal the sum of total_price for those orders.
**Validates: Requirements 31.6**

**Property 40: Permission Enforcement**
*For any* user with a specific role and any protected operation, if the user's role permissions do not include the required permission for that operation, the operation should fail with a 403 status and message "You do not have permission to perform this action".
**Validates: Requirements 32.3, 32.7**

**Property 41: Role-Based Order Access**
*For any* chef user, they should be able to view all orders; for any waiter user, they should only be able to view orders assigned to them; for any manager or admin user, they should be able to view all orders.
**Validates: Requirements 32.5**


## Error Handling

### Backend Error Handling Strategy

**Consistent Error Response Format:**
All backend errors should follow the existing responseFormatter pattern:
```javascript
{
  success: false,
  message: "Error description",
  error: "Error type",
  statusCode: 400
}
```

**Error Categories:**

1. **Validation Errors (400)**
   - Invalid input data
   - Missing required fields
   - Data type mismatches
   - Business rule violations (e.g., insufficient stock)

2. **Authentication Errors (401)**
   - Missing or invalid JWT token
   - Expired token
   - Invalid credentials

3. **Authorization Errors (403)**
   - Insufficient permissions
   - Role-based access denial
   - Resource ownership violations

4. **Not Found Errors (404)**
   - Resource does not exist
   - Invalid ID references

5. **Conflict Errors (409)**
   - Duplicate unique fields (email, SKU)
   - Concurrent modification conflicts
   - Shift overlaps

6. **Payment Errors (402/400)**
   - Payment gateway failures
   - Insufficient funds
   - Invalid payment method
   - Webhook verification failures

7. **Server Errors (500)**
   - Database connection failures
   - External service failures
   - Unexpected exceptions

**Transaction Rollback:**
All operations involving multiple database updates (stock deduction + transaction record, payment + order update) should use MongoDB transactions to ensure atomicity. On error, all changes should be rolled back.

**Retry Logic:**
- Payment gateway calls: 3 retries with exponential backoff
- Webhook processing: Idempotent handling to support retries
- Cron jobs: Log failures and retry on next scheduled run

### Frontend Error Handling Strategy

**Error Display:**
- Toast notifications for transient errors
- Modal dialogs for critical errors requiring user action
- Inline validation messages for form errors
- Error boundaries for component-level failures

**User-Friendly Messages:**
- Technical errors translated to user-friendly language
- Actionable guidance (e.g., "Please try again" or "Contact support")
- Error codes hidden from users but logged for debugging

**Network Error Handling:**
- Loading states during API calls
- Timeout handling (30 seconds default)
- Retry buttons for failed requests
- Offline detection and messaging

**Form Validation:**
- Client-side validation before submission
- Real-time validation feedback
- Server-side validation as final check
- Clear error messages next to invalid fields


## Testing Strategy

### Dual Testing Approach

This project requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests:**
- Verify specific examples and edge cases
- Test error conditions and boundary values
- Validate integration points between components
- Test UI component rendering and interactions
- Fast execution for rapid feedback

**Property-Based Tests:**
- Verify universal properties across all inputs
- Generate random test data for comprehensive coverage
- Catch edge cases not anticipated in unit tests
- Validate invariants and business rules
- Run minimum 100 iterations per property

**Complementary Nature:**
Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the input space. Both are necessary for production-grade quality.

### Property-Based Testing Configuration

**Library Selection:**
- **Backend (Node.js)**: Use `fast-check` library
  ```javascript
  npm install --save-dev fast-check
  ```

- **Frontend (TypeScript)**: Use `fast-check` library
  ```typescript
  npm install --save-dev fast-check
  ```

**Test Configuration:**
- Minimum 100 iterations per property test (configured via `fc.assert` options)
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing examples
- Timeout: 30 seconds per property test

**Property Test Structure:**
```javascript
// Backend example
const fc = require('fast-check');

describe('Inventory Management Properties', () => {
  it('Property 3: Stock deduction and restoration round trip', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          product_id: fc.string(),
          quantity: fc.integer({ min: 1, max: 100 }),
          stock_quantity: fc.integer({ min: 10, max: 1000 })
        })),
        async (orderItems) => {
          // Setup: Create products with initial stock
          // Action: Confirm order (deduct stock)
          // Action: Cancel order (restore stock)
          // Assert: Stock quantities match initial values
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Tagging:**
Each property test must include a comment referencing the design document property:
```javascript
// Feature: restaurant-system-enhancement, Property 3: Stock deduction and restoration round trip
```

### Unit Testing Strategy

**Backend Unit Tests:**
- Test individual service methods with mocked dependencies
- Test controller request/response handling
- Test middleware (authentication, authorization, validation)
- Test model methods and hooks
- Test utility functions

**Frontend Unit Tests:**
- Test component rendering with various props
- Test user interactions (clicks, form submissions)
- Test state management (Zustand stores)
- Test API service functions with mocked axios
- Test utility functions and helpers

**Test Organization:**
```
src/
  service/
    __tests__/
      inventory.service.test.js
      order.service.test.js
  models/
    __tests__/
      product.model.test.js

client/src/
  features/
    admin/
      __tests__/
        InventoryManagementPage.test.tsx
        StaffDirectoryPage.test.tsx
```

### Integration Testing

**API Integration Tests:**
- Test complete request/response cycles
- Test authentication and authorization flows
- Test database operations with test database
- Test payment gateway integration with sandbox mode
- Test webhook handling

**End-to-End Tests (Optional):**
- Test critical user flows (order placement, payment, cancellation)
- Test admin workflows (inventory management, staff management)
- Use Playwright or Cypress for browser automation

### Test Coverage Goals

**Minimum Coverage Targets:**
- Backend services: 80% line coverage
- Backend controllers: 70% line coverage
- Frontend components: 70% line coverage
- Frontend utilities: 90% line coverage

**Critical Path Coverage:**
- Payment processing: 100% coverage
- Inventory operations: 100% coverage
- Order lifecycle: 100% coverage
- Authentication/authorization: 100% coverage

### Testing Phases

**Phase-by-Phase Testing:**
Each phase should be fully tested before moving to the next:

1. **Phase 1**: Unit tests for date filtering, integration tests for index creation
2. **Phase 2**: Property tests for inventory operations, unit tests for edge cases
3. **Phase 3**: Unit tests for archival logic, integration tests for cron job
4. **Phase 4**: Property tests for analytics calculations, unit tests for export functions
5. **Phase 5**: Property tests for cancellation rules, unit tests for refund logic
6. **Phase 6**: Property tests for category filtering, unit tests for CRUD operations
7. **Phase 7**: Integration tests for payment gateway, property tests for state transitions
8. **Phase 8**: Property tests for permissions, unit tests for staff operations

### Continuous Integration

**CI Pipeline:**
- Run all tests on every pull request
- Run property tests with fixed seed for reproducibility
- Fail build if coverage drops below targets
- Run integration tests against test database
- Generate coverage reports

**Pre-Deployment Testing:**
- Run full test suite including property tests with 1000 iterations
- Run integration tests against staging environment
- Verify payment gateway integration in sandbox mode
- Test database migrations

