import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import useFetch from '../hooks/useFetch';

const API_BASE = process.env.REACT_APP_BACKEND_API;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);
  const { data, isLoading: fetchLoading, error: fetchError, sendRequest } = useFetch();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      fetchCart();
    }
  }, [authCtx.isLoggedIn]);

  useEffect(() => {
    setIsLoading(fetchLoading);
    setError(fetchError);
    if (data && (data.cart || data.items)) {
      setCart(data.cart || null);
      setCartItems(data.items || []);
    }
  }, [data, fetchLoading, fetchError]);

  const fetchCart = async () => {
    if (!authCtx.isLoggedIn) {
      setError('Bạn cần đăng nhập để xem giỏ hàng.');
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authCtx.token || localStorage.getItem('token')}`,
    };
    await sendRequest(`${API_BASE}/api/cart`, 'GET', null, headers);
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!authCtx.isLoggedIn) {
      throw new Error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authCtx.token || localStorage.getItem('token')}`,
    };
    const body = { cartId: cart?.id, productId, quantity };
    try {
      await sendRequest(`${API_BASE}/api/cart/items`, 'POST', body, headers);
      if (!fetchError) await fetchCart();
    } catch (err) {
      throw new Error(err.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng.');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!authCtx.isLoggedIn) {
      throw new Error('Bạn cần đăng nhập để cập nhật giỏ hàng.');
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authCtx.token || localStorage.getItem('token')}`,
    };
    const body = { quantity };
    await sendRequest(`${API_BASE}/api/cart/items/${itemId}`, 'PUT', body, headers);
    if (!fetchError) await fetchCart();
  };

  const removeItem = async (itemId) => {
    if (!authCtx.isLoggedIn) {
      throw new Error('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.');
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authCtx.token || localStorage.getItem('token')}`,
    };
    await sendRequest(`${API_BASE}/api/cart/items/${itemId}`, 'DELETE', null, headers);
    if (!fetchError) await fetchCart();
  };

  const checkout = async (shippingAddress, phoneNumber, paymentMethod) => {
  if (!authCtx.isLoggedIn) {
    throw new Error('Bạn cần đăng nhập để thanh toán.');
  }
  if (!cart || !cart.id) {
    throw new Error('Giỏ hàng không tồn tại. Vui lòng làm mới trang.');
  }
  console.log('Checkout with cartId:', cart.id); // Debug log
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authCtx.token || localStorage.getItem('token')}`,
  };
  try {
    const response = await sendRequest(
      `${API_BASE}/api/orders`,
      'POST',
      { cartId: cart.id, shippingAddress, phoneNumber, paymentMethod },
      headers
    );
    // Refresh cart to reflect empty state after successful order
    await fetchCart();
    return response.orderId; // Match the backend response structure
  } catch (err) {
    throw new Error(err.message || 'Lỗi khi đặt hàng');
  }
};

  return (
    <CartContext.Provider value={{ cart, cartItems, isLoading, error, addToCart, updateQuantity, removeItem, fetchCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};