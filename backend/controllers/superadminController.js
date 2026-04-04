const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AuctionItem = require('../models/AuctionItem');
const Bid = require('../models/Bid');
const Commission = require('../models/Commission');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Compile global platform governance statistics
 * @route   GET /api/superadmin/stats
 * @access  Private (Superadmin)
 */
const getPlatformStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalBidders = await User.countDocuments({ role: 'bidder' });
  const totalAuctioneers = await User.countDocuments({ role: 'auctioneer' });
  const totalSuperadmins = await User.countDocuments({ role: 'superadmin' });

  const totalItems = await AuctionItem.countDocuments();
  const activeItems = await AuctionItem.countDocuments({ status: 'active' });
  const closedItems = await AuctionItem.countDocuments({ status: 'closed' });

  const totalBids = await Bid.countDocuments();

  /**
   * Financial Intelligence: Aggregate capital proposal statistics
   */
  const bidStats = await Bid.aggregate([
    {
      $group: {
        _id: null,
        totalBidValue: { $sum: '$amount' },
        avgBidValue: { $avg: '$amount' },
        maxBid: { $max: '$amount' },
        minBid: { $min: '$amount' }
      }
    }
  ]);

  /**
   * Trend Analysis: 6-month capital inflow tracking
   */
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyTrend = await Bid.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  /**
   * Performance Audit: Top 5 Active Bidders
   */
  const topBidders = await Bid.aggregate([
    {
      $group: {
        _id: '$user',
        totalAmount: { $sum: '$amount' },
        totalBids: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        name: '$user.name',
        email: '$user.email',
        totalAmount: 1,
        totalBids: 1
      }
    }
  ]);

  /**
   * Performance Audit: Top 5 Auctioneer Revenue Generation
   */
  const topAuctioneers = await AuctionItem.aggregate([
    {
      $group: {
        _id: '$createdBy',
        totalRevenue: { $sum: '$currentBid' },
        totalItems: { $sum: 1 },
        activeItems: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        name: '$user.name',
        email: '$user.email',
        totalRevenue: 1,
        totalItems: 1,
        activeItems: 1
      }
    }
  ]);

  /**
   * Asset Classification Breakdown
   */
  const categoryBreakdown = await AuctionItem.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalValue: { $sum: '$currentBid' },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const financeStats = await Commission.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$finalBidAmount' },
        totalExpenses: { $sum: '$sellerPayout' },
        netBalance: { $sum: '$commissionAmount' }
      }
    }
  ]);
  const finances = financeStats[0] || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  res.status(200).json({
    success: true,
    message: 'Governance statistics successfully compiled and synchronized.',
    stats: {
      finances,
      users: {
        total: totalUsers,
        bidders: totalBidders,
        auctioneers: totalAuctioneers,
        superadmins: totalSuperadmins
      },
      items: {
        total: totalItems,
        active: activeItems,
        closed: closedItems
      },
      bids: {
        total: totalBids,
        totalValue: bidStats[0]?.totalBidValue || 0,
        avgValue: bidStats[0]?.avgBidValue || 0,
        maxBid: bidStats[0]?.maxBid || 0,
        minBid: bidStats[0]?.minBid || 0
      },
      monthlyTrend,
      topBidders,
      topAuctioneers,
      categoryBreakdown
    }
  });
});

/**
 * @desc    Retrieve multi-dimensional protocol activity audit log
 * @route   GET /api/superadmin/activities
 * @access  Private (Superadmin)
 */
const getRecentActivities = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;

  const recentUsers = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentItems = await AuctionItem.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  const recentBids = await Bid.find()
    .populate('user', 'name email')
    .populate('item', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    message: 'Global protocol activity successfully retrieved.',
    activities: {
      recentUsers,
      recentItems,
      recentBids
    }
  });
});

/**
 * @desc    Retrieve comprehensive entity registry (Superadmin Governance)
 * @route   GET /api/superadmin/users
 * @access  Private (Superadmin)
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    message: 'Entity registry successfully synchronized.',
    users,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Execute strategic role reassignment
 * @route   PUT /api/superadmin/users/:id/role
 * @access  Private (Superadmin)
 */
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!['bidder', 'auctioneer', 'superadmin'].includes(role)) {
    return next(new ErrorResponse('Governance Error: Invalid role parameters provided.', 400));
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('Registry Failure: Targeted identifier not found.', 404));
  }

  res.status(200).json({ 
    success: true, 
    message: 'Strategic role reassignment successfully executed.', 
    user 
  });
});

/**
 * @desc    Execute strategic entity status modification (Toggle Status)
 * @route   PUT /api/superadmin/users/:id/status
 * @access  Private (Superadmin)
 */
const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('Registry Failure: Targeted identifier not found.', 404));
  }
  
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('Protocol Violation: Governance cannot suspend their own identity.', 400));
  }

  user.status = user.status === 'active' ? 'inactive' : 'active';
  await user.save();

  res.status(200).json({ 
    success: true, 
    message: `Strategic status modification: Identity status transitioning to ${user.status}.`, 
    user: { _id: user._id, status: user.status } 
  });
});

/**
 * @desc    Execute terminal entity liquidation (Delete User)
 * @route   DELETE /api/superadmin/users/:id
 * @access  Private (Superadmin)
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('Registry Failure: Targeted identifier not found.', 404));
  }

  /**
   * Cascade Liquidation: Purge all assets and capital proposals
   */
  await Bid.deleteMany({ user: req.params.id });
  const userItems = await AuctionItem.find({ createdBy: req.params.id });
  for (const item of userItems) {
    await Bid.deleteMany({ item: item._id });
  }
  await AuctionItem.deleteMany({ createdBy: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ 
    success: true, 
    message: 'Terminal entity liquidation successfully executed. All registry records purged.' 
  });
});

/**
 * @desc    Execute strategic asset override (Force Delete Item)
 * @route   DELETE /api/superadmin/items/:id
 * @access  Private (Superadmin)
 */
const forceDeleteItem = asyncHandler(async (req, res, next) => {
  const item = await AuctionItem.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse('Registry Failure: Targeted asset identifier not found.', 404));
  }

  await Bid.deleteMany({ item: req.params.id });
  await AuctionItem.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Strategic asset override successfully executed. Registry parameters purged.'
  });
});

/**
 * @desc    Execute strategic capital proposal override (Force Delete Bid)
 * @route   DELETE /api/superadmin/bids/:id
 * @access  Private (Superadmin)
 */
const forceDeleteBid = asyncHandler(async (req, res, next) => {
  const bid = await Bid.findById(req.params.id);

  if (!bid) {
    return next(new ErrorResponse('Registry Failure: Targeted proposal identifier not found.', 404));
  }

  await Bid.findByIdAndDelete(req.params.id);

  /**
   * Synchronization: Recalculate highest valuation post-override
   */
  const highestBid = await Bid.findOne({ item: bid.item }).sort({ amount: -1 });
  const auctionItem = await AuctionItem.findById(bid.item);

  if (highestBid) {
    auctionItem.currentBid = highestBid.amount;
  } else {
    auctionItem.currentBid = auctionItem.startingPrice;
  }

  await auctionItem.save();

  res.status(200).json({
    success: true,
    message: 'Strategic capital proposal override successfully executed. Valuation parameters synchronized.'
  });
});

module.exports = {
  getPlatformStats,
  getRecentActivities,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  forceDeleteItem,
  forceDeleteBid
};

