import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService } from '../services';
import StatsCard from '../components/StatsCard';
import {
  Users, Package, Gavel, DollarSign, TrendingUp, Activity,
  Shield, Crown, BarChart3, UserCheck, UserX, Trash2,
  ChevronDown, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, actRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getActivities(20),
        adminService.getAllUsers({ limit: 50 }),
      ]);
      setStats(statsRes.stats);
      setActivities(actRes.activities);
      setUsers(usersRes.users || []);
    } catch (err) {
      addToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      addToast('User status updated', 'success');
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await adminService.deleteUser(userId);
      addToast('User deleted', 'success');
      loadData();
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      addToast('Role updated', 'success');
      loadData();
    } catch (err) {
      addToast('Failed to update role', 'error');
    }
  };

  // Chart Data
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = (stats?.monthlyTrend || []).map(t => ({
    name: monthNames[t._id.month] || t._id.month,
    revenue: t.revenue,
    count: t.count,
  }));

  const categoryData = (stats?.categoryBreakdown || []).map(c => ({
    name: c._id || 'Other',
    value: c.count,
    totalValue: c.totalValue,
  }));

  const pieColors = ['#FACC15', '#8B5CF6', '#22C55E', '#06B6D4', '#EF4444', '#F97316', '#EC4899', '#6366F1'];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-text-primary font-medium">${payload[0].value?.toLocaleString()}</p>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const roleBadge = {
    superadmin: 'badge-danger',
    auctioneer: 'badge-purple',
    bidder: 'badge-green',
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container" id="admin-dashboard-page">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-gold" />
              <span className="text-xs text-gold font-semibold uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Platform Dashboard</h1>
          </div>
          <button onClick={loadData} className="btn-gold-outline">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 glass-card p-1 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-gold-100 text-gold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={Users} label="Total Users" value={stats.users?.total || 0} color="purple" delay={0} />
              <StatsCard icon={Package} label="Total Auctions" value={stats.items?.total || 0} color="cyan" delay={100} />
              <StatsCard icon={Gavel} label="Total Bids" value={stats.bids?.total || 0} color="green" delay={200} />
              <StatsCard icon={DollarSign} label="Total Volume" value={stats.bids?.totalValue || 0} prefix="$" color="gold" delay={300} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              {trendData.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="adminGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#FACC15" fill="url(#adminGold)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Breakdown */}
              {categoryData.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Category Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={pieColors[i % pieColors.length]} opacity={0.8} />
                        ))}
                      </Pie>
                      <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="glass-card p-3 text-xs">
                            <p className="text-text-primary font-medium">{payload[0].name}</p>
                            <p className="text-text-muted">{payload[0].value} items</p>
                          </div>
                        );
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {categoryData.map((c, i) => (
                      <span key={c.name} className="flex items-center gap-1 text-xs text-text-muted">
                        <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Bidders & Auctioneers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-gold" /> Top Bidders
                </h3>
                {(stats.topBidders || []).map((b, i) => (
                  <div key={b._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <span className="text-xs font-bold text-text-muted w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{b.name}</p>
                      <p className="text-[10px] text-text-dim">{b.totalBids} bids</p>
                    </div>
                    <span className="text-sm font-bold gradient-text-gold font-display">${b.totalAmount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-neon-green" /> Top Auctioneers
                </h3>
                {(stats.topAuctioneers || []).map((a, i) => (
                  <div key={a._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <span className="text-xs font-bold text-text-muted w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{a.name}</p>
                      <p className="text-[10px] text-text-dim">{a.totalItems} items</p>
                    </div>
                    <span className="text-sm font-bold gradient-text-green font-display">${a.totalRevenue?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-glass-border">
              <p className="text-sm text-text-secondary">{users.length} users registered</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left p-4 text-xs text-text-muted uppercase tracking-wider">User</th>
                    <th className="text-left p-4 text-xs text-text-muted uppercase tracking-wider">Role</th>
                    <th className="text-left p-4 text-xs text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs text-text-muted uppercase tracking-wider">Joined</th>
                    <th className="text-right p-4 text-xs text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/3 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                            <span className="text-xs font-bold text-bg-deep">{u.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{u.name}</p>
                            <p className="text-xs text-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="glass-input py-1 px-2 text-xs w-32"
                          disabled={u._id === user?.id}
                        >
                          <option value="bidder">Bidder</option>
                          <option value="auctioneer">Auctioneer</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={u.status === 'active' ? 'badge-green' : 'badge-danger'}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-text-muted">
                        {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="p-4 text-right">
                        {u._id !== user?.id && (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleToggleStatus(u._id)}
                              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                              title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {u.status === 'active' ? (
                                <UserX className="w-4 h-4 text-text-muted" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-neon-green" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && activities && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Recent Bids</h3>
              <div className="space-y-2">
                {(activities.recentBids || []).map((bid, i) => (
                  <div key={bid._id || i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neon-green-dim flex items-center justify-center">
                      <Gavel className="w-4 h-4 text-neon-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        <span className="font-medium">{bid.user?.name}</span> bid on <span className="text-gold">{bid.item?.title}</span>
                      </p>
                      <p className="text-[10px] text-text-dim">
                        {bid.createdAt ? format(new Date(bid.createdAt), 'MMM d, yyyy h:mm a') : ''}
                      </p>
                    </div>
                    <span className="text-sm font-bold gradient-text-gold font-display">${bid.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
