import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useBids } from '../context/BidContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchItemById } = useItems(); // Changed from fetchItems to fetchItemById
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
      const timer = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [item]);

  const loadAuctionDetails = async () => {
    try {
      setLoading(true);
      // Fetch the specific item by ID instead of all items
      const itemResponse = await fetchItemById(id);
      await fetchBids();
      
      setItem(itemResponse.item);
      // Set itemBids from the response
      setItemBids(itemResponse.bids.sort((a, b) => b.amount - a.amount));
    } catch (error) {
      console.error('Failed to load auction details:', error);
    } finally {
      setLoading(false);
      // Load reviews after item details are loaded
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
    
    const now = new Date().getTime();
    const end = new Date(item.endDate).getTime();
    const distance = end - now;

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
      loadAuctionDetails(); // Reload to show new bid
    } catch (error) {
      setBidError(error.response?.data?.message || 'Failed to place bid');
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Auction Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-semibold">{item.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-9xl">🖼️</span>
              </div>
              <div className="p-4 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all">
                    <span className="text-2xl">🖼️</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{item.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  item.status === 'active' ? 'bg-green-100 text-green-700' :
                  item.status === 'closed' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-semibold">{item.createdBy?.name}</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.category}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting Price</div>
                  <div className="font-bold text-gray-900 dark:text-white">${item.startingPrice.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Bid</div>
                  <div className="font-bold text-gray-900 dark:text-white">${item.currentBid.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</div>
                  <div className="font-bold text-gray-900 dark:text-white">{new Date(item.endDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Seller</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {item.createdBy?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{item.createdBy?.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">⭐ 4.9 Rating • 100+ Sales</div>
                  </div>
                </div>
              </div>
            </div>

            {item.status === 'closed' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews</h2>
                {reviewsLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-600 mb-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review.reviewerId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                  {review.reviewerId?.name}
                                </div>
                                <div className="text-yellow-500">{renderStars(review.rating)}</div>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                    No reviews yet for this auction.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Bid</div>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  ${item.currentBid.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {itemBids.length} bid{itemBids.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ⏰ Auction Ends In
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {timeLeft || 'Calculating...'}
                  </div>
                </div>
              </div>

              {user && item.status === 'active' && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border-2 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder={`Min: ${item.currentBid + 1}`}
                        min={item.currentBid + 1}
                      />
                    </div>
                    {bidError && <p className="text-red-600 text-sm mt-2">{bidError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Place Bid
                  </button>
                </form>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg text-center hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Login to Bid
                </Link>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                🏆 Top Bidders
              </h3>
              <div className="space-y-3">
                {itemBids.slice(0, 5).map((bid, index) => (
                  <div
                    key={bid._id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                      index === 2 ? 'bg-gradient-to-r from-orange-300 to-yellow-600 text-white' :
                      'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="w-8 text-center font-bold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold ${index < 3 ? '' : 'text-gray-900 dark:text-white'}`}>
                        {bid.user?.name || 'Anonymous'}
                      </div>
                      <div className={`text-sm ${index < 3 ? 'opacity-90' : 'text-gray-600 dark:text-gray-400'}`}>
                        ${bid.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                Trusted by Premium Brands
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Rolex', logo: '⌚' },
                  { name: 'Christie\'s', logo: '🎨' },
                  { name: 'Sotheby\'s', logo: '🖼️' },
                  { name: 'Cartier', logo: '💎' },
                  { name: 'Ferrari', logo: '🏎️' },
                  { name: 'Hermès', logo: '👜' }
                ].map((brand, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-all">
                    <div className="text-3xl mb-1">{brand.logo}</div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{brand.name}</div>
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