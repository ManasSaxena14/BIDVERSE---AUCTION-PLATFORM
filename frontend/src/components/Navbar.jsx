import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import logo from '../assets/LOGO.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-[#0D0D0D] shadow-2xl sticky top-0 z-50 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <img src={logo} alt="BidVerse" className="h-12 w-auto transform group-hover:scale-110 transition-transform duration-300" />
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-[#D4AF37] tracking-wider">
                    BidVerse
                  </div>
                </div>
              </Link>
            </div>

            
            {user?.role !== 'auctioneer' && (
              <div className="hidden md:flex max-w-lg ml-8">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search auctions..."
                      className="w-full px-4 py-2 pl-10 pr-4 bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                    />
                    <svg className="w-5 h-5 text-[#D4AF37] absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </div>
            )}
          </div>

          
          <div className={`hidden lg:flex items-center ${user?.role === 'auctioneer' ? 'space-x-0.5' : 'space-x-1'}`}>
            <Link to="/" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-white/5 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link to="/categories" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-white/5 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Categories
            </Link>
            <Link to="/leaderboard" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-white/5 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leaderboard
            </Link>
            <Link to="/about" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-white/5 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>

            {user ? (
              <>
                {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                  <>
                    <Link to="/create-item" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-[#D4AF37]/10 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Auction
                    </Link>
                    <Link to="/my-auctions" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-[#D4AF37]/10 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      My Auctions
                    </Link>
                  </>
                )}
                <Link to="/profile" className={`text-[#F7F7F7] hover:text-[#D4AF37] rounded-xl font-medium transition-all duration-300 hover:bg-[#D4AF37]/10 flex items-center ${user?.role === 'auctioneer' ? 'px-3 py-2' : 'px-4 py-2'}`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <div className={`flex items-center ${user?.role === 'auctioneer' ? 'space-x-2 ml-2 pl-2' : 'space-x-3 ml-3 pl-3'} border-l border-[#D4AF37]/30`}>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#D4AF37]">{user.name}</div>
                    <div className="text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'superadmin' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' :
                        user.role === 'auctioneer' ? 'bg-[#E5E4E2]/20 text-[#E5E4E2] border border-[#E5E4E2]/40' :
                        'bg-white/20 text-white border border-white/40'
                      }`}>
                        {user.role === 'superadmin' ? 'Admin' : 
                         user.role === 'auctioneer' ? 'Auctioneer' : 
                         'Bidder'}
                      </span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className={`${user?.role === 'auctioneer' ? 'px-4 py-1.5' : 'px-6 py-2'} bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)] flex items-center`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-3">
                <Link to="/login" className="px-4 py-1.5 text-[#D4AF37] hover:text-[#0D0D0D] font-semibold rounded-lg border border-[#D4AF37] hover:bg-[#D4AF37] backdrop-blur-sm transition-all duration-300 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-1.5 bg-[#D4AF37] text-[#0D0D0D] rounded-lg font-bold hover:bg-[#E5E4E2] shadow hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#D4AF37] hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        
        {user?.role !== 'auctioneer' && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auctions..."
                  className="w-full px-4 py-2 pl-10 bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                />
                <svg className="w-5 h-5 text-[#D4AF37] absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>
        )}
      </div>

      
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D4AF37]/30 bg-[#1A1A1A]">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link to="/categories" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Categories
            </Link>
            <Link to="/leaderboard" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leaderboard
            </Link>
            <Link to="/about" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            {user ? (
              <>
                {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                  <>
                    <Link to="/create-item" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Auction
                    </Link>
                    <Link to="/my-auctions" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      My Auctions
                    </Link>
                  </>
                )}
                <Link to="/profile" className="block px-3 py-2 text-[#F7F7F7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl transition-all flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <div className="pt-3 border-t border-[#D4AF37]/30 mt-3">
                  <div className="px-3 py-2 text-sm font-semibold text-[#D4AF37]">{user.name}</div>
                  <div className="px-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'superadmin' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' :
                      user.role === 'auctioneer' ? 'bg-[#E5E4E2]/20 text-[#E5E4E2] border border-[#E5E4E2]/40' :
                      'bg-white/20 text-white border border-white/40'
                    }`}>
                      {user.role === 'superadmin' ? 'Admin' : 
                       user.role === 'auctioneer' ? 'Auctioneer' : 
                       'Bidder'}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="mt-3 w-full px-4 py-2 bg-[#0D0D0D] border border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-[#0D0D0D] shadow-lg transition-all duration-300 hover:shadow-[0_0_18px_rgba(212,175,55,0.4)] flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-[#D4AF37]/30 mt-3 space-y-2">
                <Link to="/login" className="block px-3 py-1.5 text-center text-[#D4AF37] hover:text-[#0D0D0D] font-semibold rounded-lg border border-[#D4AF37] hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
                <Link to="/signup" className="block px-3 py-1.5 text-center bg-[#D4AF37] text-[#0D0D0D] rounded-lg font-bold hover:bg-[#E5E4E2] shadow transition-all duration-300 flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;