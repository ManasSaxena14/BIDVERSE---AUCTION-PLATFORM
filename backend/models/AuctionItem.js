const mongoose = require('mongoose');

const auctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
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
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Auction+Item'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
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

// Better approach: Use a virtual field to determine if an item is expired
// This avoids interfering with queries and updates
auctionItemSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

// Method to manually update status for expired items
auctionItemSchema.statics.updateExpiredItems = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { endDate: { $lt: now }, status: 'active' },
    { $set: { status: 'closed' } }
  );
  return result;
};

// Method to get items with updated status
auctionItemSchema.statics.findWithUpdatedStatus = async function(query = {}, projection = null, options = {}) {
  // First update any expired items
  await this.updateExpiredItems();
  
  // Then execute the query
  return this.find(query, projection, options);
};

// Method to update currentBid based on highest bid
auctionItemSchema.statics.updateCurrentBid = async function(itemId) {
  const Bid = require('./Bid');
  const item = await this.findById(itemId);
  
  if (!item) return;
  
  // Find the highest bid for this item
  const highestBid = await Bid.findOne({ item: itemId }).sort({ amount: -1 });
  
  if (highestBid) {
    // Update currentBid to the highest bid amount
    item.currentBid = highestBid.amount;
  } else {
    // If no bids, set currentBid to startingPrice
    item.currentBid = item.startingPrice;
  }
  
  await item.save();
  return item;
};

module.exports = mongoose.model('AuctionItem', auctionItemSchema);