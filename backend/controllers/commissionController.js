const asyncHandler = require('express-async-handler');
const Commission = require('../models/Commission');
const AuctionItem = require('../models/AuctionItem');
const Bid = require('../models/Bid');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Establish new capital settlement (Create Commission)
 * @route   POST /api/commissions
 * @access  Private (Superadmin)
 */
const createCommission = asyncHandler(async (req, res, next) => {
  const { auctionItemId, commissionRate } = req.body;

  const item = await AuctionItem.findById(auctionItemId);
  if (!item) {
    return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
  }

  /**
   * Protocol Analysis: Settlements can only be initiated post-liquidation
   */
  if (item.status !== 'closed') {
    return next(new ErrorResponse('Protocol Violation: Capital settlement is restricted to completed liquidations.', 400));
  }

  /**
   * Valuation Verification: Locate highest capital proposal
   */
  const winningBid = await Bid.findOne({ item: auctionItemId })
    .sort({ amount: -1 })
    .populate('user', 'name email');

  if (!winningBid) {
    return next(new ErrorResponse('Registry Failure: No valid capital proposals found for this asset.', 400));
  }

  /**
   * Redundancy Check: Verify if settlement already exists
   */
  const existingCommission = await Commission.findOne({ auctionItem: auctionItemId });
  if (existingCommission) {
    return next(new ErrorResponse('Identity Redundancy: Capital settlement already established for this asset.', 400));
  }

  const commission = await Commission.create({
    auctionItem: auctionItemId,
    seller: item.createdBy,
    winner: winningBid.user._id,
    finalBidAmount: winningBid.amount,
    commissionRate: commissionRate || 10
  });

  const populatedCommission = await Commission.findById(commission._id)
    .populate('auctionItem', 'title')
    .populate('seller', 'name email')
    .populate('winner', 'name email');

  res.status(201).json({
    success: true,
    message: 'Capital settlement successfully registered within the institutional registry.',
    commission: populatedCommission
  });
});

/**
 * @desc    Retrieve capital settlement history with governance filtering
 * @route   GET /api/commissions
 * @access  Private (Seller/Superadmin)
 */
const getCommissions = asyncHandler(async (req, res, next) => {
  const { status, seller } = req.query;
  const query = {};

  if (status) query.status = status;
  if (seller) query.seller = seller;

  /**
   * Access Pattern: Entities are restricted to their own settlement records
   */
  if (req.user.role !== 'superadmin') {
    query.seller = req.user._id;
  }

  const commissions = await Commission.find(query)
    .populate('auctionItem', 'title')
    .populate('seller', 'name email')
    .populate('winner', 'name email')
    .sort({ createdAt: -1 });

  const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPayout = commissions.reduce((sum, c) => sum + c.sellerPayout, 0);

  res.status(200).json({
    success: true,
    message: 'Settlement history successfully synchronized.',
    count: commissions.length,
    summary: {
      totalCommission,
      totalPayout,
      totalRevenue: totalCommission + totalPayout
    },
    commissions
  });
});

/**
 * @desc    Retrieve specific capital settlement intelligence
 * @route   GET /api/commissions/:id
 * @access  Private (Seller/Superadmin)
 */
const getCommissionById = asyncHandler(async (req, res, next) => {
  const commission = await Commission.findById(req.params.id)
    .populate('auctionItem', 'title')
    .populate('seller', 'name email')
    .populate('winner', 'name email');

  if (!commission) {
    return next(new ErrorResponse('Registry Failure: Targeted settlement identifier not found.', 404));
  }

  /**
   * Governance Check: Verify entity authorization for record retrieval
   */
  if (req.user.role !== 'superadmin' && commission.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Access Denied: Insufficient privileges to view this settlement record.', 403));
  }

  res.status(200).json({
    success: true,
    commission
  });
});

/**
 * @desc    Execute settlement status modification
 * @route   PUT /api/commissions/:id/status
 * @access  Private (Superadmin)
 */
const updateCommissionStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const commission = await Commission.findById(req.params.id);

  if (!commission) {
    return next(new ErrorResponse('Registry Failure: Targeted settlement identifier not found.', 404));
  }

  commission.status = status;
  if (status === 'paid') {
    commission.paidAt = new Date();
  }

  await commission.save();

  const updatedCommission = await Commission.findById(commission._id)
    .populate('auctionItem', 'title')
    .populate('seller', 'name email')
    .populate('winner', 'name email');

  res.status(200).json({
    success: true,
    message: 'Settlement status successfully modified and re-syndicated.',
    commission: updatedCommission
  });
});

/**
 * @desc    Rescind capital settlement (Delete Commission)
 * @route   DELETE /api/commissions/:id
 * @access  Private (Superadmin)
 */
const deleteCommission = asyncHandler(async (req, res, next) => {
  const commission = await Commission.findById(req.params.id);

  if (!commission) {
    return next(new ErrorResponse('Registry Failure: Targeted settlement identifier not found.', 404));
  }

  await Commission.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Capital settlement successfully rescinded and purged from the registry.'
  });
});

module.exports = {
  createCommission,
  getCommissions,
  getCommissionById,
  updateCommissionStatus,
  deleteCommission
};

