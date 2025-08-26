import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const authCtx = React.useContext(AuthContext);
  const location = useLocation();
  if (!authCtx.isInitialized) {
    // Hiển thị một trang tải hoặc spinner trong khi đang kiểm tra
    // Điều này ngăn việc chuyển hướng ngay lập tức
    return <div className="text-center my-5"><span className="visually-hidden">Đang tải...</span></div>;
  }
  if (!authCtx.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(authCtx.user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;