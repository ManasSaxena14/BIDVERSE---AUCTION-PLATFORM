import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ItemCard = ({ item, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user && item.createdBy._id === user.id;
  const isSuperAdmin = user && user.role === 'superadmin';
  const canEdit = isOwner || isSuperAdmin;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = new Date(item.endDate) < new Date();

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#D4AF37]/20 rounded-2xl shadow-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 group transform hover:-translate-y-2 hover:scale-[1.02]">
      <Link to={`/items/${item._id}`} className="block relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider backdrop-blur-md ${
            item.status === 'active' && !isExpired
              ? 'bg-[#D4AF37] text-[#0D0D0D] shadow-lg'
              : 'bg-black/60 text-[#E5E4E2] border border-[#E5E4E2]/30'
          }`}>
            {item.status === 'active' && !isExpired ? 'LIVE' : 'ENDED'}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl text-xs font-bold text-[#D4AF37] tracking-wider">
            {item.category.toUpperCase()}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/items/${item._id}`}>
          <h3 className="text-xl font-bold text-[#F7F7F7] mb-2 hover:text-[#D4AF37] transition-colors line-clamp-1 tracking-wide">
            {item.title}
          </h3>
        </Link>
        <p className="text-[#E5E4E2]/70 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D4AF37]/20">
          <div>
            <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Current Bid</p>
            <p className="text-2xl font-bold text-[#D4AF37]">${item.currentBid}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#D4AF37]/80 mb-1 tracking-wider uppercase">Ends</p>
            <p className="text-sm font-semibold text-[#E5E4E2]">{formatDate(item.endDate)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/items/${item._id}`} 
            className="flex-1 text-center px-6 py-3 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold tracking-wide hover:bg-[#E5E4E2] transition-all duration-300 shadow-lg hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
          >
            VIEW DETAILS
          </Link>
          {canEdit && (
            <div className="flex gap-2">
              <Link 
                to={`/update-item/${item._id}`} 
                className="px-4 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all duration-300"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              {onDelete && (
                <button 
                  onClick={() => onDelete(item._id)} 
                  className="px-4 py-3 bg-[#1A1A1A] backdrop-blur-xl border border-red-500/30 text-red-500 rounded-xl font-bold tracking-wider hover:bg-red-500 hover:text-[#0D0D0D] transition-all duration-300"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;