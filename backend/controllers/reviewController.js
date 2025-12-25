const Review = require('../models/Review');
const AuctionItem = require('../models/AuctionItem');
const User = require('../models/User');


const createReview = async (req, res) => {
  try {
    const { rating, feedback, auctionId } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const auction = await AuctionItem.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }


    if (auction.status !== 'closed') {
      return res.status(400).json({ message: 'Can only review completed auctions' });
    }

    if (auction.createdBy.toString() === userId.toString()) {
      return res.status(403).json({ message: 'Cannot review your own auction' });
    }

    const Bid = require('../models/Bid');
    const userBid = await Bid.findOne({ item: auctionId, user: userId });
    if (!userBid) {
      return res.status(403).json({ message: 'Only participants can review auctions' });
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
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getReviewsByAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await AuctionItem.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
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
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.reviewerId.toString() !== userId.toString() && userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

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
  getReviewsByAuction,
  deleteReview
};