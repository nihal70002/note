import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Minus, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axiosInstance from '../api/axios';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import ShimmerButton from '../components/ShimmerButton';
import { getProductIdFromSlug, getProductPath, productDescription } from '../utils/seo';
import { breadcrumbSchema, productSchema } from '../utils/schema';

const normalizeReviewImages = (review) => {
  const images = review.images ?? review.Images ?? review.imageUrls ?? review.photos ?? [];
  if (Array.isArray(images)) return images.filter(Boolean).slice(0, 3);
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 3) : [];
    } catch {
      return images ? [images].slice(0, 3) : [];
    }
  }
  return [];
};

const normalizeReviews = (data) => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.reviews)
      ? data.reviews
      : Array.isArray(data?.items)
        ? data.items
        : [];

  return source.map((review) => ({
    ...review,
    images: normalizeReviewImages(review),
  }));
};

const getReviewImageUrl = (image) => {
  if (typeof image === 'string') {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return image.startsWith('http') ? image : `${apiBaseUrl}${image}`;
  }

  return image?.url || image?.secure_url || '';
};

const ProductDetails = () => {
  const { id, slug } = useParams();
  const productId = id || getProductIdFromSlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingProductId, setAddingProductId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlist, setWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewImages, setReviewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  useEffect(() => {
    axiosInstance.get(`/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    axiosInstance.get(`/products/${productId}/reviews`)
      .then(res => {
        console.log('Reviews API response:', res.data);
        const normalizedReviews = normalizeReviews(res.data);
        console.log('Normalized reviews:', normalizedReviews);
        setReviews(normalizedReviews);
      })
      .catch(err => console.error(err));
  }, [productId]);

  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => {
        const products = Array.isArray(res.data) ? res.data : [];
        setRelatedProducts(products.filter((item) => String(item.id) !== String(productId)).slice(0, 3));
      })
      .catch(err => console.error(err));
  }, [productId]);

  useEffect(() => {
    if (!token) return;

    axiosInstance.get(`/wishlist/${productId}/exists`)
      .then(res => setWishlist(res.data.exists || res.data.Exists))
      .catch(err => console.error(err));
  }, [productId, token]);

  const handleAddToCart = async () => {
    if (product) {
      if (product.stock <= 0) {
        showToast('error', 'This product is out of stock.');
        return;
      }
      setAddingProductId(product.id);
      const result = await addToCart(product.id, quantity);
      setAddingProductId(null);
      showToast(result?.success ? 'success' : 'error', result?.success ? `${product.name} added to cart.` : result?.message || 'Could not add item to cart.');
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      showToast('error', 'Please sign in to save this product.');
      return;
    }

    try {
      await axiosInstance({
        method: wishlist ? 'delete' : 'post',
        url: `/wishlist/${product.id}`,
      });
      setWishlist(!wishlist);
      showToast('success', wishlist ? 'Removed from wishlist.' : 'Saved to wishlist.');
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      showToast('error', 'Could not update wishlist.');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Check for valid image formats
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const isValidType = validTypes.includes(file.type);
      const isValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
      
      if (!isValidType || !isValidExtension) {
        showToast('error', `${file.name} is not a valid image format. Please use JPG, PNG, GIF, or WebP.`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('error', `${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length + reviewImages.length > 3) {
      showToast('error', 'Maximum 3 images allowed.');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReviewImages(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.onerror = () => {
        showToast('error', `Failed to read ${file.name}. Please try again.`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('error', 'Please sign in to write a review.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('rating', reviewForm.rating);
      formData.append('comment', reviewForm.comment);
      
      reviewImages.forEach((image) => {
        formData.append('images', image, image.name);
      });

      console.log('Submitting review images:', reviewImages);

      const saveResponse = await axiosInstance.post(`/products/${product.id}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Review save response:', saveResponse.data);
      
      setReviewForm({ rating: 5, comment: '' });
      setReviewImages([]);
      setImagePreviews([]);
      showToast('success', 'Review saved.');
      const nextReviews = await axiosInstance.get(`/products/${productId}/reviews`);
      console.log('Reviews API response after save:', nextReviews.data);
      const normalizedReviews = normalizeReviews(nextReviews.data);
      console.log('Normalized reviews after save:', normalizedReviews);
      setReviews(normalizedReviews);
    } catch (error) {
      console.error('Failed to submit review:', error);
      showToast('error', 'Could not save review.');
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
  const specifications = (product.specifications || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const seoPath = getProductPath(product);
  const seoDescription = productDescription(product);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: product.name, path: seoPath },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 lg:py-20 pb-32 md:pb-20">
      <SEO
        title={`${product.name} | Papercues`}
        description={seoDescription}
        path={seoPath}
        image={product.image || '/logo.png'}
        type="product"
        jsonLd={[productSchema(product, seoPath), breadcrumbSchema(breadcrumbs)]}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/shop" className="hover:text-ink transition-colors">Shop</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] bg-cream/50 rounded-sm overflow-hidden relative group">
             <img src={displayImage} alt={`${product.name} premium aesthetic journal or notebook by Papercues`} fetchPriority="high" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
             
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
                  <img src={img} alt={`${product.name} product detail image ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
             <div className="flex items-center gap-3 mb-6">
               <span className="text-xl text-taupe line-through">{formatINR(product.price * 2)}</span>
               <span className="text-2xl text-ink font-medium">{formatINR(product.price)}</span>
               <span className="bg-red-500 text-white text-xs uppercase tracking-widest px-3 py-1 font-bold">50% OFF</span>
             </div>
             <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-taupe">
               <span>{product.averageRating > 0 ? `${product.averageRating.toFixed(1)} / 5` : 'No ratings yet'}</span>
               <span>{product.reviewCount || 0} reviews</span>
               <span className={product.stock > 0 ? 'text-green-700' : 'text-red-600'}>
                 {product.stock > 0 ? 'In stock' : 'Out of stock'}
               </span>
               <a href="#customer-reviews" className="basis-full sm:basis-auto text-ink underline underline-offset-4">
                 Write a review
               </a>
             </div>
             <p className="text-ink/80 leading-relaxed mb-8">
               {product.description || "A meticulously crafted daily journal featuring high-grade, acid-free 120gsm paper. The subtle 5mm dot grid provides structure without constraint, perfect for bullet journaling, sketching, or structured noting. Encased in a premium linen finish hard cover."}
             </p>
             <div className="mb-8">
               <label className="block text-sm uppercase tracking-widest text-taupe mb-3">Quantity</label>
               <div className="inline-flex items-center gap-4 border border-taupe/30 rounded-sm px-4 py-3">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink hover:text-taupe transition-colors">
                   <Minus className="w-5 h-5" />
                 </button>
                 <span className="w-6 text-center text-lg font-medium">{quantity}</span>
                 <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} className="text-ink hover:text-taupe transition-colors">
                   <Plus className="w-5 h-5" />
                 </button>
               </div>
             </div>

             <ShimmerButton 
              onClick={handleAddToCart} 
              disabled={product.stock <= 0} 
              loading={addingProductId === product.id}
              className="btn-primary w-full py-4 text-sm tracking-widest uppercase mb-4"
            >
              {addingProductId === product.id ? 'Adding...' : 'Buy Now'}
            </ShimmerButton>
             <p className="text-xs text-center text-taupe uppercase tracking-wider">Free shipping over ₹500</p>
          </div>
          
          {specifications.length > 0 && (
          <div className="space-y-6 mt-8 sm:mt-12 bg-cream/30 p-5 sm:p-8 rounded-sm">
             <div>
               <h4 className="font-serif text-lg text-ink mb-2">Specifications</h4>
               <ul className="text-sm text-ink/70 space-y-2">
                 {specifications.map((item) => (
                   <li key={item}>• {item}</li>
                 ))}
               </ul>
             </div>
          </div>
          )}

          <div id="customer-reviews" className="space-y-6 mt-8 scroll-mt-24 bg-paper border border-taupe/10 p-5 sm:p-8 rounded-sm">
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
                 
                 {/* Image Upload */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-ink uppercase tracking-wider">Add Photos (Optional)</label>
                   <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                     <input
                       type="file"
                       multiple
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="hidden"
                       id="review-images"
                     />
                     <label
                       htmlFor="review-images"
                       className="px-4 py-2 border border-taupe/30 rounded-sm cursor-pointer hover:border-ink transition-colors text-sm"
                     >
                       Choose Images
                     </label>
                     <span className="text-xs text-taupe">Up to 3 images, max 5MB each</span>
                   </div>
                   
                   {/* Image Previews */}
                   {imagePreviews.length > 0 && (
                     <div className="grid grid-cols-3 gap-2">
                       {imagePreviews.map((preview, index) => (
                         <div key={index} className="relative group">
                           <img
                             src={preview}
                             alt={`Review image ${index + 1}`}
                             className="w-full h-20 object-cover rounded-sm"
                           />
                           <button
                             type="button"
                             onClick={() => removeImage(index)}
                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
                 
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
             {!user && (
               <div className="space-y-3 border-t border-taupe/10 pt-5">
                 <p className="text-sm text-taupe">Sign in to write a review for this product.</p>
                 <Link to="/login" className="btn-secondary inline-flex w-full justify-center py-3 text-sm uppercase tracking-widest sm:w-auto sm:px-6">
                   Sign In to Review
                 </Link>
               </div>
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
                   <p className="text-sm text-ink/70 mb-3">{review.comment}</p>
                   
                   {review.images?.length > 0 && (
                     <div className="flex gap-2 mt-3 flex-wrap">
                       {review.images.slice(0, 3).map((image, index) => {
                         const imageUrl = getReviewImageUrl(image);

                         if (!imageUrl) return null;

                         return (
                           <button
                             key={index}
                             type="button"
                             className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/40"
                             onClick={() => window.open(imageUrl, '_blank', 'noopener,noreferrer')}
                           >
                             <img
                               src={imageUrl}
                               alt="review"
                               className="w-20 h-20 object-cover rounded-lg border border-taupe/20"
                               onError={(e) => {
                                 console.error('Review image failed to load:', imageUrl, image);
                                 e.target.style.display = 'none';
                               }}
                             />
                           </button>
                         );
                       })}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 border-t border-taupe/20 pt-12 sm:pt-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-ink">Related Products</h2>
            <Link to="/shop" className="text-sm border-b border-ink pb-1 uppercase tracking-widest hover:text-ink/70">
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-paper/95 backdrop-blur-md border-t border-taupe/20 z-40 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex gap-4 items-center max-w-md mx-auto">
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <p className="text-xs font-serif text-taupe truncate leading-tight mb-0.5">{product.name}</p>
            <p className="font-medium text-ink leading-tight">{formatINR(product.price * quantity)}</p>
          </div>
          <ShimmerButton 
            onClick={handleAddToCart} 
            disabled={product.stock <= 0} 
            loading={addingProductId === product.id}
            className="btn-primary py-3 px-6 text-sm tracking-widest uppercase flex-shrink-0"
          >
            {addingProductId === product.id ? 'Adding...' : 'Buy Now'}
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
