const express = require('express');
const {
  getPlatformStats,
  getRecentActivities,
  forceDeleteItem,
  forceDeleteBid
} = require('../controllers/superadminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();


router.use(protect, authorize('superadmin'));

router.get('/stats', getPlatformStats);
router.get('/activities', getRecentActivities);
router.delete('/items/:id', forceDeleteItem);
router.delete('/bids/:id', forceDeleteBid);

module.exports = router;
