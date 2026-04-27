import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Feather, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-header py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Feather className="w-6 h-6 text-ink group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-serif font-semibold text-lg sm:text-xl tracking-wider">PAPERCUES</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link text-sm uppercase tracking-widest ${location.pathname === link.path ? 'font-semibold text-ink' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4 mr-4 border-r border-ink/20 pr-4">
              <Link to="/profile" className="text-sm font-medium text-ink hover:text-taupe transition-colors">Hi, {user.username}</Link>
              {user.role === 'Admin' && (
                <Link to="/admin" className="text-sm text-taupe hover:text-ink transition-colors">Admin</Link>
              )}
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 mr-4 border-r border-ink/20 pr-4">
              <Link to="/login" className="text-sm uppercase tracking-widest text-ink hover:text-taupe transition-colors">Login</Link>
            </div>
          )}

          <button 
            className="relative p-2 text-ink hover:opacity-70 transition-opacity"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-taupe text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <button 
            className="md:hidden p-2 text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-paper border-b border-taupe/10 glass-header p-5 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg uppercase tracking-wider text-ink border-b border-taupe/10 pb-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-taupe/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest text-ink">
                  Hi, {user.username}
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest text-taupe">
                    Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-sm uppercase tracking-widest text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-widest text-ink">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
