import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBids } from '../context/BidContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';

const UpdateBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateBid } = useBids();
  const { fetchItems } = useItems();
  const { addToast } = useToast();

  const bid = location.state?.bid;
  const item = location.state?.item;

  const [amount, setAmount] = useState(bid?.amount || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bid || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <p className="text-2xl text-red-500 font-bold mb-6 tracking-wider">BID INFORMATION NOT FOUND</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
          >
            GO TO HOME
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateBid(id, { amount: parseFloat(amount) });
      
      // Refresh item data to update current bid and leaderboard
      try {
        await fetchItems();
      } catch (refreshErr) {
        console.warn('Could not refresh item data:', refreshErr);
      }
      
      addToast('Bid updated successfully!', 'success');
      navigate(`/items/${item._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bid');
      addToast(err.response?.data?.message || 'Failed to update bid', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            UPDATE BID
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] tracking-wide mb-4">Refine Your Offer</h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">Update bid for: {item.title}</p>
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
                    <p className="text-xs text-[#E5E4E2]/70 tracking-wide">YOUR PREVIOUS BID</p>
                    <p className="text-2xl font-extrabold text-[#D4AF37]">${bid.amount.toLocaleString()}</p>
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
                NEW BID AMOUNT ($) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={item.currentBid === bid.amount ? item.currentBid + 0.01 : bid.amount}
                step="0.01"
                className="w-full px-6 py-5 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-2xl font-extrabold focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
              />
              <p className="text-sm text-[#E5E4E2]/70 mt-2 font-light tracking-wide">
                Must be greater than current bid of ${item.currentBid.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-[#D4AF37] text-xl mb-4 tracking-wide">IMPORTANT NOTE</h4>
              <p className="text-[#E5E4E2]">
                Updating your bid will change your bid amount. Make sure you enter the correct amount.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'UPDATING BID...' : 'UPDATE BID'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/items/${item._id}`)}
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

export default UpdateBid;
