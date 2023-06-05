const express = require('express');
const app = express();
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.CreateReview
  );

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    reviewController.DeleteReview
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    reviewController.UpdateReview
  );

module.exports = router;
