import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineStar, 
  HiStar, 
  HiOutlineTrophy, 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlinePhoto, 
  HiOutlineMagnifyingGlass,
  HiOutlineTag,
  HiOutlineCheckBadge
} from 'react-icons/hi2';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchItemById } = useItems();
  const { fetchBids, createBid } = useBids();
  const { getReviewsByAuction } = useReviews();

  const [item, setItem] = useState(null);
  const [itemBids, setItemBids] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    loadAuctionDetails();
  }, [id]);

  useEffect(() => {
    if (item?.endDate) {
      const timer = setInterval(() => calculateTimeLeft(), 1000);
      return () => clearInterval(timer);
    }
  }, [item]);

  const loadAuctionDetails = async () => {
    try {
      setLoading(true);
      const itemResponse = await fetchItemById(id);
      await fetchBids();
      setItem(itemResponse.item);
      setItemBids(itemResponse.bids.sort((a, b) => b.amount - a.amount));
    } catch (error) {
      console.error('Failed to load auction details:', error);
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

  const calculateTimeLeft = () => {
    if (!item?.endDate) return;
    const distance = new Date(item.endDate).getTime() - new Date().getTime();
    if (distance < 0) {
      setTimeLeft('Auction Ended');
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError('');
    if (!user) {
      setBidError('Please login to place a bid');
      return;
    }
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= item.currentBid) {
      setBidError(`Bid must be higher than current bid of $${item.currentBid}`);
      return;
    }
    try {
      await createBid({ item: item._id, amount });
      setBidAmount('');
      loadAuctionDetails();
    } catch (error) {
      setBidError(error.response?.data?.message || 'Failed to place bid');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          i < rating ? <HiStar key={i} /> : <HiOutlineStar key={i} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="animate-pulse text-[#D4AF37] font-bold tracking-widest text-xl uppercase">Loading Auction...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <HiOutlineMagnifyingGlass className="text-6xl mx-auto text-[#D4AF37]/20 mb-4" />
          <h2 className="text-2xl font-bold text-[#F7F7F7] mb-2 uppercase tracking-wide">Auction Not Found</h2>
          <Link to="/" className="text-[#D4AF37] hover:underline font-bold tracking-tight">BACK TO HOME</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="bg-[#1A1A1A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5E4E2]/40 font-bold">
            <Link to="/" className="hover:text-[#D4AF37]">Home</Link>
            <span className="opacity-20">/</span>
            <span className="text-[#D4AF37]">{item.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden border border-white/5">
              <div className="h-96 bg-[#0D0D0D] flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                ) : (
                  <HiOutlinePhoto className="text-9xl text-[#D4AF37]/10" />
                )}
              </div>
              <div className="p-4 grid grid-cols-4 gap-2 border-t border-white/5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-[#0D0D0D] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#D4AF37] border border-transparent transition-all">
                    <HiOutlinePhoto className="text-2xl text-[#D4AF37]/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-8 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-[#F7F7F7] tracking-tight">{item.title}</h1>
                <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${
                  item.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <HiOutlineUser className="text-[#D4AF37]" />
                  <span className="text-sm font-bold text-[#F7F7F7]">{item.createdBy?.name}</span>
                  <HiOutlineCheckBadge className="text-green-500 text-xs" />
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">Description</h2>
                <p className="text-[#E5E4E2]/70 leading-relaxed font-light">{item.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Category', value: item.category },
                  { label: 'Starting Price', value: `$${item.startingPrice.toLocaleString()}` },
                  { label: 'Current Bid', value: `$${item.currentBid.toLocaleString()}` },
                  { label: 'End Date', value: new Date(item.endDate).toLocaleDateString() }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0D0D0D] p-5 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-[#E5E4E2]/30 mb-1 font-bold">{stat.label}</div>
                    <div className="text-lg font-bold text-[#F7F7F7]">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Auctioneer Information</h3>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl flex items-center justify-center text-[#0D0D0D] text-2xl font-black">
                    {item.createdBy?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-[#F7F7F7] text-lg">{item.createdBy?.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <HiStar className="text-yellow-500 text-xs" />
                      <span className="text-xs font-bold text-[#E5E4E2]/40 tracking-wider">4.9 Rating • Tier 1 Seller</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {item.status === 'closed' && (
              <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-8 border border-white/5">
                <h2 className="text-xl font-extrabold text-[#F7F7F7] mb-8 uppercase tracking-tight">Public Reviews</h2>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#D4AF37] font-black uppercase">
                            {review.reviewerId?.name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-bold text-[#F7F7F7]">{review.reviewerId?.name}</div>
                                {renderStars(review.rating)}
                              </div>
                              <div className="text-[10px] uppercase font-bold text-[#E5E4E2]/20">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-[#E5E4E2]/60 font-light leading-relaxed">{review.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#E5E4E2]/20 font-bold uppercase tracking-widest">No reviews yet</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl p-8 border border-white/5 sticky top-4">
              <div className="text-center mb-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Live Valuation</div>
                <div className="text-5xl font-black text-[#F7F7F7] mb-2 tracking-tighter">
                  ${item.currentBid.toLocaleString()}
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full inline-block text-[10px] font-bold tracking-widest text-[#E5E4E2]/40 uppercase">
                  {itemBids.length} Active Bids
                </div>
              </div>

              <div className="bg-[#0D0D0D] rounded-2xl p-6 mb-8 border border-white/5 shadow-inner">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#E5E4E2]/30 mb-3 uppercase tracking-widest">
                    <HiOutlineClock className="text-[#D4AF37]" /> Remaining Time
                  </div>
                  <div className="text-2xl font-black text-[#D4AF37] tracking-tight">
                    {timeLeft || 'Calculating...'}
                  </div>
                </div>
              </div>

              {user && item.status === 'active' && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-bold">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-[#0D0D0D] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[#F7F7F7] placeholder-[#E5E4E2]/20 font-bold"
                      placeholder={`Min: ${(item.currentBid + 1).toLocaleString()}`}
                      min={item.currentBid + 1}
                    />
                  </div>
                  {bidError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">{bidError}</p>}
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-black text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all uppercase tracking-widest">
                    Place Official Bid
                  </button>
                </form>
              )}

              {!user && (
                <Link to="/login" className="block w-full py-4 bg-white/5 border border-white/10 text-[#F7F7F7] rounded-xl font-black text-lg text-center hover:bg-white/10 transition-all uppercase tracking-widest">
                  Authenticate to Bid
                </Link>
              )}
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl p-8 border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6 flex items-center gap-2">
                <HiOutlineTrophy /> Leading Bidders
              </h3>
              <div className="space-y-4">
                {itemBids.slice(0, 5).map((bid, index) => (
                  <div key={bid._id} className={`flex items-center gap-3 p-4 rounded-xl border border-white/5 ${index === 0 ? 'bg-white/5' : 'bg-[#0D0D0D]'}`}>
                    <div className={`w-8 text-center font-black text-lg ${index === 0 ? 'text-[#D4AF37]' : 'text-[#E5E4E2]/10'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#F7F7F7] truncate text-sm">{bid.user?.name || 'Anonymous'}</div>
                      <div className="text-[10px] font-bold text-[#E5E4E2]/20 uppercase tracking-widest mt-0.5">
                        ${bid.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl p-8 border border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E5E4E2]/20 mb-6 text-center">Verified Industry Standards</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Rolex', icon: HiOutlineTag },
                  { name: 'Authentic', icon: HiOutlineCheckBadge },
                  { name: 'Secure', icon: HiOutlineTag },
                  { name: 'Global', icon: HiOutlineTag },
                  { name: 'Elite', icon: HiOutlineTrophy },
                  { name: 'Premium', icon: HiStar }
                ].map((brand, i) => (
                  <div key={i} className="text-center p-3 bg-[#0D0D0D] rounded-xl border border-white/5">
                    <brand.icon className="mx-auto text-xl text-[#D4AF37]/20 mb-2" />
                    <div className="text-[8px] font-black text-[#E5E4E2]/20 uppercase tracking-tighter">{brand.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionDetails;