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
    required: [true, 'Bid amount is required'],
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure bid amount is greater than current bid
bidSchema.pre('save', async function(next) {
  const AuctionItem = mongoose.model('AuctionItem');
  const item = await AuctionItem.findById(this.item);
  
  if (!item) {
    return next(new Error('Auction item not found'));
  }
  
  if (this.amount <= item.currentBid) {
    return next(new Error(`Bid must be greater than current bid of $${item.currentBid}`));
  }
  
  next();
});

// Update auction item currentBid after saving bid
bidSchema.post('save', async function() {
  const AuctionItem = mongoose.model('AuctionItem');
  // Use the utility function to update currentBid
  await AuctionItem.updateCurrentBid(this.item);
});

module.exports = mongoose.model('Bid', bidSchema);
