import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ink pb-8 pt-12 sm:pt-16 text-paper/80 border-t border-taupe/20 mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 sm:mb-16">
        <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 group text-paper">
            <img src="/logo.png" alt="Papercues logo" className="h-12 w-auto" />
          </Link>

          <p className="max-w-md mt-4 text-sm leading-loose">
            Crafting premium, minimalist journals and notebooks for the modern writer.
            Designed to elevate your everyday thoughts into art.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-paper transition-colors duration-300"><Camera className="w-5 h-5" /></a>
            <a href="#" className="hover:text-paper transition-colors duration-300"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="hover:text-paper transition-colors duration-300"><Mail className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-paper tracking-widest uppercase mb-6">Shop</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/shop" className="hover:text-paper transition-colors">All Journals</Link></li>
            <li><Link to="/shop" className="hover:text-paper transition-colors">Dotted Notebooks</Link></li>
            <li><Link to="/shop" className="hover:text-paper transition-colors">Planners</Link></li>
            <li><Link to="/shop" className="hover:text-paper transition-colors">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-paper tracking-widest uppercase mb-6">Info</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/about" className="hover:text-paper transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-paper transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-paper transition-colors">Shipping Returns</a></li>
            <li><a href="#" className="hover:text-paper transition-colors">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 border-t border-paper/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-xs tracking-wider gap-4">
        <p>&copy; {new Date().getFullYear()} AESTHETIC DIARIES. ALL RIGHTS RESERVED.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:text-paper transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-paper transition-colors">TERMS OF SERVICE</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
