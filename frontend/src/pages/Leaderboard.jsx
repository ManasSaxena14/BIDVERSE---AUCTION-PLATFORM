import { useState, useEffect } from 'react';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';

const Leaderboard = () => {
  const { items, fetchItems } = useItems();
  const { bids, fetchBids } = useBids();
  const [loading, setLoading] = useState(true);
  const [topBidders, setTopBidders] = useState([]);
  const [topAuctioneers, setTopAuctioneers] = useState([]);
  const [highestBids, setHighestBids] = useState([]);
  const [activeTab, setActiveTab] = useState('bidders'); // bidders, auctioneers, bids

  useEffect(() => {
    loadLeaderboardData();
    
    // Refresh data every 30 seconds to ensure leaderboard stays current
    const interval = setInterval(() => {
      loadLeaderboardData();
    }, 30000);
    
    // Refresh data when component comes back into focus
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
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLeaderboards = () => {
    // Top Bidders (by total bid amount)
    const bidderStats = {};
    bids.forEach(bid => {
      const userId = bid.user._id;
      const userName = bid.user.name;
      if (!bidderStats[userId]) {
        bidderStats[userId] = {
          name: userName,
          totalBids: 0,
          totalAmount: 0,
          wins: 0
        };
      }
      bidderStats[userId].totalBids += 1;
      bidderStats[userId].totalAmount += bid.amount;
    });

    const topBiddersArray = Object.values(bidderStats)
      .sort((a, b) => {
        // Ensure proper numeric comparison
        return b.totalAmount - a.totalAmount;
      })
      .slice(0, 10);
    setTopBidders(topBiddersArray);

    // Top Auctioneers (by items created)
    const auctioneerStats = {};
    items.forEach(item => {
      const userId = item.createdBy._id;
      const userName = item.createdBy.name;
      if (!auctioneerStats[userId]) {
        auctioneerStats[userId] = {
          name: userName,
          totalItems: 0,
          totalRevenue: 0,
          activeItems: 0
        };
      }
      auctioneerStats[userId].totalItems += 1;
      auctioneerStats[userId].totalRevenue += item.currentBid;
      if (item.status === 'active') {
        auctioneerStats[userId].activeItems += 1;
      }
    });

    const topAuctioneersArray = Object.values(auctioneerStats)
      .sort((a, b) => {
        // Ensure proper numeric comparison
        return b.totalRevenue - a.totalRevenue;
      })
      .slice(0, 10);
    setTopAuctioneers(topAuctioneersArray);

    // Highest Bids
    const sortedBids = [...bids]
      .sort((a, b) => {
        // Ensure proper numeric comparison
        return b.amount - a.amount;
      })
      .slice(0, 10);
    setHighestBids(sortedBids);
  };

  const getMedalColor = (rank) => {
    if (rank === 0) return 'from-yellow-400 to-orange-400';
    if (rank === 1) return 'from-gray-300 to-gray-400';
    if (rank === 2) return 'from-orange-300 to-yellow-600';
    return 'from-gray-100 to-gray-200';
  };

  const getMedalIcon = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
          <p className="text-xl text-[#E5E4E2]/70">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Luxury Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            TOP PERFORMERS
          </div>
          <div className="text-7xl mb-6 text-[#D4AF37]">🏆</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#F7F7F7] mb-6 tracking-wide">LEADERBOARD</h1>
          <p className="text-xl md:text-2xl text-[#E5E4E2]/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Celebrating our most active bidders, sellers, and high-value transactions
          </p>
          <button 
            onClick={loadLeaderboardData}
            className="mt-6 px-6 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
          >
            REFRESH LEADERBOARD
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="inline-flex bg-[#1A1A1A] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-2 gap-2 border border-[#D4AF37]/30">
            <button
              onClick={() => setActiveTab('bidders')}
              className={`px-6 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                activeTab === 'bidders'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0D0D0D] shadow-lg'
                  : 'text-[#E5E4E2]/70 hover:bg-white/5'
              }`}
            >
              TOP BIDDERS
            </button>
            <button
              onClick={() => setActiveTab('auctioneers')}
              className={`px-6 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                activeTab === 'auctioneers'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0D0D0D] shadow-lg'
                  : 'text-[#E5E4E2]/70 hover:bg-white/5'
              }`}
            >
              TOP SELLERS
            </button>
            <button
              onClick={() => setActiveTab('bids')}
              className={`px-6 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                activeTab === 'bids'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] text-[#0D0D0D] shadow-lg'
                  : 'text-[#E5E4E2]/70 hover:bg-white/5'
              }`}
            >
              HIGHEST BIDS
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Top Bidders */}
        {activeTab === 'bidders' && (
          <div>
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">TOP BIDDERS</h2>
            <div className="space-y-4">
              {topBidders.map((bidder, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-1 border border-[#D4AF37]/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-5xl w-20 text-center flex-shrink-0 text-[#D4AF37]">
                      {index < 3 ? getMedalIcon(index) : `#${index + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold mb-3 text-[#F7F7F7] tracking-wide">
                        {bidder.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Total Bids: </span>
                          <span className="font-bold text-lg text-[#D4AF37]">{bidder.totalBids}</span>
                        </div>
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Total Amount: </span>
                          <span className="font-bold text-lg text-[#D4AF37]">${bidder.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Auctioneers */}
        {activeTab === 'auctioneers' && (
          <div>
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">TOP SELLERS</h2>
            <div className="space-y-4">
              {topAuctioneers.map((auctioneer, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-1 border border-[#D4AF37]/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-5xl w-20 text-center flex-shrink-0 text-[#D4AF37]">
                      {index < 3 ? getMedalIcon(index) : `#${index + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold mb-3 text-[#F7F7F7] tracking-wide">
                        {auctioneer.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Items Listed: </span>
                          <span className="font-bold text-lg text-[#D4AF37]">{auctioneer.totalItems}</span>
                        </div>
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Total Revenue: </span>
                          <span className="font-bold text-lg text-[#D4AF37]">${auctioneer.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Active: </span>
                          <span className="font-bold text-lg text-[#D4AF37]">{auctioneer.activeItems}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highest Bids */}
        {activeTab === 'bids' && (
          <div>
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">HIGHEST BIDS</h2>
            <div className="space-y-4">
              {highestBids.map((bid, index) => (
                <div
                  key={bid._id}
                  className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-1 border border-[#D4AF37]/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-5xl w-20 text-center flex-shrink-0 text-[#D4AF37]">
                      {index < 3 ? getMedalIcon(index) : `#${index + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold mb-3 text-[#D4AF37] tracking-wide">
                        ${bid.amount.toLocaleString()}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Bidder: </span>
                          <span className="font-bold text-lg text-[#F7F7F7]">{bid.user.name}</span>
                        </div>
                        <div>
                          <span className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Item: </span>
                          <span className="font-bold text-lg text-[#F7F7F7]">{bid.item?.title || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'bidders' && topBidders.length === 0) ||
          (activeTab === 'auctioneers' && topAuctioneers.length === 0) ||
          (activeTab === 'bids' && highestBids.length === 0)) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-[#D4AF37]">📊</div>
            <h3 className="text-2xl font-bold text-[#F7F7F7] mb-2 tracking-wide">NO DATA YET</h3>
            <p className="text-[#E5E4E2]/70 tracking-wide">Be the first to make it to the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
