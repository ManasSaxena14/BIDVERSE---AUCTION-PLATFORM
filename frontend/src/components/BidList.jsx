import { useAuth } from '../context/AuthContext';

const BidList = ({ bids, onUpdate, onDelete }) => {
  const { user } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8 text-[#E5E4E2]/70">
        <p className="text-lg tracking-wide">No bids placed yet. Be the first to bid!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-[#F7F7F7] mb-6 tracking-wide">ALL BIDS ({bids.length})</h3>
      
      {bids.map((bid, index) => {
        const isOwner = user && bid.user._id === user.id;
        const isSuperAdmin = user && user.role === 'superadmin';
        const canModify = isOwner || isSuperAdmin;

        return (
          <div
            key={bid._id}
            className={`p-6 rounded-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
              index === 0
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] shadow-lg scale-[1.02]'
                : index === 1
                ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
                : index === 2
                ? 'bg-gradient-to-r from-orange-300 to-yellow-600 text-white'
                : 'bg-[#0D0D0D] border border-[#D4AF37]/20'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-extrabold ${
                    index === 0 ? 'text-[#0D0D0D]' :
                    index === 1 ? 'text-gray-900' :
                    index === 2 ? 'text-white' :
                    'text-[#D4AF37]'
                  }`}>
                    {index < 3 ? (
                      index === 0 ? '🥇' : 
                      index === 1 ? '🥈' : 
                      '🥉'
                    ) : `#${index + 1}`}
                  </span>
                  <span className={`text-2xl font-extrabold ${
                    index === 0 ? 'text-[#0D0D0D]' :
                    index === 1 ? 'text-gray-900' :
                    index === 2 ? 'text-white' :
                    'text-[#D4AF37]'
                  }`}>
                    ${bid.amount.toLocaleString()}
                  </span>
                  {index === 0 && (
                    <span className="text-xs bg-[#0D0D0D] text-[#D4AF37] px-3 py-1 rounded-full font-bold tracking-wider">
                      HIGHEST BID
                    </span>
                  )}
                </div>
                <p className="text-sm mt-2 font-medium">
                  by <span className={`font-bold ${
                    index === 0 ? 'text-[#0D0D0D]' :
                    index === 1 ? 'text-gray-900' :
                    index === 2 ? 'text-white' :
                    'text-[#F7F7F7]'
                  }`}>{bid.user.name}</span>
                </p>
                <p className={`text-xs mt-1 ${
                  index === 0 ? 'text-[#0D0D0D]/80' :
                  index === 1 ? 'text-gray-900/80' :
                  index === 2 ? 'text-white/80' :
                  'text-[#E5E4E2]/70'
                }`}>{formatDate(bid.createdAt)}</p>
              </div>

              {canModify && (
                <div className="flex gap-2">
                  {onUpdate && (
                    <button
                      onClick={() => onUpdate(bid)}
                      className={`px-4 py-2 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                        index === 0
                          ? 'bg-[#0D0D0D] text-[#D4AF37] border border-[#0D0D0D] hover:bg-[#D4AF37] hover:text-[#0D0D0D]'
                          : 'bg-[#1A1A1A] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D]'
                      }`}
                    >
                      UPDATE
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(bid._id)}
                      className={`px-4 py-2 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                        index === 0
                          ? 'bg-[#0D0D0D] text-red-500 border border-[#0D0D0D] hover:bg-red-500 hover:text-[#0D0D0D]'
                          : 'bg-[#1A1A1A] border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-[#0D0D0D]'
                      }`}
                    >
                      DELETE
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BidList;