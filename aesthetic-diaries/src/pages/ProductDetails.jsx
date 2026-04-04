import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Images */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 space-y-6"
        >
          <Tilt perspective={1500} scale={1.01} transitionSpeed={2000} glareEnable={true} glareMaxOpacity={0.2}>
            <div className="aspect-[4/5] bg-ink/50 rounded-md overflow-hidden shadow-2xl border border-taupe/30 relative">
               <div className="absolute inset-0 bg-taupe/10 mix-blend-multiply z-10" />
               <img src={`/book${id || 1}.png`} alt="Magical Tome" className="w-full h-full object-cover" onError={(e) => { e.target.src='/fantasy-butterfly.png'; }} />
            </div>
          </Tilt>
        </motion.div>

        {/* Details */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 lg:pl-12 flex flex-col justify-center"
        >
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-serif text-4xl text-ink drop-shadow-md">Tome of Secrets {id ? `(Vol. ${id})` : ''}</h1>
              <button className="p-2 text-rose hover:text-red-400 transition-colors drop-shadow-lg">
                <Heart className="w-8 h-8" />
              </button>
            </div>
            <p className="text-2xl text-taupe font-bold mb-6 drop-shadow-sm">45 Gold Coins</p>
            <p className="text-ink/80 leading-relaxed mb-8 font-medium">
              A meticulously crafted magical journal featuring high-grade, enchanted acid-free parchment. 
              The subtle spell grid provides structure without constraint, perfect for alchemy logging, sketching runes, or structured spells. Encased in a premium forest linen cover.
            </p>
            
            <div className="border-t border-b border-taupe/30 py-6 mb-8 flex items-center justify-between">
              <span className="text-sm uppercase tracking-widest text-ink/90 font-bold">Quantity</span>
              <div className="flex items-center gap-6 border border-taupe/50 rounded-full px-4 py-2 bg-ink/20">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink hover:text-taupe">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-ink hover:text-taupe">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="btn-primary w-full py-4 text-sm tracking-widest uppercase mb-4 bg-taupe text-paper hover:bg-white hover:text-taupe shadow-[0_0_20px_rgba(140,175,130,0.5)]">
              Add to Satchel
            </button>
            <p className="text-xs text-center text-taupe uppercase tracking-wider font-bold">Free owl delivery over 50 gold</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
