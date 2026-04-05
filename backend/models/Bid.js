const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuctionItem',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Capital allocation amount is required'],
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Performance Optimization: High-frequency transaction indexes
 */
bidSchema.index({ item: 1, amount: -1 }); // Optimized for "Highest Bid" lookups
bidSchema.index({ user: 1, createdAt: -1 }); // Optimized for user proposal history
bidSchema.index({ user: 1, item: 1 }, { unique: true }); // One bid per user per item

/**
 * Integrity Guard: Ensure all proposals meet the strictly increasing valuation protocol
 */
bidSchema.pre('save', async function(next) {
  const AuctionItem = mongoose.model('AuctionItem');
  const item = await AuctionItem.findById(this.item);
  
  if (!item) {
    return next(new Error('Registry Failure: Targeted asset not found.'));
  }
  
  if (this.amount <= item.currentBid) {
    return next(new Error(`Valuation Failure: Allocation must exceed current threshold of $${item.currentBid}`));
  }
  
  next();
});

/**
 * Synchronization: Update the asset's current valuation post-allocation
 */
bidSchema.post('save', async function() {
  const AuctionItem = mongoose.model('AuctionItem');
  await AuctionItem.updateCurrentBid(this.item);
});

module.exports = mongoose.model('Bid', bidSchema);

