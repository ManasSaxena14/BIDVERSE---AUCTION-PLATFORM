import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBids } from '../context/BidContext';
import { useItems } from '../context/ItemContext';
import GamificationBadge, { calculateLevel, calculateBadges } from '../components/GamificationBadge';
import { Trophy, Crown, Medal, Award, Star } from 'lucide-react';

const Leaderboard = () => {
  const { bids, fetchBids } = useBids();
  const { items, fetchItems } = useItems();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchBids({ limit: 1000 }),
      fetchItems({ limit: 200 })
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Aggregate bidder stats
  const bidderMap = {};
  (bids || []).forEach((bid) => {
    const userId = bid.user?._id || bid.user;
    if (!userId) return;
    if (!bidderMap[userId]) {
      bidderMap[userId] = {
        id: userId,
        name: bid.user?.name || 'Anonymous',
        email: bid.user?.email || '',
        totalBids: 0,
        itemMaxBids: {}, // Keep track of highest bid per item
      };
    }
    bidderMap[userId].totalBids++;
    
    const itemId = bid.item?._id || bid.item;
    if (itemId) {
      if (!bidderMap[userId].itemMaxBids[itemId]) {
        bidderMap[userId].itemMaxBids[itemId] = 0;
      }
      bidderMap[userId].itemMaxBids[itemId] = Math.max(bidderMap[userId].itemMaxBids[itemId], bid.amount || 0);
    }
  });

  const leaderboard = Object.values(bidderMap)
    .map((b) => {
      // Calculate total portfolio volume as the sum of max bids per unique item
      const totalAmount = Object.values(b.itemMaxBids).reduce((sum, val) => sum + val, 0);
      const itemCount = Object.keys(b.itemMaxBids).length;
      const level = calculateLevel(b.totalBids);
      const badges = calculateBadges({ 
        totalBids: b.totalBids, 
        totalWins: itemCount, // Assuming item count as a proxy for participation win for gamification
        highestBid: Math.max(...Object.values(b.itemMaxBids), 0),
        rank: 999 // Rank will be assigned after sort
      });
      return {
        ...b,
        itemCount,
        totalAmount,
        level,
        badges
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .map((b, i) => ({ ...b, rank: i + 1 })); // Explicit rank assignment

  const podiumOrder = [1, 0, 2]; // silver, gold, bronze positions
  const topThree = leaderboard.slice(0, 3);

  const podiumConfig = [
    { rank: 1, icon: Crown, color: 'text-gold', bg: 'bg-[#121212]', glowLayer: 'bg-gold/20', border: 'border-gold/40', glow: 'shadow-[0_0_80px_-10px_rgba(250,204,21,0.6)]', height: 'h-64', label: 'Grandmaster' },
    { rank: 2, icon: Award, color: 'text-slate-300', bg: 'bg-[#0A0A0A]', glowLayer: 'bg-slate-400/10', border: 'border-slate-400/30', glow: 'shadow-[0_0_40px_-10px_rgba(148,163,184,0.3)]', height: 'h-48', label: 'Elite' },
    { rank: 3, icon: Medal, color: 'text-amber-600', bg: 'bg-[#0A0A0A]', glowLayer: 'bg-amber-700/10', border: 'border-amber-700/30', glow: 'shadow-[0_0_40px_-10px_rgba(180,83,9,0.3)]', height: 'h-40', label: 'Veteran' },
  ];

  return (
    <div className="page-container relative overflow-hidden" id="leaderboard-page">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#111111] border border-gold/20 mb-6 shadow-glow-gold-sm"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-xs text-gold uppercase tracking-[0.25em] font-bold">Hall of Fame</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-text-primary mb-6 font-display tracking-tight drop-shadow-xl">
            Global Leaderboard
          </h1>
          <p className="text-lg text-text-secondary font-light max-w-xl mx-auto">
            The most prestigious bidders on the platform. Status forged through legendary acquisitions.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-8 shimmer h-24 border-[#1F1F1F]" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="glass-card max-w-lg mx-auto text-center py-24 border-[#1F1F1F]">
            <Trophy className="w-16 h-16 text-text-muted mx-auto mb-6 opacity-30" />
            <h3 className="text-2xl font-black text-text-primary mb-3 font-display">Vacuum of Power</h3>
            <p className="text-text-secondary font-light">No bids have been placed yet. The throne is empty.</p>
          </div>
        ) : (
          <>
            {/* Grand Podium */}
            {topThree.length >= 3 && (
              <div className="flex items-end justify-center gap-4 sm:gap-8 mb-24 px-4 pt-10 mt-10">
                {podiumOrder.map((podiumIdx) => {
                  const bidder = topThree[podiumIdx];
                  const config = podiumConfig[podiumIdx];
                  if (!bidder) return null;

                  return (
                    <motion.div
                      key={bidder.id}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: podiumIdx === 0 ? 0.2 : podiumIdx * 0.3, type: 'spring', damping: 15 }}
                      className={`flex flex-col items-center relative ${podiumIdx === 0 ? 'order-2 z-20 scale-110' : podiumIdx === 1 ? 'order-1 z-10' : 'order-3 z-10'} w-1/3 max-w-[220px]`}
                    >
                      {/* Ambient Dust particles specialized for podium */}
                      {podiumIdx === 0 && (
                        <div className="absolute -top-20 w-40 h-40 bg-gold/10 blur-[60px] animate-pulse rounded-full pointer-events-none" />
                      )}

                      {/* Avatar Hologram */}
                      <div className={`relative mb-8 group cursor-default`}>
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${config.bg} border-2 ${config.border} ${config.glow} flex items-center justify-center relative overflow-hidden backdrop-blur-3xl`}>
                          <div className={`absolute inset-0 ${config.glowLayer} animate-pulse-glow`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                          <span className={`text-4xl sm:text-6xl font-black ${config.color} font-display relative z-10 drop-shadow-2xl`}>
                            {bidder.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <motion.div 
                          animate={{ y: [0, -5, 0] }} 
                          transition={{ repeat: Infinity, duration: 3 }}
                          className={`absolute -top-4 -right-4 w-12 h-12 rounded-full bg-bg-deep border-4 ${config.border} flex items-center justify-center shadow-2xl z-20`}
                        >
                          <config.icon className={`w-6 h-6 ${config.color}`} />
                        </motion.div>
                      </div>

                      <div className="text-center px-2 z-20 mb-6">
                        <p className="text-lg sm:text-xl font-black text-text-primary truncate w-full mb-1 tracking-tight">{bidder.name}</p>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mb-3">{config.label}</p>
                        <div className={`text-2xl sm:text-3xl font-black font-display ${config.color} tracking-tighter drop-shadow-xl`}>
                          ${bidder.totalAmount.toLocaleString()}
                        </div>
                      </div>

                      {/* Monolith Pillar */}
                      <div className={`w-full rounded-t-3xl bg-gradient-to-t from-[#050505] to-[#121212] border-x-2 border-t-2 ${config.border} flex items-start pt-8 justify-center ${config.height} relative overflow-hidden shadow-2xl group`}>
                         {/* Scanline Effect */}
                        <div className="absolute inset-x-0 top-0 h-1/2 w-full bg-gradient-to-b from-white/[0.05] to-transparent -translate-y-full group-hover:animate-shimmer-slow pointer-events-none" />
                        
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${config.color.split('-')[1]} to-transparent opacity-80`} />
                        <span className={`text-7xl font-black ${config.color} opacity-[0.03] font-display select-none`}>{config.rank}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Exclusive Roster Table */}
            <div className="glass-card overflow-hidden border-[#1F1F1F]">
              <div className="p-6 border-b border-[#1F1F1F] bg-[#111111]">
                <div className="grid grid-cols-12 gap-4 text-xs text-text-muted uppercase tracking-[0.15em] font-bold">
                  <div className="col-span-1 md:col-span-1 text-center">Pos</div>
                  <div className="col-span-6 md:col-span-5">Identity</div>
                  <div className="hidden md:block md:col-span-2 text-center">Status</div>
                  <div className="col-span-2 md:col-span-1 text-center">Items</div>
                  <div className="col-span-3 md:col-span-3 text-right">Acquisition Vol.</div>
                </div>
              </div>

              <div className="divide-y divide-[#1F1F1F]">
                {leaderboard.map((bidder, i) => {
                  const rankColors = {
                    0: 'text-gold',
                    1: 'text-slate-300',
                    2: 'text-amber-700',
                  };
                  return (
                    <motion.div
                      key={bidder.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                      className={`grid grid-cols-12 gap-4 items-center p-8 transition-all duration-500 hover:bg-[#0A0A0A] group relative overflow-hidden border-b border-white/5 ${i === 0 ? 'bg-gold/[0.03]' : 'bg-[#050505]'}`}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-y-0 left-0 w-1 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                      <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer-slow pointer-events-none" />

                      {/* Rank Position */}
                      <div className="col-span-1 md:col-span-1 flex justify-center">
                        <span className={`text-lg font-black font-display ${rankColors[i] || 'text-text-muted opacity-30 group-hover:opacity-100 transition-opacity'}`}>
                          {i < 3 ? <Star className={`w-6 h-6 ${rankColors[i]} fill-current drop-shadow-lg`} /> : `${i + 1 < 10 ? '0' : ''}${i + 1}`}
                        </span>
                      </div>
 
                      {/* Identity */}
                      <div className="col-span-6 md:col-span-4 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative overflow-hidden group-hover:rotate-3 ${i < 3 ? 'bg-[#0D0D0D] border-gold/40 shadow-glow-gold-sm' : 'bg-[#121212] border-white/10 group-hover:border-white/30'}`}>
                           <div className={`absolute inset-0 bg-gradient-to-br ${i === 0 ? 'from-gold/20 to-transparent' : 'from-white/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                           <span className={`text-xl font-black font-display relative z-10 ${i < 3 ? 'text-gold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            {bidder.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-lg font-black truncate tracking-tight ${i < 3 ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}>{bidder.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex gap-1">
                                {(bidder.badges || []).slice(0, 3).map((badgeId, bIdx) => (
                                   <GamificationBadge key={bIdx} badgeId={badgeId} size="sm" showTooltip={true} />
                                ))}
                             </div>
                             <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{bidder.totalBids} BIDS</span>
                          </div>
                        </div>
                      </div>
 
                      {/* Status/Level */}
                      <div className="hidden md:block md:col-span-3 text-center">
                         <div className="flex flex-col items-center">
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl transition-all duration-500 ${i < 3 ? 'border-gold/40 text-gold bg-gold/10' : 'border-white/10 bg-white/5 text-text-muted group-hover:border-white/30 group-hover:text-text-primary'}`}>
                              {bidder.level.name} LEVEL
                            </span>
                            <div className="w-24 h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                               <div className="h-full bg-gold" style={{ width: `${Math.min((bidder.totalBids / (bidder.level.next || 100)) * 100, 100)}%` }} />
                            </div>
                         </div>
                      </div>
 
                      {/* Item Count */}
                      <div className="col-span-2 md:col-span-1 text-center font-black font-display text-text-primary tabular-nums">
                        {bidder.itemCount}
                      </div>
 
                      {/* Total Volume */}
                      <div className="col-span-3 md:col-span-3 text-right">
                        <div className="flex flex-col items-end">
                           <span className={`text-2xl font-black font-display tracking-tight leading-none ${i === 0 ? 'gradient-text-gold animate-glow-soft' : i < 3 ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                            ${bidder.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-text-muted font-bold tracking-widest group-hover:text-gold/60 transition-colors uppercase mt-1">Volume Portfolio</span>
                        </div>
                      </div>
                    </motion.div>

                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
