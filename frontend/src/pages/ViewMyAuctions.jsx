import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuctionTimer from '../components/AuctionTimer';
import {
  Package, Edit, Trash2, Eye, PlusCircle, Loader2, Tag, DollarSign
} from 'lucide-react';

const ViewMyAuctions = () => {
  const { items, fetchItems, deleteItem, loading } = useItems();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchItems({ createdBy: user?.id, limit: 100 })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this auction and all its bids?')) return;
    try {
      await deleteItem(id);
      addToast('Auction deleted', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const myItems = (items || []).filter(i => (i.createdBy?._id || i.createdBy) === user?.id);

  return (
    <div className="page-container" id="my-auctions-page">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Auctions</h1>
            <p className="text-text-secondary text-sm mt-1">{myItems.length} items listed</p>
          </div>
          <Link to="/create-item" className="btn-gold">
            <PlusCircle className="w-4 h-4" /> New Auction
          </Link>
        </div>

        {pageLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Auctions Yet</h3>
            <p className="text-sm text-text-muted mb-6">Create your first auction listing</p>
            <Link to="/create-item" className="btn-gold inline-flex">
              <PlusCircle className="w-4 h-4" /> Create Auction
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item, i) => {
              const isActive = item.status === 'active' && new Date(item.endDate) > new Date();
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative h-40">
                    <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent" />
                    <div className="absolute top-3 left-3">
                      {isActive ? <span className="badge-green"><span className="w-1.5 h-1.5 rounded-full bg-neon-green" /> LIVE</span> : <span className="badge-danger">ENDED</span>}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-base font-semibold text-text-primary truncate">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="badge-gold py-0.5"><Tag className="w-3 h-3" /> {item.category}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase">Current Bid</p>
                        <p className="text-lg font-bold gradient-text-gold font-display">${(item.currentBid || item.startingPrice)?.toLocaleString()}</p>
                      </div>
                      {isActive && <AuctionTimer endDate={item.endDate} size="sm" />}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-glass-border">
                      <Link to={`/auction/${item._id}`} className="flex-1 btn-ghost text-xs py-2 border border-glass-border rounded-lg justify-center">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      <Link to={`/update-item/${item._id}`} className="flex-1 btn-ghost text-xs py-2 border border-glass-border rounded-lg justify-center">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <button onClick={() => handleDelete(item._id)} className="btn-ghost text-xs py-2 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 px-3">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyAuctions;
