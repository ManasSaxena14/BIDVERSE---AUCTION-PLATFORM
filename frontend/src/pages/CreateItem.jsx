import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HiOutlinePlusCircle,
  HiOutlineArrowLeft
} from 'react-icons/hi2';

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    category: '',
    image: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createItem } = useItems();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createItem(formData);
      addToast('Asset listing protocol initialized.', 'success');
      navigate('/my-auctions');
    } catch (err) {
      const msg = err.response?.data?.message || 'Protocol initialization failure.';
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-24 text-center space-y-8 animate-fadeInUp">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.4em] uppercase leading-none">
            <HiOutlinePlusCircle className="text-sm text-[#D4AF37]" />
            Asset Allocation Terminal
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            Protocol <span className="gold-shimmer-text not-italic">Initialization</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/20 text-[11px] font-black tracking-[0.3em] uppercase leading-relaxed italic">
            Authorize the entry of high-valuation holdings into the global archival network.
          </p>
        </header>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fadeInUp delay-200">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none" />
          
          {error && (
            <div className="mb-12 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-center gap-5 text-red-500 text-[10px] font-black tracking-[0.4em] uppercase shadow-inner">
              <HiOutlineXMark className="text-xl" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-16">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                  <HiOutlinePencilSquare className="text-sm" /> Asset Identity
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Official asset nomenclature..."
                  className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-2xl text-white text-[11px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none italic placeholder:text-white/5 shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                  <HiOutlineTag className="text-sm" /> Classification
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-2xl text-white text-[11px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none appearance-none cursor-pointer italic"
                  >
                    <option value="" className="bg-[#0D0D0D]">Index Class</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0D0D0D]">{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <HiOutlineCube className="text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                <HiOutlineCube className="text-sm" /> Asset Intelligence
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Comprehensive technical specifications, provenance data, and physical state report..."
                className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-3xl text-white text-[11px] font-black tracking-[0.2em] leading-loose uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none italic placeholder:text-white/5 shadow-inner resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                  <HiOutlineCurrencyDollar className="text-sm" /> Reserve Valuation (USD)
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-2xl text-white text-[11px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none italic placeholder:text-white/5 shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                  <HiOutlineCalendarDays className="text-sm" /> Protocol Termination
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-2xl text-white text-[11px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none italic invert opacity-40 hover:opacity-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic leading-none">
                <HiOutlinePhoto className="text-sm" /> Visual Architecture URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://prestige-vault.io/asset-preview.jpg"
                className="w-full px-8 py-6 bg-black/40 border border-white/5 rounded-2xl text-white text-[11px] font-black tracking-[0.2em] uppercase focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all outline-none italic placeholder:text-white/5 shadow-inner"
              />
              <div className="flex items-center gap-3 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <p className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase italic">
                  High-fidelity visual references significantly optimize engagement metrics.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-10">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-14 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-3xl font-black text-[11px] tracking-[0.5em] uppercase hover:bg-white transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(212,175,55,0.2)] disabled:opacity-50 italic group"
              >
                {loading ? 'Processing Protocol...' : (
                  <>
                    <HiOutlineCheckCircle className="text-lg group-hover:scale-110 transition-transform" />
                    Commit Allocation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-14 py-6 bg-white/5 border border-white/10 text-white/40 rounded-3xl font-black text-[11px] tracking-[0.5em] uppercase hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-4 italic"
              >
                <HiOutlineArrowLeft className="text-sm" />
                Abort
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CreateItem;


