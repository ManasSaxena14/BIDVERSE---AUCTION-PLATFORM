const express = require('express');
const { createReview, getReviewsByAuction, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();


router.post('/', protect, authorize('bidder'), createReview);


router.get('/auction/:auctionId', getReviewsByAuction);


router.delete('/:id', protect, deleteReview);

module.exports = router;