import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, prefix = '', suffix = '', color = 'gold', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (hasAnimated.current || numValue === 0) {
      setDisplayValue(numValue);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(eased * numValue));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayValue(numValue);
          };
          setTimeout(() => requestAnimationFrame(animate), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  const colorMap = {
    gold: { icon: 'text-gold', glow: 'shadow-glow-gold-sm', bg: 'bg-gold-100', border: 'border-gold/10' },
    green: { icon: 'text-neon-green', glow: 'shadow-glow-green-sm', bg: 'bg-neon-green-dim', border: 'border-neon-green/10' },
    purple: { icon: 'text-neon-purple', glow: 'shadow-glow-purple-sm', bg: 'bg-neon-purple-dim', border: 'border-neon-purple/10' },
    cyan: { icon: 'text-neon-cyan', glow: 'shadow-glow-cyan', bg: 'bg-neon-cyan-dim', border: 'border-neon-cyan/10' },
  };

  const c = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={`glass-card p-6 border ${c.border}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.glow}`}>
          {Icon && <Icon className={`w-6 h-6 ${c.icon}`} />}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="text-2xl font-bold font-display text-text-primary">
          {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}{suffix}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
