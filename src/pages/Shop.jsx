import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';



const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5009/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe/20 pb-8 mb-10 sm:mb-12">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink mb-4">The Collection</h1>
          <p className="text-ink/70 max-w-lg">Discover our full range of minimalist notebooks, productivity planners, and premium journaling accessories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors cursor-pointer">
            Sort <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-10 sm:mb-12 flex flex-wrap gap-3 sm:gap-4 animate-in slide-in-from-top-4 duration-300">
          <button className="btn-secondary text-sm border-taupe text-taupe hover:bg-taupe hover:text-paper">All</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Journals</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Planners</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Premium</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-16">
        {loading ? (
          <p className="col-span-full text-center text-taupe py-12">Loading collection...</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
