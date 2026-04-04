import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/ItemCard';
import { 
  HiOutlineArrowLeft, 
  HiOutlineRectangleGroup,
  HiOutlineInboxStack,
  HiOutlineAdjustmentsHorizontal
} from 'react-icons/hi2';

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
      // Analysis for category load failure protocol
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-4">
        <div className="w-10 h-10 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.5em] uppercase animate-pulse">
          Retrieving {formatCategoryName(categoryName)} Collection...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative border-b border-white/5 py-40 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center space-y-10 z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] font-black tracking-[0.4em] uppercase">
            <HiOutlineRectangleGroup className="text-xs text-[#D4AF37]" />
            Curated Classification
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none italic">
              {formatCategoryName(categoryName)}
            </h1>
            <p className="text-[11px] text-white/20 max-w-xl mx-auto font-black tracking-[0.3em] uppercase leading-relaxed">
              Explore classified assets within the {formatCategoryName(categoryName)} collective portfolio.
            </p>
          </div>
          <div className="pt-8">
            <button 
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all shadow-2xl"
            >
              <HiOutlineArrowLeft className="text-sm" /> Portfolio Index
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-32">
        {categoryItems.length > 0 ? (
          <div className="space-y-20">
            <header className="flex justify-between items-end border-b border-white/5 pb-10">
              <div className="space-y-2">
                <h2 className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">
                  Verified Holdings
                </h2>
                <div className="text-3xl font-black text-white tracking-tighter italic italic uppercase">
                  {categoryItems.length} Registered Asset{categoryItems.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <HiOutlineAdjustmentsHorizontal className="text-white/20 text-xl" />
              </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {categoryItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-48 bg-white/5 border border-dashed border-white/10 rounded-[4rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl space-y-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
            <HiOutlineInboxStack className="text-8xl text-white/5 mx-auto" />
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">No Assets Identified</h3>
              <p className="max-w-md mx-auto text-[11px] font-black text-white/20 tracking-[0.3em] uppercase leading-relaxed">
                The {formatCategoryName(categoryName)} collection is currently fully allocated. System synchronization will update upon availability.
              </p>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => navigate('/')}
                className="px-12 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.15)] leading-none"
              >
                Master Portfolio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryItems;