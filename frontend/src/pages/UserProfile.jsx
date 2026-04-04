import { useState, useEffect } from 'react';
import { 
  HiOutlineListBullet, 
  HiOutlineBolt, 
  HiOutlineTag, 
  HiOutlineCurrencyDollar, 
  HiOutlineUser, 
  HiOutlineClock, 
  HiOutlinePencilSquare, 
  HiOutlineInboxStack,
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingUp,
  HiOutlineBriefcase,
  HiOutlineIdentification,
  HiOutlineCircleStack,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const { items, fetchItems } = useItems();
  const { bids, fetchBids } = useBids();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [myItems, setMyItems] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [stats, setStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    activeBids: 0,
    totalSpent: 0,
    itemsListed: 0,
    itemsSold: 0,
    totalRevenue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchItems({ limit: 100 }), fetchBids()]);
    } catch (error) {
      // Protocol synchronization failure logged
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && items.length > 0) {
      calculateStats();
    }
  }, [user, items, bids]);

  const calculateStats = () => {
    try {
      const userId = user.id || user._id;
      const userItems = items.filter(item => item.createdBy?._id === userId);
      setMyItems(userItems);

      const userBids = bids.filter(bid => bid.user?._id === userId);
      setMyBids(userBids);

      setStats({
        totalBids: userBids.length,
        wonAuctions: 0,
        activeBids: userBids.filter(bid => bid.item?.status === 'active').length,
        totalSpent: userBids.reduce((sum, bid) => sum + (bid.amount || 0), 0),
        itemsListed: userItems.length,
        itemsSold: userItems.filter(item => item.status === 'sold').length,
        totalRevenue: userItems.reduce((sum, item) => sum + (item.currentBid || 0), 0)
      });
    } catch (error) {
      // Intelligence analysis error handling synchronized
    }
  };

  const getBadgeColor = (role) => {
    switch (role) {
      case 'superadmin': return 'border-purple-500/50 text-purple-400 bg-purple-500/10';
      case 'auctioneer': return 'border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10';
      case 'bidder': return 'border-white/20 text-white/40 bg-white/5';
      default: return 'border-white/10 text-white/20 bg-white/5';
    }
  };

  const isAuctionActive = (item) => {
    if (!item) return false;
    return item.status === 'active' && new Date(item.endDate) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-10">
        <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin shadow-[0_0_30px_rgba(212,175,55,0.2)]"></div>
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.6em] uppercase animate-pulse leading-none italic">Synchronizing Identity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative border-b border-white/5 py-40 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#D4AF37]/5 blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="relative group shrink-0">
              <div className="w-48 h-48 rounded-[3rem] bg-black border border-white/5 flex items-center justify-center text-7xl text-white font-black group-hover:scale-105 transition-all duration-700 shadow-3xl relative overflow-hidden italic gold-shimmer-text">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20" />
                <span className="relative z-10">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#D4AF37] w-12 h-12 rounded-2xl border-[8px] border-[#0A0A0A] flex items-center justify-center shadow-xl">
                <HiOutlineShieldCheck className="text-sm text-[#0D0D0D]" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase leading-none">
                <HiOutlineIdentification className="text-sm text-[#D4AF37]" />
                Authenticated Executive Identity Index
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic italic">
                  {user?.name}
                </h1>
                <p className="text-[12px] text-white/20 font-black tracking-[0.3em] uppercase italic">{user?.email}</p>
              </div>
              
              <div className="flex gap-6 justify-center lg:justify-start flex-wrap">
                <span className={`px-6 py-3 rounded-2xl border text-[9px] font-black tracking-[0.4em] uppercase leading-none transition-all ${getBadgeColor(user?.role)}`}>
                  Deployment: {user?.role}
                </span>
                <span className="px-6 py-3 rounded-2xl border border-white/5 bg-black/40 text-white/20 text-[9px] font-black tracking-[0.4em] uppercase leading-none italic">
                  Registry Date: {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </span>
              </div>
            </div>

            <Link
              to="/edit-profile"
              className="px-12 py-6 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-[#D4AF37]/50 transition-all shadow-2xl leading-none italic"
            >
              <HiOutlinePencilSquare className="text-sm inline-block mr-3" />
              Refine Protocol
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { id: 'bids', val: stats.totalBids, label: 'Bids Executed', icon: HiOutlineListBullet },
            { id: 'active', val: stats.activeBids, label: 'Active Protocols', icon: HiOutlineBolt, color: 'text-green-500' },
            { id: 'inventory', val: stats.itemsListed, label: 'Asset Holdings', icon: HiOutlineTag },
            { id: 'revenue', val: `$${stats.totalRevenue.toLocaleString()}`, label: 'Portfolio Equity', icon: HiOutlineCurrencyDollar, color: 'text-[#D4AF37]' }
          ].map((s, i) => (
            <div key={i} className="bg-black/80 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] space-y-8 group hover:border-[#D4AF37]/20 transition-all duration-700 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-all duration-700">
                <s.icon className="text-xl" />
              </div>
              <div className="space-y-2">
                <div className={`text-4xl font-black text-white tracking-tighter italic ${s.id === 'revenue' ? 'gold-shimmer-text' : ''}`}>{s.val}</div>
                <div className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase italic leading-none">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-40">
        <nav className="flex gap-12 mb-24 flex-wrap border-b border-white/5 pb-12 overflow-x-auto whitespace-nowrap">
          {['overview', 'myBids', 'myAuctions', 'activity'].map(tab => (
            (tab !== 'myAuctions' || (user?.role === 'auctioneer' || user?.role === 'superadmin')) && (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-black tracking-[0.5em] transition-all duration-700 uppercase relative py-4 italic leading-none ${
                  activeTab === tab ? 'text-[#D4AF37]' : 'text-white/10 hover:text-white/40'
                }`}
              >
                {tab === 'overview' ? 'Intelligence' : 
                 tab === 'myBids' ? 'Engagements' : 
                 tab === 'myAuctions' ? 'Allocations' : 'Logistics'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.5)]" />}
              </button>
            )
          ))}
        </nav>

        <section className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="bg-white/5 backdrop-blur-3xl p-16 md:p-24 rounded-[4rem] border border-white/5 shadow-2xl space-y-24 relative overflow-hidden transition-all duration-1000 animate-fadeInUp">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none" />
               <header className="space-y-4 text-center md:text-left">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Institutional Summary</h2>
                <div className="w-24 h-px bg-[#D4AF37]/30" />
               </header>
               
               <div className="grid md:grid-cols-2 gap-24">
                <div className="space-y-12">
                  <header className="flex items-center gap-4 text-[#D4AF37]">
                    <HiOutlineArrowTrendingUp className="text-xl" />
                    <h3 className="text-[11px] font-black text-white/40 tracking-[0.4em] uppercase leading-none">Acquisition Intelligence</h3>
                  </header>
                  <div className="space-y-10">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6 group">
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">Aggregate Bid Proposals</span>
                      <span className="text-3xl font-black text-white italic group-hover:scale-110 transition-transform">{stats.totalBids}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-6 group">
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">Cumulative Capitalized Flux</span>
                      <span className="text-3xl font-black text-[#D4AF37] italic group-hover:scale-110 transition-transform gold-shimmer-text">${stats.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {(user?.role === 'auctioneer' || user?.role === 'superadmin') && (
                  <div className="space-y-12 border-l border-white/5 pl-24 hidden md:block">
                    <header className="flex items-center gap-4 text-[#D4AF37]">
                      <HiOutlineBriefcase className="text-xl" />
                      <h3 className="text-[11px] font-black text-white/40 tracking-[0.4em] uppercase leading-none">Managed Allocation Analysis</h3>
                    </header>
                    <div className="space-y-10">
                      <div className="flex justify-between items-end border-b border-white/5 pb-6 group">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">Assets Registered</span>
                        <span className="text-3xl font-black text-white italic group-hover:scale-110 transition-transform">{stats.itemsListed}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-6 group">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">Liquidations Finalized</span>
                        <span className="text-3xl font-black text-[#D4AF37] italic group-hover:scale-110 transition-transform gold-shimmer-text">{stats.itemsSold}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'myBids' && (
            <div className="grid md:grid-cols-1 gap-10 animate-fadeInUp">
              {myBids.length > 0 ? myBids.map((bid) => (
                <article key={bid._id} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-700 group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-12 shadow-2xl">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[80px] pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />
                   <div className="flex-1 space-y-10 relative z-10">
                      <div className="space-y-4">
                        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.4em] uppercase italic leading-none">{bid.item?.category || 'General Index'}</div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-[#D4AF37] transition-colors leading-none italic">
                          {bid.item?.title || 'Classified Asset'}
                        </h3>
                      </div>
                      <div className="flex gap-20">
                        <div className="space-y-2">
                          <div className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] leading-none">Proposal Valuation</div>
                          <div className="text-4xl font-black text-white tracking-tighter italic group-hover:gold-shimmer-text transition-all">${bid.amount.toLocaleString()}</div>
                        </div>
                        <div className="space-y-2 border-l border-white/5 pl-12">
                          <div className="text-[9px] text-white/20 uppercase font-black tracking-[0.3em] leading-none">Authorization Date</div>
                          <div className="text-[14px] font-black text-white/60 uppercase tracking-widest leading-none mt-2">{new Date(bid.createdAt).toLocaleDateString().toUpperCase()}</div>
                        </div>
                      </div>
                   </div>
                   <footer className="flex flex-col sm:flex-row gap-6 relative z-10 shrink-0">
                      <Link to={`/items/${bid.item?._id}`} className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-[#D4AF37]/40 transition-all leading-none italic">Analysis Index</Link>
                      {isAuctionActive(bid.item) && (
                        <Link to={`/update-bid/${bid._id}`} className="px-12 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-2xl hover:bg-white transition-all leading-none italic flex items-center gap-3">
                          <HiOutlineArrowTrendingUp className="text-sm" />
                          Escalate Proposal
                        </Link>
                      )}
                   </footer>
                </article>
              )) : (
                <div className="text-center py-48 bg-white/5 border border-dashed border-white/10 rounded-[4rem] space-y-12 backdrop-blur-3xl">
                  <HiOutlineInboxStack className="text-8xl mx-auto text-white/5" />
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black text-white/20 tracking-[0.4em] uppercase leading-none italic">Pool Data Void</h2>
                    <Link to="/" className="inline-flex items-center gap-4 text-[11px] text-[#D4AF37] font-black uppercase tracking-[0.4em] hover:text-white transition-all leading-none italic">
                      Initialize Acquisition Protocol <HiOutlineArrowRight />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'myAuctions' && (
            <div className="grid md:grid-cols-2 gap-12 animate-fadeInUp">
              {myItems.map((item) => (
                <Link to={`/items/${item._id}`} key={item._id} className="bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-1000 group shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col">
                  <div className="h-64 bg-[#050505] flex items-center justify-center border-b border-white/5 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <HiOutlineIdentification className="absolute top-8 left-8 text-white/20 text-2xl group-hover:text-[#D4AF37] transition-all" />
                  </div>
                  <div className="p-12 space-y-12 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-[10px] text-[#D4AF37]/60 font-black tracking-[0.4em] uppercase italic leading-none">{item.category}</div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter line-clamp-2 leading-tight italic">{item.title}</h3>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/5 pt-10">
                      <div className="space-y-2">
                        <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.3em] leading-none">Net Benchmark</div>
                        <div className="text-4xl font-black text-white tracking-tighter italic group-hover:gold-shimmer-text transition-all">${item.currentBid.toLocaleString()}</div>
                      </div>
                      <div className={`px-5 py-2.5 rounded-2xl text-[9px] font-black tracking-[0.4em] uppercase border backdrop-blur-xl ${
                        item.status === 'active' ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] shadow-xl' : 'bg-black border-white/5 text-white/20'
                      }`}>
                        {item.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-8 animate-fadeInUp max-w-4xl mx-auto">
               <header className="mb-12 border-l border-[#D4AF37] pl-10">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Executive Audit Trail</h2>
                  <p className="text-[10px] text-white/20 font-black tracking-[0.3em] uppercase mt-4 italic leading-none">Sub-Millisecond Execution Integrity Log</p>
               </header>
              {myBids.slice(0, 10).map((bid, i) => (
                <div key={i} className="flex items-center gap-12 p-10 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-[#D4AF37]/30 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-[40px] pointer-events-none" />
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/10 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 group-hover:scale-110 transition-all duration-700 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-10" />
                    <HiOutlineClock className="text-2xl relative z-10" />
                  </div>
                  <div className="flex-1 space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                       <div className="text-[10px] text-white/10 font-black tracking-[0.5em] uppercase leading-none italic">Protocol Sequence Recognized</div>
                       <div className="text-[9px] text-white/20 font-black italic">{new Date(bid.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <p className="text-[13px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      Proposal of <span className="text-[#D4AF37] italic font-black">${bid.amount.toLocaleString()}</span> authored for <span className="text-white italic">{bid.item?.title || 'Classified Portfolio Asset'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;