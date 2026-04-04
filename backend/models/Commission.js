const mongoose = require('mongoose');

/**
 * Capital Settlement Protocol (Commission Schema)
 * Defines the financial redistribution parameters for completed asset liquidations.
 */
const commissionSchema = new mongoose.Schema({
  auctionItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuctionItem',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  finalBidAmount: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    required: true
  },
  sellerPayout: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Settlement Calculation: Automated redistribution logic for capital inflow
 */
commissionSchema.pre('save', function(next) {
  if (this.isNew) {
    this.commissionAmount = (this.finalBidAmount * this.commissionRate) / 100;
    this.sellerPayout = this.finalBidAmount - this.commissionAmount;
  }
  next();
});

module.exports = mongoose.model('Commission', commissionSchema);

