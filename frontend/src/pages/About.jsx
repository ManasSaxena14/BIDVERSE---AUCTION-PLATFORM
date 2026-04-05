import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Award, Users, TrendingUp, ArrowRight } from 'lucide-react';

const About = () => {
  const features = [
    { icon: Zap, title: 'Real-Time Bidding', desc: 'Live updates and countdown timers', color: 'text-gold bg-gold-100' },
    { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security', color: 'text-neon-green bg-neon-green-dim' },
    { icon: Globe, title: 'Global Reach', desc: 'Connect worldwide', color: 'text-neon-purple bg-neon-purple-dim' },
    { icon: Award, title: 'Gamification', desc: 'Badges, ranks, leaderboard', color: 'text-neon-cyan bg-neon-cyan-dim' },
    { icon: Users, title: 'Community', desc: 'Thriving auction community', color: 'text-gold bg-gold-100' },
    { icon: TrendingUp, title: 'Analytics', desc: 'Detailed bidding insights', color: 'text-neon-green bg-neon-green-dim' },
  ];

  return (
    <div className="page-container relative overflow-hidden" id="about-page">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 rounded-[100%] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="py-32 relative z-10">
        <div className="section-container text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#111111] border border-gold/20 mb-8 shadow-glow-gold-sm"
            >
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-xs text-gold uppercase tracking-[0.3em] font-bold">The Institution</span>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 font-display tracking-tighter leading-none">
              About <span className="gradient-text-gold text-glow-gold">BidVerse</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light leading-relaxed">
              The premier online destination where absolute exclusivity meets technical innovation. 
              Forging the future of luxury acquisitions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gold font-black uppercase tracking-[0.4em] mb-2">Our Mission</span>
                <div className="h-1 w-20 bg-gradient-gold rounded-full" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary font-display tracking-tight leading-tight">Revolutionizing <br/>Acquisitions.</h2>
              <p className="text-lg text-text-secondary leading-relaxed font-light">
                We believe every masterpiece has a legacy. BidVerse architecture combines high-frequency 
                bidding technology with a curated aesthetic to deliver a thrilling and elite marketplace encounter.
              </p>
              <div className="flex items-center gap-6 pt-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-deep bg-[#111111] flex items-center justify-center">
                          <Users className="w-4 h-4 text-text-muted" />
                       </div>
                    ))}
                 </div>
                 <p className="text-sm text-text-muted font-bold tracking-widest uppercase">+10K POWER BIDDERS</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }} 
              whileInView={{ opacity: 1, scale: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/[0.02] pointer-events-none" />
              <div className="grid grid-cols-2 gap-10 relative z-10 text-center">
                {[
                  { value: '10K+', label: 'Magnates' }, 
                  { value: '50K+', label: 'Sold' }, 
                  { value: '99.9%', label: 'Uptime' }, 
                  { value: '4.9★', label: 'Tier' }
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-4xl font-black gradient-text-gold font-display tracking-tighter drop-shadow-xl">{s.value}</p>
                    <p className="text-[10px] text-text-muted mt-2 uppercase tracking-[0.3em] font-black">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-text-primary font-display tracking-tight">The BidVerse Protocol</h2>
            <p className="text-lg text-text-secondary font-light mt-4">Technically superior. Visually unparalleled.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="glass-card group p-10 hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary mb-3 relative z-10 font-display tracking-tight">{f.title}</h3>
                  <p className="text-text-secondary relative z-10 leading-relaxed font-light">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-40 relative z-10">
        <div className="section-container">
          <div className="glass-card p-24 text-center relative overflow-hidden rounded-[3rem]">
            <div className="absolute inset-0 bg-gradient-hero opacity-30 animate-pulse-glow" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-6xl font-black text-text-primary mb-10 font-display tracking-tight">Initiate Your <br/><span className="gradient-text-gold">Heritage.</span></h2>
              <Link to="/signup" className="btn-gold px-12 py-6 text-lg inline-flex items-center gap-3 shadow-glow-gold hover:scale-105 transition-transform duration-500 rounded-2xl">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
