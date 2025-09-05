import React, { useContext } from 'react'; // Import useContext from React
import './App.css';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader'; // Import AdminHeader
import Footer from './components/Footer';
import AdminFooter from './components/AdminFooter'; // Import AdminFooter
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import ProductGrid from './components/ProductGrid'; // Sẽ dùng cho trang chủ
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { SearchProvider } from './context/SearchContext';
import { NotificationProvider } from './context/NotificationContext';
import AuthContext from './context/AuthContext'; // Import AuthContext for HeaderSwitcher
import { OrderProvider } from './context/OrderContext';

// Import các component
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './components/ForgotPassword';
import VerifyOTP from './components/VerifyOTP';
import OrderFlowRoute from './components/OrderFlowRoute';
import Chatbot from "./components/Chatbot";

// Import Toast notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các trang mới
import ProductsPage from './pages/ProductsPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage'; // Trang 404
import OrderTracking from './pages/OrderTracking'; // Trang theo dõi đơn hàng
import CheckoutPage from './pages/CheckoutPage';
import NotificationsPage from './pages/NotificationsPage';
import ConfirmationPage from './pages/ConfirmationPage'; // New confirmation page
import CustomOrderPage from './pages/CustomOrderPage'; // Trang đặt hàng in 3D tùy chỉnh
import CustomCheckoutPage from './pages/CustomCheckoutPage';
import CustomConfirmPage from './pages/CustomConfirmationPage';

// Trang chi tiết blog 
import BlogDetailPage from './pages/BlogDetailPage';
// Trang profile người dùng
import ProfilePage from './pages/ProfilePage';
// Trang cho admin
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminBlogs from './pages/AdminBlogs';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute để bảo vệ các route admin
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Router> {/* Bọc toàn bộ ứng dụng bằng Router */}
      <AuthProvider> {/* Bọc toàn bộ ứng dụng trong AuthProvider */}
        <CartProvider> {/* Bọc toàn bộ ứng dụng trong CartContext.Provider */}
          <SearchProvider> {/* Bọc toàn bộ ứng dụng trong SearchContext.Provider */}
            <NotificationProvider> {/* Bọc toàn bộ ứng dụng trong NotificationContext.Provider */}
              <OrderProvider> {/* Thêm OrderProvider */}
              <div className="App">
                {/* Conditional Header based on admin role and route */}
                <HeaderSwitcher />
                <ToastContainer/> {/* Hiển thị Toast notifications */}

                <main> {/* Sử dụng thẻ main để bọc nội dung chính */}
                  <Routes> {/* Định nghĩa các Route */}
                    <Route path="/" element={
                      <>
                        <HeroSection />
                        <FeatureSection />
                        <Container className="my-5">
                          <h2 className="text-center mb-4">Sản Phẩm Nổi Bật Của Chúng Tôi</h2>
                          <ProductGrid /> {/* Chỉ hiển thị một phần trên trang chủ */}
                        </Container>
                      </>
                    } />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/san-pham" element={<ProductsPage />} />
                    <Route path="/dich-vu" element={<ServicesPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<BlogDetailPage />} />
                    <Route path="/lien-he" element={<ContactPage />} />
                    <Route path="/chinh-sach" element={<PolicyPage />} />
                    <Route path="/gio-hang" element={<CartPage />} />
                    <Route path="/checkout" element={<OrderFlowRoute><CheckoutPage /></OrderFlowRoute>} />
                    <Route path="/confirmation" element={<OrderFlowRoute requireState><ConfirmationPage /></OrderFlowRoute>} />
                    <Route path="/thong-bao" element={<NotificationsPage />} />
                    <Route path="/orders" element={<OrderTracking />} />
                    <Route path="/custom-order" element={<CustomOrderPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/custom-checkout" element={<OrderFlowRoute requireState><CustomCheckoutPage /></OrderFlowRoute>} />
                    <Route path="/custom-confirm" element={<OrderFlowRoute requireState><CustomConfirmPage /></OrderFlowRoute>} />


                    <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 */}
                    {/* User Profile Route - Yêu cầu xác thực */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute> {/* Không cần roles vì mọi user đều có profile */}
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminProducts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/blogs"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminBlogs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminUsers />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                {/* Conditional Footer based on admin role */}
                <FooterSwitcher />
                <Chatbot /> {/* Thêm component Chatbot vào đây */}
              </div>
              </OrderProvider>
            </NotificationProvider> {/* Đóng NotificationProvider */}
          </SearchProvider> {/* Đóng SearchProvider */}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// Separate component to handle conditional header rendering
function HeaderSwitcher() {
  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isLoggedIn && authCtx.user?.role === 'admin';

  return isAdmin ? <AdminHeader /> : <Header />;
}

// Separate component to handle conditional footer rendering
function FooterSwitcher() {
  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isLoggedIn && authCtx.user?.role === 'admin';

  return isAdmin ? <AdminFooter /> : <Footer />;
}

export default App;
