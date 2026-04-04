import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center -mt-16 overflow-hidden bg-[#8caf82]">
        {/* Animated Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[#e09f9c]/20 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#8caf82]/40 to-ink/60 z-10" />
          <img 
            src="/fantasy-butterfly.png" 
            alt="Fantasy Magical Book" 
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Magical Dust Particles */}
        <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="dust-particle animate-float animate-pulse-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
          <h2 className="font-serif italic text-xl md:text-3xl mb-4 text-[#fff4d2] tracking-widest" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>The Magic of Words</h2>
          <h1 className="font-serif text-5xl md:text-8xl mb-8 tracking-widest uppercase text-[#fff4d2] animate-float" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            Avonlea<br />Diaries
          </h1>
          <Link to="/shop" className="btn-primary bg-[#fff4d2] text-[#8caf82] hover:bg-white px-10 py-4 text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,244,210,0.4)]">
            Open the Book
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="py-24 container mx-auto px-6 md:px-12"
      >
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-ink drop-shadow-md">Curated for the Creator</h2>
          <div className="h-[2px] w-24 bg-taupe mx-auto mt-6 shadow-[0_0_10px_#8caf82]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link to="/shop" className="group relative aspect-[4/3] overflow-hidden rounded-md shadow-2xl border border-taupe/20">
            <div className="absolute inset-0 bg-ink/30 mix-blend-multiply group-hover:bg-ink/10 transition-colors z-10 duration-500" />
            <img src="/book2.png" alt="Daily Journals" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" onError={(e) => e.target.src='/fantasy-butterfly.png'} />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="bg-paper/40 backdrop-blur-md text-ink px-10 py-5 font-serif text-2xl tracking-widest uppercase shadow-[0_0_30px_rgba(255,244,210,0.3)] border border-taupe/40">Spell Books</span>
            </div>
          </Link>
          <Link to="/shop" className="group relative aspect-[4/3] overflow-hidden rounded-md shadow-2xl border border-taupe/20">
            <div className="absolute inset-0 bg-ink/30 mix-blend-multiply group-hover:bg-ink/10 transition-colors z-10 duration-500" />
            <img src="/book4.png" alt="Planners" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" onError={(e) => e.target.src='/fantasy-butterfly.png'} />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="bg-paper/40 backdrop-blur-md text-ink px-10 py-5 font-serif text-2xl tracking-widest uppercase shadow-[0_0_30px_rgba(255,244,210,0.3)] border border-taupe/40">Nature Grimoires</span>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* New Arrivals */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="py-24 bg-ink/20 backdrop-blur-sm border-t border-b border-taupe/20"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl text-ink drop-shadow-md">New Conjurations</h2>
            </div>
            <Link to="/shop" className="text-sm border-b-2 border-taupe pb-1 uppercase tracking-widest hover:text-white mb-1 font-bold">View Vault</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <ProductCard id="1" name="Little Women" price={28.00} image="/book1.png" isNew={true} />
            <ProductCard id="2" name="Houses and Gardens" price={45.00} image="/book2.png" isNew={false} />
            <ProductCard id="3" name="NUR Journal" price={32.00} image="/book3.png" isNew={true} />
            <ProductCard id="4" name="The Little Garden" price={18.00} image="/book4.png" isNew={false} />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
