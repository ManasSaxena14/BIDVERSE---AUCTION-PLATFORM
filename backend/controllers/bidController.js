const Bid = require('../models/Bid');
const AuctionItem = require('../models/AuctionItem');


const createBid = async (req, res) => {
  try {
    const { item, amount } = req.body;


    if (!item || !amount) {
      return res.status(400).json({ message: 'Please provide item ID and bid amount' });
    }


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


    if (amount <= auctionItem.currentBid) {
      return res.status(400).json({ 
        message: `Bid amount must be greater than current bid of $${auctionItem.currentBid}` 
      });
    }


    const existingBid = await Bid.findOne({
      user: req.user._id,
      item: item
    });

    let bid;
    if (existingBid) {

      existingBid.amount = amount;

      await existingBid.save();
      bid = existingBid;
    } else {

      bid = await Bid.create({
        user: req.user._id,
        item,
        amount
      });
    }


    auctionItem.currentBid = amount;
    await auctionItem.save();


    const populatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid: populatedBid,
      currentBid: auctionItem.currentBid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(400).json({ message: error.message });
  }
};


const getBids = async (req, res) => {
  try {
    const { item, user, sort = 'createdAt', page = 1, limit = 10 } = req.query;

    const query = {};
    if (item) query.item = item;
    if (user) query.user = user;


    let sortOption = { createdAt: -1 };
    if (sort === 'amount_desc') {
      sortOption = { amount: -1 };
    } else if (sort === 'amount_asc') {
      sortOption = { amount: 1 };
    }


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


    const auctionItem = await AuctionItem.findById(bid.item);
    if (auctionItem.status === 'closed' || new Date() > auctionItem.endDate) {
      return res.status(400).json({ message: 'Cannot update bid. Auction is closed or ended.' });
    }


    if (amount <= auctionItem.currentBid && amount !== bid.amount) {
      return res.status(400).json({
        message: `Bid must be greater than current bid of $${auctionItem.currentBid}`
      });
    }

    bid.amount = amount;
    await bid.save();


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


const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    await Bid.findByIdAndDelete(req.params.id);


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