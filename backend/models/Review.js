const mongoose = require('mongoose');

/**
 * Performance Audit Protocol (Review Schema)
 * Defines the qualitative assessment parameters for completed asset liquidations.
 */
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Compliance rating is required'],
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: [true, 'Institutional feedback is required']
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuctionItem',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auctioneerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Audit Integrity Index: Optimize for auctioneer performance lookups
 */
reviewSchema.index({ auctioneerId: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);