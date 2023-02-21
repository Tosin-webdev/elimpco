const express = require('express');
const viewsController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/signup', viewsController.signup);
router.get('/signin', viewsController.signin);
router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
// api/v1/tours/5c88fa8cf4afda39709c2970
