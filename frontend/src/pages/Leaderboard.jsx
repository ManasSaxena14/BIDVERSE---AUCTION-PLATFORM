import { useState, useEffect } from 'react';
import { 
  HiOutlineTrophy, 
  HiOutlineChartBar, 
  HiStar,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineQueueList,
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight,
  HiOutlineIdentification
} from 'react-icons/hi2';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';

const Leaderboard = () => {
  const { items, fetchItems } = useItems();
  const { bids, fetchBids } = useBids();
  const [loading, setLoading] = useState(true);
  const [topBidders, setTopBidders] = useState([]);
  const [topAuctioneers, setTopAuctioneers] = useState([]);
  const [highestBids, setHighestBids] = useState([]);
  const [activeTab, setActiveTab] = useState('bidders');

  useEffect(() => {
    loadLeaderboardData();
    const interval = setInterval(() => {
      loadLeaderboardData();
    }, 30000);
    const handleFocus = () => {
      loadLeaderboardData();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (bids.length > 0 || items.length > 0) {
      calculateLeaderboards();
    }
  }, [bids, items]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchItems({ limit: 100 }),
        fetchBids()
      ]);
      calculateLeaderboards();
    } catch (error) {
      // Synchronization failure handling
    } finally {
      setLoading(false);
    }
  };

  const calculateLeaderboards = () => {
    const bidderStats = {};
    bids.forEach(bid => {
      const userId = bid.user._id;
      if (!bidderStats[userId]) {
        bidderStats[userId] = {
          name: bid.user.name,
          totalBids: 0,
          totalAmount: 0
        };
      }
      bidderStats[userId].totalBids += 1;
      bidderStats[userId].totalAmount += bid.amount;
    });

    setTopBidders(Object.values(bidderStats)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10));

    const auctioneerStats = {};
    items.forEach(item => {
      if (!item.createdBy) return;
      const userId = item.createdBy._id;
      if (!auctioneerStats[userId]) {
        auctioneerStats[userId] = {
          name: item.createdBy.name,
          totalItems: 0,
          totalRevenue: 0,
          activeItems: 0
        };
      }
      auctioneerStats[userId].totalItems += 1;
      auctioneerStats[userId].totalRevenue += item.currentBid;
      if (item.status === 'active') auctioneerStats[userId].activeItems += 1;
    });

    setTopAuctioneers(Object.values(auctioneerStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10));

    setHighestBids([...bids]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10));
  };

  const getRankDecoration = (rank) => {
    if (rank === 0) return <div className="p-5 bg-[#D4AF37] rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse"><HiStar className="text-[#0D0D0D] text-3xl" /></div>;
    if (rank === 1) return <div className="p-5 bg-white/10 rounded-2xl border border-white/20"><HiStar className="text-white text-2xl" /></div>;
    if (rank === 2) return <div className="p-5 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/10"><HiStar className="text-[#D4AF37]/60 text-xl" /></div>;
    return <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-[11px] font-black text-white/10 tracking-widest italic uppercase">#{rank + 1}</div>;
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
      <header className="relative border-b border-white/5 py-48 bg-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-10 animate-fadeInUp">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.4em] uppercase italic leading-none">
            <HiOutlineSparkles className="text-sm text-[#D4AF37]" />
            Merit Core Registry
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none italic">Institutional <span className="gold-shimmer-text not-italic">Elite</span></h1>
            <p className="text-[11px] text-white/20 max-w-xl mx-auto font-black tracking-[0.4em] uppercase leading-relaxed italic">The definitive registry of the most significant institutional and private collectors within our ecosystem.</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-32">
        <nav className="flex justify-center mb-32 animate-fadeInUp delay-200">
          <div className="inline-flex bg-white/5 backdrop-blur-3xl rounded-[3rem] p-3 gap-3 border border-white/5 shadow-2xl">
            {[
              { id: 'bidders', label: 'Distinguished Collectors', icon: HiOutlineArrowTrendingUp },
              { id: 'auctioneers', label: 'Master Agents', icon: HiOutlineQueueList },
              { id: 'bids', label: 'Valuation Flux', icon: HiOutlineTrophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] font-black text-[10px] tracking-[0.4em] transition-all duration-1000 uppercase italic leading-none ${
                  activeTab === tab.id 
                  ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                  : 'text-white/20 hover:text-white/60'
                }`}
              >
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <section className="max-w-5xl mx-auto space-y-10 pb-40 animate-fadeInUp delay-300">
          {activeTab === 'bidders' && topBidders.map((b, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-1000 group relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center gap-16 relative z-10">
                <div className="shrink-0">{getRankDecoration(i)}</div>
                <div className="flex-1 text-center sm:text-left space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <HiOutlineShieldCheck className="text-[#D4AF37] text-sm" />
                      <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase italic leading-none">Verified Identity</p>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter group-hover:gold-shimmer-text transition-all duration-1000 leading-none italic">{b.name}</h3>
                  </div>
                  <div className="flex gap-16 justify-center sm:justify-start pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.4em] italic leading-none">Acquisition Velocity</div>
                      <div className="text-3xl font-black text-white/40 tracking-tighter italic">{b.totalBids} PROPOSALS</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-[#D4AF37] uppercase font-black tracking-[0.4em] italic leading-none">Market Capitalization</div>
                      <div className="text-4xl font-black text-white tracking-tighter gold-shimmer-text italic leading-none">${b.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'auctioneers' && topAuctioneers.map((a, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 hover:border-white/20 transition-all duration-1000 group relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col sm:flex-row items-center gap-16 relative z-10">
                <div className="shrink-0">{getRankDecoration(i)}</div>
                <div className="flex-1 text-center sm:text-left space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-white/20">
                      <HiOutlineIdentification className="text-sm" />
                      <p className="text-[10px] font-black tracking-[0.4em] uppercase italic leading-none">Strategic Agent</p>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter group-hover:text-white transition-all duration-1000 leading-none italic">{a.name}</h3>
                  </div>
                  <div className="flex gap-16 justify-center sm:justify-start pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.4em] italic leading-none">Managed Allocations</div>
                      <div className="text-3xl font-black text-white/40 tracking-tighter italic">{a.totalItems} ASSETS</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.4em] italic leading-none">Liquidation Equity</div>
                      <div className="text-3xl font-black text-white/60 tracking-tighter italic leading-none italic uppercase tracking-tighter">${a.totalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'bids' && highestBids.map((bid, i) => (
            <div key={bid._id} className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-1000 group relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col sm:flex-row items-center gap-16 relative z-10">
                <div className="shrink-0">{getRankDecoration(i)}</div>
                <div className="flex-1 text-center sm:text-left space-y-8">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-white/20 tracking-[0.5em] uppercase italic leading-none">Protocol Record</p>
                    <h3 className="text-5xl md:text-6xl font-black text-[#D4AF37] tracking-tighter italic leading-none group-hover:scale-[1.03] origin-left transition-transform duration-1000 gold-shimmer-text">${bid.amount.toLocaleString()}</h3>
                  </div>
                  <div className="flex gap-16 justify-center sm:justify-start pt-6 border-t border-white/5">
                    <div className="space-y-2">
                      <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.4em] italic leading-none">Acquiring Entity</div>
                      <div className="text-[12px] font-black text-white tracking-[0.2em] uppercase italic leading-none">{bid.user.name}</div>
                    </div>
                    <div className="space-y-2 max-w-[280px]">
                      <div className="text-[10px] text-white/10 uppercase font-black tracking-[0.4em] italic leading-none">Asset Reference</div>
                      <div className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em] truncate italic leading-none">{bid.item?.title || 'RESTRICTED INVENTORY'}</div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 hidden md:block">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/10 group-hover:text-[#D4AF37] transition-all">
                    <HiOutlineArrowUpRight className="text-2xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {((activeTab === 'bidders' && topBidders.length === 0) ||
            (activeTab === 'auctioneers' && topAuctioneers.length === 0) ||
            (activeTab === 'bids' && highestBids.length === 0)) && (
            <div className="text-center py-60 bg-white/5 rounded-[5rem] border border-white/5 border-dashed space-y-12 backdrop-blur-3xl animate-pulse">
              <div className="relative inline-block">
                <HiOutlineChartBar className="text-9xl mx-auto text-white/5" />
                <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl font-black text-white/20 tracking-tighter uppercase leading-none italic">Intelligence Vacuum</h3>
                <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.5em] leading-loose italic">Activity is currently being synthesized within the private networks.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Leaderboard;


