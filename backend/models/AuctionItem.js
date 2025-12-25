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


auctionItemSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});


auctionItemSchema.statics.updateExpiredItems = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { endDate: { $lt: now }, status: 'active' },
    { $set: { status: 'closed' } }
  );
  return result;
};


auctionItemSchema.statics.findWithUpdatedStatus = async function(query = {}, projection = null, options = {}) {

  await this.updateExpiredItems();
  

  return this.find(query, projection, options);
};


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