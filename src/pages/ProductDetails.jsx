import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5009/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      // Optional: add a toast or redirect
      // navigate('/cart');
    }
  };

  if (loading) {
    return <div className="container mx-auto py-24 text-center text-taupe">Loading product details...</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-24 text-center text-taupe">Product not found.</div>;
  }

  const availableImages = [product.image, product.image2, product.image3, product.image4, product.image5].filter(Boolean);
  const displayImage = mainImage || product.image || "/product.png";

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Images */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden">
             <img src={displayImage} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          {availableImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {availableImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden cursor-pointer border-2 transition-all ${displayImage === img ? 'border-ink' : 'border-transparent hover:border-taupe/30'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} detail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 lg:pl-12 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-8">
             <div className="flex justify-between items-start mb-2">
               <h1 className="font-serif text-4xl text-ink">{product.name}</h1>
               <button className="p-2 text-ink/70 hover:text-ink transition-colors">
                 <Heart className="w-6 h-6" />
               </button>
             </div>
             <p className="text-xl text-taupe mb-6">${product.price.toFixed(2)}</p>
             <p className="text-ink/80 leading-relaxed mb-8">
               {product.description || "A meticulously crafted daily journal featuring high-grade, acid-free 120gsm paper. The subtle 5mm dot grid provides structure without constraint, perfect for bullet journaling, sketching, or structured noting. Encased in a premium linen finish hard cover."}
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

             <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-sm tracking-widest uppercase mb-4">
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
