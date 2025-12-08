import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: '💻',
      description: 'Latest gadgets, smartphones, laptops, and tech accessories',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      name: 'Art',
      icon: '🎨',
      description: 'Original paintings, sculptures, and fine art pieces',
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Collectibles',
      icon: '🏆',
      description: 'Rare coins, stamps, memorabilia, and vintage items',
      gradient: 'from-orange-600 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      name: 'Jewelry',
      icon: '💎',
      description: 'Fine jewelry, luxury watches, and precious gemstones',
      gradient: 'from-emerald-600 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      name: 'Antiques',
      icon: '🏺',
      description: 'Vintage furniture, historical artifacts, and curios',
      gradient: 'from-amber-600 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50'
    },
    {
      name: 'Fashion',
      icon: '👗',
      description: 'Designer clothing, luxury bags, and fashion accessories',
      gradient: 'from-rose-600 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50'
    },
    {
      name: 'Automotive',
      icon: '🚗',
      description: 'Luxury cars, classic vehicles, and premium automotive collectibles',
      gradient: 'from-gray-600 to-blue-600',
      bgGradient: 'from-gray-50 to-blue-50'
    },
    {
      name: 'Real Estate',
      icon: '🏠',
      description: 'Premium properties, luxury estates, and exclusive real estate opportunities',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            EXPLORE COLLECTIONS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#F7F7F7] mb-6 tracking-wide">
            BROWSE BY CATEGORY
          </h1>
          <p className="text-xl md:text-2xl text-[#E5E4E2]/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
            Discover curated collections of premium items across all categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name}`}
              className="group relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 overflow-hidden hover:-translate-y-2 border border-[#D4AF37]/20"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] opacity-100 group-hover:opacity-70 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative p-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <span className="text-5xl text-[#0D0D0D]">{category.icon}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-[#F7F7F7] mb-3 group-hover:text-[#D4AF37] transition-colors tracking-wide">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-[#E5E4E2]/70 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center justify-end">
                  <svg className="w-6 h-6 text-[#D4AF37] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black py-20 border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">PLATFORM STATISTICS</h2>
            <p className="text-xl text-[#E5E4E2]/70 tracking-wide">Trusted by collectors worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-[#D4AF37] mb-2">12K+</div>
              <div className="text-[#E5E4E2]/60 tracking-wider uppercase">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-[#D4AF37] mb-2">50K+</div>
              <div className="text-[#E5E4E2]/60 tracking-wider uppercase">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-[#D4AF37] mb-2">$50M+</div>
              <div className="text-[#E5E4E2]/60 tracking-wider uppercase">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-[#D4AF37] mb-2">4.9/5</div>
              <div className="text-[#E5E4E2]/60 tracking-wider uppercase">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-[#1A1A1A] to-black border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-6 tracking-wide">
            READY TO START BIDDING?
          </h2>
          <p className="text-xl text-[#E5E4E2]/70 mb-10 leading-relaxed tracking-wide">
            Join BidVerse today and discover extraordinary items in your favorite categories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-10 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#E5E4E2] transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.4)] tracking-wide">
              CREATE FREE ACCOUNT
            </Link>
            <Link to="/" className="px-10 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-lg hover:bg-[#D4AF37] hover:text-[#0D0D0D] transform hover:scale-105 transition-all duration-300 tracking-wide">
              BROWSE ALL AUCTIONS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;