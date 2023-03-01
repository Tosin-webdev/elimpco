const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/signup', viewsController.signup);
router.get('/signin', viewsController.signin);
router.get('/tour/:slug', viewsController.getTour);
router.get('/me', viewsController.getMe);
router.get('/404', viewsController.errorPage);

module.exports = router;
// api/v1/tours/5c88fa8cf4afda39709c2970
