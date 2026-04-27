import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { useState } from 'react';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, checkout, totalPrice } = useCart();
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    landmark: '',
    pincode: ''
  });

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-paper shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-taupe/20">
          <h2 className="font-serif text-2xl text-ink">
            {isCheckoutStep ? 'Shipping Details' : 'Your Cart'}
          </h2>
          <button onClick={() => {
            onClose();
            setTimeout(() => setIsCheckoutStep(false), 300); // reset after slide animation
          }} className="p-2 text-ink/60 hover:text-ink transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isCheckoutStep ? (
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
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Full Delivery Address</label>
                <textarea value={shippingDetails.deliveryAddress} onChange={(e) => setShippingDetails({...shippingDetails, deliveryAddress: e.target.value})} rows="3" className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Landmark</label>
                <input type="text" value={shippingDetails.landmark} onChange={(e) => setShippingDetails({...shippingDetails, landmark: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Pincode</label>
                <input type="text" value={shippingDetails.pincode} onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
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
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-32 bg-cream/50 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.product?.image || "/product.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-lg text-ink line-clamp-2">{item.product?.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-taupe hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-taupe mt-1">${item.product?.price.toFixed(2)}</p>
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
                      <p className="font-medium text-ink">${(item.product?.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length > 0 && (
          <div className="p-6 border-t border-taupe/20 bg-cream/30">
            <div className="flex justify-between items-center mb-6 text-lg font-serif">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-taupe uppercase tracking-wider text-center mb-4">
              Shipping & taxes calculated at checkout
            </p>
            <button 
              onClick={async () => {
                if (!isCheckoutStep) {
                  setIsCheckoutStep(true);
                } else {
                  if (!shippingDetails.fullName || !shippingDetails.phoneNumber || !shippingDetails.deliveryAddress || !shippingDetails.pincode) {
                    alert("Please fill all required shipping fields.");
                    return;
                  }
                  const success = await checkout(shippingDetails);
                  if (success) {
                    alert('Order placed successfully!');
                    onClose();
                    setTimeout(() => {
                      setIsCheckoutStep(false);
                      setShippingDetails({ fullName: '', phoneNumber: '', deliveryAddress: '', landmark: '', pincode: '' });
                    }, 300);
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
