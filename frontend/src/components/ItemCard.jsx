import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Tag, Eye } from 'lucide-react';
import AuctionTimer from './AuctionTimer';

const ItemCard = ({ item, index = 0 }) => {
  if (!item) return null;

  const isActive = item.status === 'active' && new Date(item.endDate) > new Date();
  const isEnding = isActive && (new Date(item.endDate) - Date.now()) < 3600000;

  const categoryColors = {
    'Electronics': 'badge-cyan',
    'Art': 'badge-purple',
    'Jewelry': 'badge-gold',
    'Vehicles': 'badge-green',
    'Fashion': 'badge-purple',
    'Collectibles': 'badge-gold',
    'Sports': 'badge-green',
    'Books': 'badge-cyan',
  };

  const badgeClass = categoryColors[item.category] || 'badge-gold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/items/${item._id}`} className="block" id={`item-card-${item._id}`}>
        <div className="glass-card overflow-hidden transition-all duration-300 group-hover:border-gold/20 group-hover:shadow-glow-gold-sm">
          {/* Image Container */}
          <div className="relative h-72 overflow-hidden border-b border-glass-border">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              {isActive ? (
                <span className={`badge-green font-black uppercase tracking-widest ${isEnding ? '!bg-red-500/12 !text-red-400 !border-red-500/20 animate-pulse' : ''}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isEnding ? 'bg-red-400' : 'bg-neon-green'}`} />
                  {isEnding ? 'ENDING SOON' : 'LIVE'}
                </span>
              ) : (
                <span className="badge-danger font-black uppercase tracking-widest">ENDED</span>
              )}
            </div>

            {/* Category */}
            <div className="absolute top-3 right-3">
              <span className={badgeClass}>
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
            </div>

            {/* Timer Overlay */}
            {isActive && (
              <div className="absolute bottom-3 left-3">
                <AuctionTimer endDate={item.endDate} size="sm" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-text-primary truncate group-hover:text-gold transition-colors font-display tracking-tight">
              {item.title}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Current Bid</p>
                <p className="text-3xl font-black gradient-text-gold font-display drop-shadow-md">
                  ${(item.currentBid || item.startingPrice || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-text-secondary bg-[#1A1A1A]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#1F1F1F]">
                <Eye className="w-4 h-4 text-neon-purple" />
                <span className="text-sm font-bold">{item.bids?.length || item.totalBids || 0} bids</span>
              </div>
            </div>

            {/* Seller Info */}
            {item.createdBy && (
              <div className="flex items-center gap-3 pt-4 mt-2 border-t border-[#1F1F1F]">
                <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold-sm">
                  <span className="text-xs font-black text-bg-deep font-display">
                    {item.createdBy.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Curator</span>
                  <span className="text-sm font-bold text-text-primary truncate">{item.createdBy.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ItemCard;
