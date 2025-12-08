import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadMyAuctions();
  }, [user]);

  const loadMyAuctions = async () => {
    try {
      setLoading(true);
      await fetchItems({ limit: 100, createdBy: user._id });
    } catch (error) {
      console.error('Failed to load auctions:', error);
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

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.status === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_high':
          return b.currentBid - a.currentBid;
        case 'price_low':
          return a.currentBid - b.currentBid;
        case 'ending_soon':
          return new Date(a.endDate) - new Date(b.endDate);
        default:
          return 0;
      }
    });

    setMyAuctions(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteItem(id);
        addToast('Auction deleted successfully!', 'success');
        loadMyAuctions();
      } catch (error) {
        addToast('Failed to delete auction', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-600 to-emerald-500 text-white';
      case 'sold':
        return 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white';
      case 'closed':
        return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white';
    }
  };

  const calculateTimeLeft = (endDate) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const distance = end - now;

    if (distance < 0) return 'Ended';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const stats = {
    total: myAuctions ? myAuctions.length : 0,
    active: myAuctions ? myAuctions.filter(a => a.status === 'active').length : 0,
    sold: myAuctions ? myAuctions.filter(a => a.status === 'sold').length : 0,
    totalRevenue: myAuctions ? myAuctions.reduce((sum, a) => sum + (a.currentBid || 0), 0) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
          <p className="text-xl text-[#E5E4E2]">Loading your auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] border-b border-[#D4AF37]/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">MY AUCTIONS</h1>
          <p className="text-xl text-[#E5E4E2]/70 tracking-wide">Manage your auction listings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300">
            <div className="text-3xl mb-2 text-[#D4AF37]">📦</div>
            <div className="text-3xl font-bold text-[#F7F7F7]">{stats.total}</div>
            <div className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Total Auctions</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300">
            <div className="text-3xl mb-2 text-[#D4AF37]">✅</div>
            <div className="text-3xl font-bold text-green-500">{stats.active}</div>
            <div className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Active</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300">
            <div className="text-3xl mb-2 text-[#D4AF37]">🎉</div>
            <div className="text-3xl font-bold text-blue-500">{stats.sold}</div>
            <div className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Sold</div>
          </div>
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-300">
            <div className="text-3xl mb-2 text-[#D4AF37]">💰</div>
            <div className="text-3xl font-bold text-purple-500">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-[#E5E4E2]/70 tracking-wider uppercase">Total Revenue</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Filters and Actions */}
        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'sold', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                    filter === status
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]'
                      : 'bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                  }`}
                >
                  {status === 'all' ? 'ALL' : status.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <label className="text-[#E5E4E2] font-bold tracking-wider uppercase">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl font-bold tracking-wider focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              >
                <option value="latest" className="bg-[#0D0D0D]">LATEST FIRST</option>
                <option value="oldest" className="bg-[#0D0D0D]">OLDEST FIRST</option>
                <option value="price_high" className="bg-[#0D0D0D]">HIGHEST PRICE</option>
                <option value="price_low" className="bg-[#0D0D0D]">LOWEST PRICE</option>
                <option value="ending_soon" className="bg-[#0D0D0D]">ENDING SOON</option>
              </select>

              <Link
                to="/create-item"
                className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)] whitespace-nowrap"
              >
                + NEW AUCTION
              </Link>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        {myAuctions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myAuctions.map((auction) => (
              <div
                key={auction._id}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={auction.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider ${getStatusColor(auction.status)}`}>
                      {auction.status?.toUpperCase()}
                    </span>
                  </div>
                  {auction.status === 'active' && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 px-4 py-2 rounded-xl text-xs font-bold text-[#D4AF37] tracking-wider">
                      ⏰ {calculateTimeLeft(auction.endDate)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#F7F7F7] mb-3 line-clamp-1 tracking-wide">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-[#E5E4E2]/70 mb-4 line-clamp-2">
                    {auction.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#D4AF37]/20">
                      <div className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Current Bid</div>
                      <div className="text-lg font-bold text-[#D4AF37]">${auction.currentBid.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#D4AF37]/20">
                      <div className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Starting Bid</div>
                      <div className="text-lg font-bold text-[#F7F7F7]">${auction.startingPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-[#E5E4E2]/70">
                    <span className="tracking-wider uppercase">📂 {auction.category}</span>
                    <span className="tracking-wider uppercase">📅 {new Date(auction.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/items/${auction._id}`}
                      className="flex-1 text-center px-4 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
                    >
                      VIEW DETAILS
                    </Link>
                    <Link
                      to={`/update-item/${auction._id}`}
                      className="px-4 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(auction._id)}
                      className="px-4 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-red-500/30 text-red-500 rounded-xl font-bold tracking-wider hover:bg-red-500 hover:text-[#0D0D0D] transition-all duration-300"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4 text-[#D4AF37]">📦</div>
            <h3 className="text-2xl font-bold text-[#F7F7F7] mb-2 tracking-wide">
              {filter === 'all' ? 'NO AUCTIONS YET' : `NO ${filter.toUpperCase()} AUCTIONS`}
            </h3>
            <p className="text-[#E5E4E2]/70 mb-6">
              {filter === 'all' 
                ? "Create your first auction to get started!"
                : `You don't have any ${filter} auctions.`}
            </p>
            <Link
              to="/create-item"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
            >
              CREATE YOUR FIRST AUCTION
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyAuctions;