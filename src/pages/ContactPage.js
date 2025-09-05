import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function ContactPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Liên Hệ Với Chúng Tôi</h1>
      <p className="text-center lead mb-5">
        Hãy điền vào biểu mẫu dưới đây hoặc liên hệ trực tiếp để được hỗ trợ.
      </p>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Nhúng Google Form vào đây */}
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeWZgvielK5Ywg0MRsysE6J1ulvwth7lI9-6kglcvvgPYwMRg/viewform?embedded=true" width="640" height="1186" frameborder="0" marginheight="0" marginwidth="0" title="Biểu mẫu liên hệ Print3D">
          Đang tải biểu mẫu liên hệ…</iframe>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5 text-center">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <FaPhone size={40} className="text-primary mb-3" />
              <Card.Title>Điện thoại</Card.Title>
              <Card.Text>(+84) 123 456 789</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <FaEnvelope size={40} className="text-success mb-3" />
              <Card.Title>Email</Card.Title>
              <Card.Text>info@print3d.io.vn</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <FaMapMarkerAlt size={40} className="text-info mb-3" />
              <Card.Title>Địa chỉ</Card.Title>
              <Card.Text>Số 123, Đường ABC, Quận XYZ, TP. Cần Thơ</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;