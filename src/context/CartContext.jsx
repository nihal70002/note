/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axiosInstance from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState('');
  const [shippingSettings, setShippingSettings] = useState({
    enabled: true,
    standardShippingFee: 5,
    freeShippingAmount: 500
  });
  const [shouldOpenCart, setShouldOpenCart] = useState(false);
  const { token } = useAuth();

  // Initialize cart
  useEffect(() => {
    try {
      let id = localStorage.getItem('cartId');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('cartId', id);
      }
      setCartId(id);
      fetchCart(id);
      // Don't block cart initialization on shipping settings error
      fetchShippingSettings().catch(console.error);
    } catch (error) {
      console.error('Cart initialization error:', error);
      // Set empty cart to prevent crashes
      setCart({ items: [] });
    }
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const response = await axiosInstance.get('/shipping/settings');
      const settings = response.data;
      
      // Validate and warn about missing config data
      if (!settings) {
        console.warn('[Cart Warning] Shipping settings response is empty, using defaults');
        return;
      }
      
      if (import.meta.env.DEV) {
        if (settings.freeShippingAmount === undefined) {
          console.warn('[Cart Warning] freeShippingAmount is missing from shipping settings');
        }
        if (settings.standardShippingFee === undefined) {
          console.warn('[Cart Warning] standardShippingFee is missing from shipping settings');
        }
        if (settings.enabled === undefined) {
          console.warn('[Cart Warning] enabled flag is missing from shipping settings');
        }
      }
      
      setShippingSettings(settings);
    } catch (error) {
      console.error('Failed to fetch shipping settings:', error);
      // Use default settings if API fails - no need to update state since defaults are already set
    }
  };

  const fetchCart = async (id) => {
    try {
      const response = await axiosInstance.get(`/cart/${id}`);
      setCart(response.data);
      setCartMessage('');
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartMessage(error.response?.data?.message || error.response?.data?.Message || 'Could not fetch cart.');
      // Set empty cart to prevent crashes
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post(`/cart/${cartId}/items`, { productId, quantity });
      setCart(response.data);
      setCartMessage('');
      // Trigger cart to open automatically
      setShouldOpenCart(true);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || error.response?.data?.Message || 'Could not update quantity.';
      setCartMessage(message);
      return { success: false, message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await axiosInstance.put(`/cart/${cartId}/items/${itemId}`, { quantity });
      setCart(response.data);
      setCartMessage('');
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      const message = error.response?.data?.message || error.response?.data?.Message || 'Could not update quantity.';
      setCartMessage(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${cartId}/items/${itemId}`);
      setCart(response.data);
      setCartMessage('');
      return { success: true };
    } catch (error) {
      console.error('Error removing item:', error);
      const message = error.response?.data?.message || error.response?.data?.Message || 'Could not remove item from cart.';
      setCartMessage(message);
      return { success: false, message };
    }
  };

  const checkout = async (shippingDetails) => {
    if (!token) {
      return { success: false, message: 'Please login to checkout.' };
    }
    
    try {
      console.log("Cart ID:", cartId);
      console.log("Token:", token);

      const response = await axiosInstance.post(
        `/orders/checkout/${cartId}`,
        shippingDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCart(null);
      // Generate new cart ID
      const newId = crypto.randomUUID();
      localStorage.setItem('cartId', newId);
      setCartId(newId);
      
      return { 
        success: true, 
        orderId: response.data.orderId,
        razorpayOrderId: response.data.razorpayOrderId,
        amount: response.data.amount,
        currency: response.data.currency || 'INR'
      };
    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false, message: error.response?.data?.message || error.response?.data?.Message || 'Checkout failed. Please try again.' };
    }
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.product.price), 0) || 0;
  
  const shippingCharge = shippingSettings?.enabled 
    ? (totalPrice >= (shippingSettings?.freeShippingAmount ?? 500) ? 0 : (shippingSettings?.standardShippingFee ?? 5))
    : 0;
  
  const totalAmount = totalPrice + shippingCharge;

  return (
    <CartContext.Provider value={{ cart, loading, cartMessage, setCartMessage, addToCart, updateQuantity, removeFromCart, checkout, totalItems, totalPrice, shippingCharge, totalAmount, shippingSettings, shouldOpenCart, setShouldOpenCart }}>
      {children}
    </CartContext.Provider>
  );
};
