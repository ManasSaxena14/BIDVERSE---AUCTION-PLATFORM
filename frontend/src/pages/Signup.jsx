import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineXMark
} from 'react-icons/hi2';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'bidder'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Identity registration protocol failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <HiOutlineIdentification className="text-sm" />
            Identity Registration
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">
            Join the <span className="text-[#D4AF37]">Elite</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black tracking-widest uppercase leading-loose">
            Establish your credentials to engage with the master portfolio.
          </p>
        </header>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[9px] font-black tracking-widest uppercase text-center">
              <HiOutlineXMark className="text-lg" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineUser /> Full Identity
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineEnvelope /> Primary Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                placeholder="verified_user@domain.com"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineLockClosed /> Secure Credentials
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineBriefcase /> Engagement Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none appearance-none"
              >
                <option value="bidder" className="bg-[#0D0D0D]">Asset Acquisition (Bidder)</option>
                <option value="auctioneer" className="bg-[#0D0D0D]">Asset Allocation (Auctioneer)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-10 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl disabled:opacity-50 mt-4"
            >
              {loading ? 'Initializing...' : 'Register Identity'}
            </button>
          </form>

          <footer className="mt-12 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">
              Authorized already?{' '}
              <Link to="/login" className="text-[#D4AF37] hover:text-white transition-colors ml-1">
                Establish Access
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
};


export default Signup;

