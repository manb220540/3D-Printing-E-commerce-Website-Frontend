import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HeroSection.css'; // Sẽ tạo file này để đặt background image
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="hero-section text-white text-center d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <h1 className="display-4 fw-bold mb-3">In 3D Đã Đơn Giản Hơn Bao Giờ Hết!</h1>
            <p className="lead mb-4">
              Biến ý tưởng thành hiện thực với công nghệ in 3D tiên tiến.
              Dịch vụ nhanh chóng, chất lượng vượt trội, giá cả phải chăng.
            </p>
            <Button variant="primary" size="lg" className="me-3" as={Link} to="/san-pham">
              Khám phá Sản phẩm
            </Button>
            <Button variant="outline-light" size="lg" as={Link} to="/lien-he">
              Liên hệ ngay
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection;