import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

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
      addToast('Auction item created successfully!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
      addToast(err.response?.data?.message || 'Failed to create item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            CREATE AUCTION
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] tracking-wide mb-4">List Your Exclusive Item</h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">Showcase your valuable item to our community of discerning collectors</p>
        </div>

        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl mb-8 text-center font-medium tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                ITEM TITLE *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder="e.g., 1950s Rolex Submariner"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                DETAILED DESCRIPTION *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder="Provide a comprehensive description of your item, including condition, provenance, and any notable features..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                  STARTING PRICE ($) *
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                  CATEGORY *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Art">Art</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Antiques">Antiques</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                IMAGE URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder="https://example.com/item-image.jpg"
              />
              <p className="text-sm text-[#E5E4E2]/70 mt-2 font-light tracking-wide">
                High-resolution images are recommended for luxury items
              </p>
            </div>

            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                AUCTION END DATE & TIME *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300"
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CREATING ITEM...' : 'CREATE AUCTION ITEM'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 min-w-[200px] px-8 py-5 bg-[#1A1A1A] backdrop-blur-xl border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-lg tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
