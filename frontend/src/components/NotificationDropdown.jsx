import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Gavel, TrendingUp, Clock } from 'lucide-react';

const NotificationDropdown = ({ bids = [], items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    ...bids.slice(0, 5).map((bid) => ({
      id: bid._id,
      type: 'bid',
      icon: Gavel,
      title: `New bid: $${bid.amount?.toLocaleString()}`,
      subtitle: bid.item?.title || 'Auction Item',
      time: bid.createdAt,
      color: 'text-neon-green',
    })),
    ...items
      .filter((item) => item.status === 'active' && new Date(item.endDate) > new Date())
      .slice(0, 3)
      .map((item) => ({
        id: item._id,
        type: 'ending',
        icon: Clock,
        title: 'Auction ending soon',
        subtitle: item.title,
        time: item.endDate,
        color: 'text-gold',
      })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8);

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
        id="notification-bell"
      >
        <Bell className="w-5 h-5 text-text-secondary hover:text-gold transition-colors" />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
            <span className="text-[9px] font-bold text-bg-deep">{Math.min(notifications.length, 9)}</span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card overflow-hidden z-50"
          >
            <div className="p-4 border-b border-glass-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                <span className="badge-gold text-[10px]">{notifications.length} new</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto hide-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif, i) => {
                  const IconComp = notif.icon;
                  return (
                    <motion.div
                      key={notif.id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-4 py-3 hover:bg-white/3 transition-colors border-b border-glass-border last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${notif.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{notif.title}</p>
                          <p className="text-xs text-text-muted truncate">{notif.subtitle}</p>
                        </div>
                        <span className="text-[10px] text-text-dim whitespace-nowrap">{formatTime(notif.time)}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
