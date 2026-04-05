import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { LayoutGrid, ChevronRight, Package, Cpu, Palette, Gem, Car, Shirt, Trophy, Medal, BookOpen, Music, Home as HomeIcon, Box, Building } from 'lucide-react';

const categoryConfig = {
  'Electronics': { icon: Cpu, color: 'from-cyan-500/20 to-blue-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  'Art': { icon: Palette, color: 'from-purple-500/20 to-pink-600/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  'Jewelry': { icon: Gem, color: 'from-gold/20 to-amber-600/20', border: 'border-gold/40', text: 'text-gold', glow: 'shadow-gold/20' },
  'Vehicles': { icon: Car, color: 'from-green-500/20 to-emerald-600/20', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
  'Automotive': { icon: Car, color: 'from-green-500/20 to-emerald-600/20', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
  'Fashion': { icon: Shirt, color: 'from-rose-500/20 to-pink-600/20', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
  'Collectibles': { icon: Trophy, color: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  'Sports': { icon: Medal, color: 'from-teal-500/20 to-emerald-600/20', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  'Books': { icon: BookOpen, color: 'from-orange-400/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  'Music': { icon: Music, color: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  'Home': { icon: HomeIcon, color: 'from-teal-400/20 to-cyan-600/20', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  'Real Estate': { icon: Building, color: 'from-blue-400/20 to-indigo-600/20', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
};

const Categories = () => {
  const { items, fetchItems, loading } = useItems();

  useEffect(() => {
    fetchItems({ limit: 200 }).catch(() => {});
  }, []);

  const categoryMap = {};
  (items || []).forEach((item) => {
    const cat = item.category || 'Other';
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, active: 0, totalValue: 0 };
    categoryMap[cat].count++;
    if (item.status === 'active' && new Date(item.endDate) > new Date()) categoryMap[cat].active++;
    categoryMap[cat].totalValue += item.currentBid || item.startingPrice || 0;
  });

  const categories = Object.entries(categoryMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="page-container relative overflow-hidden" id="categories-page">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#111111] border border-[#1F1F1F] mb-6 shadow-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            <span className="text-xs text-text-secondary uppercase tracking-[0.2em] font-bold">Curated Selections</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black text-text-primary mb-6 font-display tracking-tight drop-shadow-xl">
            Explore Vaults
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            Discover extraordinary items categorized by class. Each vault contains premium acquisitions waiting for the highest bidder.
          </p>
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card p-8 h-56 shimmer" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="glass-card max-w-lg mx-auto text-center py-20 px-8 border-[#1F1F1F]">
            <Package className="w-16 h-16 text-text-muted mx-auto mb-6" />
            <h3 className="text-2xl font-black text-text-primary mb-3 font-display">No Assets Available</h3>
            <p className="text-text-secondary font-light">The vaults are currently empty. Check back once new acquisitions are classified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {categories.map((cat, i) => {
              const cfg = categoryConfig[cat.name] || { icon: Box, color: 'from-[#1A1A1A] to-[#111111]', border: 'border-[#1F1F1F]', text: 'text-text-muted' };
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                >
                  <Link
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    className={`glass-card p-1 items-stretch block group relative overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] h-full`}
                  >
                    {/* Animated Liquid Background Layer */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cfg.color} opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0`} />
                    
                    {/* Persistent Shimmer / Scanline effect */}
                    <div className="absolute inset-x-0 top-0 h-[200%] w-full bg-gradient-to-b from-white/[0.03] via-transparent to-transparent -translate-y-full group-hover:animate-shimmer-slow pointer-events-none z-0" />

                    <div className="relative z-10 bg-[#070707]/95 p-9 h-full flex flex-col border border-white/10 rounded-[14px]">
                      <div className="flex items-start justify-between mb-10">
                        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cfg.color} flex items-center justify-center border-2 ${cfg.border} group-hover:rotate-6 transition-all duration-700 shadow-2xl relative overflow-hidden`}>
                          {/* Inner icon glow cell */}
                          <div className={`absolute inset-0 blur-2xl ${cfg.glow} opacity-40 group-hover:opacity-100 animate-pulse transition-opacity duration-1000`} />
                          <Icon className={`w-10 h-10 ${cfg.text} relative z-10 drop-shadow-2xl`} strokeWidth={0.75} />
                        </div>
                        
                        {cat.active > 0 ? (
                          <div className="flex flex-col items-end gap-2">
                             <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/5 border border-neon-green/30 backdrop-blur-3xl shadow-glow-green-sm">
                              <span className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping absolute" />
                              <span className="w-2.5 h-2.5 rounded-full bg-neon-green" />
                              <span className="text-xs font-black text-neon-green tracking-[0.2em] uppercase font-display">ACTIVE</span>
                            </span>
                          </div>
                        ) : (
                          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-text-muted tracking-[0.25em] uppercase font-display italic">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-10">
                        <h3 className="text-4xl font-black text-text-primary mb-2 font-display group-hover:gradient-text-gold transition-colors tracking-tighter leading-none">
                          {cat.name}
                        </h3>
                        <div className="h-0.5 w-0 group-hover:w-16 bg-gradient-to-r from-gold to-transparent transition-all duration-700 rounded-full" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5 mb-8">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-gold/10 transition-colors">
                          <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mb-1">Stock</p>
                          <p className="text-2xl font-black text-text-primary tabular-nums tracking-tighter font-display">{cat.count}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-gold/20 transition-colors">
                          <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mb-1">Cap.</p>
                          <p className="text-2xl font-black text-gold tabular-nums tracking-tighter font-display shadow-glow-gold-sm">
                            {cat.totalValue > 1000000 ? `${(cat.totalValue / 1000000).toFixed(1)}M` : `${(cat.totalValue / 1000).toFixed(0)}K`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between group-hover:border-gold/40 transition-colors">
                        <span className="text-xs font-black text-text-muted group-hover:text-text-primary transition-all tracking-[0.3em] uppercase font-display">OPEN VAULT</span>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold transition-all duration-700 border border-white/10 group-hover:border-gold group-hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                          <ChevronRight className="w-6 h-6 text-text-muted group-hover:text-bg-deep transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
