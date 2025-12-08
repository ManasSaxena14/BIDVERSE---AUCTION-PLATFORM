const Commission = require('../models/Commission');
const AuctionItem = require('../models/AuctionItem');
const Bid = require('../models/Bid');

// @desc    Create commission for completed auction
// @route   POST /api/commissions
// @access  Private (Superadmin only)
const createCommission = async (req, res) => {
  try {
    const { auctionItemId, commissionRate } = req.body;

    const item = await AuctionItem.findById(auctionItemId);
    if (!item) {
      return res.status(404).json({ message: 'Auction item not found' });
    }

    if (item.status !== 'closed') {
      return res.status(400).json({ message: 'Auction must be closed to create commission' });
    }

    // Get winning bid
    const winningBid = await Bid.findOne({ item: auctionItemId })
      .sort({ amount: -1 })
      .populate('user', 'name email');

    if (!winningBid) {
      return res.status(400).json({ message: 'No bids found for this auction' });
    }

    // Check if commission already exists
    const existingCommission = await Commission.findOne({ auctionItem: auctionItemId });
    if (existingCommission) {
      return res.status(400).json({ message: 'Commission already created for this auction' });
    }

    const commission = await Commission.create({
      auctionItem: auctionItemId,
      seller: item.createdBy,
      winner: winningBid.user._id,
      finalBidAmount: winningBid.amount,
      commissionRate: commissionRate || 10
    });

    const populatedCommission = await Commission.findById(commission._id)
      .populate('auctionItem', 'title')
      .populate('seller', 'name email')
      .populate('winner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Commission created successfully',
      commission: populatedCommission
    });
  } catch (error) {
    console.error('Create commission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all commissions
// @route   GET /api/commissions
// @access  Private (Superadmin or own commissions)
const getCommissions = async (req, res) => {
  try {
    const { status, seller } = req.query;
    const query = {};

    if (status) query.status = status;
    if (seller) query.seller = seller;

    // If not superadmin, only show own commissions as seller
    if (req.user.role !== 'superadmin') {
      query.seller = req.user._id;
    }

    const commissions = await Commission.find(query)
      .populate('auctionItem', 'title')
      .populate('seller', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPayout = commissions.reduce((sum, c) => sum + c.sellerPayout, 0);

    res.status(200).json({
      success: true,
      count: commissions.length,
      summary: {
        totalCommission,
        totalPayout,
        totalRevenue: totalCommission + totalPayout
      },
      commissions
    });
  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single commission
// @route   GET /api/commissions/:id
// @access  Private
const getCommissionById = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('auctionItem', 'title')
      .populate('seller', 'name email')
      .populate('winner', 'name email');

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    // Check authorization
    if (req.user.role !== 'superadmin' && commission.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this commission' });
    }

    res.status(200).json({
      success: true,
      commission
    });
  } catch (error) {
    console.error('Get commission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update commission status
// @route   PUT /api/commissions/:id
// @access  Private (Superadmin only)
const updateCommissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const commission = await Commission.findById(req.params.id);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    commission.status = status;
    if (status === 'paid') {
      commission.paidAt = new Date();
    }

    await commission.save();

    const updatedCommission = await Commission.findById(commission._id)
      .populate('auctionItem', 'title')
      .populate('seller', 'name email')
      .populate('winner', 'name email');

    res.status(200).json({
      success: true,
      message: 'Commission status updated',
      commission: updatedCommission
    });
  } catch (error) {
    console.error('Update commission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete commission
// @route   DELETE /api/commissions/:id
// @access  Private (Superadmin only)
const deleteCommission = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await Commission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Commission deleted successfully'
    });
  } catch (error) {
    console.error('Delete commission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCommission,
  getCommissions,
  getCommissionById,
  updateCommissionStatus,
  deleteCommission
};
