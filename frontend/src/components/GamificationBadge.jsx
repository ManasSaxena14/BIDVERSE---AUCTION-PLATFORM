import { Trophy, Award, Star, Flame, Crown, Gem, Shield, Zap } from 'lucide-react';

const BADGE_CONFIG = {
  first_bid: { icon: Zap, label: 'First Bid', desc: 'Placed your first bid', color: 'gold', tier: 'bronze' },
  high_roller: { icon: Crown, label: 'High Roller', desc: 'Bid over $1,000', color: 'gold', tier: 'gold' },
  winning_streak: { icon: Flame, label: 'On Fire', desc: 'Won 3+ auctions', color: 'green', tier: 'silver' },
  auction_creator: { icon: Star, label: 'Creator', desc: 'Created first auction', color: 'purple', tier: 'bronze' },
  top_bidder: { icon: Trophy, label: 'Top Bidder', desc: 'Reached #1 on leaderboard', color: 'gold', tier: 'diamond' },
  collector: { icon: Gem, label: 'Collector', desc: 'Won 10+ items', color: 'cyan', tier: 'gold' },
  veteran: { icon: Shield, label: 'Veteran', desc: 'Member for 30+ days', color: 'purple', tier: 'silver' },
  elite: { icon: Award, label: 'Elite', desc: 'Top 5 bidder by volume', color: 'gold', tier: 'diamond' },
};

const TIER_STYLES = {
  bronze: { ring: 'ring-amber-700/30', bg: 'bg-amber-900/20', accent: 'text-amber-400' },
  silver: { ring: 'ring-slate-400/30', bg: 'bg-slate-700/20', accent: 'text-slate-300' },
  gold: { ring: 'ring-yellow-500/40', bg: 'bg-yellow-900/20', accent: 'text-yellow-400' },
  diamond: { ring: 'ring-cyan-400/40', bg: 'bg-cyan-900/20', accent: 'text-cyan-300' },
};

const COLOR_MAP = {
  gold: 'text-gold',
  green: 'text-neon-green',
  purple: 'text-neon-purple',
  cyan: 'text-neon-cyan',
};

export const calculateBadges = (userData = {}) => {
  const badges = [];
  const { totalBids = 0, totalWins = 0, highestBid = 0, auctionsCreated = 0, daysSinceJoin = 0, rank = 999 } = userData;

  if (totalBids >= 1) badges.push('first_bid');
  if (highestBid >= 1000) badges.push('high_roller');
  if (totalWins >= 3) badges.push('winning_streak');
  if (auctionsCreated >= 1) badges.push('auction_creator');
  if (rank <= 1) badges.push('top_bidder');
  if (totalWins >= 10) badges.push('collector');
  if (daysSinceJoin >= 30) badges.push('veteran');
  if (rank <= 5) badges.push('elite');

  return badges;
};

export const calculateLevel = (totalBids = 0) => {
  if (totalBids >= 100) return { level: 6, name: 'Diamond', color: 'text-cyan-300', xp: totalBids, next: null };
  if (totalBids >= 50) return { level: 5, name: 'Platinum', color: 'text-purple-300', xp: totalBids, next: 100 };
  if (totalBids >= 25) return { level: 4, name: 'Gold', color: 'text-yellow-400', xp: totalBids, next: 50 };
  if (totalBids >= 10) return { level: 3, name: 'Silver', color: 'text-slate-300', xp: totalBids, next: 25 };
  if (totalBids >= 3) return { level: 2, name: 'Bronze', color: 'text-amber-400', xp: totalBids, next: 10 };
  return { level: 1, name: 'Novice', color: 'text-text-secondary', xp: totalBids, next: 3 };
};

const GamificationBadge = ({ badgeId, size = 'md', showTooltip = true }) => {
  const config = BADGE_CONFIG[badgeId];
  if (!config) return null;

  const { icon: Icon, label, desc, color, tier } = config;
  const tierStyle = TIER_STYLES[tier];
  const iconColor = COLOR_MAP[color];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} rounded-xl ${tierStyle.bg} ${tierStyle.ring} ring-1 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:ring-2`}
      >
        <Icon className={`${iconSizes[size]} ${iconColor}`} />
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="glass-card px-3 py-2 text-center whitespace-nowrap">
            <p className={`text-xs font-semibold ${tierStyle.accent}`}>{label}</p>
            <p className="text-[10px] text-text-muted">{desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationBadge;
