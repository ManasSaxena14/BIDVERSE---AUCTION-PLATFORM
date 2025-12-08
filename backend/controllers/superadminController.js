const User = require('../models/User');
const AuctionItem = require('../models/AuctionItem');
const Bid = require('../models/Bid');

// @desc    Get platform statistics
// @route   GET /api/superadmin/stats
// @access  Private (Superadmin only)
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBidders = await User.countDocuments({ role: 'bidder' });
    const totalAuctioneers = await User.countDocuments({ role: 'auctioneer' });
    const totalSuperadmins = await User.countDocuments({ role: 'superadmin' });
    
    const totalItems = await AuctionItem.countDocuments();
    const activeItems = await AuctionItem.countDocuments({ status: 'active' });
    const closedItems = await AuctionItem.countDocuments({ status: 'closed' });
    
    const totalBids = await Bid.countDocuments();
    
    // Calculate total bid value
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

    res.status(200).json({
      success: true,
      stats: {
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
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/superadmin/activities
// @access  Private (Superadmin only)
const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent items
    const recentItems = await AuctionItem.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent bids
    const recentBids = await Bid.find()
      .populate('user', 'name email')
      .populate('item', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      activities: {
        recentUsers,
        recentItems,
        recentBids
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete any auction item (admin override)
// @route   DELETE /api/superadmin/items/:id
// @access  Private (Superadmin only)
const forceDeleteItem = async (req, res) => {
  try {
    const item = await AuctionItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete all bids associated
    const Bid = require('../models/Bid');
    await Bid.deleteMany({ item: req.params.id });

    await AuctionItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item force deleted by superadmin'
    });
  } catch (error) {
    console.error('Force delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete any bid (admin override)
// @route   DELETE /api/superadmin/bids/:id
// @access  Private (Superadmin only)
const forceDeleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    await Bid.findByIdAndDelete(req.params.id);

    // Recalculate currentBid
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
      message: 'Bid force deleted by superadmin'
    });
  } catch (error) {
    console.error('Force delete bid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getRecentActivities,
  forceDeleteItem,
  forceDeleteBid
};
