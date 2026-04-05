export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        bg: {
          deep: '#000000',
          card: '#111111',
          elevated: '#1A1A1A',
        },
        gold: {
          DEFAULT: '#FACC15',
          dim: '#CA8A04',
          muted: '#A16207',
          glow: 'rgba(250, 204, 21, 0.35)',
          '50': 'rgba(250, 204, 21, 0.04)',
          '100': 'rgba(250, 204, 21, 0.08)',
          '200': 'rgba(250, 204, 21, 0.15)',
        },
        neon: {
          green: '#22C55E',
          'green-glow': 'rgba(34, 197, 94, 0.35)',
          'green-dim': 'rgba(34, 197, 94, 0.1)',
          purple: '#8B5CF6',
          'purple-glow': 'rgba(139, 92, 246, 0.35)',
          'purple-dim': 'rgba(139, 92, 246, 0.1)',
          cyan: '#06B6D4',
          'cyan-glow': 'rgba(6, 182, 212, 0.35)',
          'cyan-dim': 'rgba(6, 182, 212, 0.1)',
        },
        glass: {
          border: '#1F1F1F',
          'border-light': '#2A2A2A',
          fill: 'rgba(17, 17, 17, 0.7)',
          'fill-light': 'rgba(17, 17, 17, 0.5)',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
          dim: '#52525B',
        },
        danger: {
          DEFAULT: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #FACC15, #CA8A04)',
        'gradient-green': 'linear-gradient(135deg, #22C55E, #16A34A)',
        'gradient-purple': 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        'gradient-hero': 'radial-gradient(ellipse at 50% 0%, rgba(250, 204, 21, 0.06) 0%, transparent 50%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
      },
      boxShadow: {
        'glow-gold': '0 0 15px rgba(250, 204, 21, 0.2), 0 0 30px rgba(250, 204, 21, 0.06)',
        'glow-gold-sm': '0 0 8px rgba(250, 204, 21, 0.15)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.2), 0 0 30px rgba(34, 197, 94, 0.06)',
        'glow-green-sm': '0 0 8px rgba(34, 197, 94, 0.15)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.2), 0 0 30px rgba(139, 92, 246, 0.06)',
        'glow-purple-sm': '0 0 8px rgba(139, 92, 246, 0.15)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.2), 0 0 30px rgba(6, 182, 212, 0.06)',
        'glow-danger': '0 0 15px rgba(239, 68, 68, 0.2), 0 0 30px rgba(239, 68, 68, 0.06)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.6)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'count-up': 'countUp 1s ease-out',
        'rank-reveal': 'rankReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'toast-slide': 'toastSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-exit': 'toastExit 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'icon-pop': 'iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(250, 204, 21, 0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(250, 204, 21, 0.35), 0 0 40px rgba(250, 204, 21, 0.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 4px rgba(250, 204, 21, 0.15), 0 0 8px rgba(250, 204, 21, 0.06)' },
          '100%': { boxShadow: '0 0 15px rgba(250, 204, 21, 0.3), 0 0 25px rgba(250, 204, 21, 0.12)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        countUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rankReveal: {
          '0%': { transform: 'scale(0) rotateZ(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotateZ(0deg)', opacity: '1' },
        },
        toastSlide: {
          '0%': { transform: 'translateX(100px) scale(0.8) rotateY(-15deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1) rotateY(0deg)', opacity: '1' },
        },
        toastExit: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateX(100px) scale(0.8)', opacity: '0' },
        },
        iconPop: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
