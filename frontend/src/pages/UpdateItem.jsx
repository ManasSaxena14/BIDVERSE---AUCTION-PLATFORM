import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import { 
  HiOutlinePencilSquare, 
  HiOutlineCube, 
  HiOutlineCurrencyDollar, 
  HiOutlineTag, 
  HiOutlinePhoto, 
  HiOutlineCalendarDays, 
  HiOutlineCheckCircle, 
  HiOutlineXMark,
  HiOutlineArrowPath
} from 'react-icons/hi2';

const UpdateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchItemById, updateItem } = useItems();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    category: '',
    image: '',
    endDate: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setFetchLoading(true);
      const response = await fetchItemById(id);
      const item = response.item;
      
      setFormData({
        title: item.title,
        description: item.description,
        startingPrice: item.startingPrice,
        category: item.category,
        image: item.image,
        endDate: new Date(item.endDate).toISOString().slice(0, 16),
        status: item.status
      });
    } catch (error) {
      setError('Failed to retrieve asset nomenclature.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateItem(id, formData);
      addToast('Asset parameters updated successfully.', 'success');
      navigate(`/items/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to re-initialize asset parameters.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Horology', 'Fine Art', 'Real Estate', 'Blue Chip Collectibles', 
    'Jewelry & Gems', 'Antiques', 'Couture', 'Automotive'
  ];

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.5em] uppercase animate-pulse">
          Retrieving Asset Parameters...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <HiOutlineArrowPath className="text-sm" />
            Parameter Modification Protocol
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Refine <span className="text-[#D4AF37]">Selection</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/40 text-xs font-black tracking-widest uppercase leading-loose">
            Optimization of existing holdings ensure maximum acquisition potential.
          </p>
        </header>

        <section className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
          
          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-[10px] font-black tracking-widest uppercase text-center">
              <HiOutlineXMark className="text-lg" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlinePencilSquare /> Asset Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlineTag /> Classification
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#0D0D0D]">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineCube /> Asset Intelligence
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest leading-loose uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlineCurrencyDollar /> Reserve Price (USD)
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlineCalendarDays /> Auction Termination
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlinePhoto /> Asset Visualization URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                  <HiOutlineArrowPath /> Listing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                >
                  <option value="active" className="bg-[#0D0D0D]">Active</option>
                  <option value="closed" className="bg-[#0D0D0D]">Terminated</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-10 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <HiOutlineCheckCircle className="text-lg" />
                    Synchronize Modification
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all flex items-center justify-center"
              >
                Revert Protocol
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};


export default UpdateItem;

