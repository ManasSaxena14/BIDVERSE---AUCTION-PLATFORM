const express = require('express');
const {
  createCommission,
  getCommissions,
  getCommissionById,
  updateCommissionStatus,
  deleteCommission
} = require('../controllers/commissionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const router = express.Router();

/**
 * Access Control: New capital settlement strategies restricted to Global Governance
 */
router.post('/', protect, authorize('superadmin'), createCommission);

/**
 * Platform Intelligence: Retrieve settlement history records
 */
router.get('/', protect, getCommissions);
router.get('/:id', protect, getCommissionById);

/**
 * Governance: Settlement status overrides and record liquidation
 */
router.put('/:id/status', protect, authorize('superadmin'), updateCommissionStatus);
router.delete('/:id', protect, authorize('superadmin'), deleteCommission);

module.exports = router;

