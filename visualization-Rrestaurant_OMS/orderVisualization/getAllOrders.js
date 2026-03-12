/**PURPOSE
Retrieve all orders from the database with user and product details, sorted by newest first. Admin-only feature.

INPUTS
Route Level:

authorize('admin') middleware validates role before controller runs
Controller:

req - Express request object
res - Express response object
req.user.role - Already validated as 'admin' by middleware
Service:

None (no parameters needed)
Where they come from:

req.user → Set by auth middleware from JWT token
Authorization already handled by authorize('admin') middleware
CHECKS
Route Middleware (authorize('admin')):

✅ Validates req.user.role === 'admin'
✅ Blocks non-admins with 403 before reaching controller
Controller:

✅ Try-catch for error handling
Service:

✅ Implicit: Returns empty array if no orders exist
Not checking:

No pagination limits
No additional filters
ACTIONS
Middleware:

Verifies user role is 'admin'
Passes request to controller OR blocks with 403
Controller:

Calls orderService.getAllOrders()
Receives orders array
Sends response with status 200
Service:

Queries database: Order.find() (all orders, no filter)
Populates user_id with name, email, phone
Populates items.product_id with full product details
Sorts by createdAt: -1 (newest first)
Returns orders array */