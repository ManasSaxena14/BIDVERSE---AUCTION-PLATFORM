import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

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
      setError('Failed to load item details');
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
      addToast('Auction item updated successfully!', 'success');
      navigate(`/items/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      addToast(err.response?.data?.message || 'Failed to update item', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-2xl text-[#F7F7F7] font-bold tracking-wider">LOADING ITEM DETAILS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            UPDATE AUCTION
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] tracking-wide mb-4">Refine Your Listing</h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">Enhance your item's presentation to attract more bidders</p>
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
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                  CATEGORY *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                />
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                  STATUS
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'UPDATING ITEM...' : 'UPDATE ITEM'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/items/${id}`)}
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

export default UpdateItem;
