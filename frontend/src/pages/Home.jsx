import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const { user } = useAuth();
  const { items, loading, error, fetchItems } = useItems();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    loadItems();
  }, [activeTab, selectedCategory, searchQuery, currentPage]);

  const loadItems = async () => {
    try {
      const params = {
        status: activeTab === 'all' ? undefined : activeTab,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await fetchItems(params);
      setTotalPages(response.pages || 1);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('Failed to load items:', error);
      addToast('Failed to load auction items', 'error');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteItem(id);
        addToast('Auction deleted successfully!', 'success');
        
      } catch (error) {
        addToast('Failed to delete auction', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="relative bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] border-b border-[#D4AF37]/30 overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-[#F7F7F7] mb-6 tracking-wide">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">BIDVERSE</span>
            </h1>
            <p className="text-2xl text-[#E5E4E2]/80 mb-6 max-w-3xl mx-auto leading-relaxed tracking-wide">
              <span className="font-bold text-lg">A Global Stage for the World’s Finest Auctions</span>
            </p>
            <p className="text-xl text-[#E5E4E2]/80 mb-4 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Connect with elite collectors worldwide and compete for rare, high-value pieces.
            </p>
            <p className="text-xl text-[#E5E4E2]/80 mb-4 max-w-3xl mx-auto leading-relaxed tracking-wide">
              A trusted marketplace where premium assets meet serious bidders.
            </p>
            <p className="text-xl text-[#E5E4E2]/80 mb-10 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Every listing is curated, verified, and built for prestige.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">10K+</div>
            <div className="text-[#E5E4E2]/70 tracking-wider uppercase">Items Auctioned</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">50K+</div>
            <div className="text-[#E5E4E2]/70 tracking-wider uppercase">Bidders</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">$50M+</div>
            <div className="text-[#E5E4E2]/70 tracking-wider uppercase">Value Traded</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">24/7</div>
            <div className="text-[#E5E4E2]/70 tracking-wider uppercase">Support</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    
                  }}
                  className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl font-bold tracking-wider focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder:text-[#E5E4E2]/50"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'closed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    
                  }}
                  className={`px-6 py-3 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]'
                      : 'bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                  }`}
                >
                  {tab === 'all' ? 'ALL AUCTIONS' : tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[#E5E4E2] font-bold tracking-wider uppercase">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  
                }}
                className="px-4 py-3 bg-[#0D0D0D] border border-[#D4AF37]/30 text-[#F7F7F7] rounded-xl font-bold tracking-wider focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              >
                <option value="all" className="bg-[#0D0D0D]">ALL CATEGORIES</option>
                <option value="Automotive" className="bg-[#0D0D0D]">AUTOMOTIVE</option>
                <option value="Jewelry" className="bg-[#0D0D0D]">JEWELRY</option>
                <option value="Art" className="bg-[#0D0D0D]">ART</option>
                <option value="Antiques" className="bg-[#0D0D0D]">ANTIQUES</option>
                <option value="Electronics" className="bg-[#0D0D0D]">ELECTRONICS</option>
                <option value="Fashion" className="bg-[#0D0D0D]">FASHION</option>
                <option value="Collectibles" className="bg-[#0D0D0D]">COLLECTIBLES</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-12 text-center">
          <div>
            <h2 className="text-4xl font-bold text-[#F7F7F7] tracking-wide">FEATURED AUCTIONS</h2>
            <p className="text-[#E5E4E2]/70 mt-2 text-lg tracking-wide">Exclusive items available now</p>

          </div>
        </div>

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
              const isOwner = user && item.createdBy && item.createdBy._id === user.id;
              const isSuperAdmin = user && user.role === 'superadmin';
              const canEdit = isOwner || isSuperAdmin;

              return (
                <div key={item._id} className="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] border border-[#D4AF37]/20">
                  <Link to={`/items/${item._id}`} className="block relative overflow-hidden">
                    <img
                      src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={item.title}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider backdrop-blur-md ${isActive
                          ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg'
                          : 'bg-black/60 text-[#E5E4E2] border border-[#E5E4E2]/30'
                        }`}>
                        {isActive ? 'LIVE' : 'ENDED'}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl text-xs font-bold text-[#D4AF37] tracking-wider">
                        {item.category?.toUpperCase() || 'UNCATEGORIZED'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]">
                    <Link to={`/items/${item._id}`}>
                      <h3 className="text-xl font-bold text-[#F7F7F7] mb-2 hover:text-[#D4AF37] transition-colors line-clamp-1 tracking-wide">
                        {item.title || 'Untitled Auction'}
                      </h3>
                    </Link>
                    <p className="text-[#E5E4E2]/70 text-sm mb-4 line-clamp-2">{item.description || 'No description available'}</p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D4AF37]/20">
                      <div>
                        <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Current Bid</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">${item.currentBid?.toLocaleString() || item.startingPrice?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Ends</p>
                        <p className="text-sm font-semibold text-[#E5E4E2]">{item.endDate ? formatDate(item.endDate) : 'N/A'}</p>
                      </div>
                    </div>

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

        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-bold tracking-wider ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#D4AF37] text-[#0D0D0D] hover:bg-[#E5E4E2] transition-all'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-bold tracking-wider ${
                        currentPage === page
                          ? 'bg-[#D4AF37] text-[#0D0D0D]'
                          : 'bg-[#1A1A1A] text-[#E5E4E2] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-bold tracking-wider ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#D4AF37] text-[#0D0D0D] hover:bg-[#E5E4E2] transition-all'
                }`}
              >
                Next
              </button>
            </div>
            
            <p className="mt-4 text-[#E5E4E2]/70 text-sm">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>

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