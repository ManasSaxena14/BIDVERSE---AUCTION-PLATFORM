import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import ParticleBackground from '../components/ParticleBackground';
import Testimonials from '../components/Testimonials';
import {
  ArrowRight, TrendingUp, Users, Gavel, Zap, ChevronRight,
  Sparkles, LayoutGrid, Crown, ArrowLeft, ArrowRight as ChevronRightIcon,
  Cpu, Palette, Gem, Car, Shirt, Trophy, Medal, BookOpen, Music, Home as HomeIcon, Box, Building
} from 'lucide-react';

const Home = () => {
  const { items, fetchItems, loading } = useItems();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const heroRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  // Pagination State for Live Auctions (3x3 Grid = 9 items)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const search = searchParams.get('search');
    fetchItems(search ? { search, limit: 100 } : { limit: 100 }).catch(() => {});
  }, [searchParams]);

  // Enhanced GSAP Hero Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo([title1Ref.current, title2Ref.current, title3Ref.current], 
        { opacity: 0, y: 80, rotationX: -20, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, rotationX: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.2 }
      )
      .fromTo(subtitleRef.current, 
        { opacity: 0, y: 40, filter: 'blur(5px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 
        '-=0.8'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
        '-=0.6'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const activeItems = items?.filter(item => item.status === 'active' && new Date(item.endDate) > new Date()) || [];
  
  // Pagination Logic
  const totalPages = Math.ceil(activeItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActiveItems = activeItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      document.getElementById('live-auctions').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trending limited to exactly 3
  const trendingItems = [...(items || [])].sort((a, b) => (b.currentBid || 0) - (a.currentBid || 0)).slice(0, 3);
  
  const categories = [...new Set((items || []).map(item => item.category).filter(Boolean))];

  const categoryIcons = {
    'Electronics': Cpu, 'Art': Palette, 'Jewelry': Gem, 'Vehicles': Car, 'Automotive': Car,
    'Fashion': Shirt, 'Collectibles': Trophy, 'Sports': Medal, 'Books': BookOpen,
    'Music': Music, 'Home': HomeIcon, 'Real Estate': Building, 'Other': Box,
  };

  const howItWorks = [
    { icon: Users, title: 'Exclusive Access', desc: 'Secure your membership to the most prestigious auction house online', color: 'purple' },
    { icon: Gavel, title: 'Live Bidding', desc: 'Experience the thrill of real-time combat for the rarest acquisitions', color: 'green' },
    { icon: Crown, title: 'Dominate & Win', desc: 'Outbid rivals, claim your prize, and ascend the absolute global hierarchy', color: 'gold' },
  ];

  return (
    <div className="min-h-screen">
      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero-section">
        <ParticleBackground particleCount={60} />
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* Ambient Orbs - More prominent for eye-catchy effect */}
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="section-container relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center mt-[-5vh]">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-50 border border-gold/20 mb-8 backdrop-blur-md shadow-glow-gold-sm"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">The Pinnacle of Auctions</span>
            </motion.div>

            {/* Title - Staggered lines for maximum impact */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.05] tracking-tight mb-8 drop-shadow-2xl flex flex-col font-display">
              <motion.span 
                ref={title1Ref} 
                className="text-text-primary pl-2 uppercase tracking-tight inline-block"
                style={{textShadow: '0 10px 30px rgba(0,0,0,0.8)'}}
                whileHover={{ 
                  scale: 1.05,
                  x: 10,
                  transition: { duration: 0.3 }
                }}
              >
                Bid.
              </motion.span>
              <motion.span 
                ref={title2Ref} 
                className="text-text-primary pl-2 uppercase tracking-tight inline-block"
                style={{textShadow: '0 10px 30px rgba(0,0,0,0.8)'}}
                whileHover={{ 
                  scale: 1.05,
                  x: 10,
                  transition: { duration: 0.3 }
                }}
              >
                Win.
              </motion.span>
              <motion.span 
                ref={title3Ref} 
                className="gradient-text-gold text-glow-gold pl-2 uppercase tracking-tight transform-gpu inline-block"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(250, 204, 21, 0.3), 0 0 30px rgba(250, 204, 21, 0.1)',
                    '0 0 25px rgba(250, 204, 21, 0.5), 0 0 50px rgba(250, 204, 21, 0.2)',
                    '0 0 15px rgba(250, 204, 21, 0.3), 0 0 30px rgba(250, 204, 21, 0.1)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.08,
                  x: 10,
                  transition: { duration: 0.3 }
                }}
              >
                Dominate.
              </motion.span>
            </h1>

            {/* Subtitle */}
            <div ref={subtitleRef}>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-light px-4">
                Command the ultimate auction arena. Where legends bid, fortunes shift, and only the bold claim victory.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              ref={ctaRef} 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to={user ? '/categories' : '/signup'} className="btn-gold px-10 py-5 text-lg shadow-glow-gold group/btn">
                  <Zap className="w-6 h-6 group-hover/btn:animate-pulse" />
                  {user ? 'Enter Marketplace' : 'Start Bidding Now'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to="/how-it-works" className="btn-ghost text-lg py-5 px-10 border border-glass-border rounded-xl ml-0 bg-[#111111] hover:bg-[#1A1A1A] hover:border-text-secondary transition-all group/discover">
                  Discover How
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block ml-2"
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Down Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            >
              <div className="w-8 h-12 rounded-full border-2 border-gold/30 flex justify-center items-start p-1 bg-[#111111]/50 backdrop-blur-sm">
                <div className="w-1.5 h-3 bg-gold rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ LIVE AUCTIONS (3x3 Grid with Pagination) ============ */}
      {activeItems.length > 0 && (
        <section className="py-32" id="live-auctions">
          <div className="section-container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-4 border-b border-[#1F1F1F] pb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" style={{boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'}} />
                  <span className="text-sm text-neon-green font-bold uppercase tracking-[0.2em]">Live Arena</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-text-primary font-display tracking-tight">Active Auctions</h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-text-muted hidden sm:block mr-4 font-medium uppercase tracking-widest">Page 0{currentPage} / 0{totalPages}</p>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full bg-[#111111] border border-[#1F1F1F] flex items-center justify-center text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1A1A1A] hover:border-gold/50 transition-all hover:text-gold"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full bg-[#111111] border border-[#1F1F1F] flex items-center justify-center text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1A1A1A] hover:border-gold/50 transition-all hover:text-gold"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3x3 Grid strictly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {currentActiveItems.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <ItemCard item={item} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Pagination Dots Indicator */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 bg-[#111111]/80 backdrop-blur-sm w-fit mx-auto px-8 py-4 rounded-full border border-[#1F1F1F] shadow-2xl">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`transition-all duration-500 rounded-full ${currentPage === i + 1 ? 'w-10 h-1.5 bg-gold shadow-glow-gold' : 'w-1.5 h-1.5 bg-text-dim hover:bg-text-secondary'}`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ TRENDING (Top 3 Only) ============ */}
      {trendingItems.length > 0 && (
        <section className="py-32 bg-[#0A0A0A] border-y border-[#1F1F1F] relative overflow-hidden" id="trending-section">
          {/* Ambient rank background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gold/5 blur-[150px] pointer-events-none" />

          <div className="section-container relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span className="text-sm text-gold font-bold uppercase tracking-[0.2em]">Market Leaders</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-text-primary font-display tracking-tight drop-shadow-lg">Trending Elite</h2>
              <p className="text-lg text-text-secondary mt-6 max-w-2xl font-light leading-relaxed">The most sought-after pieces currently dominating the marketplace. High stakes, immense rewards.</p>
            </div>

            {/* Exactly 3 columns grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {trendingItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  key={item._id} 
                  className="relative group"
                >
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center text-bg-deep font-display font-black text-3xl z-20 shadow-[0_0_40px_-5px_rgba(250,204,21,0.6)] border-4 border-[#0A0A0A] group-hover:scale-110 transition-transform duration-500">
                    {i+1}
                  </div>
                  <ItemCard item={item} index={i} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-32" id="how-it-works-preview">
        <div className="section-container">
          <div className="text-center mb-24 relative">
            <h2 className="text-5xl lg:text-7xl font-black text-text-primary mb-6 font-display tracking-tight">The Paradigm</h2>
            <p className="text-xl text-text-secondary font-light tracking-wide">Master the art of acquisition in three phases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[80px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent -z-10" />

            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              const colorClasses = {
                gold: 'text-gold bg-gold-50 border border-gold/30 shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)]',
                green: 'text-neon-green bg-neon-green-dim border border-neon-green/30 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]',
                purple: 'text-neon-purple bg-neon-purple-dim border border-neon-purple/30 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]',
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                  className="glass-card p-12 text-center relative overflow-hidden bg-[#111111]/90 backdrop-blur-2xl border-[#1F1F1F] group hover:border-[#333] transition-colors duration-500"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-glass-border group-hover:via-gold/30 transition-colors duration-500 to-transparent" />
                  
                  <div className="absolute -right-8 -top-8 text-[150px] font-black text-white/[0.015] group-hover:text-gold/[0.03] transition-colors duration-500 select-none pointer-events-none font-display leading-none">
                    0{i+1}
                  </div>
                  
                  <div className={`w-24 h-24 rounded-2xl ${colorClasses[step.color]} flex items-center justify-center mx-auto mb-10 relative z-10 group-hover:-translate-y-2 transition-transform duration-500`}>
                    <Icon className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-text-primary mb-4 font-display relative z-10 tracking-tight">{step.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed relative z-10 font-light">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.length > 0 && (
        <section className="py-32 border-t border-[#1F1F1F] bg-[#0A0A0A]" id="categories-preview">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <LayoutGrid className="w-5 h-5 text-neon-purple" />
                  <span className="text-sm text-neon-purple font-bold uppercase tracking-[0.2em]">Curations</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-text-primary font-display tracking-tight drop-shadow-md">Explore Vaults</h2>
              </div>
              <Link to="/categories" className="btn-ghost flex items-center mt-auto pb-3 text-lg uppercase tracking-widest font-bold border-b-2 border-[#1F1F1F] hover:border-gold hover:text-gold rounded-none px-0 py-0 transition-all duration-300">
                View Directory <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.slice(0, 12).map((cat, i) => {
                const IconComp = categoryIcons[cat] || Box;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/category/${encodeURIComponent(cat)}`}
                      className="glass-card-hover p-10 flex flex-col items-center justify-center gap-6 text-center group h-full bg-[#111111]/80 backdrop-blur-xl border-[#1F1F1F] hover:border-gold/30 transition-all duration-500"
                    >
                      <IconComp className="w-12 h-12 text-text-muted group-hover:text-gold group-hover:scale-110 transition-all duration-500 drop-shadow-xl" strokeWidth={1.2} />
                      <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors tracking-[0.1em] uppercase">{cat}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      <Testimonials />

      {/* ============ CTA ============ */}
      {!user && (
        <section className="py-40 relative overflow-hidden" id="cta-section">
          <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
          
          <div className="section-container">
            <div className="glass-card p-20 text-center relative overflow-hidden backdrop-blur-3xl border-gold/20 shadow-[0_20px_100px_-20px_rgba(250,204,21,0.15)] rounded-[3rem]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-hero opacity-40 animate-pulse-glow" style={{ mixBlendMode: 'screen' }} />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="inline-block px-6 py-2 rounded-full border border-gold/20 bg-gold/5 text-sm text-gold font-bold uppercase tracking-[0.3em] mb-8 shadow-glow-gold-sm">The Inner Circle</span>
                
                <h2 className="text-6xl lg:text-8xl font-black text-text-primary mb-8 font-display tracking-tight leading-[1.1] drop-shadow-2xl">Claim Your <br/><span className="text-transparent bg-clip-text bg-gradient-gold">Legacy.</span></h2>
                
                <p className="text-xl lg:text-2xl text-text-secondary mb-12 leading-relaxed font-light">
                  Join the elite community of collectors and magnates. Secure your access and start winning exclusive pieces that define absolute status.
                </p>
                
                <Link to="/signup" className="btn-gold px-14 py-6 text-xl inline-flex shadow-[0_0_40px_-10px_rgba(250,204,21,0.5)] hover:scale-105 transition-transform duration-500 rounded-2xl group">
                  <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Initiate Access
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && items?.length === 0 && (
        <div className="section-container py-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-64 shimmer" />
                <div className="p-8 space-y-4">
                  <div className="h-5 w-3/4 shimmer rounded-lg" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 shimmer rounded-full" />
                    <div className="h-6 w-20 shimmer rounded-full" />
                  </div>
                  <div className="h-8 w-1/3 shimmer rounded-lg pt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
