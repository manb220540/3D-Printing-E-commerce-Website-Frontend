import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';
import AuthContext from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_BACKEND_API;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { data, isLoading, error, sendRequest, clearState } = useFetch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const prevUsernameRef = useRef(''); // Track the previous username to reset attempts

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearState();
    setErrorMessage('');

    // Reset failed attempts if username changes
    if (prevUsernameRef.current !== username) {
      setFailedAttempts(0);
      prevUsernameRef.current = username;
    }

    try {
      const response = await sendRequest(
        `${API_BASE}/api/users/login`,
        'POST',
        { username, password },
        { 'Content-Type': 'application/json' }
      );

      if (response && response.token) {
        setFailedAttempts(0); // Reset on success
        authCtx.login(response.token, response.user);
        const redirectPath = response.user.role === 'admin' ? '/admin' : '/';
        navigate(redirectPath);
      }
    } catch (err) {
      // Handle error response based on status code and extract only the message
      let message = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      if (err && typeof err === 'object' && err.response) {
        const status = err.response.status;
        console.log('status:', status); // Debug log
        const responseData = err.response.data;

        if (status === 400) {
          message = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else if (status === 401) {
          message = 'Tài khoản bị khóa tạm thời. Vui lòng đặt lại mật khẩu.';
        } else if (responseData && typeof responseData.message === 'string') {
          message = responseData.message; // Fallback to raw message
        }
      } else if (err.message && typeof err.message === 'string') {
        // Fallback for non-response errors (e.g., network issues)
        message = "Đăng nhập không thành công. Vui lòng kiểm tra lại mật khẩu hoặc tên đăng nhập.";
      }
      setErrorMessage(message);

      // Check for specific messages to increment failed attempts
      if (message.includes('Tên đăng nhập hoặc mật khẩu không đúng')) {
        setFailedAttempts((prev) => prev + 1);
      } else if (message.includes('Vui lòng đặt lại mật khẩu')) {
        setFailedAttempts(5); // Force show forgot password link
      }
    }
  };

  useEffect(() => {
    if (data) {
      if (data.token && data.user && data.user.username) {
        authCtx.login(data.token, data.user);
        const redirectPath = data.user.role === 'admin' ? '/admin' : '/';
        navigate(redirectPath);
      } else {
        console.warn('Login data missing expected fields (token, user.username):', data);
      }
    }
  }, [data, authCtx, navigate]);

  const showForgotPassword = failedAttempts >= 5;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="mb-4 text-center">Đăng nhập</h2>
            <Form onSubmit={handleSubmit}>
              {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
              {showForgotPassword && (
                <Alert variant="warning" className="text-center">
                  Tài khoản bị khóa tạm thời. <Link to="/forgot-password">Quên mật khẩu?</Link>
                </Alert>
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

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </div>
            </Form>

            <p className="mt-3 text-center">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;