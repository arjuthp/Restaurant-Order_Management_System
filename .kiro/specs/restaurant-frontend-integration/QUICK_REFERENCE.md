# Quick Reference Guide

## 🎯 Epic Overview

| Epic | Stories | Priority | Estimated Time |
|------|---------|----------|----------------|
| 1. Backend Fixes | 6 | 🔴 CRITICAL | 1-2 days |
| 2. Authentication | 4 | 🔴 CRITICAL | 2-3 days |
| 3. Product Browsing | 4 | 🔴 CRITICAL | 2 days |
| 4. Cart Management | 4 | 🔴 CRITICAL | 1 day |
| 5. Order Placement | 3 | 🔴 CRITICAL | 1-2 days |
| 6. Admin Products | 4 | 🔴 CRITICAL | 1.5 days |
| 7. Admin Orders | 3 | 🔴 CRITICAL | 1 day |
| 8. Reservations | 4 | 🟡 OPTIONAL | 2 days |

**Total MVP Time:** ~10-12 days  
**Total with Reservations:** ~12-14 days

---

## 📋 Story Checklist

### Phase 1: Backend Fixes (MUST DO FIRST)
- [ ] 1.1 File Upload for Product Images (6 criteria)
- [ ] 1.2 Pagination for All List Endpoints (8 criteria)
- [ ] 1.3 CORS Configuration Fix (5 criteria)
- [ ] 1.4 Standardized Response Formats (5 criteria)
- [ ] 1.5 Input Validation Middleware (6 criteria)
- [ ] 1.6 Search and Filter Capabilities (7 criteria)

### Phase 2: Authentication
- [ ] 2.1 User Login (8 criteria)
- [ ] 2.2 User Registration (8 criteria)
- [ ] 2.3 Protected Routes (6 criteria)
- [ ] 2.4 Logout (5 criteria)

### Phase 3: Customer Features
- [ ] 3.1 View Product Menu (8 criteria)
- [ ] 3.2 Search Products (7 criteria)
- [ ] 3.3 Filter Products by Category (6 criteria)
- [ ] 3.4 View Product Details (8 criteria)
- [ ] 4.1 Add Items to Cart (7 criteria)
- [ ] 4.2 View Cart (8 criteria)
- [ ] 4.3 Update Cart Quantities (7 criteria)
- [ ] 4.4 Remove Items from Cart (6 criteria)
- [ ] 5.1 Checkout Process (9 criteria)
- [ ] 5.2 View Order History (8 criteria)
- [ ] 5.3 View Order Details (8 criteria)

### Phase 4: Admin Features
- [ ] 6.1 View All Products (8 criteria)
- [ ] 6.2 Create Product (10 criteria)
- [ ] 6.3 Edit Product (8 criteria)
- [ ] 6.4 Delete Product (7 criteria)
- [ ] 7.1 View All Orders (8 criteria)
- [ ] 7.2 View Order Details (8 criteria)
- [ ] 7.3 Update Order Status (7 criteria)

### Phase 5: Reservations (Optional)
- [ ] 8.1 Check Table Availability (8 criteria)
- [ ] 8.2 Create Reservation (7 criteria)
- [ ] 8.3 View My Reservations (7 criteria)
- [ ] 8.4 Manage Reservations (7 criteria)

---

## 🔑 Key Acceptance Criteria by Feature

### File Upload
- Max 5MB file size
- JPEG, PNG, WebP only
- Admin only
- Returns image URL

### Pagination
- Default: 12 products, 10 others
- Max: 100 per page
- Returns: currentPage, totalPages, totalItems, itemsPerPage

### Authentication
- JWT tokens (access: 15min, refresh: 7 days)
- Bcrypt password hashing
- Role-based access (customer/admin)
- Auto token refresh

### Product Browsing
- Grid layout, 12 per page
- Search by name/description
- Filter by category
- Show availability status

### Cart
- LocalStorage persistence
- Max quantity: 10
- Real-time total calculation
- Sync to backend before checkout

### Orders
- Special instructions field
- Status tracking (pending → confirmed → preparing → delivered)
- Order history with filtering
- Admin can update status

---

## 🚫 Explicitly Out of Scope

1. Payment integration
2. Promo codes
3. Email notifications
4. Password reset
5. Product reviews
6. Real-time updates
7. Analytics dashboard
8. Multi-language
9. Social login
10. Delivery tracking
11. Inventory management
12. Employee management
13. Multi-restaurant
14. Mobile apps
15. Advanced search

---

## 📊 Technical Stack

### Backend
- Node.js 16+
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer (file upload)
- Express-validator

### Frontend
- React 18+
- TypeScript
- Vite
- Zustand (state)
- React Router v6
- Axios

---

## 🎯 Success Criteria

### Performance
- Page load < 3 seconds
- API response < 500ms (p95)

### Usability
- Mobile responsive (320px - 1920px)
- Touch-friendly (min 44x44px)
- Clear error messages

### Security
- HTTPS in production
- CORS restricted
- Input validation
- XSS prevention

### Accessibility
- Semantic HTML
- ARIA labels
- WCAG AA contrast
- Keyboard navigation

---

## 📅 Implementation Order

### Week 1: Foundation
**Days 1-2:** Backend fixes
- File upload endpoint
- Pagination
- CORS fix
- Response standardization
- Validation middleware

**Days 3-5:** Frontend foundation
- Type system
- API services
- Shared components
- Auth pages

### Week 2: Core Features
**Days 1-2:** Product browsing + Cart
**Days 3-4:** Order placement + History
**Day 5:** Admin product management

### Week 3: Admin & Polish
**Days 1-2:** Admin order management
**Days 3-4:** Responsive design + States
**Day 5:** Testing + Bug fixes

### Week 4: Enhancements (Optional)
**Days 1-2:** Reservations + Tables
**Days 3-4:** Profile + Settings
**Day 5:** Final polish

---

## 🔗 Document Navigation

**Start Here:**
1. `README.md` - Overview
2. `requirements.md` - Full requirements
3. `QUICK_REFERENCE.md` - This file

**Planning Docs:**
- `planning/00-MASTER_SUMMARY.md` - Project overview
- `planning/08-EXECUTION_PLAN.md` - Implementation guide
- `planning/09-FRONTEND_BACKEND_CONTRACT.md` - Type definitions

**Next Steps:**
1. Review requirements
2. Get sign-off
3. Create design.md
4. Create tasks.md
5. Start implementation

---

## 💡 Pro Tips

1. **Always start with backend fixes** - They block everything else
2. **Test auth thoroughly** - It's the foundation
3. **Build shared components first** - Reuse everywhere
4. **Mobile-first approach** - Easier to scale up
5. **Use TypeScript strictly** - Catch errors early
6. **Implement loading states** - Better UX
7. **Handle errors gracefully** - Show helpful messages
8. **Test cross-browser** - Don't assume it works
9. **Keep components small** - Easier to maintain
10. **Document as you go** - Future you will thank you

---

**Version:** 1.0  
**Last Updated:** March 18, 2026
