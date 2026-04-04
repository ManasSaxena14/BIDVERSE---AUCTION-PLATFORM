import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBids } from '../context/BidContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import { 
  HiOutlineBanknotes, 
  HiOutlineClock, 
  HiOutlineShieldCheck, 
  HiOutlineCheckCircle, 
  HiOutlineXMark,
  HiOutlineTag,
  HiOutlineScale,
  HiOutlineArrowLeft
} from 'react-icons/hi2';

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
      setError('Protocol failure: Could not retrieve item parameters.');
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
      try {
        await fetchItemById(id);
      } catch (refreshErr) {
        // Non-critical background sync
      }
      addToast('Acquisition proposal successfully authorized.', 'success');
      navigate(`/items/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Authorization failed: Proposal rejected.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-4">
        <div className="w-10 h-10 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
        <div className="text-[10px] text-[#D4AF37] font-black tracking-[0.5em] uppercase animate-pulse">
          Initializing Acquisition Protocol...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] space-y-8">
        <HiOutlineXMark className="text-6xl text-red-500/20" />
        <div className="text-[10px] text-red-500/60 font-black tracking-[0.3em] uppercase">
          Asset Identification Failed
        </div>
        <button onClick={() => navigate(-1)} className="text-[9px] text-[#D4AF37] font-black tracking-[0.4em] uppercase border-b border-[#D4AF37]/30 pb-1 hover:text-white hover:border-white transition-all">Return to Index</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative border-b border-white/5 py-32 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] font-black tracking-[0.4em] uppercase">
            <HiOutlineScale className="text-xs text-[#D4AF37]" />
            Acquisition Authorization
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
              Lodge <span className="text-[#D4AF37] not-italic">Proposal</span>
            </h1>
            <p className="text-[11px] text-white/20 max-w-xl mx-auto font-black tracking-[0.3em] uppercase leading-relaxed italic">
              Authorization requested for: <span className="text-white">{item.title}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 -mt-16 pb-32 relative z-20">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl space-y-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
          
          <section className="bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-10 items-center transition-all group hover:border-[#D4AF37]/20">
            <div className="relative shrink-0">
               <img
                src={item.image}
                alt={item.title}
                className="w-40 h-40 object-cover rounded-2xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
            </div>
            <div className="flex-1 space-y-8 text-center md:text-left">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight italic">{item.title}</h3>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-white/20 tracking-widest uppercase">Benchmark Valuation</p>
                  <p className="text-3xl font-black text-[#D4AF37] tracking-tighter italic gold-shimmer-text">${item.currentBid.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-white/20 tracking-widest uppercase">Protocol Expiry</p>
                  <p className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase">
                    {new Date(item.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-6 text-red-500 text-[9px] font-black tracking-[0.3em] uppercase transition-all animate-shake">
              <HiOutlineXMark className="text-xl" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-6">
              <label className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic">
                <HiOutlineBanknotes className="text-sm" /> Nominal Proposal Authorization (USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min={item.currentBid + 0.01}
                  step="0.01"
                  className="w-full px-12 py-10 bg-black/40 border border-white/5 rounded-[2rem] text-white text-5xl md:text-6xl font-black tracking-tighter focus:ring-0 focus:border-[#D4AF37]/50 transition-all outline-none text-center shadow-inner italic"
                  placeholder={`Min: ${item.currentBid + 1}`}
                />
              </div>
              <p className="text-[9px] font-black text-white/10 tracking-[0.3em] uppercase text-center">
                Proposed valuation must exceed benchmark threshold: ${item.currentBid.toLocaleString()}
              </p>
            </div>

            <aside className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-10">
              <h4 className="flex items-center gap-3 text-[10px] font-black text-[#D4AF37] tracking-[0.4em] uppercase italic">
                <HiOutlineShieldCheck className="text-xl" /> Settlement Protocols
              </h4>
              <ul className="space-y-6">
                {[
                  'Authorization requires immediate capital verification upon successful settlement.',
                  'Proposals are immutable once acknowledged by the network infrastructure.',
                  `Protocol termination sequence initiated for: ${new Date(item.endDate).toLocaleString()}`
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-6 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 mt-1.5 group-hover:bg-[#D4AF37] transition-colors" />
                    <span className="text-[10px] font-black text-white/20 group-hover:text-white/40 transition-colors tracking-widest uppercase leading-loose">{text}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <footer className="flex flex-col sm:flex-row gap-8 pt-10 border-t border-white/5">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-12 py-7 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 group shadow-[0_0_50px_rgba(212,175,55,0.1)]"
              >
                {loading ? 'Authorizing...' : (
                  <>
                    <HiOutlineCheckCircle className="text-xl group-hover:scale-110 transition-transform" />
                    Authorize Proposal
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-12 py-7 bg-white/5 border border-white/10 text-white/20 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:text-white hover:border-white transition-all flex items-center justify-center gap-3"
              >
                <HiOutlineArrowLeft className="text-sm" /> Retract
              </button>
            </footer>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PlaceBid;


