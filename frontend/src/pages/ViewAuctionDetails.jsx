import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuctionTimer from '../components/AuctionTimer';
import BidList from '../components/BidList';
import ReviewForm from '../components/ReviewForm';
import {
  ArrowLeft, DollarSign, Users, TrendingUp, Tag, Calendar,
  Star, MessageSquare, Loader2, Edit, Clock
} from 'lucide-react';
import { format } from 'date-fns';

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchItemById } = useItems();
  const { fetchBids, bids } = useBids();
  const { createReview, getReviewsByAuction } = useReviews();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [item, setItem] = useState(null);
  const [itemBids, setItemBids] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchItemById(id);
      setItem(response.item);
      setItemBids(response.bids || []);
      try {
        const reviewRes = await getReviewsByAuction(id);
        setReviews(reviewRes.reviews || []);
      } catch {}
    } catch {
      addToast('Failed to load auction', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reviewData) => {
    setReviewLoading(true);
    try {
      await createReview({
        ...reviewData,
        auctionId: id,
        auctioneerId: item?.createdBy?._id
      });
      addToast('Review submitted!', 'success');
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const isActive = item?.status === 'active' && new Date(item?.endDate) > new Date();
  const isOwner = user && (item?.createdBy?._id === user.id);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) {
    return <div className="page-container flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  if (!item) {
    return <div className="page-container flex items-center justify-center"><p className="text-text-muted">Auction not found</p></div>;
  }

  return (
    <div className="page-container" id="view-auction-page">
      <div className="section-container">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>

        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isActive ? <span className="badge-green"><span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> LIVE</span> : <span className="badge-danger">ENDED</span>}
                  <span className="badge-gold"><Tag className="w-3 h-3" /> {item.category}</span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary">{item.title}</h1>
                <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
            {isOwner && (
              <Link to={`/update-item/${item._id}`} className="btn-gold-outline shrink-0">
                <Edit className="w-4 h-4" /> Edit Auction
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Bid</p>
                <p className="text-3xl font-bold gradient-text-gold font-display">${(item.currentBid || item.startingPrice)?.toLocaleString()}</p>
              </div>
              <div className="divider-glow" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-text-muted">Starting</p>
                  <p className="text-sm font-semibold text-text-primary">${item.startingPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Total Bids</p>
                  <p className="text-sm font-semibold text-text-primary">{itemBids.length}</p>
                </div>
              </div>
              {isActive && (
                <div className="text-center pt-2">
                  <p className="text-xs text-text-muted mb-2">Time Remaining</p>
                  <AuctionTimer endDate={item.endDate} size="md" />
                </div>
              )}
            </div>

            {avgRating && (
              <div className="glass-card p-6 text-center">
                <Star className="w-8 h-8 text-gold mx-auto mb-2 fill-gold" />
                <p className="text-2xl font-bold text-gold font-display">{avgRating}</p>
                <p className="text-xs text-text-muted">{reviews.length} reviews</p>
              </div>
            )}
          </div>

          {/* Bids & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-green" /> Bid History
              </h3>
              <BidList bids={itemBids} />
            </div>

            {/* Reviews */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gold" /> Reviews
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-gold text-gold' : 'text-text-muted'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-text-muted">{review.reviewerId?.name || 'User'}</span>
                      </div>
                      <p className="text-sm text-text-secondary">{review.feedback}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted mb-4">No reviews yet</p>
              )}

              {user && !isOwner && (
                <ReviewForm onSubmit={handleReview} loading={reviewLoading} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionDetails;