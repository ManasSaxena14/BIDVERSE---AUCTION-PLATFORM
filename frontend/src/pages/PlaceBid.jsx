import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useToast } from '../context/ToastContext';
import AuctionTimer from '../components/AuctionTimer';
import {
  ArrowLeft, Gavel, TrendingUp, DollarSign, Loader2, CheckCircle, AlertCircle, Zap
} from 'lucide-react';

const PlaceBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchItemById } = useItems();
  const { createBid, loading: bidLoading } = useBids();
  const { addToast } = useToast();
  const [item, setItem] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchItemById(id);
        setItem(response.item);
      } catch { addToast('Failed to load item', 'error'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const minBid = (item?.currentBid || item?.startingPrice || 0) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < minBid) {
      setError(`Minimum bid: $${minBid.toLocaleString()}`);
      return;
    }
    try {
      await createBid({ item: id, amount: numAmount });
      setSuccess(true);
      addToast('Bid placed! You are now leading this auction!', 'success');
      // Refresh item data to show updated current bid
      setTimeout(async () => {
        try {
          const response = await fetchItemById(id);
          setItem(response.item);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('Failed to refresh item:', err);
          }
        }
      }, 500);
      // Redirect to item details page after success
      setTimeout(() => navigate(`/items/${id}`), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  if (loading) {
    return <div className="page-container flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  if (!item) {
    return <div className="page-container flex items-center justify-center"><p className="text-text-muted">Item not found</p></div>;
  }

  return (
    <div className="page-container" id="place-bid-page">
      <div className="section-container max-w-xl">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent" />

          {/* Item Preview */}
          <div className="flex items-start gap-4 mb-8">
            <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-text-primary truncate">{item.title}</h2>
              <p className="text-sm text-text-muted">{item.category}</p>
              {item.status === 'active' && <AuctionTimer endDate={item.endDate} size="sm" />}
            </div>
          </div>

          {/* Current Bid Display */}
          <div className="glass-card p-6 text-center mb-8">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Highest Bid</p>
            <p className="text-4xl font-bold gradient-text-gold font-display">
              ${(item.currentBid || item.startingPrice)?.toLocaleString()}
            </p>
          </div>

          {/* Bid Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Your Bid</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  placeholder={minBid.toString()}
                  min={minBid}
                  step="0.01"
                  className="glass-input pl-10 text-xl font-bold"
                  id="bid-amount"
                />
              </div>
              <p className="text-xs text-text-muted mt-1">Minimum: ${minBid.toLocaleString()}</p>
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map(inc => (
                <button key={inc} type="button" onClick={() => { setAmount((minBid + inc).toString()); setError(''); }}
                  className="py-2 rounded-lg text-xs font-medium bg-white/5 text-text-secondary hover:bg-gold-100 hover:text-gold border border-glass-border transition-all">
                  +${inc}
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-green/10 border border-neon-green/20">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <p className="text-sm text-neon-green font-medium">Bid placed! You are now leading!</p>
                </div>
                <Link 
                  to="/leaderboard" 
                  className="block text-center py-2 px-4 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all text-sm font-bold"
                >
                  View Leaderboard
                </Link>
              </motion.div>
            )}

            <button type="submit" disabled={bidLoading || success} className="w-full btn-neon-green py-4 text-base font-bold" id="submit-bid">
              {bidLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <><CheckCircle className="w-5 h-5" /> Done!</> : <><Zap className="w-5 h-5" /> Place Bid</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PlaceBid;
