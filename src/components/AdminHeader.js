import React, { useContext } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaUser, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import logo from '../logo.svg'; // Adjust path as needed

function AdminHeader() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();

  const handleLogout = () => {
    authCtx.logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/admin">
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
            <Nav.Link as={Link} to="/admin" className="fw-bold mx-2">Admin Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="fw-bold mx-2">Quản lý sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/admin/blogs" className="fw-bold mx-2">Quản lý blog</Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="fw-bold mx-2">Quản lý đơn hàng</Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="fw-bold mx-2">Quản lý người dùng</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
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

export default AdminHeader;