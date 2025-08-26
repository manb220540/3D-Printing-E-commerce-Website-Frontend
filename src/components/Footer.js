import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Print3D.io.vn</h5>
            <p>
              Chuyên cung cấp dịch vụ in 3D theo yêu cầu và các sản phẩm in 3D chất lượng cao. Biến ý tưởng của bạn thành hiện thực!
            </p>
            <div className="social-icons mt-3">
              {/* Thay href="#facebook" bằng to="/external-link-to-facebook" hoặc để rỗng nếu chỉ là placeholder */}
              {/* Lưu ý: Các liên kết mạng xã hội thường là external link, bạn có thể vẫn dùng <a> với href thật */}
              <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-white me-3"><FaFacebookF size={24} /></a>
              <a href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-white me-3"><FaInstagram size={24} /></a>
              <a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="text-white"><FaYoutube size={24} /></a>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Liên hệ</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><FaMapMarkerAlt className="me-2" /> Địa chỉ: [Địa chỉ của bạn]</li>
              <li className="mb-2"><FaPhoneAlt className="me-2" /> Điện thoại: [Số điện thoại của bạn]</li>
              <li><FaEnvelope className="me-2" /> Email: [Email của bạn]</li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              {/* Sử dụng <Link to="..."> thay vì <a href="#..."> */}
              <li className="mb-2"><Link to="/san-pham" className="text-white text-decoration-none">Sản phẩm</Link></li>
              <li className="mb-2"><Link to="/dich-vu" className="text-white text-decoration-none">Dịch vụ</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-white text-decoration-none">Blog</Link></li>
              <li className="mb-2"><Link to="/lien-he" className="text-white text-decoration-none">Liên hệ</Link></li>
              <li className="mb-2"><Link to="/chinh-sach" className="text-white text-decoration-none">Chính sách bảo mật</Link></li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-secondary my-4" />
        <p className="text-center text-secondary mb-0">
          &copy; {currentYear} Print3D.io.vn. Đã đăng ký bản quyền.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;