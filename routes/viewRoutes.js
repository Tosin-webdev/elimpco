const express = require('express');
const viewsController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/signup', viewsController.signup);
router.get('/signin', viewsController.signin);
router.get('/tour', viewsController.getTour);

module.exports = router;
