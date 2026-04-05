import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBids } from '../context/BidContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { ArrowLeft, Edit, Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const UpdateBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bids, fetchBids, updateBid, loading: bidLoading } = useBids();
  const { addToast } = useToast();
  const [bid, setBid] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/bids/${id}`);
        setBid(response.data.bid);
        setAmount(response.data.bid?.amount?.toString() || '');
      } catch { addToast('Failed to load bid', 'error'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= (bid?.amount || 0)) {
      setError('New amount must be higher than current bid');
      return;
    }
    try {
      await updateBid(id, { amount: numAmount });
      setSuccess(true);
      addToast('Bid updated successfully!', 'success');
      setTimeout(() => navigate(`/items/${bid?.item?._id || bid?.item}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bid');
    }
  };

  if (loading) {
    return <div className="page-container flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  return (
    <div className="page-container" id="update-bid-page">
      <div className="section-container max-w-xl">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-neon-purple-dim flex items-center justify-center">
              <Edit className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Update Bid</h1>
              <p className="text-sm text-text-muted">{bid?.item?.title || 'Auction Item'}</p>
            </div>
          </div>

          <div className="glass-card p-4 text-center mb-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Bid</p>
            <p className="text-2xl font-bold gradient-text-gold font-display">${bid?.amount?.toLocaleString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2">New Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold text-lg">$</span>
                <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  min={(bid?.amount || 0) + 1} step="0.01" className="glass-input pl-10 text-xl font-bold" id="update-bid-amount" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400" /><p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 p-3 rounded-xl bg-neon-green/10 border border-neon-green/20">
                <CheckCircle className="w-4 h-4 text-neon-green" /><p className="text-sm text-neon-green font-medium">Bid updated!</p>
              </motion.div>
            )}

            <button type="submit" disabled={bidLoading || success} className="w-full btn-neon-purple py-4 text-base font-bold" id="update-bid-btn">
              {bidLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><TrendingUp className="w-5 h-5" /> Update Bid</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateBid;
