import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

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
      addToast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            EDIT PROFILE
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] tracking-wide mb-4">Update Your Information</h1>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light">Modify your personal details below</p>
        </div>

        <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl mb-8 text-center font-medium tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                FULL NAME *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 placeholder-[#E5E4E2]/50"
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] px-8 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'UPDATING PROFILE...' : 'UPDATE PROFILE'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
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

export default EditProfile;