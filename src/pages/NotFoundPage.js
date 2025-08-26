import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NotFoundPage() {
  const navigate = useNavigate();

// Hiển thị thông báo lỗi khi trang không tìm thấy
//   useEffect(() => {
//     toast.error('Trang bạn tìm kiếm không tồn tại!', {
//       position: 'top-right',
//       autoClose: 3000,
//     });
//   }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container className="my-5 text-center">
      <Row>
        <Col>
          <h1 className="display-4">404 - Không Tìm Thấy</h1>
          <p className="lead">Rất tiếc, trang bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>
          <Button variant="primary" onClick={handleGoHome} className="mt-3">
            Về Trang Chủ
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;