// const express = require('express');
// const bookingController = require('../controllers/bookingController');
// const authController = require('../controllers/authController');

// // const router = express.Router({ mergeParams: true });
// const router = express.Router();

// // console.log(router.route(''));
// router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);

// router.use(authController.restrictTo('admin', 'lead-guide'));

// router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking);

// router
//   .route('/:id')
//   .get(bookingController.getBooking)
//   .patch(bookingController.updateBooking)
//   .delete(bookingController.deleteBooking);

// module.exports = router;
