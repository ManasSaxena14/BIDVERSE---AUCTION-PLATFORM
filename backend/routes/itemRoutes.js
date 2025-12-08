const express = require('express');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const { authorize, authorizeOwnerOrAdmin } = require('../middleware/authorization');
const AuctionItem = require('../models/AuctionItem');

const router = express.Router();

// Public routes
router.get('/', getItems); // Get all items with filters
router.get('/:id', getItemById); // Get single item with bids

// Protected routes
router.post(
  '/',
  protect,
  authorize('auctioneer', 'superadmin'),
  createItem
); // Create item

router.put(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  updateItem
); // Update item (owner or superadmin)

router.delete(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  deleteItem
); // Delete item (owner or superadmin)

module.exports = router;
