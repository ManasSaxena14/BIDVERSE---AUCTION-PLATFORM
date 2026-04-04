import { useState, useEffect } from 'react';
import { 
  HiOutlineInbox, 
  HiOutlineCheckCircle, 
  HiOutlineCurrencyDollar, 
  HiOutlineClock, 
  HiOutlineFolder, 
  HiOutlineCalendarDays, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlinePlus,
  HiOutlineChartBar,
  HiOutlineArrowUpRight,
  HiOutlineScale,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ViewMyAuctions = () => {
  const { user } = useAuth();
  const { items, fetchItems, deleteItem } = useItems();
  const { addToast } = useToast();
  const [myAuctions, setMyAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadMyAuctions();
  }, [user, filter, sortBy, currentPage]);

  const loadMyAuctions = async () => {
    try {
      setLoading(true);
      const params = {
        createdBy: user._id,
        status: filter === 'all' ? undefined : filter,
        page: currentPage,
        limit: itemsPerPage
      };
      const response = await fetchItems(params);
      setTotalPages(response.pages || 1);
    } catch (error) {
      addToast('Synchronization of portfolio records failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && items && items.length > 0) {
      filterAndSortAuctions();
    }
  }, [user, items, filter, sortBy]);

  const filterAndSortAuctions = () => {
    if (!user) return;
    let filtered = [...items];
    if (filter !== 'all') filtered = filtered.filter(item => item.status === filter);
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_high': return b.currentBid - a.currentBid;
        case 'price_low': return a.currentBid - b.currentBid;
        case 'ending_soon': return new Date(a.endDate) - new Date(b.endDate);
        default: return 0;
      }
    });
    setMyAuctions(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm permanent asset decommissioning?')) {
      try {
        await deleteItem(id);
        addToast('Asset decommissioned.', 'success');
        loadMyAuctions();
      } catch (error) {
        addToast('Decommissioning failed.', 'error');
      }
    }
  };

  const calculateTimeLeft = (endDate) => {
    const distance = new Date(endDate).getTime() - new Date().getTime();
    if (distance < 0) return 'PROTOCOL TERMINATED';
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}D ${hours}H REMAINING` : `${hours}H REMAINING`;
  };

  const stats = {
    total: myAuctions ? myAuctions.length : 0,
    active: myAuctions ? myAuctions.filter(a => a.status === 'active').length : 0,
    totalRevenue: myAuctions ? myAuctions.reduce((sum, a) => sum + (a.currentBid || 0), 0) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-10">
        <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin shadow-[0_0_30px_rgba(212,175,55,0.2)]"></div>
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.6em] uppercase animate-pulse italic">Synchronizing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="border-b border-white/5 py-48 bg-[#0D0D0D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-10 animate-fadeInUp">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.4em] uppercase italic leading-none">
            <HiOutlineChartBar className="text-sm text-[#D4AF37]" />
            Asset Management Terminal
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">
            Strategic <span className="gold-shimmer-text not-italic">Index</span>
          </h1>
          <p className="text-[11px] text-white/20 max-w-xl mx-auto font-black tracking-[0.4em] uppercase leading-loose italic">
            Comprehensive oversight of your institutional holdings and global liquidation protocols.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-24 relative z-20 animate-fadeInUp delay-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Total Allocations', val: stats.total, icon: HiOutlineFolder, color: 'text-white/20' },
            { label: 'Flux Protocols', val: stats.active, icon: HiOutlineArrowUpRight, color: 'text-[#D4AF37]' },
            { label: 'Portfolio Equity', val: `${stats.totalRevenue.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'text-white' }
          ].map((s, i) => (
            <div key={i} className="bg-black/60 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.5)] space-y-8 group hover:border-[#D4AF37]/30 transition-all duration-1000 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
              <s.icon className={`text-3xl ${s.color} group-hover:scale-110 transition-transform duration-700`} />
              <div className="space-y-2">
                <div className="text-5xl font-black text-white tracking-tighter leading-none italic uppercase">{s.val}</div>
                <div className="text-[10px] text-white/10 font-black tracking-[0.4em] uppercase italic">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-40">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12 animate-fadeInUp delay-300">
          <div className="flex gap-6 flex-wrap">
            {['all', 'active', 'closed'].map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setCurrentPage(1); }}
                className={`px-12 py-5 rounded-[2rem] font-black text-[10px] tracking-[0.4em] transition-all duration-700 uppercase italic leading-none ${
                  filter === s 
                  ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                  : 'text-white/20 border border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-10 py-5 bg-black/40 border border-white/5 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 outline-none transition-all italic appearance-none cursor-pointer pr-16"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1rem' }}
            >
              <option value="latest" className="bg-[#0D0D0D]">Latest Entry</option>
              <option value="price_high" className="bg-[#0D0D0D]">Premium Value</option>
              <option value="price_low" className="bg-[#0D0D0D]">Entry Value</option>
              <option value="ending_soon" className="bg-[#0D0D0D]">Termination Flux</option>
            </select>

            <Link
              to="/create-item"
              className="px-14 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase shadow-2xl hover:bg-white transition-all flex items-center gap-4 italic leading-none group"
            >
              <HiOutlinePlus className="text-sm group-hover:rotate-90 transition-transform" />
              Initialize Asset
            </Link>
          </div>
        </div>

        {myAuctions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fadeInUp delay-400">
            {myAuctions.map((a) => (
              <div key={a._id} className="bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-1000 group shadow-2xl relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={a.image || 'https://via.placeholder.com/600x400?text=Restricted+Intel'} 
                    alt={a.title} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[40%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100" 
                  />
                  <div className="absolute top-8 right-8">
                    <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-black tracking-[0.4em] uppercase border backdrop-blur-3xl italic leading-none ${
                      a.status === 'active' 
                      ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]' 
                      : 'bg-black/80 text-white/20 border-white/10'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  {a.status === 'active' && (
                    <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-3xl border border-white/5 px-6 py-2.5 rounded-2xl text-[9px] font-black text-[#D4AF37] tracking-[0.3em] uppercase flex items-center gap-3 italic">
                       <HiOutlineClock className="text-sm" /> {calculateTimeLeft(a.endDate)}
                    </div>
                  )}
                </div>

                <div className="p-12 space-y-10">
                  <h3 className="text-2xl font-black text-white hover:gold-shimmer-text transition-all duration-700 italic uppercase tracking-tighter line-clamp-1">{a.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner">
                      <div className="text-[9px] text-white/10 font-black tracking-[0.4em] uppercase mb-2 italic">Current Position</div>
                      <div className="text-2xl font-black text-white tracking-tighter gold-shimmer-text italic leading-none">${a.currentBid.toLocaleString()}</div>
                    </div>
                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner">
                      <div className="text-[9px] text-white/10 font-black tracking-[0.4em] uppercase mb-2 italic">Baseline</div>
                      <div className="text-2xl font-black text-white/20 tracking-tighter italic leading-none">${a.startingPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-y border-white/5 py-8">
                    <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
                      <HiOutlineScale className="text-sm text-[#D4AF37]" /> {a.category}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-white/10 uppercase tracking-[0.3em] italic">
                       {new Date(a.createdAt).toLocaleDateString().toUpperCase()}
                    </div>
                  </div>

                  <div className="flex gap-6 pt-4">
                    <Link to={`/items/${a._id}`} className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-white/40 rounded-3xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-[#D4AF37]/50 transition-all italic leading-none group">
                      Protocol Analysis <HiOutlineArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="flex gap-4">
                      <Link to={`/update-item/${a._id}`} className="p-5 bg-white/5 border border-white/10 text-white/20 rounded-3xl hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all flex items-center justify-center" title="Modify Protocol"><HiOutlinePencilSquare className="text-xl" /></Link>
                      <button onClick={() => handleDelete(a._id)} className="p-5 bg-red-500/5 border border-red-500/20 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-xl flex items-center justify-center" title="Decommission Asset"><HiOutlineTrash className="text-xl" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-60 bg-white/5 rounded-[5rem] border border-white/5 border-dashed space-y-12 backdrop-blur-3xl animate-pulse">
            <div className="relative inline-block">
              <HiOutlineInbox className="text-9xl mx-auto text-white/5" />
              <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Portfolio Void</h3>
              <p className="text-[11px] text-white/10 font-black tracking-[0.5em] uppercase italic">No active liquidation protocols identified in current registry.</p>
            </div>
            <Link to="/create-item" className="inline-block px-16 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-3xl font-black text-[11px] tracking-[0.5em] uppercase hover:bg-white transition-all shadow-2xl italic leading-none">
              Initialize First Allocation
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-32 flex justify-center gap-8">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-14 py-5 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase bg-white/5 text-white/20 disabled:opacity-0 active:scale-95 border border-white/5 transition-all hover:text-white italic leading-none">Previous</button>
            <div className="flex gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-16 h-16 rounded-2xl font-black text-[11px] transition-all border italic ${currentPage === p ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-110' : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'}`}>{p}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-14 py-5 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase bg-white/5 text-white/20 disabled:opacity-0 active:scale-95 border border-white/5 transition-all hover:text-white italic leading-none">Next</button>
          </nav>
        )}
      </main>
    </div>
  );
};

export default ViewMyAuctions;