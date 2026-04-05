import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import { Edit, Image, Tag, DollarSign, Calendar, FileText, Loader2, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Art', 'Jewelry', 'Vehicles', 'Fashion', 'Collectibles', 'Sports', 'Books', 'Music', 'Home', 'Other'];

const UpdateItem = () => {
  const { id } = useParams();
  const { fetchItemById, updateItem, loading } = useItems();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', startingPrice: '', category: '', image: '', endDate: '', status: 'active'
  });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchItemById(id);
        const item = response.item;
        setFormData({
          title: item.title || '',
          description: item.description || '',
          startingPrice: item.startingPrice || '',
          category: item.category || '',
          image: item.image || '',
          endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
          status: item.status || 'active',
        });
      } catch (err) {
        addToast('Failed to load item', 'error');
        navigate(-1);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem(id, {
        ...formData,
        startingPrice: parseFloat(formData.startingPrice),
      });
      addToast('Auction updated successfully!', 'success');
      navigate(`/items/${id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update', 'error');
    }
  };

  if (pageLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container" id="update-item-page">
      <div className="section-container max-w-2xl">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-neon-purple-dim flex items-center justify-center">
              <Edit className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Update Auction</h1>
              <p className="text-sm text-text-muted">Modify your listing details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-title">Title</label>
              <input type="text" id="edit-title" name="title" value={formData.title} onChange={handleChange} required className="glass-input" />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-desc">Description</label>
              <textarea id="edit-desc" name="description" value={formData.description} onChange={handleChange} required rows={4} className="glass-input resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-price">Starting Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                  <input type="number" id="edit-price" name="startingPrice" value={formData.startingPrice} onChange={handleChange} required min="0" step="0.01" className="glass-input pl-8" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-category">Category</label>
                <select id="edit-category" name="category" value={formData.category} onChange={handleChange} required className="glass-input">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-image">Image URL</label>
              <input type="url" id="edit-image" name="image" value={formData.image} onChange={handleChange} className="glass-input" />
              {formData.image && (
                <div className="mt-3 glass-card overflow-hidden">
                  <img src={formData.image} alt="Preview" className="w-full h-40 object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-enddate">End Date</label>
                <input type="datetime-local" id="edit-enddate" name="endDate" value={formData.endDate} onChange={handleChange} required className="glass-input" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-status">Status</label>
                <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className="glass-input">
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-gold py-4 text-base" id="update-item-btn">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Edit className="w-5 h-5" /> Update Auction</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateItem;
