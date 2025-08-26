import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { data, isLoading, sendRequest, clearState } = useFetch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearState();
    setMessage('');
    setError('');

    try {
      await sendRequest(
        'http://localhost:5000/api/users/forgot-password',
        'POST',
        { email },
        { 'Content-Type': 'application/json' }
      );
      setMessage(data?.message || 'Mã OTP đã được gửi. Vui lòng kiểm tra email.');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 2000);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="mb-4 text-center">Quên Mật Khẩu</h2>
            <Form onSubmit={handleSubmit}>
              {message && <Alert variant="success" className="text-center">{message}</Alert>}
              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang gửi...' : 'Gửi Mã OTP'}
                </Button>
              </div>
            </Form>

            <p className="mt-3 text-center">
              <Link to="/login">Quay lại Đăng nhập</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;