import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F7F7F7] tracking-wide">WELCOME BACK</h1>
          <p className="text-[#E5E4E2]/70 mt-2 tracking-wide">Login to your auction account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-8 border border-[#D4AF37]/20">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#D4AF37] mb-2 tracking-wider uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] placeholder-[#E5E4E2]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#D4AF37] mb-2 tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-[#D4AF37]/30 text-[#F7F7F7] placeholder-[#E5E4E2]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white/10 transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold tracking-wide hover:bg-[#E5E4E2] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#E5E4E2]/70 tracking-wide">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#D4AF37] font-bold hover:underline tracking-wide">
                SIGN UP HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
