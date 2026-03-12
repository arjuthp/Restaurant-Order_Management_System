src/
├── service/
│   ├── auth.service.js
│   │   ├── registerUser(name, email, password, role, phone, address)
│   │   ├── loginUser(email, password, requiredRole)
│   │   ├── refreshAccessToken(token)
│   │   ├── logout(token)
│   │   └── [Private Helper Methods]
│   │       ├── _findUserByEmail(email)
│   │       ├── _findUserById(userId)
│   │       ├── _verifyPassword(plainPassword, hashedPassword)
│   │       ├── _checkRole(user, requiredRole)
│   │       ├── _generateTokens(userId, userRole)
│   │       ├── _storeRefreshToken(userId, refreshToken)
│   │       ├── _formatUserResponse(user)
│   │       └── _generateAndStoreTokens(user)
│   │
│   ├── user.service.js
│   │   ├── getAllUsers()                    [Admin only]
│   │   ├── getUserById(userId)              [Admin only]
│   │   ├── updateUser(userId, updateData)   [Customer/Admin]
│   │   └── deleteUser(userId)               [Customer/Admin]
│   │
│   ├── product.service.js
│   │   ├── getAllProducts()                 [Public]
│   │   ├── getAvailableProducts()           [Public]
│   │   ├── getProductById(productId)        [Public]
│   │   ├── createProduct(productData)       [Admin only]
│   │   ├── updateProduct(productId, updateData)  [Admin only]
│   │   └── deleteProduct(productId)         [Admin only - soft delete]
│   │
│   ├── cart.service.js
│   │   ├── getCart(userId)                  [Customer only]
│   │   ├── addItemtoCart(userId, productId, quantity)  [Customer only]
│   │   ├── updateItemQuantity(userId, productId, quantity)  [Customer only]
│   │   ├── removeItemFromCart(userId, productId)  [Customer only]
│   │   └── clearCart(userId)                [Customer only]
│   │
│   └── order.service.js
│       ├── createOrder(userId, notes)       [Customer only]
│       ├── getMyOrders(userId)              [Customer only]
│       ├── getOrderById(userId, orderId, userRole)  [Customer/Admin]
│       ├── getAllOrders()                   [Admin only]
│       ├── updateOrderStatus(orderId, newStatus)  [Admin only]
│       ├── cancelOrder(userId, orderId)     [Customer only]
│       └── createPreOrderForReservation(userId, reservationId, notes)  [Customer only]
