const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/signup', viewsController.signup);
router.get('/signin', viewsController.signin);
router.get('/tour/:slug', authController.protect, authController.isLoggedIn, viewsController.getTour);
router.get('/me', authController.protect, viewsController.getMe);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/404', viewsController.errorPage);

// router.post('/submit-user-data', viewsController.updateUserData);

module.exports = router;
// api/v1/tours/5c88fa8cf4afda39709c2970
