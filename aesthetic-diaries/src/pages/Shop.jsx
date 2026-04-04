import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const products = [
  { id: '1', name: 'Little Women', price: 28.00, image: '/book1.png', category: 'Classics', isNew: true },
  { id: '2', name: 'Houses and Gardens', price: 45.00, image: '/book2.png', category: 'Architecture', isNew: false },
  { id: '3', name: 'NUR Journal', price: 32.00, image: '/book3.png', category: 'Journals', isNew: true },
  { id: '4', name: 'The Little Garden', price: 38.00, image: '/book4.png', category: 'Nature', isNew: false },
  { id: '5', name: 'Anne of Avonlea', price: 24.00, image: '/book5.png', category: 'Classics', isNew: false },
];

const Shop = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row md:items-end justify-between border-b border-taupe/20 pb-8 mb-12"
      >
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 drop-shadow-md">The Grand Library</h1>
          <p className="text-ink/80 max-w-lg font-medium">Discover our full range of mystical notebooks, enchanted planners, and legendary novels.</p>
        </div>
        <div className="flex items-center gap-6 mt-8 md:mt-0">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors font-bold"
          >
            <Filter className="w-4 h-4" /> Filter Spells
          </button>
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors cursor-pointer font-bold">
            Sort Magic <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {filterOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-12 flex flex-wrap gap-4"
        >
          <button className="btn-secondary text-sm border-taupe text-taupe hover:bg-taupe hover:text-paper">All Volumes</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Journals</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Novels</button>
          <button className="btn-secondary text-sm border-taupe/40 hover:border-taupe">Botanical</button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product, i) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
