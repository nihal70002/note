import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const products = [
  { id: '1', name: 'The Minimalist Grid', price: 28.00, image: '/product.png', category: 'Journals', isNew: true },
  { id: '2', name: 'Midnight Leather', price: 45.00, image: '/hero.png', category: 'Premium', isNew: false },
  { id: '3', name: 'Taupe Linen Planner', price: 32.00, image: '/product.png', category: 'Planners', isNew: true },
  { id: '4', name: 'Pocket Ideas Book', price: 18.00, image: '/hero.png', category: 'Pocket', isNew: false },
  { id: '5', name: 'Weekly Overview', price: 24.00, image: '/product.png', category: 'Planners', isNew: false },
  { id: '6', name: 'Dotted Sketch Pad', price: 22.00, image: '/hero.png', category: 'Creative', isNew: false },
  { id: '7', name: 'Morning Pages', price: 26.00, image: '/product.png', category: 'Journals', isNew: true },
  { id: '8', name: 'The Master Collection', price: 85.00, image: '/hero.png', category: 'Premium', isNew: false },
];

const Shop = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-taupe/20 pb-8 mb-12">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">The Collection</h1>
          <p className="text-ink/70 max-w-lg">Discover our full range of minimalist notebooks, productivity planners, and premium journaling accessories.</p>
        </div>
        <div className="flex items-center gap-6 mt-8 md:mt-0">
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
        <div className="mb-12 flex flex-wrap gap-4 animate-in slide-in-from-top-4 duration-300">
          <button className="btn-secondary text-sm border-taupe text-taupe hover:bg-taupe hover:text-paper">All</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Journals</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Planners</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Premium</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
