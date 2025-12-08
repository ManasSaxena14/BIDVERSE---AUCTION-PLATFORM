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

// All commission routes are protected
router.post('/', protect, authorize('superadmin'), createCommission);
router.get('/', protect, getCommissions); // Auctioneers can see their own
router.get('/:id', protect, getCommissionById);
router.put('/:id', protect, authorize('superadmin'), updateCommissionStatus);
router.delete('/:id', protect, authorize('superadmin'), deleteCommission);

module.exports = router;
