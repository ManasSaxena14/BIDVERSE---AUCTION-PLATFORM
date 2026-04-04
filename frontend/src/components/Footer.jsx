import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/LOGO.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-[#E5E4E2] border-t border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="BidVerse" className="h-10 w-auto luxury-glow" />
              <h3 className="text-xl font-black text-[#D4AF37] tracking-[0.2em] uppercase">BidVerse</h3>
            </div>
            <p className="text-[11px] text-white/40 leading-loose tracking-[0.05em] uppercase font-black mb-8">
              The premier global destination for high-value asset liquidation and exclusive portfolio management.
            </p>
            <div className="flex gap-6">
              {[
                { icon: FaGithub, href: 'https://github.com/ManasSaxena14' },
                { icon: FaInstagram, href: 'https://www.instagram.com/_manas_14_/' },
                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/manas-saxena-1b3b27324/' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all duration-500"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#D4AF37] mb-8 tracking-[0.3em] uppercase">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Categories', 'Leaderboard', 'About Us'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-black text-white/20 hover:text-[#D4AF37] transition-all tracking-[0.2em] uppercase">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#D4AF37] mb-8 tracking-[0.3em] uppercase">Asset Classes</h4>
            <ul className="space-y-4">
              {['Horology', 'Fine Art', 'Estate', 'Blue Chip', 'Automotive'].map((item) => (
                <li key={item} className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase cursor-default hover:text-white/40 transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#D4AF37] mb-8 tracking-[0.3em] uppercase">Protocol</h4>
            <ul className="space-y-4">
              {['Safety', 'Authentication', 'Terms', 'Privacy', 'Contact'].map((item) => (
                <li key={item} className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase cursor-default hover:text-white/40 transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-white/10 tracking-[0.3em] uppercase">
            © {currentYear} BIDVERSE GLOBAL. OPERATED UNDER PRESTIGE CLEARING PROTOCOL.
          </p>
          <div className="flex gap-10">
            {['Terms', 'Transparency', 'Security'].map((item) => (
              <a key={item} href="#" className="text-[9px] font-black text-white/10 hover:text-[#D4AF37] transition-all tracking-[0.3em] uppercase">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;