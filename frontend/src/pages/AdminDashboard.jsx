import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineChartBar, 
  HiOutlineUsers, 
  HiOutlineClock, 
  HiOutlineTrophy, 
  HiOutlineCurrencyDollar, 
  HiOutlineBanknotes, 
  HiOutlineBuildingLibrary, 
  HiOutlineUser, 
  HiOutlineTag, 
  HiOutlineClipboardDocumentList, 
  HiOutlineMicrophone, 
  HiOutlineFlag, 
  HiOutlinePhoto, 
  HiStar
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService } from '../services';

const Sparkline = ({ data, color = '#D4AF37' }) => {
  if (!data || data.length === 0) return null;
  const vals = data.map(d => d.revenue);
  const max = Math.max(...vals, 1);
  const w = 120, h = 40;
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1 || 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

const monthName = (m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];

const StatCard = ({ label, value, sub, icon: Icon, accent = '#D4AF37', trend }) => (
  <div className="relative overflow-hidden bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
    <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none" />
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-[#D4AF37]"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <Icon />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-3xl font-extrabold text-[#F7F7F7] mb-1 tracking-tight">{value}</div>
    <div className="text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">{label}</div>
    {sub && <div className="text-xs text-[#E5E4E2]/50 mt-1">{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-[#F7F7F7] tracking-wider uppercase mb-5 flex items-center gap-3">
    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#B8860B]" />
    {children}
  </h2>
);

const RoleBadge = ({ role }) => {
  const map = {
    superadmin: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40',
    auctioneer: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    bidder: 'bg-white/10 text-[#E5E4E2] border-white/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${map[role] || map.bidder}`}>
      {role === 'superadmin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'superadmin') navigate('/');
  }, [user, navigate]);

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const [statsRes, actRes] = await Promise.all([
        adminService.getStats(),
        adminService.getActivities(15)
      ]);
      setStats(statsRes.stats);
      setActivities(actRes.activities);
    } catch (err) {
      addToast('Failed to load dashboard stats', 'error');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminService.getAllUsers({
        search: userSearch || undefined,
        role: userRoleFilter || undefined,
        limit: 50
      });
      setUsers(res.users);
      setUsersTotal(res.total);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab, loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingRole(userId);
      await adminService.updateUserRole(userId, newRole);
      addToast('User role updated successfully', 'success');
      loadUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update role', 'error');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId);
      addToast(`User marked as ${currentStatus === 'active' ? 'inactive' : 'active'}`, 'success');
      loadUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to toggle user status', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return;
    try {
      await adminService.deleteUser(userId);
      addToast('User deleted', 'success');
      loadUsers();
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this auction?')) return;
    try {
      await adminService.forceDeleteItem(itemId);
      addToast('Auction deleted', 'success');
      loadStats();
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const fmt = (n) => typeof n === 'number' ? n.toLocaleString() : '—';
  const fmtMoney = (n) => typeof n === 'number' ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—';

  if (loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center font-bold tracking-widest text-[#D4AF37] uppercase animate-pulse">Loading...</div>
      </div>
    );
  }

  const s = stats || {};
  const trend = s.monthlyTrend || [];
  const maxRev = Math.max(...trend.map(t => t.revenue), 1);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HiOutlineChartBar },
    { id: 'users', label: 'Users', icon: HiOutlineUsers },
    { id: 'activity', label: 'Activity', icon: HiOutlineClock },
    { id: 'performers', label: 'Performers', icon: HiOutlineTrophy },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="relative border-b border-[#D4AF37]/20 py-10 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-green-400 tracking-widest text-white/40">Secure Admin Panel</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#F7F7F7] tracking-tight">BidVerse <span className="text-[#D4AF37]">Internal</span></h1>
          </div>
          <button onClick={loadStats} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">Sync Platform</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-[#D4AF37] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-white/40 border border-white/5'
              }`}
            >
              <tab.icon className="text-lg" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Income" value={fmtMoney(s.finances?.totalIncome)} icon={HiOutlineCurrencyDollar} accent="#34d399" />
              <StatCard label="Expenses" value={fmtMoney(s.finances?.totalExpenses)} icon={HiOutlineBanknotes} accent="#f87171" />
              <StatCard label="Net Balance" value={fmtMoney(s.finances?.netBalance)} icon={HiOutlineBuildingLibrary} accent="#a78bfa" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={fmt(s.users?.total)} icon={HiOutlineUser} />
              <StatCard label="Auctions" value={fmt(s.items?.active)} icon={HiOutlineTag} accent="#60a5fa" />
              <StatCard label="Total Bids" value={fmt(s.bids?.total)} icon={HiOutlineClipboardDocumentList} accent="#a78bfa" />
              <StatCard label="Max Bid" value={fmtMoney(s.bids?.maxBid)} icon={HiOutlineTrophy} accent="#D4AF37" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard label="Bidders" value={fmt(s.users?.bidders)} icon={HiOutlineUsers} />
              <StatCard label="Vendors" value={fmt(s.users?.auctioneers)} icon={HiOutlineMicrophone} />
              <StatCard label="Finished" value={fmt(s.items?.closed)} icon={HiOutlineFlag} />
              <StatCard label="Minimum" value={fmtMoney(s.bids?.minBid)} icon={HiOutlineChartBar} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
                <SectionTitle>Monthly Trends</SectionTitle>
                <div className="space-y-4">
                  {trend.map((t, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-white/20 w-10 uppercase">{monthName(t._id.month)}</span>
                      <div className="flex-1 bg-[#0D0D0D] rounded-lg h-3 overflow-hidden border border-white/5">
                        <div className="h-full bg-[#D4AF37]" style={{ width: `${maxRev > 0 ? (t.revenue / maxRev) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37] w-20 text-right">{fmtMoney(t.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
                <SectionTitle>Category Allocation</SectionTitle>
                <div className="space-y-4">
                  {(s.categoryBreakdown || []).map((cat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-white/20 w-24 uppercase truncate">{cat._id}</span>
                      <div className="flex-1 bg-[#0D0D0D] rounded-lg h-2 overflow-hidden border border-white/5">
                        <div className="h-full bg-[#D4AF37]/40" style={{ width: `${(cat.count / Math.max(...(s.categoryBreakdown || []).map(c => c.count), 1)) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white/60 w-20 text-right">{cat.count} Units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
              <input type="text" placeholder="Search accounts..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50" />
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40">
                <option value="">All Tiers</option>
                <option value="bidder">Bidders</option>
                <option value="auctioneer">Auctioneers</option>
                <option value="superadmin">Admins</option>
              </select>
              <button onClick={loadUsers} className="px-8 py-3 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold uppercase text-xs tracking-widest">Execute Filter</button>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0D0D0D] border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  <tr>
                    <th className="px-8 py-5">Identity</th>
                    <th className="px-8 py-5">Credentials</th>
                    <th className="px-8 py-5">Access Tier</th>
                    <th className="px-8 py-5">Lifecycle</th>
                    <th className="px-8 py-5">Registry Date</th>
                    <th className="px-8 py-5 text-right">Commands</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-black text-xs uppercase">{u.name?.charAt(0)}</div><span className="font-bold text-white/80">{u.name}</span></div></td>
                      <td className="px-8 py-5 text-white/40">{u.email}</td>
                      <td className="px-8 py-5"><RoleBadge role={u.role} /></td>
                      <td className="px-8 py-5">
                        <button onClick={() => handleStatusToggle(u._id, u.status)} disabled={u._id === user?.id} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${u.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{u.status}</button>
                      </td>
                      <td className="px-8 py-5 text-[#E5E4E2]/20 font-bold text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u._id !== user?.id && (
                            <>
                              <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="bg-[#0D0D0D] border border-white/5 text-[10px] uppercase font-bold rounded-lg px-2 py-1.5 focus:border-[#D4AF37]/40 outline-none">
                                <option value="bidder">Promote to Bidder</option>
                                <option value="auctioneer">Promote to Vendor</option>
                                <option value="superadmin">Authorize Admin</option>
                              </select>
                              <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-[10px] font-black uppercase text-red-500/40 hover:text-red-500 transition-colors">Terminate</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
              <SectionTitle>Bidding Stream</SectionTitle>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {(activities?.recentBids || []).map(bid => (
                  <div key={bid._id} className="flex items-center gap-4 p-5 rounded-xl bg-[#0D0D0D] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]"><HiOutlineTag /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white/80">{bid.user?.name}</div>
                      <div className="text-[10px] font-bold text-white/20 uppercase truncate">Bid on "{bid.item?.title}"</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#D4AF37]">${bid.amount.toLocaleString()}</div>
                      <div className="text-[8px] font-black text-white/10 uppercase tracking-widest">{new Date(bid.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
                <SectionTitle>Auction Log</SectionTitle>
                <div className="space-y-4">
                  {(activities?.recentItems || []).map(item => (
                    <div key={item._id} className="flex items-center gap-4 p-4 bg-[#0D0D0D] rounded-xl border border-white/5">
                      <HiOutlinePhoto className="text-white/10 text-2xl" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white/80 truncate">{item.title}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase">Author: {item.createdBy?.name}</div>
                      </div>
                      <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500/20 hover:text-red-500 transition-colors uppercase font-black text-[8px] tracking-tighter">Force Flush</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
                <SectionTitle>Registry Log</SectionTitle>
                <div className="space-y-4">
                  {(activities?.recentUsers || []).map(u => (
                    <div key={u._id} className="flex items-center gap-4 p-4 bg-[#0D0D0D] rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black uppercase text-[#D4AF37]">{u.name?.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white/80 truncate">{u.name}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase truncate">{u.email}</div>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
              <SectionTitle>Elite Acquisition Rank</SectionTitle>
              <div className="space-y-4">
                {(s.topBidders || []).map((b, i) => (
                  <div key={i} className={`flex items-center gap-5 p-6 rounded-2xl border transition-all ${i === 0 ? 'bg-white/5 border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'bg-[#0D0D0D] border-white/5'}`}>
                    <div className="text-2xl font-black w-8 text-center text-[#D4AF37]">{i < 3 ? <HiStar className="mx-auto" /> : i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-white uppercase tracking-tight text-lg">{b.name}</div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{b.totalBids} Approved Transactions</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#D4AF37] tracking-tighter">{fmtMoney(b.totalAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/5">
              <SectionTitle>Global Vendor Rank</SectionTitle>
              <div className="space-y-4">
                {(s.topAuctioneers || []).map((a, i) => (
                  <div key={i} className={`flex items-center gap-5 p-6 rounded-2xl border transition-all ${i === 0 ? 'bg-white/5 border-blue-500/40 ring-1 ring-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'bg-[#0D0D0D] border-white/5'}`}>
                    <div className="text-2xl font-black w-8 text-center text-blue-400">{i < 3 ? <HiStar className="mx-auto" /> : i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-white uppercase tracking-tight text-lg">{a.name}</div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{a.totalItems} Distributed Assets</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-400 tracking-tighter">{fmtMoney(a.totalRevenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

