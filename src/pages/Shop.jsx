import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import axiosInstance from '../api/axios';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ShimmerButton from '../components/ShimmerButton';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [addingProductId, setAddingProductId] = useState('');
  const [quickViewProductId, setQuickViewProductId] = useState('');
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
  const quickViewProduct = products.find((product) => product.id === quickViewProductId);
  const quickViewImages = quickViewProduct
    ? [quickViewProduct.image, quickViewProduct.image2, quickViewProduct.image3, quickViewProduct.image4, quickViewProduct.image5].filter(Boolean)
    : [];

  const getCartItem = (productId) => cart?.items?.find((item) => item.productId === productId);

  const handleAddToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('error', 'This product is out of stock.');
      return;
    }

    setAddingProductId(product.id);
    const result = await addToCart(product.id, quantity);
    setAddingProductId('');

    if (result.success) {
      showToast('success', `${product.name} added to cart.`);
      setQuickViewProductId('');
      setQuickViewQuantity(1);
    } else {
      showToast('error', result.message || 'Could not add item to cart.');
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    const item = getCartItem(productId);
    if (!item) return;

    setAddingProductId(productId);
    const result = await updateQuantity(item.id, quantity);
    setAddingProductId('');

    if (!result.success) {
      showToast('error', result.message || 'Could not update quantity.');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category !== 'All') params.set('category', category);
    if (sort) params.set('sort', sort);

    axiosInstance.get(`/products?${params.toString()}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [search, category, sort]);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <SEO
        title="Buy Premium Journals Online India | Free Shipping Above ₹500 | Papercues"
        description="Shop premium journals and notebooks online in India. Buy aesthetic journals with 120gsm acid-free paper, free shipping above ₹500, and 7-day returns. Order now for fast delivery."
        path="/shop"
        image="/logo.png"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe/20 pb-8 mb-10 sm:mb-12">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink mb-4">Buy Premium Journals Online</h1>
          <p className="text-ink/70 max-w-lg">Shop premium journals with free shipping across India. Quality notebooks with 120gsm acid-free paper, perfect for bullet journaling and creative planning.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search journals..."
            className="w-full sm:w-56 border-b border-taupe/30 bg-transparent py-2 text-sm focus:outline-none focus:border-ink"
          />
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <label className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-taupe transition-colors">
            Sort <ChevronDown className="w-4 h-4" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent focus:outline-none">
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price-asc">Price Low</option>
              <option value="price-desc">Price High</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-10 sm:mb-12 flex flex-wrap gap-3 sm:gap-4 animate-in slide-in-from-top-4 duration-300">
          {['All', 'Journals', 'Planners', 'Premium', 'Pocket', 'Creative'].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`btn-secondary text-sm ${category === item ? 'border-taupe bg-taupe text-paper' : 'border-taupe/40 hover:border-taupe'}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-16">
        {loading ? (
          <p className="col-span-full text-center text-taupe py-12">Loading collection...</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              cartQuantity={getCartItem(product.id)?.quantity || 0}
              addingToCart={addingProductId === product.id}
              onAddToCart={() => handleAddToCart(product)}
              onQuantityChange={handleQuantityChange}
              onQuickView={(productId) => {
                setQuickViewProductId(productId);
                setQuickViewQuantity(getCartItem(productId)?.quantity || 1);
              }}
            />
          ))
        )}
      </div>

      {quickViewProduct && (
        <div className="fixed inset-0 z-[150] flex items-end bg-ink/40 backdrop-blur-sm sm:items-center sm:justify-center">
          <button
            type="button"
            aria-label="Close quick view"
            className="absolute inset-0 cursor-default"
            onClick={() => setQuickViewProductId('')}
          />
          <div className="relative max-h-[92vh] w-full overflow-y-auto bg-paper p-5 shadow-2xl sm:max-w-3xl sm:p-6">
            <button
              type="button"
              onClick={() => setQuickViewProductId('')}
              className="absolute right-4 top-4 z-10 rounded-full bg-paper/90 p-2 text-ink shadow-sm transition-colors hover:bg-cream"
              aria-label="Close quick view"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-6 sm:grid-cols-[1fr_0.9fr]">
              <div className="space-y-3">
                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-cream">
                  <img
                    src={quickViewImages[0] || '/product.png'}
                    alt={quickViewProduct.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {quickViewImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {quickViewImages.slice(1, 5).map((image) => (
                      <div key={image} className="aspect-square overflow-hidden rounded-sm bg-cream">
                        <img src={image} alt={quickViewProduct.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="mb-3 text-xs uppercase tracking-widest text-taupe">{quickViewProduct.category}</p>
                <h2 className="font-serif text-2xl text-ink sm:text-3xl">{quickViewProduct.name}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-taupe line-through">{formatINR((quickViewProduct.discountPrice ? quickViewProduct.price : quickViewProduct.price * 2))}</span>
                  <span className="text-lg font-medium text-ink">{formatINR(quickViewProduct.discountPrice || quickViewProduct.price)}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/70">
                  {quickViewProduct.description || 'Premium Papercues notebook crafted for everyday notes, planning, and creative journaling.'}
                </p>
                <p className={`mt-4 text-xs uppercase tracking-widest ${quickViewProduct.stock <= 0 ? 'text-red-700' : quickViewProduct.stock <= 8 ? 'text-orange-700' : 'text-green-700'}`}>
                  {quickViewProduct.stock <= 0 ? 'Sold out' : quickViewProduct.stock <= 8 ? 'Selling fast' : 'In stock'}
                </p>

                <div className="mt-6 flex items-center justify-between border border-taupe/30">
                  <button
                    type="button"
                    onClick={() => setQuickViewQuantity((value) => Math.max(1, value - 1))}
                    className="flex h-12 w-14 items-center justify-center text-ink transition-colors hover:bg-cream"
                    disabled={quickViewQuantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-ink">{quickViewQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuickViewQuantity((value) => Math.min(quickViewProduct.stock, value + 1))}
                    className="flex h-12 w-14 items-center justify-center text-ink transition-colors hover:bg-cream"
                    disabled={quickViewQuantity >= quickViewProduct.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <ShimmerButton
                  type="button"
                  loading={addingProductId === quickViewProduct.id}
                  disabled={addingProductId === quickViewProduct.id || quickViewProduct.stock <= 0}
                  onClick={() => handleAddToCart(quickViewProduct, quickViewQuantity)}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-ink px-4 py-4 text-sm uppercase tracking-widest text-paper transition-colors hover:bg-taupe disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {quickViewProduct.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                </ShimmerButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
