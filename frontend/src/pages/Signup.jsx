import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ParticleBackground from '../components/ParticleBackground';
import { Mail, Lock, User, Gavel, UserPlus, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'bidder' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      addToast('Welcome to BidVerse!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Medium', color: 'bg-gold' };
    return { level: score, label: 'Strong', color: 'bg-neon-green' };
  };

  const passwordStrength = getPasswordStrength();

  const roles = [
    { value: 'bidder', label: 'Bidder', desc: 'Bid on items', icon: Gavel },
    { value: 'auctioneer', label: 'Auctioneer', desc: 'Sell items', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-24" id="signup-page">
      <ParticleBackground particleCount={30} />
      <div className="absolute inset-0 bg-gradient-hero" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', damping: 25 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-glow-gold-sm">
              <UserPlus className="w-7 h-7 text-bg-deep" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
            <p className="text-sm text-text-secondary mt-1">Join the BidVerse community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="signup-name">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="glass-input pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="signup-email">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="glass-input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="signup-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="signup-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="glass-input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? passwordStrength.color : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength.color === 'bg-neon-green' ? 'text-neon-green' : passwordStrength.color === 'bg-gold' ? 'text-gold' : 'text-red-400'}`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm text-text-secondary mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.value })}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-gold/40 bg-gold-50 shadow-glow-gold-sm'
                          : 'border-glass-border bg-white/3 hover:border-glass-border-light'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-gold' : 'text-text-muted'}`} />
                      <p className={`text-sm font-medium ${isSelected ? 'text-gold' : 'text-text-primary'}`}>{r.label}</p>
                      <p className="text-xs text-text-muted">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 text-base"
              id="signup-submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 divider-glow" />
            <span className="text-xs text-text-muted">OR</span>
            <div className="flex-1 divider-glow" />
          </div>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-gold font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
