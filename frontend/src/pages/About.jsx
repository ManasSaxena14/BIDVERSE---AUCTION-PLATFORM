import { 
  HiOutlineTarget, 
  HiOutlineBolt, 
  HiOutlineShieldCheck, 
  HiOutlineGlobeAlt, 
  HiOutlineSparkles, 
  HiOutlineHandshake, 
  HiOutlineTrophy,
  HiOutlineArrowRight,
  HiOutlineShieldExclamation
} from 'react-icons/hi2';

const About = () => {
  const features = [
    {
      icon: HiOutlineShieldCheck,
      title: 'Institutional Grade',
      description: 'Secure and transparent liquidation protocols with verified institutional entities and authenticated assets.'
    },
    {
      icon: HiOutlineBolt,
      title: 'Real-Time Flux',
      description: 'Experience high-frequency auction dynamics with millisecond-accurate proposal updates and global notifications.'
    },
    {
      icon: HiOutlineShieldExclamation,
      title: 'Asset Protection',
      description: 'Your capital allocations are secured through our comprehensive cryptographic guarantee and buyer escrow protocols.'
    },
    {
      icon: HiOutlineGlobeAlt,
      title: 'Global Network',
      description: 'Synchronize with elite collectors and institutional vendors across 180+ global jurisdictions.'
    },
    {
      icon: HiOutlineSparkles,
      title: 'Curated Registry',
      description: 'Access the world\'s most significant collectibles, fine arts, and unique high-value allocations.'
    },
    {
      icon: HiOutlineHandshake,
      title: 'Concierge Support',
      description: 'Our dedicated institutional support personnel are available 24/7 to ensure protocol success.'
    }
  ];

  const stats = [
    { number: '150K+', label: 'Verified Entities' },
    { number: '500K+', label: 'Assets Liquidated' },
    { number: '$2B+', label: 'Protocol Volume' },
    { number: '4.98/5', label: 'Trust Index' }
  ];

  const buyerSteps = [
    { step: '01', title: 'Entity Registration', description: 'Initialize your institutional profile and verify your capital credentials to enter the secondary market.' },
    { step: '02', title: 'Asset Discovery', description: 'Navigate our global registry of high-value assets across diverse alternative investment categories.' },
    { step: '03', title: 'Capital Allocation', description: 'Deploy competitive proposals and monitor the institutional elite index in real-time.' },
    { step: '04', title: 'Acquisition Finalization', description: 'Upon successful proposal termination, complete the secure custodial transfer through our escrow protocols.' }
  ];

  const sellerSteps = [
    { step: '01', title: 'Asset Categorization', description: 'Initialize an auction with multi-angle high-resolution media, technical specifications, and baseline valuation.' },
    { step: '02', title: 'Strategic Configuration', description: 'Define your baseline valuation, reserve thresholds, and protocol duration for maximum liquidation efficiency.' },
    { step: '03', title: 'Proposal Management', description: 'Monitor high-frequency proposals, respond to institutional inquiries, and optimize registry exposure.' },
    { step: '04', title: 'Capital Realization', description: 'Upon protocol termination, finalize the settlement and coordinate secure logistics with the acquiring entity.' }
  ];

  const faqs = [
    { question: 'How is a capital proposal initialized?', answer: 'Navigate to any asset entry, define your allocation amount (which must exceed current market position plus increment), and execute the proposal. You will receive cryptographic confirmation immediately.' },
    { question: 'Are proposals binding agreements?', answer: 'Yes, all proposals represent institutional-grade binding commitments according to our global trading protocols. Contact our legal concierge for exceptional termination requests.' },
    { question: 'What is the institutional service fee?', answer: 'We maintain a 12.5% premium on final liquidation values. This enables the maintenance of our high-security infrastructure. Acquiring entities face zero transaction fees.' },
    { question: 'What is the typical protocol duration?', answer: 'Vendors may configure protocol durations from 24 hours to 60 days. The termination countdown signifies the exact millisecond of asset liquidation.' },
    { question: 'How is transactional security maintained?', answer: 'We utilize state-of-the-art end-to-end encryption and multi-sig escrow gateways to ensure the absolute integrity of every capital allocation.' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative py-60 border-b border-white/5 bg-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[180px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 animate-fadeInUp">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.6em] uppercase italic leading-none">
            <span className="text-[#D4AF37]">ESTABLISHED MMXX</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            GLOBAL STANDARDS
          </div>
          <div className="space-y-6">
            <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter uppercase leading-none italic">
              Heritage <span className="gold-shimmer-text not-italic">& Protocols</span>
            </h1>
            <p className="text-[12px] md:text-[14px] text-white/20 max-w-2xl mx-auto font-black tracking-[0.4em] uppercase leading-relaxed italic">
              Defining the global benchmark for institutional-grade digital asset liquidation.
            </p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-48 animate-fadeInUp delay-200">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">The Governance</h2>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-none italic uppercase tracking-tighter">OUR <span className="gold-shimmer-text">MISSION</span></h2>
            </div>
            <div className="space-y-8">
              <p className="text-lg text-white/40 leading-relaxed italic font-black uppercase tracking-tight">
                At BidVerse, we are architecting the future of alternative asset markets. 
                Our mission is to establish a transparent, high-security, and high-frequency 
                marketplace where institutional capital meets extraordinary secondary assets.
              </p>
              <p className="text-md text-white/20 leading-relaxed italic">
                We believe in democratizing access to the world\'s most significant registry 
                while ensuring absolute market efficiency through competitive high-tracking 
                liquidation protocols.
              </p>
            </div>
            <div className="flex gap-16 border-t border-white/5 pt-16">
              {[
                { val: '2020', label: 'Inception' },
                { val: '180+', label: 'Jurisdictions' },
                { val: '99.9%', label: 'Uptime Index' }
              ].map((s, i) => (
                <div key={i} className="text-left space-y-2">
                  <div className="text-4xl font-black text-white tracking-tighter italic leading-none">{s.val}</div>
                  <div className="text-[10px] text-[#D4AF37] tracking-[0.4em] font-black uppercase italic">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#D4AF37]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200" 
              alt="BidVerse Excellence" 
              className="rounded-[4rem] border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10"
            />
            <div className="absolute -bottom-16 -right-16 bg-black/80 border border-[#D4AF37]/30 p-12 rounded-[3.5rem] shadow-3xl backdrop-blur-3xl z-20 space-y-4 animate-pulse">
              <HiOutlineTrophy className="text-5xl text-[#D4AF37]" />
              <div>
                <div className="text-[11px] font-black text-white tracking-[0.4em] uppercase italic">Premier Platform</div>
                <div className="text-[9px] font-black text-[#D4AF37] mt-1 tracking-[0.3em] uppercase">Global Excellence 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/5 border-y border-white/5 py-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="text-6xl font-black text-white tracking-tighter italic leading-none gold-shimmer-text">{stat.number}</div>
                <div className="text-[11px] text-white/10 tracking-[0.5em] font-black uppercase italic leading-none">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-48">
        <div className="text-center mb-32 space-y-4 animate-fadeInUp">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#D4AF37] italic">Elite Infrastructure</h2>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">THE BIDVERSE <span className="gold-shimmer-text">ADVANTAGE</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fadeInUp delay-200">
          {features.map((f, i) => (
            <div key={i} className="group bg-white/5 p-12 rounded-[4rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-1000 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <f.icon className="text-5xl mb-12 text-[#D4AF37] group-hover:scale-110 transition-transform duration-1000" />
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight uppercase italic group-hover:gold-shimmer-text transition-all">{f.title}</h3>
              <p className="text-white/20 leading-relaxed font-black text-xs italic uppercase tracking-widest">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black/60 backdrop-blur-3xl py-48 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">Operations</h2>
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none underline decoration-[#D4AF37]/20 underline-offset-[20px]">ACQUISITION <span className="gold-shimmer-text">INDEX</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {buyerSteps.map((step, index) => (
              <div key={index} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-700 group relative">
                <div className="text-5xl font-black text-[#D4AF37]/10 mb-8 italic leading-none group-hover:text-[#D4AF37] transition-colors">{step.step}</div>
                <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight italic">{step.title}</h3>
                <p className="text-[10px] text-white/20 leading-loose font-black tracking-widest uppercase italic">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-48 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">Liquidation</h2>
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none underline decoration-white/10 underline-offset-[20px]">VENDORS <span className="gold-shimmer-text">PROTOCOL</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {sellerSteps.map((step, index) => (
              <div key={index} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all duration-700 group relative">
                <div className="text-5xl font-black text-white/5 mb-8 italic leading-none group-hover:text-[#D4AF37] transition-colors">{step.step}</div>
                <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight italic">{step.title}</h3>
                <p className="text-[10px] text-white/20 leading-loose font-black tracking-widest uppercase italic">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/5 py-48 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">Intelligence</h2>
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">THE <span className="gold-shimmer-text">REGISTRY</span></h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden group">
                <summary className="px-12 py-8 cursor-pointer font-black text-white/40 hover:text-white transition-all duration-700 flex justify-between items-center text-[10px] uppercase tracking-[0.4em] italic leading-none list-none">
                  <span>{faq.question}</span>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/50 group-hover:rotate-45 transition-all">+</div>
                </summary>
                <div className="px-12 py-12 bg-white/5 text-white/20 text-[11px] leading-loose font-black uppercase tracking-[0.2em] italic border-t border-white/5">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black py-60 border-t border-[#D4AF37]/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[200px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-16 relative z-10">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">INITIALIZE <span className="gold-shimmer-text">LEGACY</span></h2>
            <p className="text-[12px] md:text-[14px] text-white/20 font-black tracking-[0.5em] uppercase italic">Join the most prestigious global auction network today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a href="/signup" className="px-16 py-6 bg-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black text-[11px] tracking-[0.5em] uppercase hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)] italic leading-none flex items-center gap-4 group">
              Establish Credentials <HiOutlineArrowRight className="group-hover:translate-x-3 transition-transform" />
            </a>
            <a href="/" className="px-16 py-6 border border-white/5 text-white/40 rounded-2xl font-black text-[11px] tracking-[0.5em] uppercase hover:text-white hover:border-white/20 transition-all italic leading-none">Market Overview</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;