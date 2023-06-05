const express = require('express');
const router = express.Router();
const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedin, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedin, viewController.getTour);
router.get('/login', authController.isLoggedin, viewController.getLoginform);
router.get('/me', authController.protect, viewController.getMe);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
