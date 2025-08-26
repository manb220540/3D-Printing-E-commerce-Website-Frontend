import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartList = () => {
  const { cart, cartItems, isLoading, error, updateQuantity, removeItem } = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải giỏ hàng...</span>
        </Spinner>
        <p className="mt-3">Đang tải giỏ hàng...</p>
      </Container>
    );
  }

  if (!authCtx.isLoggedIn) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          Bạn cần đăng nhập để sử dụng chức năng này. <a href="/login">Đăng nhập ngay</a>.
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">Lỗi: {error}</Alert>
      </Container>
    );
  }

  if (!cart || !cartItems || cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <p>Giỏ hàng của bạn đang trống.</p>
      </Container>
    );
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.current_price * item.quantity, 0);

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <img
                  src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/100x100?text=No+Image'}
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
                <div className="flex-grow-1">
                  <Card.Title className="mb-1">{item.name}</Card.Title>
                  <Card.Text className="text-muted">
                    Giá: {item.current_price.toLocaleString('vi-VN')} ₫ | Tổng: {(item.current_price * item.quantity).toLocaleString('vi-VN')} ₫
                  </Card.Text>
                  <div className="d-flex align-items-center">
                    <Form.Label className="me-2">Số lượng:</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{ width: '80px' }}
                    />
                    <Button
                      variant="outline-danger"
                      className="ms-3"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Tóm tắt đơn hàng</Card.Title>
              <Card.Text>
                Tổng số lượng: {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
              </Card.Text>
              <Card.Text className="fw-bold">
                Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫
              </Card.Text>
              <Button variant="primary" className="w-100" onClick={() => navigate('/checkout')}>
                Thanh toán
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartList;