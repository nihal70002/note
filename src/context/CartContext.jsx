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
      const response = await axiosInstance.get(`/cart/${id}`);
      setCart(response.data);
      setCartMessage('');
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartMessage(error.response?.data?.message || error.response?.data?.Message || 'Could not add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post(`/cart/${cartId}/items`, { productId, quantity });
      setCart(response.data);
      setCartMessage('');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage(error.response?.data?.message || error.response?.data?.Message || 'Could not update quantity.');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await axiosInstance.put(`/cart/${cartId}/items/${itemId}`, { quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${cartId}/items/${itemId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error removing item:', error);
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

  return (
    <CartContext.Provider value={{ cart, loading, cartMessage, setCartMessage, addToCart, updateQuantity, removeFromCart, checkout, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
