import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { 
  HiOutlineHome, 
  HiOutlineTag, 
  HiOutlineChartBar, 
  HiOutlineInformationCircle, 
  HiOutlinePlus, 
  HiOutlineListBullet, 
  HiOutlineShieldCheck, 
  HiOutlineUser, 
  HiOutlineArrowRightOnRectangle, 
  HiOutlineMagnifyingGlass, 
  HiOutlineBars3, 
  HiOutlineXMark,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';
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

  const navLinks = [
    { to: '/', label: 'TERMINAL', icon: HiOutlineGlobeAlt },
    { to: '/categories', label: 'REGISTRY', icon: HiOutlineTag },
    { to: '/leaderboard', label: 'INDEX', icon: HiOutlineChartBar },
    { to: '/about', label: 'PROTOCOL', icon: HiOutlineInformationCircle },
  ];

  return (
    <nav className="bg-[#0D0D0D]/90 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="flex justify-between items-center h-24">
          
          <div className="flex items-center gap-14">
            <Link to="/" className="flex items-center space-x-4 group">
              <img src={logo} alt="BidVerse" className="h-12 w-auto transform group-hover:scale-110 transition-all duration-700 luxury-glow filter grayscale group-hover:grayscale-0" />
              <div className="hidden lg:block">
                <span className="text-2xl font-black text-white tracking-[0.3em] uppercase italic group-hover:gold-shimmer-text transition-all duration-700">BidVerse</span>
              </div>
            </Link>

            {user?.role !== 'auctioneer' && (
              <div className="hidden xl:flex items-center">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Global Assets..."
                    className="w-72 px-8 py-3 pl-14 bg-white/5 border border-white/10 text-white placeholder-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 focus:w-96 transition-all duration-700 outline-none italic"
                  />
                  <HiOutlineMagnifyingGlass className="w-5 h-5 text-white/10 absolute left-5 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#D4AF37] transition-colors duration-700" />
                </form>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/20 hover:text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 flex items-center gap-3 hover:bg-white/5 italic"
              >
                <link.icon className="w-4 h-4 opacity-50" />
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="flex items-center gap-4 ml-4 pl-8 border-l border-white/5">
                {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                  <>
                    <Link to="/create-item" className="text-white/20 hover:text-[#D4AF37] px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 flex items-center gap-3 hover:bg-[#D4AF37]/5 italic">
                      <HiOutlinePlus className="w-4 h-4" />
                      INITIATE
                    </Link>
                    <Link to="/my-auctions" className="text-white/20 hover:text-[#D4AF37] px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 flex items-center gap-3 hover:bg-[#D4AF37]/5 italic">
                      <HiOutlineBriefcase className="w-4 h-4" />
                      MANAGEMENT
                    </Link>
                  </>
                )}
                {user.role === 'superadmin' && (
                  <Link to="/admin-dashboard" className="text-[#D4AF37] hover:bg-[#D4AF37]/10 px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 flex items-center gap-3 border border-[#D4AF37]/20 italic">
                    <HiOutlineShieldCheck className="w-4 h-4" />
                    GOVERNANCE
                  </Link>
                )}
                <Link to="/profile" className="text-white/20 hover:text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 flex items-center gap-3 hover:bg-white/5 italic">
                  <HiOutlineUser className="w-4 h-4" />
                  IDENTITY
                </Link>
                
                <div className="flex items-center gap-6 ml-6 pl-8 border-l border-white/5">
                  <div className="text-right">
                    <div className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic leading-none mb-1">{user.name}</div>
                    <div className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em] leading-none italic opacity-50">
                      {user.role}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-4 bg-white/5 border border-white/10 text-white/20 rounded-2xl hover:text-red-500 hover:border-red-500/30 transition-all duration-700"
                    title="Terminate Session"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="flex items-center gap-8 ml-8 pl-8 border-l border-white/5">
                <Link to="/login" className="text-white/20 hover:text-white text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 italic">
                  SIGN IN
                </Link>
                <Link to="/signup" className="px-10 py-3.5 bg-[#D4AF37] text-[#0D0D0D] text-[11px] font-black tracking-[0.3em] uppercase rounded-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all duration-700 shadow-[0_20px_50px_rgba(212,175,55,0.2)] italic">
                  INITIALIZE ACCOUNT
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-4 rounded-2xl text-[#D4AF37] bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D0D] border-t border-white/5 fixed inset-0 top-[97px] z-[100] animate-fadeIn">
          <div className="px-8 py-12 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-6 px-8 py-6 rounded-[2.5rem] text-white/20 text-[11px] font-black tracking-[0.4em] uppercase bg-white/5 border border-transparent hover:border-[#D4AF37]/30 hover:text-white transition-all duration-700 italic"
              >
                <link.icon className="w-6 h-6 opacity-30" />
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-12 border-t border-white/5 space-y-6">
                <div className="px-10 py-8 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[3rem] space-y-2">
                  <div className="text-[12px] font-black text-[#D4AF37] uppercase tracking-[0.3em] italic">{user.name}</div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">{user.role}</div>
                </div>
                
                {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                  <>
                    <Link to="/create-item" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-6 px-8 py-6 rounded-[2.5rem] text-white/20 text-[11px] font-black tracking-[0.4em] uppercase bg-white/5 hover:text-[#D4AF37] transition-all italic">
                      <HiOutlinePlus className="w-6 h-6 opacity-30" /> INITIATE ASSET
                    </Link>
                    <Link to="/my-auctions" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-6 px-8 py-6 rounded-[2.5rem] text-white/20 text-[11px] font-black tracking-[0.4em] uppercase bg-white/5 hover:text-[#D4AF37] transition-all italic">
                      <HiOutlineBriefcase className="w-6 h-6 opacity-30" /> MANAGEMENT
                    </Link>
                  </>
                )}
                
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-6 px-8 py-6 rounded-[2.5rem] text-white/20 text-[11px] font-black tracking-[0.4em] uppercase bg-white/5 hover:text-white transition-all italic">
                  <HiOutlineUser className="w-6 h-6 opacity-30" /> IDENTITY
                </Link>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-6 px-8 py-8 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black tracking-[0.4em] uppercase italic"
                >
                  <HiOutlineArrowRightOnRectangle className="w-6 h-6" />
                  TERMINATE SESSION
                </button>
              </div>
            ) : (
              <div className="pt-12 border-t border-white/5 space-y-6">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-8 py-6 rounded-[2.5rem] text-white/20 text-[11px] font-black tracking-[0.4em] uppercase border border-white/5 hover:text-white transition-all italic">
                  SIGN IN
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center px-8 py-6 rounded-[2.5rem] bg-[#D4AF37] text-[#0D0D0D] text-[11px] font-black tracking-[0.4em] uppercase shadow-3xl italic">
                  INITIALIZE ACCOUNT
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