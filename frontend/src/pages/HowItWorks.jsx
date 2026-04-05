import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Search, Gavel, Trophy, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create Your Account', desc: 'Sign up as a Bidder to place bids or as an Auctioneer to list items. It takes less than 30 seconds.', color: 'text-neon-purple bg-neon-purple-dim' },
  { icon: Search, title: 'Browse & Discover', desc: 'Explore categories, search for items, and find the perfect auction. Filter by price, category, or status.', color: 'text-neon-cyan bg-neon-cyan-dim' },
  { icon: Gavel, title: 'Place Your Bids', desc: 'Enter your bid amount and compete in real-time. Watch the countdown timer and stay ahead of the competition.', color: 'text-neon-green bg-neon-green-dim' },
  { icon: Trophy, title: 'Win & Earn Rewards', desc: 'Win auctions to claim items. Earn badges, climb the leaderboard, and unlock exclusive achievements.', color: 'text-gold bg-gold-100' },
];

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <div className="page-container" id="how-it-works-page">
      <div className="section-container">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 border border-gold/15 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">Getting Started</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">How BidVerse Works</h1>
          <p className="text-text-secondary max-w-lg mx-auto">Four simple steps to start your auction journey</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 flex items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold/40 to-transparent" />
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <span className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-bg-deep font-bold text-lg">{i + 1}</span>
                  {i < steps.length - 1 && <div className="w-px h-8 bg-gold/20" />}
                </div>
                <div>
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-16">
          {user ? (
            <Link to="/" className="btn-gold px-8 py-4 text-base inline-flex hover:-translate-y-1 transition-transform group">
              Explore Live Auctions <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link to="/signup" className="btn-gold px-8 py-4 text-base inline-flex hover:-translate-y-1 transition-transform group">
              Start Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
