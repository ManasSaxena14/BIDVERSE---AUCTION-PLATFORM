import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlineCheckCircle, 
  HiOutlineXMark,
  HiOutlineIdentification
} from 'react-icons/hi2';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile(formData);
      addToast('Identity parameters synchronized.', 'success');
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to synchronize identity.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <HiOutlineIdentification className="text-sm" />
            Identity Management Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Refine <span className="text-[#D4AF37]">Identity</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/40 text-xs font-black tracking-widest uppercase leading-loose">
            Maintain accurate credentials for secure portfolio interactions.
          </p>
        </header>

        <section className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
          
          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-[10px] font-black tracking-widest uppercase text-center">
              <HiOutlineXMark className="text-lg" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineUser /> Full Nomenclature
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                placeholder="Enter registered name"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                <HiOutlineEnvelope /> Secure Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all outline-none"
                placeholder="Enter verified email"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-10 py-5 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <HiOutlineCheckCircle className="text-lg" />
                    Synchronize Profile
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all flex items-center justify-center"
              >
                Cancel Protocol
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};


export default EditProfile;