import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useReviews } from '../context/ReviewContext';
import BidList from '../components/BidList';
import ReviewForm from '../components/ReviewForm';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchItemById, deleteItem } = useItems();
  const { deleteBid } = useBids();
  const { addToast } = useToast();
  const { createReview, getReviewsByAuction } = useReviews();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  
  useEffect(() => {
    const handleFocus = () => {
      loadItemDetails();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchItemById(id);
      setItem(response.item);
      setBids(response.bids);
    } catch (error) {
      console.error('Failed to fetch item:', error);
      addToast('Failed to load item details', 'error');
    } finally {
      setLoading(false);
      
      loadReviews();
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsResponse = await getReviewsByAuction(id);
      setReviews(reviewsResponse.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this auction item?')) {
      try {
        await deleteItem(id);
        addToast('Item deleted successfully!', 'success');
        navigate('/');
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to delete item', 'error');
      }
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (window.confirm('Are you sure you want to delete this bid?')) {
      try {
        await deleteBid(bidId);
        addToast('Bid deleted successfully!', 'success');
        loadItemDetails();
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to delete bid', 'error');
      }
    }
  };

  const handleUpdateBid = (bid) => {
    navigate(`/update-bid/${bid._id}`, { state: { bid, item } });
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const canReview = () => {
    if (!user || !item) return false;
    
    
    const isAuctionClosed = item.status === 'closed' || new Date(item.endDate) < new Date();
    if (!isAuctionClosed) return false;
    

    if (user.role !== 'bidder' && user.role !== 'superadmin') return false;
    

    if (item.createdBy && user.id && item.createdBy._id.toString() === user.id.toString()) return false;
    

    const userHasBid = bids.some(bid => bid.user && user.id && bid.user._id.toString() === user.id.toString());
    if (!userHasBid) return false;
    
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-2xl text-[#F7F7F7] font-bold tracking-wider">LOADING ITEM DETAILS...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-2xl text-red-500 font-bold tracking-wider">ITEM NOT FOUND</div>
      </div>
    );
  }

  const isOwner = user && item.createdBy && item.createdBy._id === user.id;
  const isSuperAdmin = user && user.role === 'superadmin';
  const canEdit = isOwner || isSuperAdmin;
  const canBid = user && (user.role === 'bidder' || user.role === 'superadmin');
  const isExpired = new Date(item.endDate) < new Date();
  const isActive = item.status === 'active' && !isExpired;

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-block mb-8 px-6 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300">
          ← BACK TO HOME
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8 group">
              <img
                src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={item.title || 'Auction Item'}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
              <h1 className="text-4xl font-bold text-[#F7F7F7] mb-6 tracking-wide">{item.title || 'Untitled Auction'}</h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-full text-sm font-bold tracking-wider">
                  {(item.category || 'Uncategorized').toUpperCase()}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-red-600 to-rose-500 text-white'
                  }`}
                >
                  {isActive ? 'ACTIVE' : 'CLOSED'}
                </span>
              </div>

              <p className="text-[#E5E4E2] text-lg mb-8 leading-relaxed">{item.description || 'No description available'}</p>

              <div className="border-t border-[#D4AF37]/20 py-6 mb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">STARTING PRICE:</span>
                  <span className="text-2xl font-bold text-[#F7F7F7]">${(item.startingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">CURRENT BID:</span>
                  <span className="text-3xl font-extrabold text-[#D4AF37]">
                    ${(item.currentBid || item.startingPrice || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">END DATE:</span>
                  <span className="text-lg font-medium text-[#F7F7F7]">
                    {item.endDate ? new Date(item.endDate).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">CREATED BY:</span>
                  <span className="text-lg font-medium text-[#F7F7F7]">{item.createdBy?.name || 'Unknown User'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {canBid && isActive && (
                  <Link 
                    to={`/place-bid/${item._id}`} 
                    className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] text-center"
                  >
                    PLACE BID
                  </Link>
                )}
                {canEdit && (
                  <>
                    <Link 
                      to={`/update-item/${item._id}`} 
                      className="px-8 py-4 bg-[#1A1A1A] backdrop-blur-xl border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-lg tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
                    >
                      EDIT ITEM
                    </Link>
                    <button 
                      onClick={handleDelete} 
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold text-lg tracking-wider hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                      DELETE ITEM
                    </button>
                  </>
                )}
                {canReview() && (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg tracking-wider hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(129,140,248,0.4)]"
                  >
                    {showReviewForm ? 'CANCEL REVIEW' : 'LEAVE REVIEW'}
                  </button>
                )}
              </div>
              
              {showReviewForm && (
                <div className="mt-8">
                  <ReviewForm 
                    auctionId={item._id} 
                    onSubmit={() => {
                      setShowReviewForm(false);
                      
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {bids && bids.length > 0 && (
              <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">🏆</span>
                  <h3 className="text-3xl font-bold text-[#F7F7F7] tracking-wide">LEADERBOARD</h3>
                </div>
                
                <div className="space-y-4">
                  {bids.slice(0, 5).map((bid, index) => {
                    const isOwner = user && bid.user && user.id && bid.user._id === user.id;
                    
                    return (
                      <div
                        key={bid._id}
                        className={`flex items-center gap-4 p-5 rounded-xl transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg scale-[1.02]'
                            : index === 1
                            ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
                            : index === 2
                            ? 'bg-gradient-to-r from-orange-300 to-yellow-600 text-white'
                            : 'bg-[#0D0D0D] border border-[#D4AF37]/20'
                        }`}
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {index === 0 && <span className="text-3xl">🥇</span>}
                          {index === 1 && <span className="text-3xl">🥈</span>}
                          {index === 2 && <span className="text-3xl">🥉</span>}
                          {index > 2 && (
                            <span className={`text-xl font-bold ${
                              index === 0 ? 'text-[#0D0D0D]' : 'text-[#D4AF37]'
                            }`}>
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-bold truncate text-lg ${
                              index === 0 ? 'text-[#0D0D0D]' : 
                              index === 1 ? 'text-gray-900' :
                              index === 2 ? 'text-white' :
                              'text-[#F7F7F7]'
                            }`}>
                              {bid.user?.name || 'Anonymous User'}
                              {isOwner && <span className="ml-2 px-2 py-1 bg-black/20 rounded-full text-xs font-bold">YOU</span>}
                            </p>
                            {index === 0 && (
                              <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-bold tracking-wider">
                                LEADING
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            index === 0 ? 'text-black/70' :
                            index === 1 ? 'text-gray-700' :
                            index === 2 ? 'text-orange-100' :
                            'text-[#E5E4E2]'
                          }`}>
                            {bid.createdAt ? formatDate(bid.createdAt) : 'N/A'}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className={`text-2xl font-extrabold ${
                            index === 0 ? 'text-[#0D0D0D]' :
                            index === 1 ? 'text-gray-900' :
                            index === 2 ? 'text-white' :
                            'text-[#D4AF37]'
                          }`}>
                            ${(bid.amount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {bids.length > 5 && (
                  <div className="mt-6 text-center text-[#E5E4E2] font-medium tracking-wide">
                    +{bids.length - 5} MORE BIDDERS
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
              <BidList bids={bids} onUpdate={handleUpdateBid} onDelete={handleDeleteBid} />
            </div>
          </div>
        </div>

        {item.status === 'closed' && (
          <div className="mt-12 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
            <h3 className="text-3xl font-bold text-[#F7F7F7] mb-8 tracking-wide flex items-center gap-3">
              <span>⭐</span>
              REVIEWS
            </h3>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
                <p className="text-xl text-[#E5E4E2]">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-[#D4AF37]/20 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-lg">
                        {review.reviewerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-bold text-xl text-[#F7F7F7]">
                              {review.reviewerId?.name}
                            </div>
                            <div className="text-2xl text-[#D4AF37]">{renderStars(review.rating)}</div>
                          </div>
                          <div className="text-sm text-[#E5E4E2]/70">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-[#E5E4E2] text-lg">{review.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#E5E4E2]/70">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-xl">No reviews yet for this auction.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;