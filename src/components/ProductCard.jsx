import { memo } from 'react';
import { Link } from 'react-router-dom';
import { getProductPath, productImageAlt } from '../utils/seo';
import ShimmerButton from './ShimmerButton';

const ProductCard = ({ id, name, price, image, isNew = false, onAddToCart, addingToCart = false }) => {
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;
  const originalPrice = price * 2; // Original price is double the current price (50% discount)
  const discountPercentage = 50;
  
  return (
    <div className="group flex flex-col">
      <Link to={getProductPath({ id, name })} className="cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream/50 mb-4 rounded-sm">
          {isNew && (
            <span className="absolute top-4 left-4 z-10 bg-paper/90 text-ink text-xs uppercase tracking-widest px-3 py-1 font-bold">
              New
            </span>
          )}
          {/* Discount badge */}
          <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs uppercase tracking-widest px-3 py-1 font-bold">
            {discountPercentage}% OFF
          </span>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors z-10" />
          <img 
            src={image} 
            alt={productImageAlt({ name })}
            loading="lazy"
            decoding="async"
            width="640"
            height="800"
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <h3 className="font-serif text-lg text-ink tracking-wide mb-1 group-hover:text-taupe transition-colors">{name}</h3>
      </Link>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-taupe line-through">{formatINR(originalPrice)}</span>
          <span className="text-sm text-ink font-medium">{formatINR(price)}</span>
        </div>
        {onAddToCart && (
          <ShimmerButton
            type="button"
            onClick={() => onAddToCart({ id, name })}
            disabled={addingToCart}
            loading={addingToCart}
            className="w-full bg-ink text-paper py-3 px-4 text-xs uppercase tracking-widest hover:bg-taupe transition-colors"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </ShimmerButton>
        )}
      </div>
    </div>
  );
};

export default memo(ProductCard);
