import { motion } from 'framer-motion';
import { Crown, TrendingUp, User } from 'lucide-react';
import { format } from 'date-fns';

const BidList = ({ bids = [], showItem = false }) => {
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No bids placed yet</p>
        <p className="text-sm text-text-muted">Be the first to bid!</p>
      </div>
    );
  }

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const highestBidId = sortedBids[0]?._id;

  return (
    <div className="space-y-2">
      {sortedBids.map((bid, index) => {
        const isHighest = bid._id === highestBidId;
        const isTop3 = index < 3;

        const rankColors = {
          0: 'text-gold border-gold/20 bg-gold-50',
          1: 'text-slate-300 border-slate-400/20 bg-slate-800/30',
          2: 'text-amber-600 border-amber-700/20 bg-amber-900/20',
        };

        return (
          <motion.div
            key={bid._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/3 ${
              isHighest ? 'glass-card border-gold/15' : 'border border-transparent'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
              isTop3 ? rankColors[index] : 'text-text-muted border-glass-border bg-white/3'
            }`}>
              {isHighest ? (
                <Crown className="w-4 h-4" />
              ) : (
                `#${index + 1}`
              )}
            </div>

            {/* Connector Line */}
            <div className="hidden sm:flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${isHighest ? 'bg-gold' : 'bg-text-muted/30'}`} />
              {index < sortedBids.length - 1 && (
                <div className="w-px h-6 bg-glass-border" />
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isHighest ? 'bg-gradient-gold' : 'bg-white/5 border border-glass-border'
              }`}>
                <span className={`text-xs font-bold ${isHighest ? 'text-bg-deep' : 'text-text-secondary'}`}>
                  {bid.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${isHighest ? 'text-gold' : 'text-text-primary'}`}>
                  {bid.user?.name || 'Anonymous'}
                </p>
                {bid.createdAt && (
                  <p className="text-[10px] text-text-muted">
                    {format(new Date(bid.createdAt), 'MMM d, h:mm a')}
                  </p>
                )}
              </div>
            </div>

            {/* Item (optional) */}
            {showItem && bid.item && (
              <div className="hidden md:block text-xs text-text-muted truncate max-w-32">
                {bid.item.title}
              </div>
            )}

            {/* Amount */}
            <div className="text-right">
              <p className={`text-sm font-bold font-display ${isHighest ? 'gradient-text-gold' : 'text-text-primary'}`}>
                ${bid.amount?.toLocaleString()}
              </p>
              {isHighest && (
                <span className="badge-gold text-[8px] py-0 px-1.5">HIGHEST</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BidList;