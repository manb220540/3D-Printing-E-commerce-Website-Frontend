import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBolt, FaMagic, FaDollarSign } from 'react-icons/fa'; // Ví dụ icons
import { Link } from 'react-router-dom';

function FeatureSection() {
  const features = [
    {
      icon: <FaBolt size={40} className="mb-3 text-primary" />,
      title: 'Tốc độ nhanh chóng',
      description: 'Dịch vụ in 3D hoàn thành trong thời gian ngắn nhất, đáp ứng mọi yêu cầu gấp.',
    },
    {
      icon: <FaMagic size={40} className="mb-3 text-success" />,
      title: 'Chất lượng vượt trội',
      description: 'Sản phẩm in 3D sắc nét, chi tiết hoàn hảo với vật liệu cao cấp.',
    },
    {
      icon: <FaDollarSign size={40} className="mb-3 text-warning" />,
      title: 'Giá cả cạnh tranh',
      description: 'Mức giá ưu đãi nhất thị trường, tối ưu chi phí cho mọi dự án.',
    },
  ];

  return (
    <Container className="my-5 py-5 bg-light rounded">
      <h2 className="text-center mb-5">Tại Sao Chọn Print3D.io.vn?</h2>
      <Row className="justify-content-center">
        {features.map((feature, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body>
                {feature.icon}
                <Card.Title className="fw-bold">{feature.title}</Card.Title>
                <Card.Text>{feature.description}</Card.Text>
                {/* <Button variant="link">Tìm hiểu thêm</Button> */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="outline-primary" size="lg" as={Link} to="/dich-vu">Khám phá Dịch vụ của chúng tôi</Button>
      </div>
    </Container>
  );
}

export default FeatureSection;