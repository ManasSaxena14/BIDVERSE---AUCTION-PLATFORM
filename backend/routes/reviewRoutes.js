const express = require('express');
const { createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();

// POST /api/reviews - Create a review (Bidder only)
router.post('/', protect, authorize('bidder'), createReview);

// DELETE /api/reviews/:id - Delete a review (Reviewer or Superadmin)
router.delete('/:id', protect, deleteReview);

module.exports = router;