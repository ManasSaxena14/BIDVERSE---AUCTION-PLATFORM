import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import ItemCard from '../components/ItemCard';
import { ArrowLeft, SlidersHorizontal, Package } from 'lucide-react';

const CategoryItems = () => {
  const { categoryName } = useParams();
  const { items, fetchItems, loading } = useItems();
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchItems({ category: categoryName, limit: 100 }).catch(() => {});
  }, [categoryName]);

  const sortedItems = [...(items || [])].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.currentBid || 0) - (b.currentBid || 0);
    if (sortBy === 'price_desc') return (b.currentBid || 0) - (a.currentBid || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="page-container" id="category-items-page">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/categories" className="btn-ghost text-sm mb-3 inline-flex">
              <ArrowLeft className="w-4 h-4" /> Categories
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">
              {decodeURIComponent(categoryName)}
            </h1>
            <p className="text-text-secondary text-sm mt-1">{sortedItems.length} items found</p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input py-2 px-3 text-sm w-44"
              id="sort-select"
            >
              <option value="latest">Latest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-48 shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 shimmer rounded" />
                  <div className="h-6 w-1/2 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Items Found</h3>
            <p className="text-sm text-text-muted mb-4">No items in this category yet</p>
            <Link to="/categories" className="btn-gold-outline inline-flex">
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item, i) => (
              <ItemCard key={item._id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItems;
