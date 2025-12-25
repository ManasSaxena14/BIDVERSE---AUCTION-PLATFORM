const HowItWorks = () => {
  const steps = {
    buyer: [
      {
        step: '01',
        title: 'Create Your Account',
        description: 'Sign up for free and complete your profile in minutes. Choose to be a bidder or auctioneer.'
      },
      {
        step: '02',
        title: 'Browse Auctions',
        description: 'Explore thousands of items across various categories. Use filters to find exactly what you\'re looking for.'
      },
      {
        step: '03',
        title: 'Place Your Bid',
        description: 'Found something you like? Place a competitive bid and watch the leaderboard in real-time.'
      },
      {
        step: '04',
        title: 'Win & Purchase',
        description: 'If your bid is highest when the auction ends, you win! Complete the secure checkout process.'
      }
    ],
    seller: [
      {
        step: '01',
        title: 'List Your Item',
        description: 'Create an auction with photos, description, starting price, and auction duration.'
      },
      {
        step: '02',
        title: 'Set Your Terms',
        description: 'Choose your reserve price, auction duration, and shipping options.'
      },
      {
        step: '03',
        title: 'Manage Bids',
        description: 'Monitor incoming bids, answer questions, and update your listing as needed.'
      },
      {
        step: '04',
        title: 'Complete Sale',
        description: 'When auction ends, finalize the sale and arrange shipping with the winner.'
      }
    ]
  };

  const faqs = [
    {
      question: 'How do I place a bid?',
      answer: 'Simply navigate to an item page, enter your bid amount (must be higher than current bid), and click "Place Bid". You\'ll receive confirmation immediately.'
    },
    {
      question: 'Can I retract a bid?',
      answer: 'Bids are binding commitments. However, you can update your bid amount before the auction ends. Contact support for exceptional circumstances.'
    },
    {
      question: 'What fees does BidVerse charge?',
      answer: 'We charge a 10% commission on successful sales. Bidders don\'t pay any fees. Creating listings is completely free.'
    },
    {
      question: 'How long do auctions last?',
      answer: 'Auctioneers can set auction duration from 1 day to 30 days. The countdown timer shows exactly when each auction ends.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Absolutely! We use industry-standard encryption and secure payment gateways to protect all transactions.'
    },
    {
      question: 'What if I win an auction?',
      answer: 'Congratulations! You\'ll receive an email with payment instructions and seller contact information to arrange delivery.'
    }
  ];

  const features = [
    { icon: '🔒', title: 'Secure Payments', desc: 'Bank-level encryption' },
    { icon: '⚡', title: 'Instant Notifications', desc: 'Real-time bid alerts' },
    { icon: '🌟', title: 'Verified Sellers', desc: 'Trusted community' },
    { icon: '💳', title: 'Multiple Payment Methods', desc: 'Pay your way' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Bid on the go' },
    { icon: '🛡️', title: 'Buyer Protection', desc: 'Money-back guarantee' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black text-[#F7F7F7] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)` ,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            HOW IT WORKS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Master the Art of <span className="text-[#D4AF37]">Luxury Bidding</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#E5E4E2] max-w-3xl mx-auto font-light tracking-wide">
            Your complete guide to buying and selling exclusive items on BidVerse
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F7] mb-4 tracking-wide">For Buyers</h2>
          <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light tracking-wide">Discover and win rare treasures in 4 easy steps</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.buyer.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-8 shadow-2xl hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-2xl mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
                  {step.step}
                </div>
                <div className="text-sm font-bold text-[#D4AF37] mb-4 tracking-wider">STEP {step.step}</div>
                <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{step.title}</h3>
                <p className="text-[#E5E4E2] font-light">{step.description}</p>
              </div>
              {index < steps.buyer.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="py-20 bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F7] mb-4 tracking-wide">For Sellers</h2>
            <p className="text-xl text-[#E5E4E2] max-w-2xl mx-auto font-light tracking-wide">Turn your exclusive items into profitable auctions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.seller.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-8 shadow-2xl hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-2xl mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="text-sm font-bold text-[#D4AF37] mb-4 tracking-wider">STEP {step.step}</div>
                  <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{step.title}</h3>
                  <p className="text-[#E5E4E2] font-light">{step.description}</p>
                </div>
                {index < steps.seller.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#F7F7F7] mb-16 tracking-wide">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 p-8 rounded-2xl shadow-2xl hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all duration-500 group hover:-translate-y-1">
              <div className="text-4xl mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-[#E5E4E2] font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-20 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#F7F7F7] mb-16 tracking-wide">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <summary className="px-8 py-6 cursor-pointer font-bold text-xl text-[#F7F7F7] hover:bg-white/5 flex justify-between items-center tracking-wide transition-colors duration-300">
                  {faq.question}
                  <svg className="w-6 h-6 text-[#D4AF37] transform group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-8 py-6 bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] text-[#E5E4E2] border-t border-[#D4AF37]/20 font-light">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-6 tracking-wide">
          Ready to Experience <span className="text-[#D4AF37]">Luxury Auctions</span>?
        </h2>
        <p className="text-xl text-[#E5E4E2] mb-10 max-w-2xl mx-auto font-light tracking-wide">
          Join BidVerse today and discover rare treasures from collectors worldwide
        </p>
        <a href="/signup" className="inline-block px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-full font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transform hover:scale-105">
          Create Your Exclusive Account
        </a>
      </div>
    </div>
  );
};

export default HowItWorks;
