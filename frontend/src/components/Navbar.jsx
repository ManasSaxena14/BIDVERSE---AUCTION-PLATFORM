import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import logoImage from '../assets/LOGO.png';
import {
  Menu, X, Search, User, LogOut, ChevronDown,
  Home, Gavel, LayoutGrid, Trophy, PlusCircle, Settings, Shield,
  ListOrdered, Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/categories', label: 'Categories', icon: LayoutGrid },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // Admin-only nav links
  const adminNavLinks = [
    { to: '/admin-dashboard', label: 'Admin Panel', icon: Shield },
  ];

  const isActive = (path) => location.pathname === path;

  const roleBadge = {
    superadmin: { label: 'ADMIN', class: 'badge-danger' },
    auctioneer: { label: 'SELLER', class: 'badge-purple' },
    bidder: { label: 'BIDDER', class: 'badge-green' },
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-navbar shadow-glass' : 'bg-transparent'
      }`}
      id="main-navbar"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="navbar-logo">
            <img 
              src={logoImage} 
              alt="BidVerse Logo" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
            <span className="text-xl font-bold font-display gradient-text-gold hidden sm:block">BidVerse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest font-display transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.to)
                      ? 'bg-gold-100 text-gold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            
            {/* Admin Panel Link - Only for Superadmin */}
            {user?.role === 'superadmin' && adminNavLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest font-display transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.to)
                      ? 'bg-danger/10 text-danger border border-danger/30 shadow-glow-danger'
                      : 'text-danger hover:text-danger hover:bg-danger/5 border border-transparent hover:border-danger/20'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search + Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auctions..."
                className="w-48 pl-9 pr-4 py-2 rounded-xl text-sm glass-input focus:w-64 transition-all duration-300"
                id="navbar-search"
              />
            </form>

            {user ? (
              <>
                <NotificationDropdown />

                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                    id="profile-dropdown-btn"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-bg-deep">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-medium text-text-primary leading-tight">{user.name}</p>
                      <span className={`${roleBadge[user.role]?.class} text-[9px] py-0.5 px-1.5`}>
                        {roleBadge[user.role]?.label}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-card overflow-hidden"
                      >
                        <div className="p-3 border-b border-glass-border">
                          <p className="text-sm font-medium text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                            <>
                              <Link to="/create-item" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                                <PlusCircle className="w-4 h-4" /> Create Auction
                              </Link>
                              <Link to="/my-auctions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                                <ListOrdered className="w-4 h-4" /> My Auctions
                              </Link>
                            </>
                          )}
                          {user.role === 'superadmin' && (
                            <Link to="/admin-dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                              <Shield className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <Link to="/edit-profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                        </div>
                        <div className="p-2 border-t border-glass-border">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm" id="login-btn">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-gold text-sm py-2 px-4" id="signup-btn">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            id="mobile-menu-btn"
          >
            {isOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden glass-dark overflow-hidden border-t border-glass-border"
          >
            <div className="section-container py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auctions..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm glass-input"
                />
              </form>

              {navLinks.map((link) => {
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-gold-100 text-gold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Admin Panel Link - Only for Superadmin */}
              {user?.role === 'superadmin' && adminNavLinks.map((link) => {
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-danger bg-danger/5 border border-danger/20 hover:bg-danger/10"
                  >
                    <IconComp className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <div className="divider-glow my-3" />
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  {(user.role === 'auctioneer' || user.role === 'superadmin') && (
                    <Link to="/create-item" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5">
                      <PlusCircle className="w-5 h-5" /> Create Auction
                    </Link>
                  )}
                  {user.role === 'superadmin' && (
                    <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5">
                      <Shield className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1 btn-ghost text-sm py-2.5 border border-glass-border rounded-xl justify-center">
                    Sign In
                  </Link>
                  <Link to="/signup" className="flex-1 btn-gold text-sm py-2.5">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
