import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, Heart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Images */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden">
             <img src="/product.png" alt="Aesthetic Journal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden"><img src="/hero.png" alt="Detail 1" className="w-full h-full object-cover" /></div>
            <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden"><img src="/hero.png" alt="Detail 2" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 lg:pl-12 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-8">
             <div className="flex justify-between items-start mb-2">
               <h1 className="font-serif text-4xl text-ink">The Minimalist Grid {id ? `(${id})` : ''}</h1>
               <button className="p-2 text-ink/70 hover:text-ink transition-colors">
                 <Heart className="w-6 h-6" />
               </button>
             </div>
             <p className="text-xl text-taupe mb-6">$28.00</p>
             <p className="text-ink/80 leading-relaxed mb-8">
               A meticulously crafted daily journal featuring high-grade, acid-free 120gsm paper. 
               The subtle 5mm dot grid provides structure without constraint, perfect for bullet journaling, sketching, or structured noting. Encased in a premium linen finish hard cover.
             </p>
             
             <div className="border-t border-b border-taupe/20 py-6 mb-8 flex items-center justify-between">
               <span className="text-sm uppercase tracking-widest text-ink font-medium">Quantity</span>
               <div className="flex items-center gap-6 border border-taupe/30 rounded-full px-4 py-2">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink hover:text-taupe">
                   <Minus className="w-4 h-4" />
                 </button>
                 <span className="w-4 text-center">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="text-ink hover:text-taupe">
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
             </div>

             <button className="btn-primary w-full py-4 text-sm tracking-widest uppercase mb-4">
               Add to Cart
             </button>
             <p className="text-xs text-center text-taupe uppercase tracking-wider">Free shipping over $50</p>
          </div>
          
          <div className="space-y-6 mt-12 bg-cream/30 p-8 rounded-sm">
             <div>
               <h4 className="font-serif text-lg text-ink mb-2">Specifications</h4>
               <ul className="text-sm text-ink/70 space-y-2">
                 <li>• 192 Numbered Pages</li>
                 <li>• 120gsm Acid-Free Paper</li>
                 <li>• 5mm Dot Grid</li>
                 <li>• Lay-flat binding</li>
                 <li>• 2 Ribbon Markers</li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
