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
  const { createReview } = useReviews();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  // Refresh data when component comes back into focus (e.g., after updating a bid)
  useEffect(() => {
    const handleFocus = () => {
      loadItemDetails();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

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

  // Check if user can review this auction
  const canReview = () => {
    if (!user || !item) return false;
    
    // Auction must be closed (either status is 'closed' or endDate has passed)
    const isAuctionClosed = item.status === 'closed' || new Date(item.endDate) < new Date();
    if (!isAuctionClosed) return false;
    
    // User must be a bidder
    if (user.role !== 'bidder' && user.role !== 'superadmin') return false;
    
    // User cannot review their own auction (using toString() for consistent comparison)
    if (item.createdBy._id.toString() === user.id.toString()) return false;
    
    // User must have placed a bid on this auction
    const userHasBid = bids.some(bid => bid.user._id.toString() === user.id.toString());
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

  const isOwner = user && item.createdBy._id === user.id;
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
          {/* Left: Image and Details */}
          <div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8 group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
              <h1 className="text-4xl font-bold text-[#F7F7F7] mb-6 tracking-wide">{item.title}</h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-full text-sm font-bold tracking-wider">
                  {item.category.toUpperCase()}
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

              <p className="text-[#E5E4E2] text-lg mb-8 leading-relaxed">{item.description}</p>

              <div className="border-t border-[#D4AF37]/20 py-6 mb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">STARTING PRICE:</span>
                  <span className="text-2xl font-bold text-[#F7F7F7]">${item.startingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">CURRENT BID:</span>
                  <span className="text-3xl font-extrabold text-[#D4AF37]">
                    ${item.currentBid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">END DATE:</span>
                  <span className="text-lg font-medium text-[#F7F7F7]">
                    {new Date(item.endDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#E5E4E2] font-medium tracking-wide">CREATED BY:</span>
                  <span className="text-lg font-medium text-[#F7F7F7]">{item.createdBy.name}</span>
                </div>
              </div>

              {/* Action Buttons */}
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
              
              {/* Review Form */}
              {showReviewForm && (
                <div className="mt-8">
                  <ReviewForm 
                    auctionId={item._id} 
                    onSubmit={() => {
                      setShowReviewForm(false);
                      loadItemDetails(); // Refresh to hide the form after submission
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Bids and Leaderboard */}
          <div className="space-y-8">
            {/* Leaderboard */}
            {bids && bids.length > 0 && (
              <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">🏆</span>
                  <h3 className="text-3xl font-bold text-[#F7F7F7] tracking-wide">LEADERBOARD</h3>
                </div>
                
                <div className="space-y-4">
                  {bids.slice(0, 5).map((bid, index) => {
                    const isOwner = user && bid.user._id === user.id;
                    
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
                        {/* Rank */}
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

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-bold truncate text-lg ${
                              index === 0 ? 'text-[#0D0D0D]' : 
                              index === 1 ? 'text-gray-900' :
                              index === 2 ? 'text-white' :
                              'text-[#F7F7F7]'
                            }`}>
                              {bid.user.name}
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
                            {formatDate(bid.createdAt)}
                          </p>
                        </div>

                        {/* Bid Amount */}
                        <div className="text-right">
                          <p className={`text-2xl font-extrabold ${
                            index === 0 ? 'text-[#0D0D0D]' :
                            index === 1 ? 'text-gray-900' :
                            index === 2 ? 'text-white' :
                            'text-[#D4AF37]'
                          }`}>
                            ${bid.amount.toLocaleString()}
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

            {/* All Bids */}
            <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
              <BidList bids={bids} onUpdate={handleUpdateBid} onDelete={handleDeleteBid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;