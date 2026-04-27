import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API_URL = 'http://localhost:5009/api';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Initialize cart
  useEffect(() => {
    let id = localStorage.getItem('cartId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('cartId', id);
    }
    setCartId(id);
    fetchCart(id);
  }, []);

  const fetchCart = async (id) => {
    try {
      const response = await fetch(`${API_URL}/cart/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const checkout = async (shippingDetails) => {
    if (!token) {
      alert("Please login to checkout");
      return false;
    }
    
    try {
      const response = await fetch(`${API_URL}/orders/checkout/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shippingDetails)
      });
      if (response.ok) {
        setCart(null);
        // Generate new cart ID
        const newId = crypto.randomUUID();
        localStorage.setItem('cartId', newId);
        setCartId(newId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Checkout error:', error);
      return false;
    }
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.product.price), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, checkout, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
