import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center -mt-16">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-ink/20 z-10" />
          <img src="/hero.png" alt="Aesthetic Journal" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 text-center text-paper px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="font-serif italic text-xl md:text-2xl mb-4 text-paper/80">The Art of Logging</h2>
          <h1 className="font-serif text-5xl md:text-7xl mb-8 tracking-widest uppercase">Capture<br />Every Moment</h1>
          <Link to="/shop" className="btn-primary bg-paper text-ink hover:bg-paper/90 px-8 py-3 text-sm tracking-widest uppercase">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-paper container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Curated for the Creator</h2>
          <div className="h-0.5 w-16 bg-taupe mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link to="/shop" className="group relative aspect-[4/3] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors z-10 duration-500" />
            <img src="/product.png" alt="Daily Journals" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="bg-paper/90 backdrop-blur-sm text-ink px-8 py-4 font-serif text-xl tracking-widest uppercase">Daily Journals</span>
            </div>
          </Link>
          <Link to="/shop" className="group relative aspect-[4/3] overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors z-10 duration-500" />
            <img src="/hero.png" alt="Planners" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="bg-paper/90 backdrop-blur-sm text-ink px-8 py-4 font-serif text-xl tracking-widest uppercase">Goal Planners</span>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-cream/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-sm border-b border-ink pb-1 uppercase tracking-widest hover:text-ink/70 mb-1">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <ProductCard id="1" name="The Minimalist Grid" price={28.00} image="/product.png" isNew={true} />
            <ProductCard id="2" name="Midnight Leather Journal" price={45.00} image="/hero.png" isNew={false} />
            <ProductCard id="3" name="Taupe Linen Planner" price={32.00} image="/product.png" isNew={true} />
            <ProductCard id="4" name="Pocket Ideas Book" price={18.00} image="/hero.png" isNew={false} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
