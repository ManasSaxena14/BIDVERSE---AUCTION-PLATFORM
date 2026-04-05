const asyncHandler = require('express-async-handler');
const AuctionItem = require('../models/AuctionItem');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Initiate new asset allocation (Create Item)
 * @route   POST /api/items
 * @access  Private (Auctioneer, Superadmin)
 */
const createItem = asyncHandler(async (req, res, next) => {
  const { title, description, startingPrice, category, image, endDate } = req.body;

  const item = await AuctionItem.create({
    title,
    description,
    startingPrice,
    category,
    image,
    endDate,
    createdBy: req.user._id
  });

  const populatedItem = await AuctionItem.findById(item._id).populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Asset successfully allocated and registered in the global terminal.',
    item: populatedItem
  });
});

/**
 * @desc    Retrieve assets with global registry filtering and pagination
 * @route   GET /api/items
 * @access  Public
 */
const getItems = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search, sort, category, status, minPrice, maxPrice, createdBy } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) query.category = category;
  if (status) query.status = status;
  if (createdBy) query.createdBy = createdBy;

  if (minPrice || maxPrice) {
    query.currentBid = {};
    if (minPrice) query.currentBid.$gte = Number(minPrice);
    if (maxPrice) query.currentBid.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { currentBid: 1 };
  if (sort === 'price_desc') sortOption = { currentBid: -1 };
  if (sort === 'latest') sortOption = { createdAt: -1 };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  /**
   * Execution: Fetch assets with automated status synchronization
   */
  const items = await AuctionItem.findWithUpdatedStatus(query, null, {
    sort: sortOption,
    skip,
    limit: limitNum,
    populate: { path: 'createdBy', select: 'name email' }
  });

  const Bid = require('../models/Bid');
  const itemsWithBids = await Promise.all(items.map(async (item) => {
    const totalBids = await Bid.countDocuments({ item: item._id });
    const itemObj = item.toObject();
    itemObj.totalBids = totalBids;
    return itemObj;
  }));

  const total = await AuctionItem.countDocuments(query);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    items: itemsWithBids
  });
});

/**
 * @desc    Retrieve specific asset intelligence by identifier
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = asyncHandler(async (req, res, next) => {
  const items = await AuctionItem.findWithUpdatedStatus({ _id: req.params.id });
  const item = items[0];

  if (!item) {
    return next(new ErrorResponse('Asset Intelligence Failure: Specified identifier not found.', 404));
  }

  await item.populate('createdBy', 'name email');

  const Bid = require('../models/Bid');
  const bids = await Bid.find({ item: req.params.id })
    .populate('user', 'name email')
    .sort({ amount: -1 });

  res.status(200).json({
    success: true,
    item,
    bids
  });
});

/**
 * @desc    Modify existing asset parameters
 * @route   PUT /api/items/:id
 * @access  Private (Owner, Superadmin)
 */
const updateItem = asyncHandler(async (req, res, next) => {
  const { title, description, startingPrice, category, image, endDate, status } = req.body;
  let item = req.resource;

  if (title) item.title = title;
  if (description) item.description = description;
  if (startingPrice) item.startingPrice = startingPrice;
  if (category) item.category = category;
  if (image) item.image = image;
  if (endDate) item.endDate = endDate;
  if (status) item.status = status;

  await item.save();

  const updatedItem = await AuctionItem.findById(item._id).populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Asset parameters successfully modified and re-syndicated.',
    item: updatedItem
  });
});

/**
 * @desc    Initiate asset liquidation protocol (Delete Item)
 * @route   DELETE /api/items/:id
 * @access  Private (Owner, Superadmin)
 */
const deleteItem = asyncHandler(async (req, res, next) => {
  const item = req.resource;

  /**
   * Cascade: Purge all associated capital proposals
   */
  const Bid = require('../models/Bid');
  await Bid.deleteMany({ item: item._id });

  await AuctionItem.findByIdAndDelete(item._id);

  res.status(200).json({
    success: true,
    message: 'Asset and associated bid records have been purged from the global registry.'
  });
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};