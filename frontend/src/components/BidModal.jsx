import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gavel, TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const BidModal = ({ isOpen, onClose, item, currentBid, onPlaceBid, loading = false, onBidSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const minBid = (currentBid || item?.startingPrice || 0) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < minBid) {
      setError(`Minimum bid is $${minBid.toLocaleString()}`);
      return;
    }

    try {
      await onPlaceBid({ item: item._id, amount: numAmount });
      setSuccess(true);
      // Call success callback if provided (to refresh parent data)
      if (onBidSuccess) {
        onBidSuccess();
      }
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const quickBids = [
    { label: '+$10', value: minBid + 10 },
    { label: '+$50', value: minBid + 50 },
    { label: '+$100', value: minBid + 100 },
    { label: '+$500', value: minBid + 500 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md relative overflow-hidden"
          >
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Place Your Bid</h3>
                  <p className="text-xs text-text-muted">
                    {item?.title || 'Auction Item'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Current Bid */}
            <div className="p-6 space-y-6">
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Highest Bid</p>
                <p className="text-3xl font-bold gradient-text-gold font-display">
                  ${(currentBid || item?.currentBid || item?.startingPrice || 0).toLocaleString()}
                </p>
              </div>

              {/* Bid Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Your Bid Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(''); }}
                      placeholder={minBid.toString()}
                      min={minBid}
                      step="0.01"
                      className="glass-input pl-8 text-lg font-semibold"
                      id="bid-amount-input"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Minimum: ${minBid.toLocaleString()}
                  </p>
                </div>

                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {quickBids.map((qb) => (
                    <button
                      key={qb.label}
                      type="button"
                      onClick={() => { setAmount(qb.value.toString()); setError(''); }}
                      className="py-2 rounded-lg text-xs font-medium bg-white/5 text-text-secondary hover:bg-gold-100 hover:text-gold border border-glass-border hover:border-gold/20 transition-all"
                    >
                      {qb.label}
                    </button>
                  ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-neon-green/10 border border-neon-green/20"
                    >
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                      <p className="text-sm text-neon-green font-medium">You are now leading!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full btn-neon-green py-4 text-base font-bold"
                  id="submit-bid-button"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Bid Placed!
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Place Bid
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BidModal;
