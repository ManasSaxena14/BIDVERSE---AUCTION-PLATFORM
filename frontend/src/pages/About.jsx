const About = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Trusted Platform',
      description: 'Secure and transparent auction process with verified users and authentic items.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Bidding',
      description: 'Experience live auction action with instant bid updates and notifications.'
    },
    {
      icon: '🛡️',
      title: 'Buyer Protection',
      description: 'Your transactions are protected with our comprehensive buyer guarantee.'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Connect with bidders and sellers from around the world.'
    },
    {
      icon: '💎',
      title: 'Premium Items',
      description: 'Discover rare collectibles, art, and unique treasures.'
    },
    {
      icon: '🤝',
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you succeed.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '100K+', label: 'Items Sold' },
    { number: '$50M+', label: 'Total Sales' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  const buyerSteps = [
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
  ];

  const sellerSteps = [
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
  ];

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
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold tracking-wider mb-6">
            ABOUT US & HOW IT WORKS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#F7F7F7] mb-6 tracking-wide">ABOUT BIDVERSE</h1>
          <p className="text-xl md:text-2xl text-[#E5E4E2]/80 max-w-3xl mx-auto leading-relaxed tracking-wide">
            The world's most sophisticated auction platform connecting collectors, enthusiasts, and sellers globally
          </p>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#F7F7F7] mb-6 tracking-wide">OUR MISSION</h2>
            <p className="text-lg text-[#E5E4E2]/80 mb-4 leading-relaxed">
              At BidVerse, we're revolutionizing the way people buy and sell unique items. 
              Our mission is to create a transparent, secure, and exciting marketplace where 
              everyone can discover extraordinary treasures.
            </p>
            <p className="text-lg text-[#E5E4E2]/80 mb-8 leading-relaxed">
              We believe in democratizing access to rare and valuable items while ensuring 
              fair pricing through competitive bidding. Our platform empowers both buyers 
              and sellers with cutting-edge technology and unparalleled support.
            </p>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">2020</div>
                <div className="text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">150+</div>
                <div className="text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">98%</div>
                <div className="text-sm text-[#E5E4E2]/60 tracking-wider uppercase">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800" 
              alt="Team collaboration" 
              className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-[#D4AF37]/20"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#1A1A1A] border border-[#D4AF37]/30 p-6 rounded-xl shadow-xl backdrop-blur-xl">
              <div className="text-4xl font-bold">🏆</div>
              <div className="text-sm font-semibold text-[#D4AF37] mt-2 tracking-wide">BEST AUCTION PLATFORM 2024</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#0D0D0D] to-black border-y border-[#D4AF37]/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-2">{stat.number}</div>
                <div className="text-lg text-[#E5E4E2]/70 tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">WHY CHOOSE BIDVERSE?</h2>
          <p className="text-xl text-[#E5E4E2]/70 max-w-2xl mx-auto tracking-wide">Experience the pinnacle of online auctions</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 hover:-translate-y-2 border border-[#D4AF37]/20"
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-[#D4AF37]">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{feature.title}</h3>
              <p className="text-[#E5E4E2]/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] py-20 border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">HOW IT WORKS - FOR BUYERS</h2>
            <p className="text-xl text-[#E5E4E2]/70 tracking-wide">Start winning in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buyerSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 hover:-translate-y-3 border border-[#D4AF37]/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-2xl mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{step.title}</h3>
                  <p className="text-[#E5E4E2]/70 leading-relaxed">{step.description}</p>
                </div>
                {index < buyerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="py-20 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">HOW IT WORKS - FOR SELLERS</h2>
            <p className="text-xl text-[#E5E4E2]/70 tracking-wide">Turn your items into cash effortlessly</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellerSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all duration-300 hover:-translate-y-3 border border-[#D4AF37]/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#E5E4E2] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-2xl mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#F7F7F7] mb-4 tracking-wide">{step.title}</h3>
                  <p className="text-[#E5E4E2]/70 leading-relaxed">{step.description}</p>
                </div>
                {index < sellerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-gradient-to-br from-[#1A1A1A] to-black py-20 border-y border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-4 tracking-wide">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-xl text-[#E5E4E2]/70 tracking-wide">Everything you need to know</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden group hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all border border-[#D4AF37]/20">
                <summary className="px-8 py-6 cursor-pointer font-semibold text-lg text-[#F7F7F7] hover:bg-white/5 flex justify-between items-center tracking-wide">
                  <span>{faq.question}</span>
                  <svg className="w-6 h-6 transform group-open:rotate-180 transition-transform text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-8 py-6 bg-black/30 text-[#E5E4E2]/80 leading-relaxed border-t border-[#D4AF37]/20">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-black py-24 border-y border-[#D4AF37]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F7F7F7] mb-6 tracking-wide">
            READY TO START YOUR JOURNEY?
          </h2>
          <p className="text-xl text-[#E5E4E2]/80 mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Join thousands of satisfied users who trust BidVerse for their buying and selling needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-10 py-4 bg-[#D4AF37] text-[#0D0D0D] rounded-xl font-bold text-lg hover:bg-[#E5E4E2] transform hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(212,175,55,0.4)] tracking-wide">
              GET STARTED NOW
            </a>
            <a href="/" className="px-10 py-4 bg-transparent border-2 border-[#D4AF37] backdrop-blur-sm text-[#D4AF37] rounded-xl font-bold text-lg hover:bg-[#D4AF37] hover:text-[#0D0D0D] transform hover:scale-105 transition-all duration-300 tracking-wide">
              BROWSE AUCTIONS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;