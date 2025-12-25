import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-4"></div>
          <p className="text-xl text-[#E5E4E2]">Loading access permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-12 max-w-md">
          <div className="text-6xl mb-6 text-red-500">🔒</div>
          <h1 className="text-3xl font-bold text-[#F7F7F7] mb-4 tracking-wide">ACCESS DENIED</h1>
          <p className="text-[#E5E4E2] mb-2">You don't have permission to access this page.</p>
          <p className="text-sm text-[#E5E4E2]/70 mt-6">
            Required role: <span className="font-bold text-[#D4AF37]">{roles.join(', ')}</span>
          </p>
          <div className="mt-8">
            <a 
              href="/" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
            >
              RETURN TO HOME
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;