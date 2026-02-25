
## 11. Complete Request Sequence — Real Example

Putting it all together — `POST /api/orders`:
```
1.  Client sends POST /api/orders with token in header

2.  cors()           → checks if request origin is allowed
3.  helmet()         → sets security headers
4.  express.json()   → parses req.body
5.  morgan()         → logs the request

6.  verifyToken()    → checks JWT token, attaches req.user
7.  verifyCustomer() → checks req.user.role === "customer"
8.  validateBody()   → checks req.body has required fields

9.  createOrder()    → controller runs:
      a. fetch cart
      b. validate cart not empty
      c. calculate total
      d. create order in DB
      e. delete cart from DB
      f. send 201 response

10. If anything throws → error middleware sends 500
```

---

## 12. Golden Rules of Sequencing

| Rule | Why |
|------|-----|
| Security before logic | Never run business logic on unauthenticated requests |
| Validate before database | Never query DB with unvalidated data |
| Read before write | Fetch existing data before modifying it |
| Write before cleanup | Confirm save succeeded before deleting related data |
| Error handler always last | It needs to catch everything above it |
| 404 handler after all routes | Otherwise it catches valid routes too |
| Parse before routes | `req.body` won't exist without it |

---

## 13. Folder Structure That Supports Good Sequencing
```
src/
├── app.js              ← middleware sequence lives here
├── server.js           ← starts the server
├── routes/             ← defines route + middleware chain
├── middleware/         ← auth, validation, error handler
├── controllers/        ← handles request/response
├── services/           ← business logic
├── models/             ← database schemas
└── utils/              ← helpers
```

Each layer only talks to the layer below it:
```
Routes → Controllers → Services → Models → Database