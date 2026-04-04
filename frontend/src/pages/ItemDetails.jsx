import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  HiOutlineStar, 
  HiStar, 
  HiOutlineTrophy, 
  HiOutlinePencilSquare, 
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineArrowTrendingUp,
  HiOutlineScale,
  HiOutlineIdentification,
  HiOutlineArrowRight
} from 'react-icons/hi2';
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
  const { getReviewsByAuction } = useReviews();
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
    const handleFocus = () => loadItemDetails();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [id]);

  const renderStars = (rating) => {
    return (
      <div className="flex text-[#D4AF37] text-[10px]">
        {[...Array(5)].map((_, i) => (
          i < rating ? <HiStar key={i} /> : <HiOutlineStar key={i} />
        ))}
      </div>
    );
  };

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchItemById(id);
      setItem(response.item);
      setBids(response.bids);
    } catch (error) {
      addToast('Synchronization of asset intelligence failed.', 'error');
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
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Confirm permanent asset decommissioning?')) {
      try {
        await deleteItem(id);
        addToast('Asset decommissioned successfully.', 'success');
        navigate('/');
      } catch (error) {
        addToast(error.response?.data?.message || 'Decommissioning failure.', 'error');
      }
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (window.confirm('Retract this acquisition proposal?')) {
      try {
        await deleteBid(bidId);
        addToast('Proposal retracted.', 'success');
        loadItemDetails();
      } catch (error) {
        addToast(error.response?.data?.message || 'Retraction failure.', 'error');
      }
    }
  };

  const handleUpdateBid = (bid) => {
    navigate(`/update-bid/${bid._id}`, { state: { bid, item } });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).toUpperCase();
  };

  const canReview = () => {
    if (!user || !item) return false;
    const isAuctionClosed = item.status === 'closed' || new Date(item.endDate) < new Date();
    if (!isAuctionClosed) return false;
    if (user.role !== 'bidder' && user.role !== 'superadmin') return false;
    if (item.createdBy && user.id && item.createdBy._id.toString() === user.id.toString()) return false;
    return bids.some(bid => bid.user && user.id && bid.user._id.toString() === user.id.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-10">
        <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin shadow-[0_0_30px_rgba(212,175,55,0.2)]"></div>
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.6em] uppercase animate-pulse italic">Synchronizing...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-[10px] text-red-500 font-black tracking-[0.5em] uppercase italic">Asset Not Identified</div>
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
    <div className="min-h-screen bg-[#0D0D0D] py-32 sm:py-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-4 mb-20 px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[10px] font-black tracking-[0.4em] uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all shadow-2xl leading-none italic">
          <HiOutlineArrowLeft /> Master Portfolio Index
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <section className="lg:col-span-7 space-y-20 animate-fadeInUp">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[3.5rem] bg-black border border-white/5 group shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <img
                src={item.image || 'https://via.placeholder.com/800x600?text=No+Asset+Image'}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Identified'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80"></div>
              <div className="absolute top-10 right-10">
                <span className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.4em] uppercase border backdrop-blur-2xl italic leading-none ${isActive 
                  ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse' 
                  : 'bg-black/60 text-white/40 border-white/10'}`}>
                  {isActive ? 'Protocol Active' : 'Protocol Finalized'}
                </span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 md:p-20 shadow-2xl space-y-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none" />
               
               <header className="space-y-6">
                  <div className="flex items-center gap-4 text-[#D4AF37]">
                    <HiOutlineScale className="text-xl" />
                    <p className="text-[11px] font-black tracking-[0.5em] uppercase italic leading-none">{item.category || 'General Index Classification'}</p>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight italic">
                    {item.title}
                  </h1>
               </header>

               <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-white/20 tracking-[0.4em] uppercase flex items-center gap-3 italic">
                    <HiOutlineDocumentText className="text-sm text-[#D4AF37]" /> Asset Intelligence Registry
                  </h3>
                  <p className="text-white/40 text-[13px] font-black tracking-[0.2em] uppercase leading-relaxed italic">{item.description}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-white/5">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">Reserve Valuation</span>
                  <p className="text-3xl font-black text-white tracking-tighter italic">${(item.startingPrice || 0).toLocaleString()}</p>
                </div>
                <div className="space-y-2 md:text-right">
                  <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase">Market Position</span>
                  <p className="text-5xl font-black text-white tracking-tighter gold-shimmer-text italic">${(item.currentBid || item.startingPrice || 0).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">Acquisition Deadline</span>
                  <p className="text-[12px] font-black text-white/60 tracking-[0.2em] uppercase italic">{item.endDate ? formatDate(item.endDate) : 'UNSPECIFIED'}</p>
                </div>
                <div className="space-y-2 md:text-right">
                  <span className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">Lead Agent</span>
                  <p className="text-[12px] font-black text-white/60 tracking-[0.2em] uppercase italic underline underline-offset-4 decoration-[#D4AF37]/30">{item.createdBy?.name || 'ANONYMOUS ENTITY'}</p>
                </div>
               </div>

               <footer className="flex flex-wrap gap-8 pt-6">
                  {canBid && isActive && (
                    <Link to={`/place-bid/${item._id}`} className="flex-1 min-w-[240px] px-16 py-7 bg-[#D4AF37] text-[#0D0D0D] rounded-3xl font-black text-[11px] tracking-[0.5em] uppercase hover:bg-white transition-all shadow-[0_20px_60px_rgba(212,175,55,0.2)] text-center italic flex items-center justify-center gap-4 group">
                      Initiate Acquisition <HiOutlineArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
                    </Link>
                  )}
                  {canEdit && (
                    <div className="flex gap-6 w-full sm:w-auto">
                      <Link to={`/update-item/${item._id}`} className="flex-1 sm:flex-none px-12 py-7 bg-white/5 border border-white/10 text-white/40 rounded-3xl font-black text-[11px] tracking-[0.4em] uppercase hover:text-white hover:border-[#D4AF37]/50 transition-all text-center italic leading-none">
                        Refine
                      </Link>
                      <button onClick={handleDelete} className="p-7 bg-red-500/5 text-red-500 border border-red-500/20 rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-xl">
                        <HiOutlineTrash className="text-2xl" />
                      </button>
                    </div>
                  )}
               </footer>
               
               {canReview() && (
                  <div className="pt-16 border-t border-white/5">
                    <button onClick={() => setShowReviewForm(!showReviewForm)} className="w-full px-12 py-6 bg-white/5 border border-white/10 text-white/20 rounded-3xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all italic leading-none flex items-center justify-center gap-4">
                      {showReviewForm ? 'Abort Submission' : 'Initialize Certification Protocol'}
                    </button>
                    {showReviewForm && (
                      <div className="mt-16 animate-fadeInUp">
                        <ReviewForm auctionId={item._id} onSubmit={() => setShowReviewForm(false)} />
                      </div>
                    )}
                  </div>
               )}
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-20 animate-fadeInUp delay-300">
            {bids && bids.length > 0 && (
              <section className="bg-black border border-white/5 rounded-[4rem] p-12 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.5)] space-y-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[80px] pointer-events-none" />
                <header className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center rounded-2xl border border-[#D4AF37]/30">
                    <HiOutlineTrophy className="text-xl text-[#D4AF37]" />
                  </div>
                  <h3 className="text-[11px] font-black text-white tracking-[0.5em] uppercase italic">Lead Engagement Flux</h3>
                </header>
                
                <div className="space-y-8">
                  {bids.slice(0, 5).map((bid, index) => {
                    const isUserBid = user && bid.user && user.id && bid.user._id === user.id;
                    return (
                      <div
                        key={bid._id}
                        className={`group flex items-center gap-8 p-10 rounded-[3rem] transition-all duration-700 border ${
                          index === 0 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_20px_50px_rgba(212,175,55,0.3)] scale-[1.05] relative z-10' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-[#D4AF37]/30'
                        }`}
                      >
                        <div className="flex-shrink-0 w-12 text-center font-black">
                          {index < 3 ? <HiStar className={`mx-auto text-2xl ${index === 0 ? 'text-[#0D0D0D]' : 'text-[#D4AF37]'}`} /> : <span className="text-[11px] font-black tracking-widest italic">P{index + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] truncate italic">{bid.user?.name || 'ANONYMOUS ENTITY'}</p>
                            {isUserBid && <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black tracking-[0.4em] uppercase leading-none italic ${index === 0 ? 'bg-black/10 text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>IDENTITY</span>}
                          </div>
                          <p className={`text-[9px] font-black tracking-[0.3em] uppercase italic ${index === 0 ? 'text-black/40' : 'text-white/10'}`}>
                            {formatDate(bid.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black tracking-tighter italic ${index === 0 ? 'gold-shimmer-text brightness-150' : 'text-white'}`}>${(bid.amount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
              <header className="flex items-center gap-5 mb-12">
                <HiOutlineShieldCheck className="text-2xl text-[#D4AF37]" />
                <h3 className="text-[11px] font-black text-white/20 tracking-[0.5em] uppercase italic leading-none">Authentication Flux</h3>
              </header>
              <BidList bids={bids} onUpdate={handleUpdateBid} onDelete={handleDeleteBid} />
            </section>
          </aside>
        </div>

        {item.status === 'closed' && (
          <section className="mt-40 space-y-24 animate-fadeInUp">
            <header className="flex flex-col items-center space-y-6">
              <div className="w-16 h-px bg-[#D4AF37]/50 shadow-[0_0_20px_rgb(212,175,55)]" />
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none text-center">
                Review & <span className="gold-shimmer-text not-italic">Certification</span>
              </h3>
              <p className="text-white/20 text-[11px] font-black tracking-[0.5em] uppercase italic text-center">Protocol Integrity Feedback Registry</p>
            </header>

            {reviewsLoading ? (
              <div className="flex justify-center py-32">
                <div className="w-10 h-10 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] space-y-10 hover:border-[#D4AF37]/30 transition-all duration-700 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-[#D4AF37] font-black text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-700 italic gold-shimmer-text">
                        {review.reviewerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-black text-white tracking-[0.2em] uppercase italic leading-none">{review.reviewerId?.name}</p>
                          <p className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase italic leading-none">{new Date(review.createdAt).toLocaleDateString().toUpperCase()}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-white/40 text-[12px] font-black tracking-[0.2em] uppercase leading-relaxed italic border-t border-white/5 pt-10">{review.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-48 bg-white/5 border border-dashed border-white/10 rounded-[4rem] space-y-8 backdrop-blur-3xl animate-pulse">
                <HiOutlineDocumentText className="mx-auto text-7xl text-white/5" />
                <p className="text-[11px] text-white/10 font-black tracking-[0.5em] uppercase italic">Certification Record Empty.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;