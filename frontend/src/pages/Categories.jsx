import { Link } from 'react-router-dom';
import { 
  HiOutlineCpuChip, 
  HiOutlinePaintBrush, 
  HiOutlineTrophy, 
  HiOutlineSparkles, 
  HiOutlineLibrary, 
  HiOutlineShoppingBag, 
  HiOutlineTruck, 
  HiOutlineHome,
  HiOutlineArrowRight
} from 'react-icons/hi2';

const Categories = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: HiOutlineCpuChip,
      description: 'High-performance computing, advanced mobile architecture, and professional hardware.',
      theme: 'text-blue-400'
    },
    {
      name: 'Art',
      icon: HiOutlinePaintBrush,
      description: 'Masterwork canvases, structural sculptures, and significant fine art acquisitions.',
      theme: 'text-purple-400'
    },
    {
      name: 'Collectibles',
      icon: HiOutlineTrophy,
      description: 'Numismatic rarities, historical philately, and high-value cultural artifacts.',
      theme: 'text-orange-400'
    },
    {
      name: 'Jewelry',
      icon: HiOutlineSparkles,
      description: 'Investment-grade gemstones, haute horlogerie, and precious metal compositions.',
      theme: 'text-emerald-400'
    },
    {
      name: 'Antiques',
      icon: HiOutlineLibrary,
      description: 'Period-accurate furnishings, significant historical curiosities, and rare archives.',
      theme: 'text-amber-400'
    },
    {
      name: 'Fashion',
      icon: HiOutlineShoppingBag,
      description: 'Couture textiles, bespoke leather assets, and exclusive designer inventory.',
      theme: 'text-rose-400'
    },
    {
      name: 'Automotive',
      icon: HiOutlineTruck,
      description: 'Precision-engineered vehicles, classic marques, and premium mobility assets.',
      theme: 'text-gray-400'
    },
    {
      name: 'Real Estate',
      icon: HiOutlineHome,
      description: 'High-density commercial assets, luxury residential estates, and strategic land holdings.',
      theme: 'text-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative border-b border-white/5 py-40 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] font-black tracking-[0.4em] uppercase">
            Asset Exploration Protocol
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
              Asset <span className="text-[#D4AF37] not-italic">Classification</span>
            </h1>
            <p className="text-[11px] text-white/20 max-w-xl mx-auto font-black tracking-[0.3em] uppercase leading-relaxed">
              Systematic categorization of high-valuation inventory across the global trade network.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                to={`/category/${category.name}`}
                className="group relative bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-700 overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
                <div className="relative p-12 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
                       <Icon className={`text-4xl ${category.theme} relative z-10`} />
                    </div>
                    <HiOutlineArrowRight className="text-white/10 text-xl group-hover:text-[#D4AF37] group-hover:translate-x-2 transition-all duration-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter group-hover:text-[#D4AF37] transition-colors italic leading-none">
                      {category.name}
                    </h3>
                    <p className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <section className="bg-white/5 border-y border-white/5 py-32 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Network Intelligence Metrics</h2>
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto opacity-40 shadow-[0_0_10px_#D4AF37]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: '12K+', label: 'Global Inventory' },
              { val: '50K+', label: 'Verified Entities' },
              { val: '$50M+', label: 'Settlement Volume' },
              { val: '4.9/5', label: 'Consensus Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="text-5xl font-black text-[#D4AF37] tracking-tighter italic gold-shimmer-text">{stat.val}</div>
                <div className="text-[9px] text-white/20 tracking-[0.4em] uppercase font-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 bg-black border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
              Initialize <span className="text-[#D4AF37] not-italic">Acquisition</span> Protocol
            </h2>
            <p className="text-[11px] text-white/40 font-black tracking-[0.3em] uppercase leading-relaxed max-w-2xl mx-auto">
              Join the institutional network today and authorize secondary market access across all classified asset pools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
            <Link to="/signup" className="px-12 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl leading-none">
              Initialize Identity
            </Link>
            <Link to="/" className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-all leading-none">
              Explore Active Pools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;