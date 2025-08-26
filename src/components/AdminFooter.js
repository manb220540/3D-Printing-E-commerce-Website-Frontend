import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Admin Panel - Print3D.io.vn</h5>
            <p>
              Quản lý hiệu quả các hoạt động in 3D và vận hành hệ thống. Công cụ hỗ trợ dành riêng cho quản trị viên.
            </p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Liên hệ Hỗ trợ Admin</h5>
            <ul className="list-unstyled">
              <li className="mb-2">Email: admin@print3d.io.vn</li>
              <li className="mb-2">Điện thoại: +84 123 456 789</li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/admin" className="text-white text-decoration-none">Admin Dashboard</Link></li>
              <li className="mb-2"><Link to="/admin/products" className="text-white text-decoration-none">Quản lý sản phẩm</Link></li>
              <li className="mb-2"><Link to="/admin/blogs" className="text-white text-decoration-none">Quản lý blog</Link></li>
              <li className="mb-2"><Link to="/admin/orders" className="text-white text-decoration-none">Quản lý đơn hàng</Link></li>
              <li className="mb-2"><Link to="/admin/users" className="text-white text-decoration-none">Quản lý người dùng</Link></li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-secondary my-4" />
        <p className="text-center text-secondary mb-0">
          &copy; {currentYear} Print3D.io.vn. Đã đăng ký bản quyền - Phiên bản Admin.
        </p>
      </Container>
    </footer>
  );
}

export default AdminFooter;