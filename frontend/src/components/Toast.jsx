import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, Trophy, Zap } from 'lucide-react';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: { 
    border: 'border-neon-green/40', 
    text: 'text-neon-green', 
    bg: 'bg-gradient-to-br from-neon-green-dim to-transparent',
    glow: 'shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]',
    iconBg: 'bg-neon-green/20',
    accent: 'from-neon-green via-neon-green/50 to-transparent'
  },
  error: { 
    border: 'border-danger/40', 
    text: 'text-danger', 
    bg: 'bg-gradient-to-br from-danger/10 to-transparent',
    glow: 'shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]',
    iconBg: 'bg-danger/20',
    accent: 'from-danger via-danger/50 to-transparent'
  },
  info: { 
    border: 'border-neon-purple/40', 
    text: 'text-neon-purple', 
    bg: 'bg-gradient-to-br from-neon-purple-dim to-transparent',
    glow: 'shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)]',
    iconBg: 'bg-neon-purple/20',
    accent: 'from-neon-purple via-neon-purple/50 to-transparent'
  },
  warning: { 
    border: 'border-gold/40', 
    text: 'text-gold', 
    bg: 'bg-gradient-to-br from-gold-100 to-transparent',
    glow: 'shadow-[0_0_30px_-5px_rgba(250,204,21,0.4)]',
    iconBg: 'bg-gold/20',
    accent: 'from-gold via-gold/50 to-transparent'
  },
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-24 right-6 z-[100] space-y-3 max-w-md pointer-events-none" id="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const type = toast.type || 'info';
          const Icon = iconMap[type] || Info;
          const colors = colorMap[type] || colorMap.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8, rotateY: -15 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                rotateY: 0,
                transition: {
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                  mass: 0.8
                }
              }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                scale: 0.8,
                rotateY: 15,
                transition: { duration: 0.3 }
              }}
              style={{ 
                position: 'relative',
                zIndex: 100 - index
              }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl backdrop-blur-2xl border ${colors.border} ${colors.glow}`}
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 ${colors.bg} opacity-90`} />
              
              {/* Shimmer effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Accent line at top */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.accent}`} />
              
              {/* Content */}
              <div className="relative p-5 flex items-start gap-4">
                {/* Icon with pulse animation */}
                <motion.div 
                  className={`relative flex-shrink-0 w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    damping: 15,
                    stiffness: 400,
                    delay: 0.1
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`absolute inset-0 rounded-xl ${colors.iconBg}`}
                  />
                  <Icon className={`w-5 h-5 ${colors.text} relative z-10`} strokeWidth={2.5} />
                </motion.div>
                
                {/* Message */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <motion.p 
                    className="text-sm font-medium text-text-primary leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {toast.message}
                  </motion.p>
                  
                  {/* Progress bar for auto-dismiss */}
                  <motion.div 
                    className={`mt-3 h-0.5 rounded-full ${colors.iconBg} overflow-hidden`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: 5,
                      ease: 'linear'
                    }}
                  >
                    <div className={`h-full bg-gradient-to-r ${colors.accent}`} />
                  </motion.div>
                </div>
                
                {/* Close button */}
                <motion.button
                  onClick={() => removeToast(toast.id)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex-shrink-0 p-1.5 rounded-lg ${colors.iconBg} ${colors.text} hover:brightness-125 transition-all`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </motion.button>
              </div>
              
              {/* Subtle corner glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial ${colors.text} opacity-10 blur-3xl pointer-events-none`} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
