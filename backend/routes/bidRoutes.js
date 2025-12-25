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


router.post(
  '/',
  protect,
  authorize('bidder', 'superadmin'),
  createBid
);

router.get('/', protect, getBids);
router.get('/:id', protect, getBidById);

router.put(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(Bid, 'id', 'user'),
  updateBid
);

router.delete(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(Bid, 'id', 'user'),
  deleteBid
);

module.exports = router;
