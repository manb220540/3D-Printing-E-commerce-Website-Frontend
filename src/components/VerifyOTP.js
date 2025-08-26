import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { data, isLoading, sendRequest, clearState } = useFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    clearState();
    setMessage('');
    setError('');

    try {
      await sendRequest(
        'http://localhost:5000/api/users/verify-otp',
        'POST',
        { email, otp },
        { 'Content-Type': 'application/json' }
      );
      setMessage(data?.message || 'Mã OTP hợp lệ. Vui lòng đặt mật khẩu mới.');
    } catch (err) {
      // Handle error response based on status code and extract only the message
      let errorMsg = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      if (err && typeof err === 'object' && err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        if (status === 400 && responseData && typeof responseData.message === 'string') {
          if (responseData.message === 'Mã OTP không đúng') {
            errorMsg = 'Mã OTP không đúng';
          } else if (responseData.message === 'Mã OTP đã hết hạn') {
            errorMsg = 'Mã OTP đã hết hạn';
          } else {
            errorMsg = responseData.message;
          }
        } else if (responseData && typeof responseData.message === 'string') {
          errorMsg = responseData.message; // Fallback to raw message
        }
      } else if (err.message && typeof err.message === 'string') {
        // Fallback for non-response errors (e.g., network issues)
        errorMsg = "Xác minh OTP không thành công. Vui lòng kiểm tra lại mã OTP.";
      }
      setError(errorMsg);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearState();
    setMessage('');
    setError('');

    try {
      await sendRequest(
        'http://localhost:5000/api/users/reset-password',
        'POST',
        { email, otp, newPassword },
        { 'Content-Type': 'application/json' }
      );
      setMessage(data?.message || 'Mật khẩu đã được đặt lại thành công.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Handle error response based on status code and extract only the message
      let errorMsg = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      if (err && typeof err === 'object' && err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        if (status === 400 && responseData && typeof responseData.message === 'string') {
          errorMsg = responseData.message; // Handle specific reset password errors
        } else if (responseData && typeof responseData.message === 'string') {
          errorMsg = responseData.message; // Fallback to raw message
        }
      } else if (err.message && typeof err.message === 'string') {
        // Fallback for non-response errors (e.g., network issues)
        errorMsg = "Đặt lại mật khẩu không thành công. Vui lòng kiểm tra lại mã OTP hoặc mật khẩu mới.";
      }
      setError(errorMsg);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="mb-4 text-center">Xác Minh OTP</h2>
            <Form onSubmit={handleVerify}>
              {message && <Alert variant="success" className="text-center">{message}</Alert>}
              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form.Group className="mb-3" controlId="formOtp">
                <Form.Label>Mã OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang xác minh...' : 'Xác Minh'}
                </Button>
              </div>
            </Form>

            {message.includes('hợp lệ') && (
              <Form onSubmit={handleResetPassword} className="mt-3">
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="success" type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;