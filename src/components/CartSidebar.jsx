import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPortal } from 'react-dom';
import axiosInstance from '../api/axios';
import { useState } from 'react';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, checkout, totalPrice, cartMessage, setCartMessage } = useCart();
  const { user, login, register } = useAuth();
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isAuthStep, setIsAuthStep] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authDetails, setAuthDetails] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState({ type: '', text: '' });
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
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  if (!isOpen) return null;

  const resetCheckout = () => {
    setIsCheckoutStep(false);
    setIsAuthStep(false);
    setAuthMode('login');
    setAuthError('');
    setAuthLoading(false);
    setCouponCode('');
    setCheckoutMessage({ type: '', text: '' });
  };

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
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`py-3 text-xs uppercase tracking-widest ${authMode === 'login' ? 'bg-ink text-paper' : 'text-taupe hover:bg-cream/40'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className={`py-3 text-xs uppercase tracking-widest ${authMode === 'register' ? 'bg-ink text-paper' : 'text-taupe hover:bg-cream/40'}`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleInlineAuth} className="space-y-4">
                {authError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-sm">
                    {authError}
                  </div>
                )}

                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={authDetails.username}
                      onChange={(e) => setAuthDetails({ ...authDetails, username: e.target.value })}
                      className="w-full px-4 py-3 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authDetails.email}
                    onChange={(e) => setAuthDetails({ ...authDetails, email: e.target.value })}
                    className="w-full px-4 py-3 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={authDetails.password}
                    onChange={(e) => setAuthDetails({ ...authDetails, password: e.target.value })}
                    className="w-full px-4 py-3 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-primary w-full py-4 uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => { setIsAuthStep(false); setAuthError(''); }}
                  className="w-full py-2 text-sm text-taupe hover:text-ink underline uppercase tracking-widest"
                >
                  Back to Cart
                </button>
              </form>
            </div>
          ) : isCheckoutStep ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" value={shippingDetails.fullName} onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" value={shippingDetails.phoneNumber} onChange={(e) => setShippingDetails({...shippingDetails, phoneNumber: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Alternative Phone</label>
                <input type="text" value={shippingDetails.alternatePhoneNumber} onChange={(e) => setShippingDetails({...shippingDetails, alternatePhoneNumber: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Address Line 1</label>
                <input type="text" value={shippingDetails.addressLine1} onChange={(e) => setShippingDetails({...shippingDetails, addressLine1: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Address Line 2 (Optional)</label>
                <input type="text" value={shippingDetails.addressLine2} onChange={(e) => setShippingDetails({...shippingDetails, addressLine2: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">City</label>
                <input type="text" value={shippingDetails.city} onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">State</label>
                <input type="text" value={shippingDetails.state} onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Pincode</label>
                <input type="text" value={shippingDetails.pincode} onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Landmark (Optional)</label>
                <input type="text" value={shippingDetails.landmark} onChange={(e) => setShippingDetails({...shippingDetails, landmark: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Coupon Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                />
              </div>
              <button 
                onClick={() => setIsCheckoutStep(false)}
                className="w-full py-2 text-sm text-taupe hover:text-ink underline uppercase tracking-widest mt-4"
              >
                Back to Cart
              </button>
            </div>
          ) : (
            (!cart?.items || cart.items.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-taupe space-y-4">
                <p>Your cart is empty.</p>
                <button onClick={onClose} className="btn-secondary px-6">Continue Shopping</button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4">
                  <div className="w-20 h-28 sm:w-24 sm:h-32 bg-cream/50 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.product?.image || "/product.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-base sm:text-lg text-ink line-clamp-2">{item.product?.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-taupe hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-taupe mt-1">{formatINR(item.product?.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border border-taupe/30 rounded-full px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                          className="text-ink hover:text-taupe"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="text-ink hover:text-taupe"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-medium text-ink">{formatINR(item.product?.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length > 0 && !isAuthStep && (
          <div className="p-4 sm:p-6 border-t border-taupe/20 bg-cream/30">
            <div className="flex justify-between items-center mb-6 text-lg font-serif">
              <span>Subtotal</span>
              <span>{formatINR(totalPrice)}</span>
            </div>
            <p className="text-xs text-taupe uppercase tracking-wider text-center mb-4">
              Shipping & taxes calculated at checkout
            </p>
            <button 
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
                  if (!shippingDetails.fullName || !shippingDetails.phoneNumber || !shippingDetails.addressLine1 || !shippingDetails.city || !shippingDetails.state || !shippingDetails.pincode) {
                    setCheckoutMessage({ type: 'error', text: 'Please fill all required shipping fields.' });
                    return;
                  }
                  const result = await checkout({ ...shippingDetails, couponCode });
                  if (result.success) {
                    const options = {
                      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                      amount: result.amount * 100, // paise
                      currency: result.currency,
                      name: 'Note E-Commerce',
                      description: 'Order Payment',
                      order_id: result.razorpayOrderId,
                      handler: async function (response) {
                        try {
                          await axiosInstance.post('/orders/verify-payment', {
                            orderId: result.orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                          });
                          
                          setCheckoutMessage({ type: 'success', text: 'Payment successful! Order placed.' });
                          setTimeout(() => {
                            onClose();
                            setTimeout(() => {
                              setIsCheckoutStep(false);
                              setCouponCode('');
                              setShippingDetails({ fullName: '', phoneNumber: '', alternatePhoneNumber: '', addressLine1: '', addressLine2: '', city: '', state: '', deliveryAddress: '', landmark: '', pincode: '' });
                            }, 300);
                          }, 2000);
                        } catch (err) {
                          setCheckoutMessage({ type: 'error', text: 'Payment verification failed. Please contact support.' });
                        }
                      },
                      prefill: {
                        name: shippingDetails.fullName,
                        contact: shippingDetails.phoneNumber,
                        email: user?.email || ''
                      },
                      theme: {
                        color: '#1a1a1a' // ink color
                      },
                      modal: {
                        ondismiss: function () {
                          setCheckoutMessage({ type: 'error', text: 'Payment cancelled. Order is pending.' });
                        }
                      }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                      setCheckoutMessage({ type: 'error', text: response.error.description || 'Payment failed.' });
                    });
                    rzp.open();

                  } else {
                    setCheckoutMessage({ type: 'error', text: result.message || 'Checkout failed.' });
                  }
                }
              }}
              className="btn-primary w-full py-4 uppercase tracking-widest text-sm"
            >
              {isCheckoutStep ? 'Confirm Order' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartSidebar;
