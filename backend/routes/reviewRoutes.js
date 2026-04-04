const express = require('express');
const { createReview, getReviewsByAuction, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();

/**
 * Access Control: New audit profiles restricted to verified participants
 */
router.post('/', protect, authorize('bidder'), createReview);

/**
 * Public Intelligence: Retrieve qualitative asset audit profile
 */
router.get('/auction/:auctionId', getReviewsByAuction);

/**
 * Governance: Auditor or Global Governance privileges required for rescission
 */
router.delete('/:id', protect, deleteReview);

module.exports = router;