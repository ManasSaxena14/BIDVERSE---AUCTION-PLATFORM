import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const { items, fetchItems, deleteItem, loading } = useItems();
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    // Changed from 'active' to '' to show all items by default
    status: '',
    minPrice: '',
    maxPrice: '',
    sort: 'latest',
    page: 1,
    limit: 12
  });

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [location.search]);

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    // Only add status filter if it's not empty
    if (filters.status) params.status = filters.status;
    if (filters.sort) params.sort = filters.sort;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    params.page = filters.page;
    params.limit = filters.limit;

    try {
      await fetchItems(params);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction item?')) {
      try {
        await deleteItem(id);
        addToast('Item deleted successfully!', 'success');
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to delete item', 'error');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  const categories = ['Electronics', 'Art', 'Collectibles', 'Jewelry', 'Antiques', 'Fashion'];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Elegant Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-semibold tracking-wider">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.6)]"></span>
              LIVE AUCTIONS NOW
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F7F7F7] tracking-tight leading-tight">
              Discover Rare Treasures
              <span className="block mt-3 text-[#D4AF37] tracking-wider">
                Bid with Confidence
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#E5E4E2]/80 leading-relaxed tracking-wide">
              Join the world's most sophisticated auction platform. Explore curated collections of art, collectibles, and luxury items from verified sellers worldwide.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              {!user ? (
                <>
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wide hover:bg-[#E5E4E2] transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.6)]"
                  >
                    START BIDDING FREE
                  </Link>
                  <Link 
                    to="/about" 
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#D4AF37] backdrop-blur-sm text-[#D4AF37] rounded-xl font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#0D0D0D] transform hover:scale-105 transition-all duration-300"
                  >
                    HOW IT WORKS
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wide hover:bg-[#E5E4E2] transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.6)]"
                >
                  EXPLORE COLLECTIONS
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto pt-16 border-t border-[#D4AF37]/20">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1">{items?.length || 0}+</div>
                <div className="text-xs sm:text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Global Bidders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1">$50M+</div>
                <div className="text-xs sm:text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Items Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-[#F7F7F7] text-center mb-12 tracking-wide">BROWSE BY CATEGORY</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setFilters({ ...filters, category: '', page: 1 })}
            className={`px-8 py-3 rounded-xl font-semibold tracking-wide transition-all transform hover:scale-105 duration-300 ${
              filters.category === '' 
                ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_8px_30px_rgba(212,175,55,0.4)]' 
                : 'bg-white/5 text-[#F7F7F7] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]'
            }`}
          >
            ALL CATEGORIES
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat, page: 1 })}
              className={`px-8 py-3 rounded-xl font-semibold tracking-wide transition-all transform hover:scale-105 duration-300 ${
                filters.category === cat 
                  ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_8px_30px_rgba(212,175,55,0.4)]' 
                  : 'bg-white/5 text-[#F7F7F7] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-[#D4AF37]/20 p-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search for items, categories, or keywords..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] placeholder-[#E5E4E2]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                />
                <svg className="absolute left-4 top-3.5 h-6 w-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-64">
              <select 
                name="sort" 
                value={filters.sort} 
                onChange={handleFilterChange} 
                className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
              >
                <option value="latest" className="bg-[#1A1A1A] text-[#F7F7F7]">Latest First</option>
                <option value="price_asc" className="bg-[#1A1A1A] text-[#F7F7F7]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#1A1A1A] text-[#F7F7F7]">Price: High to Low</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-[#D4AF37] text-[#0D0D0D] hover:bg-[#E5E4E2] rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              FILTERS
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-bold text-[#F7F7F7] mb-2 tracking-wide">
                    STATUS
                  </label>
                  <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                  >
                    <option value="" className="bg-[#1A1A1A] text-[#F7F7F7]">All Statuses</option>
                    <option value="active" className="bg-[#1A1A1A] text-[#F7F7F7]">Active</option>
                    <option value="closed" className="bg-[#1A1A1A] text-[#F7F7F7]">Closed</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-bold text-[#F7F7F7] mb-2 tracking-wide">
                    MIN PRICE ($)
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all placeholder-[#E5E4E2]/50"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-bold text-[#F7F7F7] mb-2 tracking-wide">
                    MAX PRICE ($)
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Any"
                    className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all placeholder-[#E5E4E2]/50"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    status: '',
                    minPrice: '',
                    maxPrice: '',
                    sort: 'latest',
                    page: 1,
                    limit: 12
                  })}
                  className="px-6 py-2 text-sm font-bold bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] rounded-xl hover:bg-[#D4AF37] hover:text-[#0D0D0D] shadow-lg transition-all duration-300 tracking-wide"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Auctions */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-[#F7F7F7] tracking-wide">FEATURED AUCTIONS</h2>
            <p className="text-[#E5E4E2]/70 mt-2 text-lg tracking-wide">Exclusive items available now</p>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
              <p className="text-xl text-[#E5E4E2]">Loading exclusive auctions...</p>
            </div>
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const expired = isExpired(item.endDate);
              const isActive = item.status === 'active' && !expired;
              const isOwner = user && item.createdBy._id === user.id;
              const isSuperAdmin = user && user.role === 'superadmin';
              const canEdit = isOwner || isSuperAdmin;

              return (
                <div key={item._id} className="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] border border-[#D4AF37]/20">
                  {/* Image */}
                  <Link to={`/items/${item._id}`} className="block relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider backdrop-blur-md ${
                        isActive 
                          ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg' 
                          : 'bg-black/60 text-[#E5E4E2] border border-[#E5E4E2]/30'
                      }`}>
                        {isActive ? 'LIVE' : 'ENDED'}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl text-xs font-bold text-[#D4AF37] tracking-wider">
                        {item.category.toUpperCase()}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]">
                    <Link to={`/items/${item._id}`}>
                      <h3 className="text-xl font-bold text-[#F7F7F7] mb-2 hover:text-[#D4AF37] transition-colors line-clamp-1 tracking-wide">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-[#E5E4E2]/70 text-sm mb-4 line-clamp-2">{item.description}</p>

                    {/* Price and Time */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D4AF37]/20">
                      <div>
                        <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Current Bid</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">${item.currentBid}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Ends</p>
                        <p className="text-sm font-semibold text-[#E5E4E2]">{formatDate(item.endDate)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link 
                        to={`/items/${item._id}`} 
                        className="flex-1 text-center px-6 py-3 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold tracking-wide hover:bg-[#E5E4E2] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
                      >
                        VIEW DETAILS
                      </Link>
                      {canEdit && user && (
                        <div className="flex gap-2">
                          <Link 
                            to={`/update-item/${item._id}`} 
                            className="px-4 py-3 bg-white/5 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 rounded-xl transition-all duration-300"
                            title="Edit"
                          >
                            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button 
                            onClick={() => handleDelete(item._id)} 
                            className="px-4 py-3 bg-white/5 border border-red-500/30 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-[#F7F7F7] mb-3 tracking-wide">NO AUCTIONS FOUND</h3>
            <p className="text-[#E5E4E2]/70 mb-8 text-lg">Try adjusting your search or filters</p>
            {user && (user.role === 'auctioneer' || user.role === 'superadmin') && (
              <Link to="/create-item" className="inline-block px-8 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold tracking-wide hover:bg-[#E5E4E2] transition-all duration-300 shadow-lg">
                CREATE FIRST AUCTION
              </Link>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gradient-to-r from-[#1A1A1A] via-[#0D0D0D] to-black border-t border-[#D4AF37]/30 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-[#F7F7F7] mb-6 tracking-wide">
              READY TO START BIDDING?
            </h2>
            <p className="text-xl text-[#E5E4E2]/80 mb-10 tracking-wide">
              Join thousands of bidders discovering exclusive treasures every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="px-10 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wide hover:bg-[#E5E4E2] transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.4)]">
                CREATE FREE ACCOUNT
              </Link>
              <Link to="/login" className="px-10 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#0D0D0D] transform hover:scale-105 transition-all duration-300">
                SIGN IN
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;