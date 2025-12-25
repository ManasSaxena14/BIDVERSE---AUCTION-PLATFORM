import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/ItemCard';

const CategoryItems = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { items, fetchItems, loading } = useItems();
  const [categoryItems, setCategoryItems] = useState([]);

  useEffect(() => {
    loadCategoryItems();
  }, [categoryName]);

  const loadCategoryItems = async () => {
    try {
      await fetchItems({ category: categoryName, limit: 100 });
    } catch (error) {
      console.error('Failed to load category items:', error);
    }
  };

  useEffect(() => {
    
    setCategoryItems(items);
  }, [items]);

  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
          <p className="text-2xl text-[#E5E4E2] font-bold tracking-wider">LOADING {formatCategoryName(categoryName)} ITEMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black text-[#F7F7F7] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            CATEGORY
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-wide">
            {formatCategoryName(categoryName)}
          </h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">
            Explore exclusive items in the {formatCategoryName(categoryName)} category
          </p>
          <button 
            onClick={() => navigate('/categories')}
            className="mt-8 px-6 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
          >
            ← BACK TO ALL CATEGORIES
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categoryItems.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-[#F7F7F7] tracking-wide">
                {categoryItems.length} ITEM{categoryItems.length !== 1 ? 'S' : ''}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 text-[#D4AF37]">📭</div>
            <h3 className="text-3xl font-bold text-[#F7F7F7] mb-4 tracking-wide">NO ITEMS FOUND</h3>
            <p className="text-xl text-[#E5E4E2]/70 mb-8 max-w-2xl mx-auto">
              There are currently no items in the {formatCategoryName(categoryName)} category. Check back later for new listings.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              BROWSE ALL AUCTIONS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItems;