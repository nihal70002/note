import { Link } from 'react-router-dom';
import { getProductPath } from '../utils/seo';

const ProductCard = ({ id, name, price, image, isNew = false, onAddToCart, addingToCart = false }) => {
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;
  return (
    <div className="group flex flex-col">
      <Link to={getProductPath({ id, name })} className="cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream/50 mb-4 rounded-sm">
          {isNew && (
            <span className="absolute top-4 left-4 z-10 bg-paper/90 text-ink text-xs uppercase tracking-widest px-3 py-1 font-bold">
              New
            </span>
          )}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors z-10" />
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <h3 className="font-serif text-lg text-ink tracking-wide mb-1 group-hover:text-taupe transition-colors">{name}</h3>
      </Link>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ink/70">{formatINR(price)}</p>
        {onAddToCart && (
          <button
            type="button"
            onClick={() => onAddToCart({ id, name })}
            disabled={addingToCart}
            className="w-full bg-ink text-paper py-3 px-4 text-xs uppercase tracking-widest hover:bg-taupe transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
