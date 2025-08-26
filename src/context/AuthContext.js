import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import useFetch from '../hooks/useFetch';

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  user: null,
  login: (token, user) => {},
  logout: () => {},
  authFetch: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data, isLoading, error, sendRequest } = useFetch();
  const isLoggedIn = !!token;

  // Hàm kiểm tra token có hết hạn chưa
  const isTokenExpired = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      if (!decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Lỗi parse thì coi như hết hạn
    }
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }, []);

  useEffect(() => {
    // Tải token và thông tin user từ localStorage khi ứng dụng khởi động
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        logoutHandler();
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setIsInitialized(true); // đánh dấu đã khởi tạo xong
  }, [logoutHandler]);

  const loginHandler = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Hàm authFetch sử dụng useFetch
  const authFetch = async (url, options = {}) => {
    if (!token || isTokenExpired(token)) {
      logoutHandler();
      throw new Error('Token đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await sendRequest(url, options.method || 'GET', options.body || null, headers);

    if (error) {
      if (error.includes('401') || error.includes('Unauthorized')) {
        logoutHandler();
        throw new Error('Không được phép. Vui lòng đăng nhập lại.');
      }
      throw new Error(error);
    }

    return data;
  };

  const contextValue = {
    isLoggedIn,
    token,
    user,
    login: loginHandler,
    logout: logoutHandler,
    authFetch,
    isLoading,
    error,
    isInitialized,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
