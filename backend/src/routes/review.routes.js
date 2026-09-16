const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', reviewController.getAllReviews);
router.post('/', protect, reviewController.createReview);

module.exports = router;
