const Bid = require('../models/Bid');
const AuctionItem = require('../models/AuctionItem');

// @desc    Create/Place a bid
// @route   POST /api/bids
// @access  Private (Bidder or Superadmin)
const createBid = async (req, res) => {
  try {
    const { item, amount } = req.body;

    // Validation
    if (!item || !amount) {
      return res.status(400).json({ message: 'Please provide item ID and bid amount' });
    }

    // Check if auction item exists and is active
    const auctionItem = await AuctionItem.findById(item);
    if (!auctionItem) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    if (auctionItem.status === 'closed') {
      return res.status(400).json({ message: 'This auction is closed' });
    }

    if (new Date() > auctionItem.endDate) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Create bid (pre-save hook will validate amount > currentBid)
    const bid = await Bid.create({
      user: req.user._id,
      item,
      amount
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid: populatedBid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bids (optionally filter by item or user)
// @route   GET /api/bids
// @access  Private
const getBids = async (req, res) => {
  try {
    const { item, user, sort = 'createdAt', page = 1, limit = 10 } = req.query;

    const query = {};
    if (item) query.item = item;
    if (user) query.user = user;

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default sort by createdAt descending
    if (sort === 'amount_desc') {
      sortOption = { amount: -1 }; // Sort by amount descending
    } else if (sort === 'amount_asc') {
      sortOption = { amount: 1 }; // Sort by amount ascending
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bids = await Bid.find(query)
      .populate('user', 'name email')
      .populate('item', 'title currentBid')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Bid.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bids.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      bids
    });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single bid
// @route   GET /api/bids/:id
// @access  Private
const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.status(200).json({
      success: true,
      bid
    });
  } catch (error) {
    console.error('Get bid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update bid
// @route   PUT /api/bids/:id
// @access  Private (Owner Bidder or Superadmin)
const updateBid = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Please provide bid amount' });
    }

    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if auction is still active
    const auctionItem = await AuctionItem.findById(bid.item);
    if (auctionItem.status === 'closed' || new Date() > auctionItem.endDate) {
      return res.status(400).json({ message: 'Cannot update bid. Auction is closed or ended.' });
    }

    // Validate new amount
    if (amount <= auctionItem.currentBid && amount !== bid.amount) {
      return res.status(400).json({ 
        message: `Bid must be greater than current bid of $${auctionItem.currentBid}` 
      });
    }

    bid.amount = amount;
    await bid.save();
    
    // Recalculate currentBid for the auction item
    await AuctionItem.updateCurrentBid(bid.item);

    const updatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    res.status(200).json({
      success: true,
      message: 'Bid updated successfully',
      bid: updatedBid
    });
  } catch (error) {
    console.error('Update bid error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete bid
// @route   DELETE /api/bids/:id
// @access  Private (Owner Bidder or Superadmin)
const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    await Bid.findByIdAndDelete(req.params.id);

    // Recalculate currentBid for the auction item using the utility function
    await AuctionItem.updateCurrentBid(bid.item);

    res.status(200).json({
      success: true,
      message: 'Bid deleted successfully'
    });
  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid
};
