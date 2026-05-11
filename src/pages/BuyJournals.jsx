import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import axiosInstance from '../api/axios';

const BuyJournals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <SEO
        title="Buy Aesthetic Journals Online India | Premium Notebooks | Papercues"
        description="Order premium aesthetic journals online in India with free shipping above ₹500. Quality notebooks with 120gsm acid-free paper, perfect for bullet journaling. Fast delivery."
        path="/buy-journals"
        image="/logo.png"
      />

      {/* Hero Section */}
      <div className="text-center mb-16 sm:mb-24">
        <span className="text-sm font-bold uppercase tracking-widest text-taupe block">Premium Collection</span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink leading-tight mb-6">Buy Aesthetic Journals Online</h1>
        <p className="text-xl text-ink/80 max-w-3xl mx-auto mb-8">
          Shop premium journals with 120gsm acid-free paper, free shipping above ₹500, and 7-day returns. Perfect for bullet journaling, sketching, and creative planning.
        </p>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-ink">
            <span className="text-green-600 font-bold">✓</span>
            <span>Free Shipping Above ₹500</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink">
            <span className="text-green-600 font-bold">✓</span>
            <span>7-Day Returns</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink">
            <span className="text-green-600 font-bold">✓</span>
            <span>Premium 120gsm Paper</span>
          </div>
        </div>
        
        <Link to="/shop" className="btn-primary px-8 py-4 text-sm uppercase tracking-widest">
          Shop All Journals
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-cream/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📖</span>
          </div>
          <h3 className="font-serif text-xl text-ink mb-3">Premium Paper Quality</h3>
          <p className="text-ink/80 leading-relaxed">
            120gsm acid-free paper prevents ink bleed-through, perfect for fountain pens and markers.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-cream/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-serif text-xl text-ink mb-3">5mm Dot Grid</h3>
          <p className="text-ink/80 leading-relaxed">
            Perfect structure for bullet journaling, planning, and creative layouts without constraint.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-cream/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚚</span>
          </div>
          <h3 className="font-serif text-xl text-ink mb-3">Fast India Delivery</h3>
          <p className="text-ink/80 leading-relaxed">
            Quick delivery across India with free shipping on orders above ₹500 and express options available.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-12">
        <h2 className="font-serif text-3xl text-center text-ink mb-8">Featured Premium Journals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-16">
          {loading ? (
            <p className="col-span-full text-center text-taupe py-12">Loading premium journals...</p>
          ) : (
            products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-cream/30 p-8 rounded-sm">
        <h2 className="font-serif text-2xl text-ink mb-4">Ready to Order Your Perfect Journal?</h2>
        <p className="text-ink/80 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust Papercues for premium quality journals and notebooks across India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-primary px-8 py-4 text-sm uppercase tracking-widest">
            Browse All Journals
          </Link>
          <Link to="/contact" className="btn-secondary px-8 py-4 text-sm uppercase tracking-widest">
            Ask a Question
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyJournals;
