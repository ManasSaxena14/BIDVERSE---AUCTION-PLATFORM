import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, User, Mail, Save, Loader2 } from 'lucide-react';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      addToast('Profile updated!', 'success');
      navigate('/profile');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" id="edit-profile-page">
      <div className="section-container max-w-lg">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-glow-gold-sm">
              <span className="text-2xl font-bold text-bg-deep font-display">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-name">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" id="edit-name" name="name" value={formData.name} onChange={handleChange} required className="glass-input pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2" htmlFor="edit-email">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" id="edit-email" name="email" value={formData.email} onChange={handleChange} required className="glass-input pl-11" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 text-base" id="save-profile-btn">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
