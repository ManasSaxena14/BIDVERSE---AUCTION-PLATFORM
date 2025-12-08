import { useState, useEffect } from 'react';
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
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (user && items.length > 0 && bids.length > 0) {
      calculateStats();
    }
  }, [user, items, bids]);

  const calculateStats = () => {
    try {
      // Get user ID (handle both id and _id formats)
      const userId = user.id || user._id;
      
      // Filter user's items
      const userItems = items.filter(item => item.createdBy?._id === userId);
      setMyItems(userItems);

      // Filter user's bids
      const userBids = bids.filter(bid => bid.user?._id === userId);
      setMyBids(userBids);

      // Calculate statistics
      const newStats = {
        totalBids: userBids.length,
        wonAuctions: 0,
        activeBids: userBids.filter(bid => bid.item?.status === 'active').length,
        totalSpent: userBids.reduce((sum, bid) => sum + (bid.amount || 0), 0),
        itemsListed: userItems.length,
        itemsSold: userItems.filter(item => item.status === 'sold').length,
        totalRevenue: userItems.reduce((sum, item) => sum + (item.currentBid || 0), 0)
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Set default stats if calculation fails
      setStats({
        totalBids: 0,
        wonAuctions: 0,
        activeBids: 0,
        totalSpent: 0,
        itemsListed: 0,
        itemsSold: 0,
        totalRevenue: 0
      });
    }
  };

  const getBadgeColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'auctioneer': return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'bidder': return 'bg-gradient-to-r from-green-600 to-teal-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
          <p className="text-2xl text-[#E5E4E2] font-bold tracking-wider">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black text-[#F7F7F7] py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)` ,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-5xl shadow-2xl border-4 border-[#D4AF37] text-[#0D0D0D] font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-500 to-emerald-400 w-8 h-8 rounded-full border-4 border-[#0D0D0D]"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-wide">{user?.name}</h1>
              <p className="text-xl text-[#E5E4E2] mb-4">{user?.email}</p>
              <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                <span className={`${getBadgeColor(user?.role)} px-5 py-2 rounded-full text-base font-bold text-white shadow-lg tracking-wider`}>
                  {user?.role?.toUpperCase()}
                </span>
                <span className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-base font-bold border border-[#D4AF37]/30 tracking-wider">
                  VERIFIED MEMBER
                </span>
                <span className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-base font-bold border border-[#D4AF37]/30 tracking-wider">
                  JOINED {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown Date'}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 lg:mt-0">
              <Link
                to="/edit-profile"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                EDIT PROFILE
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all group">
            <div className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"> </div>
            <div className="text-3xl font-extrabold text-[#F7F7F7] mb-2">{stats.totalBids}</div>
            <div className="text-sm text-[#E5E4E2] font-medium tracking-wide">TOTAL BIDS</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all group">
            <div className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"> </div>
            <div className="text-3xl font-extrabold text-[#F7F7F7] mb-2">{stats.activeBids}</div>
            <div className="text-sm text-[#E5E4E2] font-medium tracking-wide">ACTIVE BIDS</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all group">
            <div className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"> </div>
            <div className="text-3xl font-extrabold text-[#F7F7F7] mb-2">{stats.itemsListed}</div>
            <div className="text-sm text-[#E5E4E2] font-medium tracking-wide">ITEMS LISTED</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all group">
            <div className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"> </div>
            <div className="text-3xl font-extrabold text-[#F7F7F7] mb-2">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-[#E5E4E2] font-medium tracking-wide">TOTAL REVENUE</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-3 inline-flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-bold transition-all tracking-wider ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg'
                : 'text-[#E5E4E2] hover:bg-white/10'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('myBids')}
            className={`px-6 py-3 rounded-xl font-bold transition-all tracking-wider ${
              activeTab === 'myBids'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg'
                : 'text-[#E5E4E2] hover:bg-white/10'
            }`}
          >
            MY BIDS
          </button>
          {(user?.role === 'auctioneer' || user?.role === 'superadmin') && (
            <button
              onClick={() => setActiveTab('myAuctions')}
              className={`px-6 py-3 rounded-xl font-bold transition-all tracking-wider ${
                activeTab === 'myAuctions'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg'
                  : 'text-[#E5E4E2] hover:bg-white/10'
              }`}
            >
              MY AUCTIONS
            </button>
          )}
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-xl font-bold transition-all tracking-wider ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg'
                : 'text-[#E5E4E2] hover:bg-white/10'
            }`}
          >
            ACTIVITY
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-[#F7F7F7] mb-6 tracking-wide">ACCOUNT OVERVIEW</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6">
                  <h3 className="font-bold text-[#D4AF37] text-xl mb-4 tracking-wide">BIDDING ACTIVITY</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                      <span className="text-[#E5E4E2] font-medium tracking-wide">TOTAL BIDS PLACED:</span>
                      <span className="font-extrabold text-2xl text-[#F7F7F7]">{stats.totalBids}</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                      <span className="text-[#E5E4E2] font-medium tracking-wide">ACTIVE BIDS:</span>
                      <span className="font-extrabold text-2xl text-green-500">{stats.activeBids}</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-[#E5E4E2] font-medium tracking-wide">TOTAL SPENT:</span>
                      <span className="font-extrabold text-2xl text-[#D4AF37]">${stats.totalSpent.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
                {(user?.role === 'auctioneer' || user?.role === 'superadmin') && (
                  <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6">
                    <h3 className="font-bold text-[#D4AF37] text-xl mb-4 tracking-wide">SELLING ACTIVITY</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                        <span className="text-[#E5E4E2] font-medium tracking-wide">ITEMS LISTED:</span>
                        <span className="font-extrabold text-2xl text-[#F7F7F7]">{stats.itemsListed}</span>
                      </li>
                      <li className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                        <span className="text-[#E5E4E2] font-medium tracking-wide">ITEMS SOLD:</span>
                        <span className="font-extrabold text-2xl text-green-500">{stats.itemsSold}</span>
                      </li>
                      <li className="flex justify-between items-center py-2">
                        <span className="text-[#E5E4E2] font-medium tracking-wide">TOTAL REVENUE:</span>
                        <span className="font-extrabold text-2xl text-[#D4AF37]">${stats.totalRevenue.toLocaleString()}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'myBids' && (
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">MY BIDS</h2>
            {myBids.length > 0 ? (
              <div className="space-y-6">
                {myBids.map((bid) => (
                  <div key={bid._id} className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-[#F7F7F7] mb-2 tracking-wide">
                          {bid.item?.title || 'Item'}
                        </h3>
                        <div className="flex flex-wrap gap-4 mb-3">
                          <p className="text-[#E5E4E2]">
                            Bid Amount: <span className="font-extrabold text-[#D4AF37] text-lg">${bid.amount.toLocaleString()}</span>
                          </p>
                          <p className="text-[#E5E4E2]/70">
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to={`/items/${bid.item?._id}`}
                          className="px-5 py-2 bg-[#1A1A1A] backdrop-blur-xl border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg font-bold hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all tracking-wider"
                        >
                          VIEW ITEM
                        </Link>
                        <Link
                          to={`/bids/${bid._id}/update`}
                          className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-lg font-bold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] tracking-wider"
                        >
                          UPDATE BID
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-2xl">
                <div className="text-6xl mb-6 text-[#D4AF37]"> </div>
                <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">NO BIDS YET</h3>
                <p className="text-xl text-[#E5E4E2] mb-8 max-w-md mx-auto">Start bidding on exclusive luxury items!</p>
                <Link to="/" className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg hover:from-[#B8860B] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] tracking-wider">
                  BROWSE AUCTIONS
                </Link>
              </div>
            )}
          </div>
        )}

        {/* My Auctions Tab */}
        {activeTab === 'myAuctions' && (user?.role === 'auctioneer' || user?.role === 'superadmin') && (
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">MY AUCTIONS</h2>
            {myItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myItems.map((item) => (
                  <div key={item._id} className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300 group">
                    <div className="h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center text-6xl text-[#D4AF37] border-b border-[#D4AF37]/20">
                      
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-[#F7F7F7] mb-3 tracking-wide">{item.title}</h3>
                      <p className="text-[#E5E4E2] mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#E5E4E2]/70 font-medium">CURRENT BID:</span>
                        <span className="font-extrabold text-[#D4AF37] text-xl">${item.currentBid.toLocaleString()}</span>
                      </div>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wider ${
                        item.status === 'active' ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' :
                        item.status === 'sold' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' :
                        'bg-gradient-to-r from-gray-600 to-gray-500 text-white'
                      }`}>
                        {item.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-2xl">
                <div className="text-6xl mb-6 text-[#D4AF37]"> </div>
                <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">NO AUCTIONS CREATED</h3>
                <p className="text-xl text-[#E5E4E2] mb-8 max-w-md mx-auto">Create your first exclusive auction item!</p>
                <Link to="/create-item" className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg hover:from-[#B8860B] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] tracking-wider">
                  CREATE AUCTION
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide">RECENT ACTIVITY</h2>
            <div className="space-y-5">
              {[...myBids].slice(0, 10).map((bid, index) => (
                <div key={index} className="flex items-center gap-5 p-5 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-xl">
                    
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#F7F7F7] text-lg mb-1">
                      Placed bid of <span className="text-[#D4AF37]">${bid.amount.toLocaleString()}</span>
                    </p>
                    <p className="text-[#E5E4E2]">
                      on {bid.item?.title || 'an item'} • <span className="text-[#E5E4E2]/70">{new Date(bid.createdAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;