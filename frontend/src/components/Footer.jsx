import { Link } from 'react-router-dom';
import { Gavel, Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = 2025;

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Live Auctions', to: '/#live-auctions' },
        { label: 'Categories', to: '/categories' },
        { label: 'Leaderboard', to: '/leaderboard' },
        { label: 'How It Works', to: '/how-it-works' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/about' },
        { label: 'Careers', to: '/about' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/about' },
        { label: 'Terms of Service', to: '/about' },
        { label: 'Cookie Policy', to: '/about' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/ManasSaxena14', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/manas-saxena-1b3b27324', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/_manas_14_', label: 'Instagram' },
  ];

  return (
    <footer className="relative mt-20 border-t border-glass-border" id="main-footer">
      {/* Glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Gavel className="w-4 h-4 text-bg-deep" />
              </div>
              <span className="text-xl font-bold font-display gradient-text-gold">BidVerse</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              The premier destination for premium online auctions. Bid on exclusive items, track live auctions, and compete with collectors worldwide.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-glass-border flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 hover:bg-gold-50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-secondary hover:text-gold transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="divider-glow mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {currentYear} BidVerse. All rights reserved.
          </p>
          <p className="text-xs text-text-dim">
            Built with precision. Designed for excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
