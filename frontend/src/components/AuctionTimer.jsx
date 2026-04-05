import { useState, useEffect, useRef } from 'react';

const AuctionTimer = ({ endDate, size = 'md', onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) onExpire();
        return;
      }

      setIsUrgent(diff < 3600000); // Less than 1 hour

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    intervalRef.current = setInterval(calculateTime, 1000);
    return () => clearInterval(intervalRef.current);
  }, [endDate, onExpire]);

  const pad = (n) => String(n).padStart(2, '0');

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-2',
    lg: 'text-lg gap-3',
  };

  const digitClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  if (isExpired) {
    return (
      <div className="flex items-center gap-2">
        <span className="badge-danger">ENDED</span>
      </div>
    );
  }

  const colorClass = isUrgent ? 'text-red-400 border-red-500/30' : 'text-gold border-gold/20';
  const bgClass = isUrgent ? 'bg-red-500/10' : 'bg-gold-100';
  const glowClass = isUrgent ? 'shadow-glow-danger' : '';

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className={`${digitClasses[size]} ${bgClass} ${colorClass} ${glowClass} rounded-lg flex items-center justify-center font-display font-bold border`}>
        {pad(value)}
      </div>
      {size !== 'sm' && (
        <span className="text-text-muted text-[10px] mt-1 uppercase tracking-wider">{label}</span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="days" />
          <span className={`${colorClass} font-bold self-start mt-2`}>:</span>
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="hrs" />
      <span className={`${colorClass} font-bold self-start mt-2`}>:</span>
      <TimeUnit value={timeLeft.minutes} label="min" />
      <span className={`${colorClass} font-bold self-start mt-2`}>:</span>
      <TimeUnit value={timeLeft.seconds} label="sec" />
    </div>
  );
};

export default AuctionTimer;
