import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'; // Removed Alert
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';

const API_BASE = process.env.REACT_APP_BACKEND_API;

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { data, isLoading, error, sendRequest, clearState } = useFetch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearState(); // Xóa trạng thái lỗi/dữ liệu fetch trước đó
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const userData = {
      username,
      email,
      password,
      fullName,
      address,
      phoneNumber,
    };

    await sendRequest(
      `${API_BASE}/api/users/register`,
      'POST',
      userData,
      { 'Content-Type': 'application/json' }
    );
  };

  // Theo dõi sự thay đổi của `data` và `error` từ useFetch
  useEffect(() => {
    if (data && data.message) {
      toast.success(`${data.message} Đăng nhập ngay!`, {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => navigate('/login'), // Redirect after toast closes
      });
      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setAddress('');
      setPhoneNumber('');
    }
    if (error) {
      toast.error(`Lỗi: ${error}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [data, error, navigate]);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="mb-4 text-center">Đăng ký tài khoản mới</h2>
            <Form onSubmit={handleSubmit}>
              {isLoading && (
                <div className="text-center mb-3">
                  <span>Đang đăng ký...</span>
                </div>
              )}
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ và tên đầy đủ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ của bạn"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </div>
            </Form>

            <p className="mt-3 text-center">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;