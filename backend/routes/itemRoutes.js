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


router.get('/', getItems);
router.get('/:id', getItemById);


router.post(
  '/',
  protect,
  authorize('auctioneer', 'superadmin'),
  createItem
);

router.put(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  updateItem
);

router.delete(
  '/:id',
  protect,
  authorizeOwnerOrAdmin(AuctionItem, 'id', 'createdBy'),
  deleteItem
);

module.exports = router;
