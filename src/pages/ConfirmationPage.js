import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import AuthContext from '../context/AuthContext';

function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { checkout, isLoading } = useContext(CartContext);
  const authCtx = useContext(AuthContext);

  const { shippingAddress, phoneNumber, paymentMethod, cartItems } = state || {};
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!state || !cartItems || !shippingAddress || !phoneNumber || !paymentMethod) {
      navigate('/checkout');
    }
  }, [state, cartItems, shippingAddress, phoneNumber, paymentMethod, navigate]);

  const totalPrice = cartItems.reduce((total, item) => total + item.current_price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    try {
      const orderId = await checkout(shippingAddress, phoneNumber, paymentMethod);
      toast.success('Đơn hàng đã được xác nhận thành công!');
      navigate('/gio-hang');
    } catch (err) {
      toast.error(err.message || 'Lỗi khi đặt hàng');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!state) {
    return <Alert variant="danger">Không tìm thấy thông tin đơn hàng. Vui lòng quay lại trang thanh toán.</Alert>;
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Xác nhận Đơn hàng</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Thông tin Người dùng</Card.Title>
              <Card.Text>
                Tên: {authCtx.user?.username || 'Không xác định'}
                <br />
                Địa chỉ giao hàng: {shippingAddress}
                <br />
                Số điện thoại: {phoneNumber}
                <br />
                Phương thức thanh toán: {paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : paymentMethod}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Sản phẩm đã đặt</Card.Title>
              {cartItems.map((item) => (
                <Row key={item.id} className="mb-3 align-items-center">
                  <Col md={2}>
                    <img
                      src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/50x50'}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={6}>{item.name} x {item.quantity}</Col>
                  <Col md={4}>{(item.current_price * item.quantity).toLocaleString('vi-VN')} ₫</Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Tóm tắt đơn hàng</Card.Title>
              <Card.Text>Tổng số lượng: {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm</Card.Text>
              <Card.Text className="fw-bold">Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫</Card.Text>
              <Button
                variant="success"
                className="w-100 mt-3"
                onClick={handleConfirmOrder}
                disabled={isLoading || isConfirming}
              >
                {isLoading || isConfirming ? 'Đang xử lý...' : 'Xác nhận Đặt Hàng'}
              </Button>
              <Button
                variant="secondary"
                className="w-100 mt-2"
                onClick={() => navigate('/checkout', { state: { shippingAddress, phoneNumber, paymentMethod } })}
                disabled={isLoading || isConfirming}
              >
                Quay lại
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ConfirmationPage;