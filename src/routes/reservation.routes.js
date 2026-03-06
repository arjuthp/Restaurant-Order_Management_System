const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.contollers');
const { authorize } = require('../auth/auth.middlewares');

//public routes
router.get('/availability', reservationController.checkAvailability);

//customer routes
router.post('/', authorize('customer'), reservationController.createReservation);
router.get('/my-reservations', authorize('customer'), reservationController.getMyReservations);
router.get('/:id', authorize('customer'), reservationController.getReservationById);
router.patch('/:id/cancel', authorize('customer'), reservationController.cancelReservation);

//ADMIN Routes
router.get('/admin/all', authorize('admin'), reservationController.getAllReservations);
router.patch('/admin/:id/status', authorize('admin'), reservationController.updateReservationStatus);

module.exports = router;