import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import axiosInstance from '../api/axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category !== 'All') params.set('category', category);
    if (sort) params.set('sort', sort);

    axiosInstance.get(`/products?${params.toString()}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [search, category, sort]);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe/20 pb-8 mb-10 sm:mb-12">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink mb-4">The Collection</h1>
          <p className="text-ink/70 max-w-lg">Discover our full range of minimalist notebooks, productivity planners, and premium journaling accessories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full sm:w-56 border-b border-taupe/30 bg-transparent py-2 text-sm focus:outline-none focus:border-ink"
          />
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <label className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors">
            Sort <ChevronDown className="w-4 h-4" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent focus:outline-none">
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price-asc">Price Low</option>
              <option value="price-desc">Price High</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-10 sm:mb-12 flex flex-wrap gap-3 sm:gap-4 animate-in slide-in-from-top-4 duration-300">
          {['All', 'Journals', 'Planners', 'Premium', 'Pocket', 'Creative'].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`btn-secondary text-sm ${category === item ? 'border-taupe bg-taupe text-paper' : 'border-taupe/40 hover:border-taupe'}`}
            >
              {item}
            </button>
          ))}
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
