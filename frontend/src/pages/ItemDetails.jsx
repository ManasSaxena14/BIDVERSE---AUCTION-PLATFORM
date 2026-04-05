import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuctionTimer from '../components/AuctionTimer';
import BidList from '../components/BidList';
import BidModal from '../components/BidModal';
import {
  ArrowLeft, Gavel, Tag, User, Calendar, TrendingUp, Eye,
  Edit, Trash2, ExternalLink, Clock, DollarSign, Sparkles,
  Crown, Trophy, Zap, Flame, Shield, Star, Info
} from 'lucide-react';
import { format } from 'date-fns';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchItemById, deleteItem } = useItems();
  const { createBid, loading: bidLoading } = useBids();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModalOpen, setBidModalOpen] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const response = await fetchItemById(id);
      setItem(response.item);
      setBids(response.bids || []);
    } catch (err) {
      addToast('Failed to load item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (bidData) => {
    const response = await createBid(bidData);
    await loadItem();
    addToast('Bid placed successfully!', 'success');
    return response;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    try {
      await deleteItem(id);
      addToast('Auction deleted', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const isActive = item?.status === 'active' && new Date(item?.endDate) > new Date();
  const isOwner = user && item?.createdBy?._id === user.id;
  const canBid = user && (user.role === 'bidder' || user.role === 'superadmin') && isActive && !isOwner;

  if (loading) {
    return (
      <div className="page-container">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <div className="h-[500px] shimmer rounded-3xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 w-3/4 shimmer rounded-2xl" />
              <div className="h-32 shimmer rounded-2xl" />
              <div className="h-48 shimmer rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Item Not Found</h2>
          <Link to="/" className="btn-gold-outline mt-4 inline-flex">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container relative overflow-hidden" id="item-details-page">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <div className="section-container relative z-10">
        {/* Back Button with Premium Style */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} 
          className="btn-ghost mb-8 text-sm group hover:text-gold transition-all duration-300 px-6 py-3 rounded-full border border-transparent hover:border-gold/20 hover:bg-gold/5"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-semibold tracking-wide">Back to Marketplace</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="glass-card overflow-hidden rounded-3xl border-glass-border shadow-glass-lg group relative">
              <div className="relative overflow-hidden">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'}
                  alt={item.title}
                  className="w-full h-[450px] lg:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent opacity-60" />

                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  {isActive ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="badge-green shadow-glow-green-sm flex items-center gap-2 px-4 py-2 text-sm font-bold"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" style={{boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'}} /> 
                      LIVE AUCTION
                    </motion.div>
                  ) : (
                    <div className="badge-danger px-4 py-2 text-sm font-bold">AUCTION ENDED</div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-6 right-6">
                  <motion.span 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="badge-gold shadow-glow-gold-sm flex items-center gap-2 px-4 py-2 text-sm font-bold backdrop-blur-md"
                  >
                    <Tag className="w-4 h-4" /> {item.category}
                  </motion.span>
                </div>

                {/* Timer Overlay */}
                {isActive && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-6 left-6 right-6"
                  >
                    <div className="glass-dark rounded-2xl p-4 border-gold/20 shadow-glow-gold-sm">
                      <AuctionTimer endDate={item.endDate} size="lg" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Description Section */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-gold" />
                  <h3 className="text-base font-bold text-text-primary uppercase tracking-wider">Item Description</h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-lg font-light">{item.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Info + Bidding Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Pricing Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-3xl border-glass-border shadow-glass relative overflow-hidden group"
            >
              {/* Decorative Element */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl lg:text-4xl font-black text-text-primary font-display tracking-tight leading-tight">{item.title}</h1>
                  <Sparkles className="w-6 h-6 text-gold flex-shrink-0 ml-4 mt-1" />
                </div>

                {/* Price Display */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-5 text-center border border-glass-border hover:border-gold/20 transition-all duration-300 rounded-2xl"
                  >
                    <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-2 font-bold">Starting Price</p>
                    <p className="text-2xl font-black text-text-secondary font-display">${item.startingPrice?.toLocaleString()}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-5 text-center border border-gold/30 bg-gold/5 rounded-2xl shadow-glow-gold-sm relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-gold opacity-5" />
                    <p className="text-[10px] text-gold-dim uppercase tracking-[0.2em] mb-2 font-bold relative z-10">Current Bid</p>
                    <p className="text-3xl font-black gradient-text-gold font-display relative z-10 text-glow-gold">${(item.currentBid || item.startingPrice)?.toLocaleString()}</p>
                  </motion.div>
                </div>

                {/* Meta Information */}
                <div className="space-y-4 pt-6 border-t border-glass-border">
                  {item.createdBy && (
                    <motion.div 
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between text-sm group/item"
                    >
                      <span className="text-text-muted flex items-center gap-3 font-medium">
                        <div className="w-9 h-9 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center group-hover/item:border-gold/40 transition-colors">
                          <User className="w-4 h-4 text-gold" /> 
                        </div>
                        Seller
                      </span>
                      <span className="text-text-primary font-bold">{item.createdBy.name}</span>
                    </motion.div>
                  )}
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between text-sm group/item"
                  >
                    <span className="text-text-muted flex items-center gap-3 font-medium">
                      <div className="w-9 h-9 rounded-full bg-neon-purple/5 border border-neon-purple/20 flex items-center justify-center group-hover/item:border-neon-purple/40 transition-colors">
                        <Calendar className="w-4 h-4 text-neon-purple" /> 
                      </div>
                      End Date
                    </span>
                    <span className="text-text-primary font-bold">{format(new Date(item.endDate), 'MMM d, yyyy')}</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between text-sm group/item"
                  >
                    <span className="text-text-muted flex items-center gap-3 font-medium">
                      <div className="w-9 h-9 rounded-full bg-neon-green/5 border border-neon-green/20 flex items-center justify-center group-hover/item:border-neon-green/40 transition-colors">
                        <TrendingUp className="w-4 h-4 text-neon-green" /> 
                      </div>
                      Total Bids
                    </span>
                    <span className="text-text-primary font-bold">{bids.length} Bids</span>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  {canBid && (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBidModalOpen(true)}
                      className="w-full btn-neon-green py-5 text-base font-black animate-glow rounded-2xl shadow-glow-green flex items-center justify-center gap-3 group/btn"
                      id="place-bid-btn"
                    >
                      <Gavel className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                      <span>Place Your Bid Now</span>
                      <Zap className="w-5 h-5 group-hover/btn:animate-pulse" />
                    </motion.button>
                  )}

                  {user && !isActive && !isOwner && (
                    <div className="text-center py-4 px-6 rounded-2xl bg-danger/5 border border-danger/20">
                      <p className="text-sm text-danger font-semibold flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        This auction has ended
                      </p>
                    </div>
                  )}

                  {!user && (
                    <Link to="/login" className="w-full btn-gold py-4 inline-flex justify-center rounded-2xl text-lg font-bold shadow-glow-gold group/link">
                      <Crown className="w-5 h-5 mr-2 group-hover/link:animate-pulse" />
                      Sign in to Bid
                    </Link>
                  )}

                  {isOwner && (
                    <div className="flex gap-3 pt-4 border-t border-glass-border">
                      <Link to={`/update-item/${item._id}`} className="flex-1 btn-gold-outline py-3 rounded-xl font-semibold group/edit">
                        <Edit className="w-4 h-4 group-hover/edit:rotate-12 transition-transform" /> 
                        <span>Edit Auction</span>
                      </Link>
                      <button onClick={handleDelete} className="flex-1 btn-danger py-3 rounded-xl font-semibold group/delete">
                        <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" /> 
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bid History Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 rounded-3xl border-glass-border shadow-glass"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-gold" />
                  <h3 className="text-base font-bold text-text-primary uppercase tracking-wider">Bid History</h3>
                </div>
                {bids.length > 0 && (
                  <span className="badge-gold text-xs">{bids.length} Bids</span>
                )}
              </div>
              <BidList bids={bids} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        item={item}
        currentBid={item.currentBid}
        onPlaceBid={handlePlaceBid}
        loading={bidLoading}
        onBidSuccess={loadItem}
      />
    </div>
  );
};

export default ItemDetails;
