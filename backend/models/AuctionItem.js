const mongoose = require('mongoose');

/**
 * Asset Allocation Profile (AuctionItem Schema)
 * Defines the parameters for resource liquidation and valuation tracking.
 */
const auctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Asset title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Asset description is required']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Initial valuation is required'],
    min: 0
  },
  currentBid: {
    type: Number,
    default: function() {
      return this.startingPrice;
    }
  },
  category: {
    type: String,
    required: [true, 'Asset classification is required'],
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Auction+Asset'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endDate: {
    type: Date,
    required: [true, 'Liquidation deadline is required']
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Valuation Integrity Index: Optimize for scale and high-frequency querying
 */
auctionItemSchema.index({ status: 1, endDate: -1 });
auctionItemSchema.index({ category: 1, status: 1 });
auctionItemSchema.index({ currentBid: 1 });
auctionItemSchema.index({ title: 'text', description: 'text' });

/**
 * Virtual Definition: Synchronized expiration status
 */
auctionItemSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

/**
 * Temporal Synchronization: Automated liquidation for expired assets
 */
auctionItemSchema.statics.updateExpiredItems = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { endDate: { $lt: now }, status: 'active' },
    { $set: { status: 'closed' } }
  );
  return result;
};

/**
 * Registry Retrieval: Fetch assets with enforced temporal synchronization
 */
auctionItemSchema.statics.findWithUpdatedStatus = async function(query = {}, projection = null, options = {}) {
  await this.updateExpiredItems();
  return this.find(query, projection, options);
};

/**
 * Valuation Realignment: Recalculate current asset valuation based on proposal history
 */
auctionItemSchema.statics.updateCurrentBid = async function(itemId) {
  const Bid = require('./Bid');
  const item = await this.findById(itemId);
  
  if (!item) return;
  
  const highestBid = await Bid.findOne({ item: itemId }).sort({ amount: -1 });
  
  if (highestBid) {
    item.currentBid = highestBid.amount;
  } else {
    item.currentBid = item.startingPrice;
  }
  
  await item.save();
  return item;
};

module.exports = mongoose.model('AuctionItem', auctionItemSchema);