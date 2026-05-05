import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axiosInstance from '../api/axios';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false); // 👈 controls when image shows

  useEffect(() => {
    // Fetch products
    axiosInstance.get('/products')
      .then(res => {
        const data = res.data;
        const arrivals = data.filter(p => p.isNew);
        setNewArrivals(arrivals.length > 0 ? arrivals : data);
      })
      .catch(err => console.error(err));

    // Fetch config
    axiosInstance.get('/storefront')
      .then(res => {
        setConfig(res.data);
      })
      .catch(err => console.error('Failed to load storefront config', err))
      .finally(() => setConfigLoading(false));
  }, []);

  // 👇 Preload hero image BEFORE showing it (prevents flicker)
  useEffect(() => {
    if (!configLoading) {
      const imageUrl =
        config?.heroImageUrl && config.heroImageUrl !== '/product3.png'
          ? config.heroImageUrl
          : '/hero.png';

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => setHeroReady(true);
    }
  }, [config, configLoading]);

  const heroImage =
    config?.heroImageUrl && config.heroImageUrl !== '/product3.png'
      ? config.heroImageUrl
      : '/hero.png';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[620px] h-[88svh] flex items-center justify-center -mt-16">
        <div className="absolute inset-0 w-full h-full bg-cream/40">
          <div className="absolute inset-0 bg-ink/30 z-10" />

          {/* 👇 Show smooth placeholder until image fully loads */}
          {!heroReady ? (
            <div className="w-full h-full bg-cream animate-pulse" />
          ) : (
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-full object-cover animate-in fade-in duration-1000"
            />
          )}
        </div>

        <div className="relative z-20 text-center text-paper px-4 sm:px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="font-serif italic text-lg sm:text-xl md:text-2xl mb-4 text-paper/80">
            {config?.heroTitle || "The Art of Logging"}
          </h2>

          <h1
            className="font-serif text-4xl sm:text-5xl md:text-7xl mb-8 tracking-widest uppercase leading-tight"
            dangerouslySetInnerHTML={{
              __html: config?.heroSubtitle || "Capture<br />Every Moment"
            }}
          />

          <Link
            to={config?.heroLink || "/shop"}
            className="btn-primary bg-paper text-ink hover:bg-paper/90 px-8 py-3 text-sm tracking-widest uppercase"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 sm:py-24 bg-cream/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 sm:mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm border-b border-ink pb-1 uppercase tracking-widest hover:text-ink/70 mb-1"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;