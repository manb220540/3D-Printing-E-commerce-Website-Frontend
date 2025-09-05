
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPrint, FaCogs, FaCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ServicesPage() {
  const navigate = useNavigate();

  const handleClick = (title) => {
    if (title === 'In 3D Theo Yêu Cầu') {
      navigate('/custom-order');
    } else if (title === 'Tư Vấn Giải Pháp In 3D') {
      navigate('/lien-he');
    } else {
      toast.info('Coming soon...', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const services = [
    {
      icon: <FaPrint size={50} className="text-primary mb-3" />,
      title: 'In 3D Theo Yêu Cầu',
      description:
        'Cung cấp dịch vụ in 3D chuyên nghiệp từ các file thiết kế của bạn. Đảm bảo độ chính xác và chất lượng vượt trội.',
    },
    {
      icon: <FaCogs size={50} className="text-success mb-3" />,
      title: 'Thiết Kế Mô Hình 3D',
      description:
        'Đội ngũ chuyên gia của chúng tôi sẽ giúp bạn biến ý tưởng thành mô hình 3D sẵn sàng cho quá trình in ấn.',
    },
    {
      icon: <FaCode size={50} className="text-info mb-3" />,
      title: 'Tư Vấn Giải Pháp In 3D',
      description:
        'Cung cấp tư vấn chuyên sâu về công nghệ, vật liệu và các giải pháp in 3D tối ưu cho dự án của bạn.',
    },
    {
      icon: <FaPrint size={50} className="text-warning mb-3" />,
      title: 'In Nguyên Mẫu Nhanh',
      description:
        'Hỗ trợ in nguyên mẫu nhanh chóng, giúp bạn kiểm tra và cải tiến sản phẩm trước khi sản xuất hàng loạt.',
    },
  ];

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Dịch Vụ Của Chúng Tôi</h1>
      <p className="text-center lead mb-5">
        Print3D.io.vn cung cấp đa dạng các dịch vụ in 3D chuyên nghiệp, đáp ứng mọi nhu cầu của bạn.
      </p>
      <Row className="justify-content-center">
        {services.map((service, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card
              className="h-100 text-center shadow-sm service-card"
              role="button"
              onClick={() => handleClick(service.title)}
            >
              <Card.Body>
                {service.icon}
                <Card.Title className="fw-bold">{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Toast container */}
      <ToastContainer />
    </Container>
  );
}

export default ServicesPage;
