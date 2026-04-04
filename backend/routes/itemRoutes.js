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
const { itemValidation } = require('../middleware/validator');
const AuctionItem = require('../models/AuctionItem');

const router = express.Router();

/**
 * Public Asset Discovery Routes
 */
router.get('/', getItems);
router.get('/:id', getItemById);

/**
 * Restricted Asset Management Routes
 */
router.post(
  '/',
  protect,
  authorize('auctioneer', 'superadmin'),
  itemValidation.create,
  createItem
);

router.put(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  itemValidation.update,
  updateItem
);

router.delete(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  deleteItem
);

module.exports = router;

