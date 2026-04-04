import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, price, image, isNew = false }) => {
  return (
    <Link to={`/shop/${id}`} className="group flex flex-col cursor-pointer">
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
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      <h3 className="font-serif text-lg text-ink tracking-wide mb-1 group-hover:text-taupe transition-colors">{name}</h3>
      <p className="text-sm text-ink/70">${price.toFixed(2)}</p>
    </Link>
  );
};

export default ProductCard;
