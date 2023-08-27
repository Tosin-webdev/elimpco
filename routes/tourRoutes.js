const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewRouter = require('../routes/reviewRoutes');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// router.use(':/tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// POST /tour/2345/reviews
// GET /tour/234fad4/reviews
// GET /tour/23455/reviews/98765

// Fetch and create a review of a tour
router
  .route('/:tourId/reviews')
  .get(authController.protect, authController.restrictTo('user'), reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

module.exports = router;
