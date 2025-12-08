const AuctionItem = require('../models/AuctionItem');

// @desc    Create auction item
// @route   POST /api/items
// @access  Private (Auctioneer or Superadmin)
const createItem = async (req, res) => {
  try {
    const { title, description, startingPrice, category, image, endDate } = req.body;

    // Validation
    if (!title || !description || !startingPrice || !category || !endDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create item
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
      message: 'Auction item created successfully',
      item: populatedItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all auction items with pagination, search, sort, filter
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort, category, status, minPrice, maxPrice, createdBy } = req.query;

    // Build query
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by creator
    if (createdBy) {
      query.createdBy = createdBy;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.currentBid = {};
      if (minPrice) query.currentBid.$gte = Number(minPrice);
      if (maxPrice) query.currentBid.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: latest first
    if (sort === 'price_asc') sortOption = { currentBid: 1 };
    if (sort === 'price_desc') sortOption = { currentBid: -1 };
    if (sort === 'latest') sortOption = { createdAt: -1 };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // First update expired items
    await AuctionItem.updateExpiredItems();
    
    // Execute query
    const items = await AuctionItem.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Ensure item statuses are correct based on endDate
    const now = new Date();
    for (let item of items) {
      if (item.endDate < now && item.status !== 'closed') {
        item.status = 'closed';
        await item.save();
      }
    }

    const total = await AuctionItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single auction item with all bids
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    // Update expired items first
    await AuctionItem.updateExpiredItems();
    
    const item = await AuctionItem.findById(req.params.id).populate('createdBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Ensure item status is correct based on endDate
    const now = new Date();
    if (item.endDate < now && item.status !== 'closed') {
      item.status = 'closed';
      await item.save();
    }

    // Get all bids for this item
    const Bid = require('../models/Bid');
    const bids = await Bid.find({ item: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      item,
      bids
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update auction item
// @route   PUT /api/items/:id
// @access  Private (Owner Auctioneer or Superadmin)
const updateItem = async (req, res) => {
  try {
    const { title, description, startingPrice, category, image, endDate, status } = req.body;

    // Update expired items first
    await AuctionItem.updateExpiredItems();
    
    const item = await AuctionItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Update fields
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
      message: 'Auction item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete auction item
// @route   DELETE /api/items/:id
// @access  Private (Owner Auctioneer or Superadmin)
const deleteItem = async (req, res) => {
  try {
    // Update expired items first
    await AuctionItem.updateExpiredItems();
    
    const item = await AuctionItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    // Delete all bids associated with this item
    const Bid = require('../models/Bid');
    await Bid.deleteMany({ item: req.params.id });

    await AuctionItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Auction item and associated bids deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};