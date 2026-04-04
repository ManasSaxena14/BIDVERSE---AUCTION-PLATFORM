import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineTag, 
  HiOutlineUsers, 
  HiOutlineCurrencyDollar, 
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineInboxStack,
  HiOutlineArrowRight,
  HiOutlineScale,
  HiOutlineSignal
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) { setCount(target); return; }
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref} className="gold-shimmer-text">
      {prefix}{typeof count === 'number' ? count.toLocaleString() : count}{suffix}
    </span>
  );
};

const Particle = ({ delay, left, size }) => (
  <div
    className="absolute rounded-full bg-[#D4AF37] pointer-events-none"
    style={{
      left: `${left}%`,
      bottom: '-10px',
      width: `${size}px`,
      height: `${size}px`,
      opacity: 0,
      animation: `particleFloat ${10 + Math.random() * 5}s ease-in-out ${delay}s infinite`,
    }}
  />
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group relative bg-[#1A1A1A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 hover:border-[#D4AF37]/30 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors" />
    <div className="relative z-10 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:border-[#D4AF37]/40 transition-all duration-700 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
        <Icon size={28} className="relative z-10" />
      </div>
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase italic leading-none">{title}</h3>
        <p className="text-white/20 text-[9px] font-black tracking-[0.2em] uppercase leading-relaxed group-hover:text-white/40 transition-colors">{description}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const { items, loading, fetchItems } = useItems();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => { setHeroLoaded(true); }, []);

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
    } catch (error) {
      // Protocol failure logging authorized
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    }).toUpperCase();
  };

  const isExpired = (endDate) => new Date(endDate) < new Date();

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      
      {/* ═══════ EXECUTIVE TERMINAL (HERO) ═══════ */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-[#070707] border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[180px] animate-heroGlow pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[900px] h-[900px] bg-[#B8860B]/3 rounded-full blur-[250px] pointer-events-none" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,175,55,1) 1px, transparent 0)',
            backgroundSize: '64px 64px'
          }} />
          {[...Array(20)].map((_, i) => (
            <Particle key={i} delay={i * 0.5} left={2 + i * 5} size={1 + Math.random() * 2} />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-32 text-center w-full z-10 space-y-16">
          <div className={`inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <HiOutlineSignal className="text-[#D4AF37] text-xs animate-pulse" />
            <span className="text-[10px] font-black text-white/40 tracking-[0.5em] uppercase leading-none">Global Network: Synchronized</span>
          </div>

          <div className="space-y-8">
            <h1 className={`text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter transition-all duration-1000 delay-200 leading-none italic ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-white">BID</span>
              <span className="gold-shimmer-text not-italic">VERSE</span>
            </h1>
            <p className={`text-xl md:text-3xl text-white/40 font-black tracking-[0.2em] uppercase max-w-4xl mx-auto leading-tight transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              The Definitive Global Architecture for <br/>
              <span className="text-[#D4AF37]">High-Valuation Asset Acquisition</span>
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center transition-all duration-1000 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {!user ? (
              <>
                <Link to="/signup" className="px-14 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl leading-none">
                  Identity Registration
                </Link>
                <Link to="/login" className="px-14 py-6 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-white transition-all leading-none">
                  Authorize Access
                </Link>
              </>
            ) : (
              <Link to="/categories" className="px-14 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)] leading-none">
                Master Portfolio Index
              </Link>
            )}
          </div>
        </div>

        <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-1000 delay-1000 ${heroLoaded ? 'opacity-20' : 'opacity-0'}`}>
          <div className="w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        </div>
      </section>

      {/* ═══════ INTELLIGENCE METRICS ═══════ */}
      <section className="relative border-b border-white/5 bg-[#0D0D0D] py-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
            {[
              { target: '10000', suffix: '+', label: 'Registered Holdings', icon: HiOutlineTag },
              { target: '50000', suffix: '+', label: 'Verified Entities', icon: HiOutlineUsers },
              { prefix: '$', target: '50', suffix: 'M+', label: 'Consolidated Capitalization', icon: HiOutlineCurrencyDollar },
              { target: '24', suffix: '/7', label: 'Network Sovereignty', icon: HiOutlineShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="text-center group space-y-6">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/20 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-all duration-700">
                  <stat.icon />
                </div>
                <div className="space-y-2">
                  <div className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} prefix={stat.prefix || ''} />
                  </div>
                  <div className="text-[10px] text-white/20 tracking-[0.4em] uppercase font-black">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CORE ADVANTAGES ═══════ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-48">
        <header className="text-center mb-32 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] font-black tracking-[0.4em] uppercase">
            Institutional Standards
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight italic">
            Strategic <span className="text-[#D4AF37] not-italic">Indexing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/20 text-[11px] font-black tracking-[0.3em] uppercase leading-relaxed">
            Engineered acquisition frameworks for the most sophisticated global portfolio managers.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard icon={HiOutlineCheckBadge} title="Verified Authenticity" description="Rigorous authentication protocols for all listed archival inventory." />
          <FeatureCard icon={HiOutlineClock} title="Real-Time Sync" description="Sub-millisecond synchronization across the global trade network." />
          <FeatureCard icon={HiOutlineShieldCheck} title="Capital Sovereignty" description="Elite encryption shields protecting high-liquidity settlements." />
          <FeatureCard icon={HiOutlineGlobeAlt} title="Global Exposure" description="Unrestricted access to high-valuation assets across international jurisdictions." />
        </div>
      </section>

      {/* ═══════ MARKET FILTRATION ═══════ */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-48">
        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 md:p-16 shadow-2xl mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-end gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic">
                <HiOutlineMagnifyingGlass className="text-sm" /> Portfolio Intelligence Search
              </label>
              <input
                type="text"
                placeholder="Initialize asset synchronization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-10 py-7 bg-black/40 border border-white/5 text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl focus:ring-1 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/40 transition-all outline-none italic placeholder:text-white/10 shadow-inner"
              />
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic">
                Protocol Status
              </label>
              <div className="flex bg-black/60 p-2 rounded-2xl border border-white/5">
                {['all', 'active', 'closed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-700 leading-none ${
                      activeTab === tab
                        ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-[0_0_40px_rgba(212,175,55,0.2)]'
                        : 'text-white/20 hover:text-white/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic">
                Asset Classification
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-10 py-7 bg-black/60 border border-white/5 text-white/40 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37]/40 appearance-none cursor-pointer hover:border-[#D4AF37]/30 transition-all min-w-[240px] italic leading-none"
                >
                  <option value="all">Comprehensive Index</option>
                  {['Automotive', 'Jewelry', 'Art', 'Antiques', 'Electronics', 'Fashion', 'Collectibles'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Link to="/categories" className="absolute -bottom-8 right-0 text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-[#D4AF37] transition-colors">View All Classifications</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ MASTER PORTFOLIO GRID ═══════ */}
        <section className="space-y-24">
          <header className="flex flex-col items-center space-y-6">
             <div className="w-12 h-px bg-[#D4AF37]/40 shadow-[0_0_10px_#D4AF37]" />
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic text-center">
              Active <span className="text-[#D4AF37] not-italic">Pools</span>
            </h2>
             <p className="text-white/20 text-[11px] font-black tracking-[0.5em] uppercase text-center italic">Curated Acquisition Opportunities</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 space-y-10">
              <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
              <p className="text-[10px] text-[#D4AF37] font-black tracking-[0.6em] uppercase animate-pulse">Synchronizing Terminal...</p>
            </div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {items.map((item, idx) => {
                const expired = isExpired(item.endDate);
                const isActive = item.status === 'active' && !expired;
                const canEdit = user && ((item.createdBy && item.createdBy._id === user.id) || user.role === 'superadmin');

                return (
                  <article
                    key={item._id}
                    className="group bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-700 overflow-hidden hover:-translate-y-4 shadow-2xl relative"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <Link to={`/items/${item._id}`} className="block relative aspect-[5/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-8 right-8">
                        <div className={`px-5 py-2.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-xl ${isActive 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_30px_rgba(212,175,55,0.4)]' 
                          : 'bg-black/60 text-white/20 border-white/10'}`}>
                          {isActive ? 'LIVE POOL' : 'CLOSED'}
                        </div>
                      </div>
                    </Link>

                    <div className="p-10 space-y-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[9px] font-black text-[#D4AF37] tracking-[0.4em] uppercase">
                          <HiOutlineScale /> {item.category}
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-[#D4AF37] transition-colors line-clamp-1 italic">{item.title}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-10 py-8 border-y border-white/5">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-white/20 tracking-widest uppercase">Benchmark</p>
                          <p className="text-3xl font-black text-white tracking-tighter italic">${item.currentBid?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-[9px] font-black text-white/20 tracking-widest uppercase">Settlement</p>
                          <p className="text-[11px] font-black text-white/60 tracking-[0.2em] uppercase leading-none">{formatDate(item.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Link
                          to={`/items/${item._id}`}
                          className="flex-1 px-10 py-5 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase rounded-2xl hover:bg-[#D4AF37] hover:text-[#0D0D0D] hover:border-[#D4AF37] transition-all text-center leading-none shadow-2xl group/btn"
                        >
                          Details <HiOutlineArrowRight className="inline-block ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        {canEdit && (
                          <Link to={`/update-item/${item._id}`} className="p-5 bg-white/5 text-white/20 hover:text-[#D4AF37] transition-colors rounded-2xl border border-white/5">
                            <HiOutlinePencilSquare />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-48 bg-white/5 border border-dashed border-white/10 rounded-[4rem] backdrop-blur-3xl space-y-10">
              <HiOutlineInboxStack className="text-8xl text-white/5 mx-auto" />
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Portfolio Empty</h3>
                <p className="max-w-md mx-auto text-white/20 text-[11px] font-black tracking-[0.3em] uppercase leading-relaxed">
                  The master index is currently synchronized but clear. <br/>Awaiting new archival allocations.
                </p>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <footer className="mt-40 flex items-center justify-center gap-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-10 py-6 bg-white/5 text-white/20 border border-white/10 rounded-2xl hover:text-white disabled:opacity-10 transition-all font-black text-[10px] tracking-[0.5em] uppercase hover:border-[#D4AF37]/40 leading-none"
              >
                Previous
              </button>
              <div className="text-xl font-black text-[#D4AF37] tracking-widest italic gold-shimmer-text">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-10 py-6 bg-white/5 text-white/20 border border-white/10 rounded-2xl hover:text-white disabled:opacity-10 transition-all font-black text-[10px] tracking-[0.5em] uppercase hover:border-[#D4AF37]/40 leading-none"
              >
                Next
              </button>
            </footer>
          )}
        </section>
      </main>

      {/* ═══════ FINAL AUTHORIZATION ═══════ */}
      {!user && (
        <section className="relative overflow-hidden border-t border-white/5 py-64 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/20 to-black pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#D4AF37]/5 rounded-full blur-[200px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 text-center space-y-16 z-10">
            <div className="space-y-8">
              <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-tight italic">
                Lodge Your <span className="gold-shimmer-text not-italic">Identity</span>
              </h2>
              <p className="text-white/20 text-[11px] font-black tracking-[0.4em] uppercase max-w-2xl mx-auto leading-relaxed">
                Join the global archival network discovering <br/>and acquiring exclusive high-valuation assets daily.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 justify-center pt-8">
              <Link to="/signup" className="px-16 py-7 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.5em] uppercase hover:bg-white transition-all shadow-[0_0_60px_rgba(212,175,55,0.2)] leading-none">
                Register Identity
              </Link>
              <Link to="/login" className="px-16 py-7 bg-white/5 border border-white/10 text-white/20 rounded-2xl font-black text-[10px] tracking-[0.5em] uppercase hover:text-white transition-all leading-none">
                Establish Gateway
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;