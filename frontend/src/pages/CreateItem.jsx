import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import {
  PlusCircle, Image, Tag, DollarSign, Calendar, FileText,
  Loader2, ArrowLeft, Sparkles
} from 'lucide-react';

const CATEGORIES = ['Electronics', 'Art', 'Jewelry', 'Vehicles', 'Fashion', 'Collectibles', 'Sports', 'Books', 'Music', 'Home', 'Other'];

const CreateItem = () => {
  const { createItem, loading } = useItems();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', startingPrice: '', category: '', image: '', endDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem({
        ...formData,
        startingPrice: parseFloat(formData.startingPrice),
      });
      addToast('Auction created successfully!', 'success');
      navigate('/my-auctions');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create auction', 'error');
    }
  };

  return (
    <div className="page-container" id="create-item-page">
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
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Create Auction</h1>
              <p className="text-sm text-text-muted">List a new item for bidding</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="item-title">
                <FileText className="w-3.5 h-3.5 inline mr-1" /> Title
              </label>
              <input
                type="text"
                id="item-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Premium Vintage Watch"
                required
                className="glass-input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="item-desc">Description</label>
              <textarea
                id="item-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item in detail..."
                required
                rows={4}
                className="glass-input resize-none"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="item-price">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" /> Starting Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                  <input
                    type="number"
                    id="item-price"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    placeholder="100"
                    required
                    min="0"
                    step="0.01"
                    className="glass-input pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="item-category">
                  <Tag className="w-3.5 h-3.5 inline mr-1" /> Category
                </label>
                <select
                  id="item-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="glass-input"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="item-image">
                <Image className="w-3.5 h-3.5 inline mr-1" /> Image URL
              </label>
              <input
                type="url"
                id="item-image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="glass-input"
              />
              {formData.image && (
                <div className="mt-3 glass-card overflow-hidden">
                  <img src={formData.image} alt="Preview" className="w-full h-40 object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="item-enddate">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> End Date
              </label>
              <input
                type="datetime-local"
                id="item-enddate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-base"
              id="create-item-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Auction
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateItem;
