const Review = require('../models/Review');
const AuctionItem = require('../models/AuctionItem');
const User = require('../models/User');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Bidder only)
const createReview = async (req, res) => {
  try {
    const { rating, feedback, auctionId } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if auction exists
    const auction = await AuctionItem.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if auction is completed
    if (auction.status !== 'closed') {
      return res.status(400).json({ message: 'Can only review completed auctions' });
    }

    // Check if the user is the auctioneer (cannot review own auction)
    if (auction.createdBy.toString() === userId.toString()) {
      return res.status(403).json({ message: 'Cannot review your own auction' });
    }

    // Check if user participated in the auction (placed a bid)
    const Bid = require('../models/Bid');
    const userBid = await Bid.findOne({ item: auctionId, user: userId });
    if (!userBid) {
      return res.status(403).json({ message: 'Only participants can review auctions' });
    }

    // Auto-fetch auctioneerId from the auction item
    const auctioneerId = auction.createdBy;

    // Create review
    const review = await Review.create({
      rating,
      feedback,
      auctionId,
      reviewerId: userId,
      auctioneerId: auctioneerId
    });

    // Populate references for response
    await review.populate([
      { path: 'reviewerId', select: 'name email' },
      { path: 'auctionId', select: 'title' },
      { path: 'auctioneerId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Reviewer or Superadmin only)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is reviewer or superadmin
    if (review.reviewerId.toString() !== userId.toString() && userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Delete review
    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  deleteReview
};