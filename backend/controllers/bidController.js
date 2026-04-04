const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const AuctionItem = require('../models/AuctionItem');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Propose new capital allocation (Create Bid)
 * @route   POST /api/bids
 * @access  Private (Bidder, Superadmin)
 */
const createBid = asyncHandler(async (req, res, next) => {
  const { item, amount } = req.body;

  /**
   * Execution: Atomic update to prevent collision and race conditions
   */
  const updatedItem = await AuctionItem.findOneAndUpdate(
    {
      _id: item,
      status: 'active',
      endDate: { $gt: new Date() },
      currentBid: { $lt: amount }
    },
    { $set: { currentBid: amount } },
    { new: true, runValidators: true }
  );

  if (!updatedItem) {
    const checkItem = await AuctionItem.findById(item);
    
    if (!checkItem) {
      return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
    }
    if (checkItem.status === 'closed' || new Date() > checkItem.endDate) {
      return next(new ErrorResponse('Protocol Violation: Targeted liquidation window has closed.', 400));
    }
    if (amount <= checkItem.currentBid) {
      return next(new ErrorResponse(`Valuation Failure: Minimum required allocation is $${checkItem.currentBid + 0.01}.`, 400));
    }
    return next(new ErrorResponse('Transaction Failure: Could not finalize capital allocation proposal. Please re-syndicate.', 400));
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

  const populatedBid = await Bid.findById(bid._id)
    .populate('user', 'name email')
    .populate('item', 'title currentBid');

  res.status(201).json({
    success: true,
    message: 'Capital allocation proposal successfully registered with the global terminal.',
    bid: populatedBid,
    currentBid: updatedItem.currentBid
  });
});

/**
 * @desc    Retrieve capital proposal history with registry filtering
 * @route   GET /api/bids
 * @access  Private
 */
const getBids = asyncHandler(async (req, res, next) => {
  const { item, user, sort = 'createdAt', page = 1, limit = 10 } = req.query;

  const query = {};
  if (item) query.item = item;
  if (user) query.user = user;

  let sortOption = { createdAt: -1 };
  if (sort === 'amount_desc') sortOption = { amount: -1 };
  else if (sort === 'amount_asc') sortOption = { amount: 1 };

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
});

/**
 * @desc    Retrieve specific capital proposal intelligence
 * @route   GET /api/bids/:id
 * @access  Private
 */
const getBidById = asyncHandler(async (req, res, next) => {
  const bid = await Bid.findById(req.params.id)
    .populate('user', 'name email')
    .populate('item', 'title currentBid');

  if (!bid) {
    return next(new ErrorResponse('Registry Failure: Specified proposal identifier not found.', 404));
  }

  res.status(200).json({
    success: true,
    bid
  });
});

/**
 * @desc    Modify existing capital proposal parameters
 * @route   PUT /api/bids/:id
 * @access  Private (Owner, Superadmin)
 */
const updateBid = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorResponse('Protocol Violation: Allocation parameters missing.', 400));
  }

  const bid = req.resource;
  const auctionItem = await AuctionItem.findById(bid.item);
  if (auctionItem.status === 'closed' || new Date() > auctionItem.endDate) {
    return next(new ErrorResponse('Protocol Violation: Targeted liquidation window is no longer active.', 400));
  }

  if (amount <= auctionItem.currentBid) {
    return next(new ErrorResponse(`Valuation Failure: Updated allocation must exceed current threshold of $${auctionItem.currentBid}.`, 400));
  }

  bid.amount = amount;
  await bid.save();

  await AuctionItem.updateCurrentBid(bid.item);

  const updatedBid = await Bid.findById(bid._id)
    .populate('user', 'name email')
    .populate('item', 'title currentBid');

  res.status(200).json({
    success: true,
    message: 'Capital proposal parameters successfully modified and re-syndicated.',
    bid: updatedBid
  });
});

/**
 * @desc    Rescind capital proposal (Delete Bid)
 * @route   DELETE /api/bids/:id
 * @access  Private (Owner, Superadmin)
 */
const deleteBid = asyncHandler(async (req, res, next) => {
  const bid = req.resource;

  await Bid.findByIdAndDelete(bid._id);
  await AuctionItem.updateCurrentBid(bid.item);

  res.status(200).json({
    success: true,
    message: 'Capital proposal successfully rescinded and purged from the registry.'
  });
});

module.exports = {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid
};