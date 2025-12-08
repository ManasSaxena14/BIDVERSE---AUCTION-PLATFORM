const express = require('express');
const {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid
} = require('../controllers/bidController');
const { protect } = require('../middleware/auth');
const { authorize, authorizeOwnerOrAdmin } = require('../middleware/authorization');
const Bid = require('../models/Bid');

const router = express.Router();

// All bid routes are protected
router.post(
  '/',
  protect,
  authorize('bidder', 'superadmin'),
  createBid
); // Create bid

router.get('/', protect, getBids); // Get all bids (with filters)
router.get('/:id', protect, getBidById); // Get single bid

router.put(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(Bid, 'id', 'user'),
  updateBid
); // Update bid (owner or superadmin)

router.delete(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(Bid, 'id', 'user'),
  deleteBid
); // Delete bid (owner or superadmin)

module.exports = router;
