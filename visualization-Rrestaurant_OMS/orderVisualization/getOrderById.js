/***CLIENT REQUEST
    ↓
GET /api/orders/65f8a1b2c3d4e5f6g7h8i9j0
    ↓
AUTH MIDDLEWARE
    → Verifies JWT token
    → Extracts: req.user = { id: "user456", role: "customer" }
    ↓
ROUTE HANDLER
    → Matches route pattern
    → Extracts: req.params.orderId = "65f8a1b2c3d4e5f6g7h8i9j0"
    ↓
CONTROLLER (getOrderByIdController)
    → Gets userId from req.user.id
    → Gets orderId from req.params.orderId
    → Gets userRole from req.user.role
    → Calls service function ↓
    ↓
SERVICE (getOrderById)
    → Queries database: Order.findById()
    → Populates user_id and items.product_id
    → Checks if order exists (404 if not)
    → Checks authorization (403 if denied)
    → Returns order object ↑
    ↓
CONTROLLER
    → Receives order from service
    → Wraps in success response
    → Sends JSON response ↓
    ↓
CLIENT RECEIVES
{
  success: true,
  data: { /* order object */ 

  