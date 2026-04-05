import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBids } from '../context/BidContext';
import { useItems } from '../context/ItemContext';
import GamificationBadge, { calculateBadges, calculateLevel } from '../components/GamificationBadge';
import {
  User, Mail, Shield, Edit, Gavel, TrendingUp, DollarSign,
  Calendar, Award, ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserProfile = () => {
  const { user } = useAuth();
  const { bids, fetchBids } = useBids();
  const { items, fetchItems } = useItems();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchBids({ user: user?.id, limit: 500 }),
      fetchItems({ limit: 200 })
    ]).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const userBids = (bids || []).filter(b => (b.user?._id || b.user) === user?.id);
  const userItems = (items || []).filter(i => i.createdBy?._id === user?.id || i.createdBy === user?.id);
  const totalSpent = userBids.reduce((sum, b) => sum + (b.amount || 0), 0);
  const highestBid = userBids.length > 0 ? Math.max(...userBids.map(b => b.amount || 0)) : 0;
  const daysSinceJoin = user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt)) / 86400000) : 0;

  const level = calculateLevel(userBids.length);
  const badges = calculateBadges({
    totalBids: userBids.length,
    highestBid,
    auctionsCreated: userItems.length,
    daysSinceJoin,
    rank: 999
  });

  // Chart Data - bids over time
  const bidsByMonth = {};
  userBids.forEach(b => {
    const month = format(new Date(b.createdAt), 'MMM yyyy');
    if (!bidsByMonth[month]) bidsByMonth[month] = { month, total: 0, count: 0 };
    bidsByMonth[month].total += b.amount || 0;
    bidsByMonth[month].count++;
  });
  const chartData = Object.values(bidsByMonth).slice(-6);

  const roleBadge = {
    superadmin: { label: 'Super Admin', class: 'badge-danger' },
    auctioneer: { label: 'Auctioneer', class: 'badge-purple' },
    bidder: { label: 'Bidder', class: 'badge-green' },
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-text-primary font-medium">${payload[0].value?.toLocaleString()}</p>
        <p className="text-text-muted">{payload[0].payload.count} bids</p>
      </div>
    );
  };

  return (
    <div className="page-container" id="user-profile-page">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Info */}
            <div className="glass-card p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-glow-gold">
                <span className="text-3xl font-bold text-bg-deep font-display">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
              <p className="text-sm text-text-muted flex items-center justify-center gap-1 mt-1">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>

              <div className="mt-3">
                <span className={roleBadge[user?.role]?.class}>
                  <Shield className="w-3 h-3" />
                  {roleBadge[user?.role]?.label}
                </span>
              </div>

              {/* Level */}
              <div className="mt-6 glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${level.color}`}>{level.name}</span>
                  <span className="text-xs text-text-muted">Level {level.level}</span>
                </div>
                {level.next && (
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                      style={{ width: `${(level.xp / level.next) * 100}%` }}
                    />
                  </div>
                )}
                <p className="text-[10px] text-text-dim mt-1">
                  {level.next ? `${level.xp}/${level.next} XP to next level` : 'Max level reached!'}
                </p>
              </div>

              <Link to="/edit-profile" className="btn-gold-outline w-full mt-4">
                <Edit className="w-4 h-4" /> Edit Profile
              </Link>
            </div>

            {/* Badges */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Badges</h3>
              {badges.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">No badges earned yet. Start bidding!</p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center">
                  {badges.map((badgeId) => (
                    <GamificationBadge key={badgeId} badgeId={badgeId} size="md" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Stats & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Gavel, label: 'Total Bids', value: userBids.length, color: 'text-neon-green' },
                { icon: DollarSign, label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, color: 'text-gold' },
                { icon: TrendingUp, label: 'Highest Bid', value: `$${highestBid.toLocaleString()}`, color: 'text-neon-purple' },
                { icon: BarChart3, label: 'Auctions', value: userItems.length, color: 'text-neon-cyan' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="glass-card p-4">
                    <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                    <p className="text-xs text-text-muted">{stat.label}</p>
                    <p className="text-lg font-bold text-text-primary font-display">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Bid Activity Chart */}
            {chartData.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Bid Activity</h3>
                  <span className="badge-gold text-xs">{userBids.length} Total Bids</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#94A3B8', fontSize: 11 }} 
                      axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#94A3B8', fontSize: 11 }} 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(250, 204, 21, 0.2)', strokeWidth: 1 }} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#FACC15" 
                      fill="url(#goldGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#FACC15', r: 4, strokeWidth: 2, stroke: '#000' }}
                      activeDot={{ fill: '#FACC15', r: 6, strokeWidth: 2, stroke: '#000', filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Bids */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Recent Bids</h3>
              {userBids.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">No bids placed yet</p>
              ) : (
                <div className="space-y-2">
                  {userBids.slice(0, 10).map((bid, i) => (
                    <Link
                      key={bid._id}
                      to={`/items/${bid.item?._id || bid.item}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center">
                        <Gavel className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate group-hover:text-gold transition-colors">
                          {bid.item?.title || 'Auction Item'}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {bid.createdAt ? format(new Date(bid.createdAt), 'MMM d, yyyy h:mm a') : ''}
                        </p>
                      </div>
                      <span className="text-sm font-bold gradient-text-gold font-display">
                        ${bid.amount?.toLocaleString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
