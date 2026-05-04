import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Minus, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axiosInstance.get(`/products/${id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (!token) return;

    axiosInstance.get(`/wishlist/${id}/exists`)
      .then(res => setWishlist(res.data.exists || res.data.Exists))
      .catch(err => console.error(err));
  }, [id, token]);

  const handleAddToCart = () => {
    if (product) {
      if (product.stock <= 0) {
        setMessage('This product is out of stock.');
        return;
      }
      addToCart(product.id, quantity);
      setMessage('Added to cart.');
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      setMessage('Please sign in to save this product.');
      return;
    }

    try {
      await axiosInstance({
        method: wishlist ? 'delete' : 'post',
        url: `/wishlist/${product.id}`,
      });
      setWishlist(!wishlist);
      setMessage(wishlist ? 'Removed from wishlist.' : 'Saved to wishlist.');
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Please sign in to write a review.');
      return;
    }

    try {
      await axiosInstance.post(`/products/${product.id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setMessage('Review saved.');
      const nextReviews = await axiosInstance.get(`/products/${id}/reviews`);
      setReviews(nextReviews.data);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-24 text-center text-taupe">Loading product details...</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-24 text-center text-taupe">Product not found.</div>;
  }

  const availableImages = [product.image, product.image2, product.image3, product.image4, product.image5].filter(Boolean);
  const displayImage = availableImages[currentImageIndex] || "/product.png";

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden relative group">
             <img src={displayImage} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
             
             {availableImages.length > 1 && (
               <>
                 <button 
                   onClick={prevImage}
                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-paper/80 hover:bg-paper p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-ink"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button 
                   onClick={nextImage}
                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-paper/80 hover:bg-paper p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-ink"
                 >
                   <ChevronRight className="w-6 h-6" />
                 </button>
               </>
             )}
          </div>
          {availableImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3 sm:gap-4">
              {availableImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden cursor-pointer border-2 transition-all ${currentImageIndex === idx ? 'border-ink' : 'border-transparent hover:border-taupe/30'}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} detail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {product.videoUrl && (
            <div className="rounded-sm overflow-hidden border border-taupe/20 bg-black">
              <video src={product.videoUrl} controls className="w-full h-auto" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 lg:pl-12 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-8">
             <div className="flex justify-between items-start gap-4 mb-2">
               <h1 className="font-serif text-3xl sm:text-4xl text-ink">{product.name}</h1>
               <button onClick={toggleWishlist} className={`p-2 transition-colors ${wishlist ? 'text-red-500' : 'text-ink/70 hover:text-ink'}`}>
                 <Heart className="w-6 h-6" fill={wishlist ? 'currentColor' : 'none'} />
               </button>
             </div>
             <p className="text-xl text-taupe mb-6">{formatINR(product.price)}</p>
             <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-taupe">
               <span>{product.averageRating > 0 ? `${product.averageRating.toFixed(1)} / 5` : 'No ratings yet'}</span>
               <span>{product.reviewCount || 0} reviews</span>
               <span className={product.stock > 0 ? 'text-green-700' : 'text-red-600'}>
                 {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
               </span>
             </div>
             <p className="text-ink/80 leading-relaxed mb-8">
               {product.description || "A meticulously crafted daily journal featuring high-grade, acid-free 120gsm paper. The subtle 5mm dot grid provides structure without constraint, perfect for bullet journaling, sketching, or structured noting. Encased in a premium linen finish hard cover."}
             </p>
             
             <div className="border-t border-b border-taupe/20 py-8 mb-8 flex items-center justify-between gap-4">
               <span className="text-sm uppercase tracking-widest text-ink font-medium">Quantity</span>
               <div className="flex items-center gap-8 border border-taupe/30 rounded-full px-6 py-3">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink hover:text-taupe transition-colors">
                   <Minus className="w-5 h-5" />
                 </button>
                 <span className="w-6 text-center text-lg font-medium">{quantity}</span>
                 <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} className="text-ink hover:text-taupe transition-colors">
                   <Plus className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {message && <div className="mb-4 text-sm text-center text-taupe">{message}</div>}

             <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-primary w-full py-4 text-sm tracking-widest uppercase mb-4 disabled:opacity-60 disabled:cursor-not-allowed">
               Add to Cart
             </button>
             <p className="text-xs text-center text-taupe uppercase tracking-wider">Free shipping over ₹50</p>
          </div>
          
          <div className="space-y-6 mt-8 sm:mt-12 bg-cream/30 p-5 sm:p-8 rounded-sm">
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

          <div className="space-y-6 mt-8 bg-paper border border-taupe/10 p-5 sm:p-8 rounded-sm">
             <h4 className="font-serif text-lg text-ink">Customer Reviews</h4>
             {user && (
               <form onSubmit={submitReview} className="space-y-4">
                 <select
                   value={reviewForm.rating}
                   onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                   className="w-full px-4 py-2 border border-taupe/30 rounded-sm bg-transparent"
                 >
                   {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                 </select>
                 <textarea
                   value={reviewForm.comment}
                   onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                   required
                   rows="3"
                   className="w-full px-4 py-2 border border-taupe/30 rounded-sm bg-transparent"
                   placeholder="Write your review"
                 />
                 <button type="submit" className="btn-secondary w-full py-3 text-sm uppercase tracking-widest">Save Review</button>
               </form>
             )}
             <div className="space-y-4">
               {reviews.length === 0 ? (
                 <p className="text-sm text-taupe">No reviews yet.</p>
               ) : reviews.map((review) => (
                 <div key={review.id} className="border-t border-taupe/10 pt-4">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="font-medium text-ink">{review.username}</span>
                     <span className="text-taupe">{review.rating} / 5</span>
                   </div>
                   <p className="text-sm text-ink/70">{review.comment}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
