import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Minus, Plus, ShoppingCart } from 'lucide-react';
import { getProductPath, productImageAlt } from '../utils/seo';
import { createProductCardUrgency } from '../utils/urgency';
import ShimmerButton from './ShimmerButton';
import UrgencyBadge from './UrgencyBadge';

const ProductCard = ({
  id,
  name,
  price,
  discountPrice,
  image,
  isNew = false,
  stock = 0,
  onAddToCart,
  onQuantityChange,
  onQuickView,
  addingToCart = false,
  cartQuantity = 0
}) => {
  const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
  const effectivePrice = discountPrice || price;
  const originalPrice = discountPrice ? price : price * 2;
  const discountPercentage = originalPrice > effectivePrice
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;
  const isOutOfStock = stock <= 0;
  const isSellingFast = stock > 0 && stock <= 8;
  const [urgency] = useState(() => createProductCardUrgency());

  return (
    <div className="group flex flex-col">
      <Link to={getProductPath({ id, name })} className="cursor-pointer">
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-sm bg-cream/50">
          {isNew && (
            <span className="absolute left-4 top-4 z-10 bg-paper/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">
              New
            </span>
          )}

          {discountPercentage > 0 && (
            <span className="absolute right-4 top-4 z-10 bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              {discountPercentage}% OFF
            </span>
          )}

          <UrgencyBadge
            message={isOutOfStock ? 'Out of stock' : isSellingFast ? 'Selling fast' : urgency.message}
            className="absolute bottom-4 left-4 right-4 z-20 sm:right-auto"
          />

          <div className="absolute inset-0 z-10 bg-black/5 transition-colors group-hover:bg-black/10" />
          <img
            src={image}
            alt={productImageAlt({ name })}
            loading="lazy"
            decoding="async"
            width="640"
            height="800"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <h3 className="mb-1 font-serif text-lg tracking-wide text-ink transition-colors group-hover:text-taupe">
          {name}
        </h3>
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {discountPercentage > 0 && (
              <span className="text-sm text-taupe line-through">{formatINR(originalPrice)}</span>
            )}
            <span className="text-sm font-medium text-ink">{formatINR(effectivePrice)}</span>
          </div>
          <span className={`text-[11px] uppercase tracking-widest ${isOutOfStock ? 'text-red-700' : isSellingFast ? 'text-orange-700' : 'text-green-700'}`}>
            {isOutOfStock ? 'Sold out' : isSellingFast ? 'Selling fast' : 'In stock'}
          </span>
        </div>

        <p className="text-xs uppercase tracking-widest text-orange-700">{urgency.hook}</p>

        <div className="mt-auto space-y-2 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between border border-taupe/30 bg-paper">
              <button
                type="button"
                onClick={() => onQuantityChange?.(id, Math.max(1, cartQuantity - 1))}
                disabled={addingToCart || cartQuantity <= 1}
                className="flex h-11 w-12 items-center justify-center text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-taupe/50"
                title="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-ink">{cartQuantity}</span>
              <button
                type="button"
                onClick={() => onQuantityChange?.(id, cartQuantity + 1)}
                disabled={addingToCart || cartQuantity >= stock}
                className="flex h-11 w-12 items-center justify-center text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-taupe/50"
                title="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            onAddToCart && (
              <ShimmerButton
                type="button"
                onClick={() => onAddToCart({ id, name, stock })}
                disabled={addingToCart || isOutOfStock}
                loading={addingToCart}
                className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-xs uppercase tracking-widest text-paper transition-colors hover:bg-taupe disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? 'Sold Out' : addingToCart ? 'Adding...' : 'Add to Cart'}
              </ShimmerButton>
            )
          )}

          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(id)}
              className="flex w-full items-center justify-center gap-2 border border-taupe/30 bg-paper px-4 py-3 text-xs uppercase tracking-widest text-ink transition-colors hover:bg-cream"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
