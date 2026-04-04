import { 
  HiOutlineLockClosed, 
  HiOutlineBolt, 
  HiOutlineStar, 
  HiOutlineCreditCard, 
  HiOutlineDevicePhoneMobile, 
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight,
  HiOutlineQueueList,
  HiOutlineAcademicCap
} from 'react-icons/hi2';

const HowItWorks = () => {
  const steps = {
    buyer: [
      { step: '01', title: 'Entity Registration', description: 'Initialize your institutional profile and verify your capital credentials for market entry.' },
      { step: '02', title: 'Registry Discovery', description: 'Navigate our global database of high-value alternative assets across diverse categories.' },
      { step: '03', title: 'Capital Allocation', description: 'Deploy competitive proposals with real-time millisecond-accurate synchronization.' },
      { step: '04', title: 'Acquisition Settlement', description: 'Finalize the secure custodial transfer and authenticated ownership transition.' }
    ],
    seller: [
      { step: '01', title: 'Asset Characterization', description: 'Professional listing infrastructure for high-value collectibles and luxury holdings.' },
      { step: '02', title: 'Strategic Configuration', description: 'Define baseline valuations and protocol deadlines with institutional precision.' },
      { step: '03', title: 'Market Exposure', description: 'Maximize global liquidity through our high-frequency bidder management network.' },
      { step: '04', title: 'Governed Settlement', description: 'Automated settlement protocols and secure international logistics coordination.' }
    ]
  };

  const faqs = [
    { question: 'Proposal Protocols', answer: 'All capital proposals are binding commitments. Each incremental adjustment must exceed the current high-water mark by the specified protocol minimum.' },
    { question: 'Security Architecture', answer: 'We utilize defense-grade encryption and secure multi-sig escrow gateways for all high-value institutional transactions.' },
    { question: 'Premium Commissions', answer: 'Our fee schedules are optimized for high-value asset transfers. Contact our private concierge for customized liquidation terms.' }
  ];

  const features = [
    { icon: HiOutlineLockClosed, title: 'Secure Vault', desc: 'MIL-SPEC ENCRYPTION' },
    { icon: HiOutlineBolt, title: 'Zero Latency', desc: 'REAL-TIME SYNC' },
    { icon: HiOutlineStar, title: 'Elite Sourcing', desc: 'VERIFIED PROVENANCE' },
    { icon: HiOutlineCreditCard, title: 'Settlement', desc: 'CUSTODIAL ESCROW' },
    { icon: HiOutlineDevicePhoneMobile, title: 'Mobility', desc: 'GLOBAL TERMINAL' },
    { icon: HiOutlineShieldCheck, title: 'Compliance', desc: 'GOVERNED TRANSFERS' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <header className="relative py-64 bg-[#0D0D0D] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10 space-y-12 animate-fadeInUp">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.5em] mb-4 uppercase italic leading-none">
            <HiOutlineAcademicCap className="text-[#D4AF37] text-sm" />
            Protocol Operational Framework
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter uppercase leading-[0.8] italic">
            Institutional <span className="gold-shimmer-text not-italic">Standards</span>
          </h1>
          <p className="text-[12px] md:text-[14px] text-white/20 max-w-2xl mx-auto font-black tracking-[0.4em] uppercase leading-relaxed italic">
            Your comprehensive framework for acquiring and liquidating high-value assets on the premier global marketplace.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-48 animate-fadeInUp delay-200">
        <div className="mb-32 space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#D4AF37] italic">Acquisition</h2>
          <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">THE BUYER <span className="gold-shimmer-text">LIFECYCLE</span></h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.buyer.map((step, index) => (
            <div key={index} className="bg-white/5 p-12 rounded-[4rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-1000 group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="text-6xl font-black text-[#D4AF37]/10 mb-10 group-hover:text-[#D4AF37] transition-colors leading-none italic">{step.step}</div>
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic group-hover:gold-shimmer-text transition-all">{step.title}</h3>
              <p className="text-[10px] text-white/20 font-black tracking-widest leading-loose uppercase italic">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black/60 backdrop-blur-3xl py-48 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-32 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#D4AF37] italic">Liquidation</h2>
            <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">VENDORS <span className="gold-shimmer-text">PROTOCOL</span></h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.seller.map((step, index) => (
              <div key={index} className="bg-white/5 p-12 rounded-[4rem] border border-white/5 hover:border-white/10 transition-all duration-1000 group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="text-6xl font-black text-white/5 mb-10 group-hover:text-[#D4AF37] transition-colors leading-none italic">{step.step}</div>
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic group-hover:text-white transition-all">{step.title}</h3>
                <p className="text-[10px] text-white/20 font-black tracking-widest leading-loose uppercase italic">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-48">
        <div className="mb-32 text-center space-y-4 animate-fadeInUp delay-300">
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#D4AF37] italic">Capabilities</h2>
          <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">PLATFORM <span className="gold-shimmer-text">EDGE</span></h3>
        </div>
        <div className="grid md:grid-cols-3 gap-12 animate-fadeInUp delay-400">
          {features.map((f, i) => (
            <div key={i} className="bg-white/5 p-16 rounded-[4rem] border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-1000 shadow-[0_30px_100px_rgba(0,0,0,0.5)] group text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <f.icon className="text-6xl mx-auto mb-10 text-[#D4AF37] group-hover:scale-110 transition-transform duration-1000" />
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight italic group-hover:gold-shimmer-text transition-all">{f.title}</h3>
              <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.6em] leading-none italic">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/5 py-48 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="mb-32 text-center space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#D4AF37] italic">Intelligence</h2>
            <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">GOVERNANCE <span className="gold-shimmer-text">REGISTRY</span></h3>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden group">
                <summary className="px-12 py-10 cursor-pointer font-black text-white/40 hover:text-white transition-all duration-1000 flex justify-between items-center text-[11px] uppercase tracking-[0.5em] italic leading-none list-none">
                  {faq.question}
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/50 group-hover:rotate-45 transition-all">+</div>
                </summary>
                <div className="px-12 py-12 bg-white/5 text-white/20 text-[12px] font-black uppercase tracking-[0.3em] leading-loose italic border-t border-white/5">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black py-72 border-t border-[#D4AF37]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[200px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center space-y-16 relative z-10">
          <h2 className="text-7xl md:text-[10rem] font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] italic">
            INITIALIZE <span className="gold-shimmer-text not-italic">LEGACY</span>
          </h2>
          <p className="text-[12px] md:text-[14px] text-white/20 max-w-xl mx-auto font-black tracking-[0.6em] uppercase italic leading-loose">
            Join the most prestigious global auction community today.
          </p>
          <a href="/signup" className="inline-block px-20 py-8 bg-[#D4AF37] text-[#0D0D0D] rounded-3xl font-black text-[12px] tracking-[0.6em] uppercase hover:bg-white transition-all shadow-[0_0_80px_rgba(212,175,55,0.4)] italic leading-none flex items-center gap-6 mx-auto group">
            ESTABLISH CREDENTIALS <HiOutlineArrowUpRight className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;


