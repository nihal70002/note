import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const ProductCard = ({ id, name, price, image, isNew = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Tilt 
        className="group flex flex-col block cursor-pointer"
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.3}
        scale={1.02}
        transitionSpeed={1500}
      >
        <Link to={`/shop/${id}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/50 mb-4 rounded-md shadow-2xl shadow-black/40 border border-taupe/20">
            {isNew && (
              <span className="absolute top-4 left-4 z-10 bg-taupe text-paper text-xs uppercase tracking-widest px-3 py-1 font-bold rounded-sm shadow-lg">
                Spell Bound
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-multiply" />
            <img 
              src={image} 
              alt={name} 
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
          </div>
          <h3 className="font-serif text-xl text-ink tracking-wide mb-1 group-hover:text-taupe transition-colors duration-300 drop-shadow-md">{name}</h3>
          <p className="text-sm text-ink/70 font-semibold tracking-wider">${price.toFixed(2)}</p>
        </Link>
      </Tilt>
    </motion.div>
  );
};

export default ProductCard;
