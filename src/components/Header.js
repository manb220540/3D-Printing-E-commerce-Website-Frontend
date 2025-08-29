import React, { useContext, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Navbar, Nav, Container, FormControl, Button, InputGroup, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Đảm bảo file CSS này tồn tại
import AuthContext from '../context/AuthContext';
import { SearchContext } from '../context/SearchContext';
import { useNotifications } from '../context/NotificationContext';
import { CartContext } from '../context/CartContext'; // Import CartContext
import logo from '../logo.svg'; // Đảm bảo đường dẫn logo chính xác

function Header() {
  const authCtx = useContext(AuthContext);
  const { notifications, unreadCount } = useNotifications();
  const { setSearchQuery } = useContext(SearchContext);
  const { cartItems } = useContext(CartContext); // Access cartItems from CartContext
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    authCtx.logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    navigate('/san-pham'); // Navigate to products page on search
  };

  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = authCtx.isLoggedIn && authCtx.user?.role === 'admin';

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Print3D.io.vn Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="fw-bold mx-2">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/san-pham" className="fw-bold mx-2">Sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/custom-order" className="fw-bold mx-2">In 3D theo yêu cầu</Nav.Link>
            <Nav.Link as={Link} to="/dich-vu" className="fw-bold mx-2">Dịch vụ</Nav.Link>
            <Nav.Link as={Link} to="/blog" className="fw-bold mx-2">Blog</Nav.Link>
            <Nav.Link as={Link} to="/lien-he" className="fw-bold mx-2">Liên hệ</Nav.Link>
            
          </Nav>

          <Nav className="ms-auto align-items-center">
            <form onSubmit={handleSearch}>
              <InputGroup className="d-none d-lg-flex me-3">
                <FormControl
                  placeholder="Tìm kiếm sản phẩm ..."
                  aria-label="Tìm kiếm sản phẩm hoặc bài viết"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="submit" variant="outline-secondary" aria-label="Tìm kiếm">
                  <FaSearch />
                </Button>
              </InputGroup>
            </form>

            <div className="d-flex align-items-center">

              {/* Thông báo */}
              {authCtx.isLoggedIn && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-noti">Thông báo</Tooltip>}>
                  <Nav.Link as={Link} to="/thong-bao" className="mx-2 nav-icon-only">
                    <span className="position-relative">
                      <FaBell size={20} />
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </Nav.Link>
                </OverlayTrigger>
              )}

              {/* Giỏ hàng */}
              {/* {authCtx.isLoggedIn && ( */}
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-cart">Giỏ hàng</Tooltip>}>
                  <Nav.Link as={Link} to="/gio-hang" className="mx-2 nav-icon-only">
                    <span className="position-relative">
                      <FaShoppingCart size={20} />
                      {cartItems.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {cartItems.length}
                        </span>
                      )}
                    </span>
                  </Nav.Link>
                </OverlayTrigger>
              {/* )} */}

              {/* Tài khoản */}
              {!authCtx.isLoggedIn ? (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-login">Đăng nhập</Tooltip>}>
                  <Nav.Link as={Link} to="/login" className="mx-2 nav-icon-only">
                    <FaUser size={20} />
                  </Nav.Link>
                </OverlayTrigger>
              ) : (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center nav-icon-only">
                      <FaUser size={20} className="user-icon-adjust" />
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                  aria-label="Tùy chọn tài khoản"
                >
                  <NavDropdown.Item as={Link} to="/profile">Thông tin cá nhân</NavDropdown.Item>
                  {isAdmin && (
                    <>
                      {/* <NavDropdown.Divider /> */}
                      <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                    </>
                  )}
                  {/* <NavDropdown.Divider /> */}
                  <NavDropdown.Item as={Link} to="/orders">Theo dõi Đơn hàng</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;