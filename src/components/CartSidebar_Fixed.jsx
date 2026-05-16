import { X, Plus, Minus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import FreeShippingBanner from './FreeShippingBanner';
import ShimmerButton from './ShimmerButton';

const getEffectiveProductPrice = (product) => {
  if (!product) return 0;
  return product.isPack || product.name?.toLowerCase().includes('combo') ? 499 : product.price;
};

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, checkout, clearCartAfterPayment, totalPrice, shippingCharge, totalAmount, totalItems, cartMessage, setCartMessage, shippingSettings } = useCart();
  const { user, login, register } = useAuth();

  // Guard against undefined shipping settings
  if (!shippingSettings) {
    console.warn('[Cart Warning] Shipping settings not available, cart may not display correctly');
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-paper rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-taupe/20">
            <h2 className="font-serif text-xl text-ink">Your Cart</h2>
            <button onClick={onClose} className="text-taupe hover:text-ink transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-taupe text-center">Loading shipping information...</p>
          </div>
        </div>
      </div>
    );
  }
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isAuthStep, setIsAuthStep] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authDetails, setAuthDetails] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState({ type: '', text: '' });
  const [previousAddress, setPreviousAddress] = useState(null);
  const [usePreviousAddress, setUsePreviousAddress] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    landmark: '',
    pincode: '',
    deliveryAddress: ''
  });
  const [showFreeShippingBanner, setShowFreeShippingBanner] = useState(true);
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;
  const [policyAgreed, setPolicyAgreed] = useState(false);

  // Calculate original prices (double the current price for 50% discount)

  // Debug shipping calculation
  console.log('[Cart Debug] totalPrice:', totalPrice, 'freeShippingAmount:', shippingSettings?.freeShippingAmount, 'should be free:', totalPrice >= 650 || totalPrice >= (shippingSettings?.freeShippingAmount ?? 500));

  const resetCheckout = () => {
    setIsCheckoutStep(false);
    setIsAuthStep(false);
    setAuthMode('login');
    setAuthError('');
    setAuthLoading(false);
    setCheckoutMessage({ type: '', text: '' });
    setPreviousAddress(null);
    setUsePreviousAddress(false);
  };

  useEffect(() => {
    if (isCheckoutStep && user && !addressLoading) {
      setAddressLoading(true);
      axiosInstance.get('/orders')
        .then(res => {
          if (res.data && res.data.length > 0) {
            const lastOrder = res.data.find(o => o.addressLine1);
            if (lastOrder) {
              setPreviousAddress({
                fullName: lastOrder.fullName || '',
                phoneNumber: lastOrder.phoneNumber || '',
                alternatePhoneNumber: lastOrder.alternatePhoneNumber || '',
                addressLine1: lastOrder.addressLine1 || '',
                addressLine2: lastOrder.addressLine2 || '',
                city: lastOrder.city || '',
                state: lastOrder.state || '',
                landmark: lastOrder.landmark || '',
                pincode: lastOrder.pincode || '',
                deliveryAddress: lastOrder.deliveryAddress || ''
              });
              setUsePreviousAddress(true);
            }
          }
        })
        .catch(console.error)
        .finally(() => setAddressLoading(false));
    }
  }, [isCheckoutStep, user, addressLoading]);

  const handleInlineAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const success = authMode === 'login'
      ? await login(authDetails.email, authDetails.password, { redirect: false })
      : await register(authDetails.username, authDetails.email, authDetails.password);

    if (success && authMode === 'register') {
      const loginSuccess = await login(authDetails.email, authDetails.password, { redirect: false });
      if (!loginSuccess) {
        setAuthError('Account created. Please sign in to continue checkout.');
        setAuthMode('login');
        setAuthLoading(false);
        return;
      }
    }

    setAuthLoading(false);

    if (!success) {
      setAuthError(authMode === 'login' ? 'Invalid email or password.' : 'Registration failed. Email might be in use.');
      return;
    }

    setIsAuthStep(false);
    setIsCheckoutStep(true);
  };

  const title = isAuthStep
    ? authMode === 'login' ? 'Sign In' : 'Create Account'
    : isCheckoutStep ? 'Shipping Details' : 'Your Cart';

  return createPortal(
    <>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 transition-opacity"
            onClick={onClose}
          />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-paper shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-taupe/20">
              <h2 className="font-serif text-xl sm:text-2xl text-ink">
                {title}
              </h2>
              <button onClick={() => {
                onClose();
                setTimeout(resetCheckout, 300); // reset after slide animation
              }} className="p-2 text-ink/60 hover:text-ink transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Free Shipping Banner for 3+ books */}
              {showFreeShippingBanner && !isCheckoutStep && !isAuthStep && (
                <div className="mb-6">
                  <FreeShippingBanner compact={true} />
                </div>
              )}
              
              {(cartMessage || checkoutMessage.text) && (
                <div className={`text-sm p-3 rounded-sm border ${
                  checkoutMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {checkoutMessage.text || cartMessage}
                </div>
              )}

              {isAuthStep ? (
                <div className="space-y-6">
                  <div className="bg-cream/30 border border-taupe/10 p-4 rounded-sm">
                    <p className="text-sm text-ink/80 leading-relaxed">
                      Sign in or create an account here to finish checkout without leaving your cart.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 rounded-sm border border-taupe/20 overflow-hidden">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`p-4 text-center transition-colors ${
                        authMode === 'login' 
                          ? 'bg-ink text-paper' 
                          : 'bg-paper text-ink hover:bg-cream'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthMode('register')}
                      className={`p-4 text-center transition-colors ${
                        authMode === 'register' 
                          ? 'bg-ink text-paper' 
                          : 'bg-paper text-ink hover:bg-cream'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  <form onSubmit={handleInlineAuth} className="space-y-4">
                    <div className="space-y-2">
                      {authMode === 'register' && (
                        <div>
                          <label className="block text-sm font-medium text-ink mb-1">Username</label>
                          <input
                            type="text"
                            value={authDetails.username}
                            onChange={(e) => setAuthDetails(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                            placeholder="Choose a username"
                            required
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Email</label>
                        <input
                          type="email"
                          value={authDetails.email}
                          onChange={(e) => setAuthDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={authDetails.password}
                            onChange={(e) => setAuthDetails(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50 pr-10"
                            placeholder="•••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-ink transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {authError && (
                      <div className="bg-red-50 border border-red-100 text-sm p-3 rounded-sm">
                        <p className="text-red-700">{authError}</p>
                      </div>
                    )}
                    
                    <ShimmerButton
                      type="submit"
                      loading={authLoading}
                      disabled={authLoading}
                      className="btn-primary w-full py-3"
                    >
                      {authLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                    </ShimmerButton>
                  </form>
                </div>
              ) : isCheckoutStep ? (
                <div className="space-y-6">
                  <div className="bg-cream/30 border border-taupe/10 p-4 rounded-sm">
                    <p className="text-sm text-ink/80 leading-relaxed">
                      Enter your shipping details to complete the order.
                    </p>
                  </div>

                  {addressLoading && (
                    <div className="text-center py-8">
                      <p className="text-taupe">Loading previous addresses...</p>
                    </div>
                  )}

                  {previousAddress && (
                    <div className="bg-green-50 border border-green-100 p-3 rounded-sm mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={usePreviousAddress}
                          onChange={(e) => setUsePreviousAddress(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-green-800">Use previous shipping address</span>
                      </label>
                    </div>
                  )}

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.fullName : shippingDetails.fullName}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={usePreviousAddress ? previousAddress.phoneNumber : shippingDetails.phoneNumber}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Alternate Phone</label>
                        <input
                          type="tel"
                          value={usePreviousAddress ? previousAddress.alternatePhoneNumber : shippingDetails.alternatePhoneNumber}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, alternatePhoneNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">Address Line 1 *</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.addressLine1 : shippingDetails.addressLine1}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, addressLine1: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="123, Main Street"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.addressLine2 : shippingDetails.addressLine2}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, addressLine2: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="Apt 4B"
                        />
                      </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">City *</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.city : shippingDetails.city}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">State *</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.state : shippingDetails.state}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">PIN Code *</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.pincode : shippingDetails.pincode}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, pincode: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="400001"
                          required
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Landmark</label>
                        <input
                          type="text"
                          value={usePreviousAddress ? previousAddress.landmark : shippingDetails.landmark}
                          onChange={(e) => setShippingDetails(prev => ({ ...prev, landmark: e.target.value }))}
                          className="w-full px-3 py-2 border border-taupe/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-taupe/50"
                          placeholder="Near Railway Station"
                        />
                      </div>
                  </form>
                </div>
              ) : (
                <>
                  {cart?.items?.length > 0 ? (
                    cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border-b border-taupe/20">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img 
                            src={item.product.image} 
                            alt={`${item.product.name} premium aesthetic journal by Papercues India`}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif text-base text-ink mb-1">{item.product.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-taupe hover:text-ink transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-taupe mt-1">{formatINR(getEffectiveProductPrice(item.product))}</p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-5 border border-taupe/30 rounded-full px-4 py-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                                  className="text-ink hover:text-taupe transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center text-base font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                  className="text-ink hover:text-taupe transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            <div className="text-right">
                              <p className="text-xs text-taupe line-through">{formatINR(getEffectiveProductPrice(item.product) * item.quantity * 2)}</p>
                              <p className="font-medium text-ink">{formatINR(getEffectiveProductPrice(item.product) * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-taupe mb-4">Your cart is empty</p>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="btn-secondary px-6 py-3 text-sm uppercase tracking-widest"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}

                  {/* Cart Message */}
                  {cartMessage && (
                    <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-sm text-red-800">{cartMessage}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {(cart?.items?.length > 0 || isCheckoutStep) && !isAuthStep && (
              <div className="p-4 sm:p-6 border-t border-taupe/20 bg-cream/30">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-taupe">Original Price</span>
                  <span className="text-taupe line-through">{formatINR(totalOriginalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-green-600 font-medium">You Saved</span>
                  <span className="text-green-600 font-medium">{formatINR(totalSavings)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span>Subtotal</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-taupe">Shipping</span>
                  <span className={shippingCharge === 0 ? "text-green-600 font-medium" : "text-taupe"}>
                    {shippingCharge === 0 ? "FREE" : formatINR(shippingCharge)}
                  </span>
                </div>
                {shippingCharge > 0 && shippingSettings?.enabled && (
                  <p className="text-xs text-taupe uppercase tracking-wider text-center mb-4">
                    {shippingSettings?.freeShippingType === 'quantity' 
                      ? `Add ${Math.max(0, (shippingSettings?.freeShippingThreshold ?? 3) - totalItems)} more ${(shippingSettings?.freeShippingThreshold ?? 3) - totalItems === 1 ? 'item' : 'items'} for FREE shipping`
                      : `Add ₹${Math.max(0, Math.min((shippingSettings?.freeShippingAmount ?? 500), 650) - totalPrice).toFixed(2)} more for FREE shipping`
                    }
                  </p>
                )}
                <div className="flex justify-between items-center mb-6 text-lg">
                  <span>Total</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
                
                {isCheckoutStep && (
                  <div className="mb-6">
                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={policyAgreed}
                        onChange={(e) => setPolicyAgreed(e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <span className="text-ink/80 leading-relaxed">
                        By placing this order, you agree to our{' '}
                        <Link to="/shipping-policy" className="text-ink underline underline-offset-4 hover:text-ink/80" target="_blank">
                          shipping policy
                        </Link>
                        {' '}and{' '}
                        <Link to="/returns-policy" className="text-ink underline underline-offset-4 hover:text-ink/80" target="_blank">
                          no-return policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                )}
                
                <ShimmerButton 
                  loading={isProcessingCheckout}
                  onClick={async () => {
                    setCartMessage('');
                    setCheckoutMessage({ type: '', text: '' });
                    if (!isCheckoutStep) {
                      if (user) {
                        setIsCheckoutStep(true);
                      } else {
                        setIsAuthStep(true);
                      }
                    } else {
                      if (!usePreviousAddress) {
                        if (!shippingDetails.fullName || !shippingDetails.phoneNumber || !shippingDetails.addressLine1 || !shippingDetails.city || !shippingDetails.state || !shippingDetails.pincode) {
                          setCheckoutMessage({ type: 'error', text: 'Please fill all required shipping fields.' });
                          return;
                        }
                      }
                      
                      if (!policyAgreed) {
                        setCheckoutMessage({ type: 'error', text: 'Please agree to our shipping and returns policy to continue.' });
                        return;
                      }
                      
                      setIsProcessingCheckout(true);
                      const finalShippingDetails = usePreviousAddress ? previousAddress : shippingDetails;
                      const result = await checkout(finalShippingDetails);
                      setIsProcessingCheckout(false);
                      
                      if (result.success) {
                        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
                        console.log('Razorpay Key Check:', razorpayKey ? 'Found' : 'Missing');
                        
                        if (!razorpayKey) {
                          setCheckoutMessage({ type: 'error', text: 'Frontend Payment configuration missing.' });
                          return;
                        }

                        const razorpayOptions = {
                          key: razorpayKey,
                          amount: result.amount * 100, // paise
                          currency: result.currency,
                          name: 'Note E-Commerce',
                          description: 'Order Payment',
                          order_id: result.razorpayOrderId,
                          handler: async function (response) {
                            try {
                              const verification = await axiosInstance.post('/orders/verify-payment', {
                                cartId: result.cartId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                shippingDetails: finalShippingDetails
                              });
                              const verifiedOrderId = verification.data.orderId;
                              await clearCartAfterPayment();
                              
                              setCheckoutMessage({ type: 'success', text: 'Payment successful! Order placed.' });
                              setTimeout(() => {
                                onClose();
                                navigate(`/order-success/${verifiedOrderId}`);
                                setTimeout(() => {
                                  setIsCheckoutStep(false);
                                  setShippingDetails({ fullName: '', phoneNumber: '', alternatePhoneNumber: '', addressLine1: '', addressLine2: '', city: '', state: '', deliveryAddress: '', landmark: '', pincode: '' });
                                }, 300);
                              }, 1500);
                            } catch (err) {
                              setCheckoutMessage({ type: 'error', text: 'Payment verification failed. Please contact support.' });
                              setTimeout(() => {
                                onClose();
                                navigate('/payment-failed');
                              }, 2000);
                            }
                          },
                          prefill: {
                            name: finalShippingDetails.fullName,
                            contact: finalShippingDetails.phoneNumber,
                            email: user?.email || ''
                          },
                          theme: {
                            color: '#1a1a1a' // ink color
                          },
                          modal: {
                            ondismiss: function () {
                              onClose();
                              navigate('/payment-failed');
                            }
                          }
                        };
                        const razorpay = new window.Razorpay(razorpayOptions);
                        razorpay.open();
                      } else {
                        setCheckoutMessage({ type: 'error', text: result.message || 'Checkout failed.' });
                      }
                    }}
                    className="btn-primary w-full py-4 uppercase tracking-widest text-sm"
                  >
                    {isProcessingCheckout ? 'Processing...' : (isCheckoutStep ? 'Confirm Order' : 'Checkout')}
                  </ShimmerButton>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CartSidebar;
