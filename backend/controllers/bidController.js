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

  // Find the auction item
  const auctionItem = await AuctionItem.findById(item);
  
  if (!auctionItem) {
    return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
  }

  // Validate bid amount
  if (!amount || amount <= 0) {
    return next(new ErrorResponse('Protocol Violation: Invalid allocation amount.', 400));
  }

  // Check if auction is still active
  if (auctionItem.status === 'closed' || new Date() > auctionItem.endDate) {
    return next(new ErrorResponse('Protocol Violation: Targeted liquidation window has closed.', 400));
  }

  // Check if bid exceeds current bid
  if (amount <= auctionItem.currentBid) {
    return next(new ErrorResponse(`Valuation Failure: Bid must exceed current threshold of $${auctionItem.currentBid}.`, 400));
  }

  // Check if bid meets starting price requirement
  if (amount < auctionItem.startingPrice) {
    return next(new ErrorResponse(`Valuation Failure: Bid must meet minimum starting price of $${auctionItem.startingPrice}.`, 400));
  }

  try {
    // Check if user already has a bid on this item
    const existingBid = await Bid.findOne({
      user: req.user._id,
      item: item
    });

    let bid;
    if (existingBid) {
      // Update existing bid
      existingBid.amount = amount;
      await existingBid.save();
      bid = existingBid;
    } else {
      // Create new bid
      bid = await Bid.create({
        user: req.user._id,
        item,
        amount
      });
    }

    // Update the auction item's current bid
    auctionItem.currentBid = amount;
    await auctionItem.save();

    // Populate bid with user and item details
    const populatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    res.status(201).json({
      success: true,
      message: 'Capital allocation proposal successfully registered with the global terminal.',
      bid: populatedBid,
      currentBid: auctionItem.currentBid
    });
  } catch (error) {
    return next(new ErrorResponse(error.message || 'Transaction Failure: Could not finalize capital allocation proposal.', 500));
  }
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

  if (!amount || amount <= 0) {
    return next(new ErrorResponse('Protocol Violation: Invalid allocation parameters.', 400));
  }

  const bid = req.resource;
  const auctionItem = await AuctionItem.findById(bid.item);
  
  if (!auctionItem) {
    return next(new ErrorResponse('Registry Failure: Associated asset not found.', 404));
  }
  
  // Check if auction is still active
  if (auctionItem.status === 'closed' || new Date() > auctionItem.endDate) {
    return next(new ErrorResponse('Protocol Violation: Targeted liquidation window is no longer active.', 400));
  }

  // Check if new amount exceeds current bid
  if (amount <= auctionItem.currentBid && bid.amount !== auctionItem.currentBid) {
    return next(new ErrorResponse(`Valuation Failure: Updated allocation must exceed current threshold of $${auctionItem.currentBid}.`, 400));
  }

  try {
    // Update the bid
    bid.amount = amount;
    await bid.save();

    // Update auction item's current bid to highest bid
    await AuctionItem.updateCurrentBid(bid.item);

    const updatedBid = await Bid.findById(bid._id)
      .populate('user', 'name email')
      .populate('item', 'title currentBid');

    res.status(200).json({
      success: true,
      message: 'Capital proposal parameters successfully modified and re-syndicated.',
      bid: updatedBid
    });
  } catch (error) {
    return next(new ErrorResponse(error.message || 'Transaction Failure: Could not update capital proposal.', 500));
  }
});

/**
 * @desc    Rescind capital proposal (Delete Bid)
 * @route   DELETE /api/bids/:id
 * @access  Private (Owner, Superadmin)
 */
const deleteBid = asyncHandler(async (req, res, next) => {
  const bid = req.resource;

  try {
    // Delete the bid
    await Bid.findByIdAndDelete(bid._id);
    
    // Recalculate auction item's current bid based on remaining bids
    await AuctionItem.updateCurrentBid(bid.item);

    res.status(200).json({
      success: true,
      message: 'Capital proposal successfully rescinded and purged from the registry.'
    });
  } catch (error) {
    return next(new ErrorResponse(error.message || 'Transaction Failure: Could not rescind capital proposal.', 500));
  }
});

module.exports = {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid
};