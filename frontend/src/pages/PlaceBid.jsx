import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBids } from '../context/BidContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

const PlaceBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createBid } = useBids();
  const { fetchItemById } = useItems();
  const { addToast } = useToast();

  const [item, setItem] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setFetchLoading(true);
      const response = await fetchItemById(id);
      setItem(response.item);
      setAmount((response.item.currentBid + 1).toString());
    } catch (error) {
      setError('Failed to load item details');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createBid({ item: id, amount: parseFloat(amount) });
      
      // Refresh item data to update current bid and leaderboard
      try {
        await fetchItemById(id);
      } catch (refreshErr) {
        console.warn('Could not refresh item data:', refreshErr);
      }
      
      addToast('Bid placed successfully!', 'success');
      // Navigate back to the item page
      navigate(`/items/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
      addToast(err.response?.data?.message || 'Failed to place bid', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            PLACE BID
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] tracking-wide mb-4">Enter Your Offer</h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">Bid on: {item.title}</p>
        </div>

        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
          {/* Item Summary */}
          <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-[#D4AF37]/30"
              />
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-[#F7F7F7] tracking-wide">{item.title}</h3>
                <p className="text-sm text-[#D4AF37] font-bold mb-3 tracking-wider">{item.category.toUpperCase()}</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-[#E5E4E2]/70 tracking-wide">CURRENT BID</p>
                    <p className="text-2xl font-extrabold text-[#D4AF37]">${item.currentBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#E5E4E2]/70 tracking-wide">ENDS ON</p>
                    <p className="text-sm font-bold text-[#F7F7F7]">
                      {new Date(item.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl mb-8 text-center font-medium tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                YOUR BID AMOUNT ($) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={item.currentBid + 0.01}
                step="0.01"
                className="w-full px-6 py-5 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-2xl font-extrabold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder={`Minimum: $${item.currentBid + 1}`}
              />
              <p className="text-sm text-[#E5E4E2]/70 mt-2 font-light tracking-wide">
                Your bid must be greater than the current bid of ${item.currentBid.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-[#D4AF37] text-xl mb-4 tracking-wide">BIDDING RULES</h4>
              <ul className="text-[#E5E4E2] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>Your bid must be higher than the current bid</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>Once placed, bids are binding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>You can update or delete your bid before auction ends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>Auction ends on: {new Date(item.endDate).toLocaleString()}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PLACING BID...' : 'PLACE BID'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/items/${id}`)}
                className="flex-1 min-w-[200px] px-8 py-5 bg-[#1A1A1A] backdrop-blur-xl border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-lg tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
