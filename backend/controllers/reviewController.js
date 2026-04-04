const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const AuctionItem = require('../models/AuctionItem');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Establish new performance audit (Create Review)
 * @route   POST /api/reviews
 * @access  Private (Bidder/Participant)
 */
const createReview = asyncHandler(async (req, res, next) => {
  const { rating, feedback, auctionId } = req.body;
  const userId = req.user._id;

  /**
   * Validation: Compliance rating must align with protocol standards [1-5]
   */
  if (rating < 1 || rating > 5) {
    return next(new ErrorResponse('Compliance Failure: Rating must be constrained between 1 and 5.', 400));
  }

  const auction = await AuctionItem.findById(auctionId);
  if (!auction) {
    return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
  }

  /**
   * Protocol Analysis: Audit can only be initiated post-liquidation
   */
  if (auction.status !== 'closed') {
    return next(new ErrorResponse('Protocol Violation: Performance audits are restricted to completed liquidations.', 400));
  }

  /**
   * Conflict of Interest: Entities cannot audit their own asset allocations
   */
  if (auction.createdBy.toString() === userId.toString()) {
    return next(new ErrorResponse('Conflict of Interest: Entities are prohibited from auditing their own allocations.', 403));
  }

  /**
   * Participation Verification: Audit rights reserved for verified participants
   */
  const Bid = require('../models/Bid');
  const userBid = await Bid.findOne({ item: auctionId, user: userId });
  if (!userBid) {
    return next(new ErrorResponse('Access Denied: Performance audit rights are reserved for verified participants.', 403));
  }

  const auctioneerId = auction.createdBy;

  const review = await Review.create({
    rating,
    feedback,
    auctionId,
    reviewerId: userId,
    auctioneerId: auctioneerId
  });

  await review.populate([
    { path: 'reviewerId', select: 'name email' },
    { path: 'auctionId', select: 'title' },
    { path: 'auctioneerId', select: 'name email' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Performance audit successfully registered within the institutional registry.',
    review
  });
});

/**
 * @desc    Retrieve qualitative audit log for specific asset
 * @route   GET /api/reviews/auction/:auctionId
 * @access  Public
 */
const getReviewsByAuction = asyncHandler(async (req, res, next) => {
  const { auctionId } = req.params;

  const auction = await AuctionItem.findById(auctionId);
  if (!auction) {
    return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
  }

  const reviews = await Review.find({ auctionId })
    .populate([
      { path: 'reviewerId', select: 'name email' },
      { path: 'auctionId', select: 'title' },
      { path: 'auctioneerId', select: 'name email' }
    ])
    .sort({ createdAt: -1 }); 

  res.status(200).json({
    success: true,
    message: 'Audit log successfully synchronized.',
    count: reviews.length,
    reviews
  });
});

/**
 * @desc    Rescind performance audit (Delete Review)
 * @route   DELETE /api/reviews/:id
 * @access  Private (Owner, Superadmin)
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const review = await Review.findById(id);
  if (!review) {
    return next(new ErrorResponse('Registry Failure: Targeted audit identifier not found.', 404));
  }

  /**
   * Authorization: Audit modification rights restricted to the original auditor or global governance
   */
  if (review.reviewerId.toString() !== userId.toString() && userRole !== 'superadmin') {
    return next(new ErrorResponse('Access Denied: Insufficient privileges to rescind this audit.', 403));
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Performance audit successfully rescinded and purged from the registry.'
  });
});

module.exports = {
  createReview,
  getReviewsByAuction,
  deleteReview
};