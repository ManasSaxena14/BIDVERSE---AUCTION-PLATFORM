const express = require('express');
const {
  getPlatformStats,
  getRecentActivities,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  forceDeleteItem,
  forceDeleteBid
} = require('../controllers/superadminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();

/**
 * Access Control: Restricted to Global Governance (Superadmin)
 */
router.use(protect, authorize('superadmin'));

/**
 * Platform Intelligence & Auditing
 */
router.get('/stats', getPlatformStats);
router.get('/activities', getRecentActivities);

/**
 * Entity Management & Strategic Operations
 */
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

/**
 * Strategic Asset & Capital Overrides
 */
router.delete('/items/:id', forceDeleteItem);
router.delete('/bids/:id', forceDeleteBid);

module.exports = router;

