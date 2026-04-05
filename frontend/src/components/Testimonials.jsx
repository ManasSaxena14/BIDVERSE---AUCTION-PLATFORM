import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Elon Musk',
    title: 'Technology Magnate',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg',
    quote: "The premier platform for acquiring true rarities. BidVerse is fundamentally changing how high-value assets are exchanged globally.",
  },
  {
    name: 'Bruce Wayne',
    title: 'Billionaire Industrialist',
    image: 'https://sites.rutgers.edu/demo-project/wp-content/uploads/sites/16/2017/12/3859882-6269102771-Bruce.jpg',
    quote: "Securing exclusive items has never felt more like a thrilling game. Absolute masterclass in luxury user experience.",
  },
  {
    name: 'Rohit Sharma',
    title: 'Sports Icon',
    image: 'https://onecricketnews.akamaized.net/parth-editor/oc-dashboard/news-images-prod/1775302068386_RohitSharma.jpg?type=hq',
    quote: "BidVerse provides a trusted, elite environment. Taking part in these auctions is as exhilarating as playing in a final.",
  },
  {
    name: 'Lionel Messi',
    title: 'Global Athlete',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
    quote: "For collecting the finest sporting memorabilia, there is no place I trust more than BidVerse. Exceptional service.",
  },
  {
    name: 'Roman Reigns',
    title: 'Professional Wrestler',
    image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTGMhfv9hHbU-3UiS2cYHglupbEAGdScyIGzjHO08XnRRF9c63Rnoilus9aH_RLwoOB0dCxjjs_PvGacyk',
    quote: "When you want to operate at the top of the food chain, you come here. Acknowledge the greatest auction platform online.",
  },
  {
    name: 'Hrithik Roshan',
    title: 'Superstar',
    image: 'https://i.pinimg.com/736x/5b/e0/55/5be0551ff581b1e4c73aa94879f20c66.jpg',
    quote: "The sophistication and security of BidVerse is unmatched. Every piece curated here is an absolute masterpiece.",
  },
];

const Testimonials = () => {
  // We duplicate the array to allow infinite seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-[#050505] border-y border-[#1F1F1F] overflow-hidden" id="testimonials">
      <div className="section-container relative z-10 mb-16 text-center">
        <h2 className="text-4xl lg:text-6xl font-black text-text-primary font-display tracking-tight drop-shadow-md">
          Endorsed by Elites
        </h2>
        <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto font-light leading-relaxed">
          The world's most influential personalities choose BidVerse for their most exclusive acquisitions.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex space-x-8 animate-scroll pl-8 py-4 w-max">
          {duplicatedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="w-[300px] md:w-[350px] shrink-0 glass-card p-8 flex flex-col relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/20" />
              <p className="text-text-secondary font-light leading-relaxed mb-8 flex-1 italic text-sm md:text-base">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/50 shadow-glow-gold-sm shrink-0">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary font-display text-sm uppercase tracking-wide">{t.name}</h4>
                  <span className="text-xs text-text-muted">{t.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
