import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

function CustomCheckoutPage() {
  const authCtx = useContext(AuthContext);
  const { data: profileData, isLoading, error, sendRequest } = useFetch();
  const [formData, setFormData] = useState({ address: '', phone: '', paymentMethod: 'COD' });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch profile khi load trang
  useEffect(() => {
    if (!authCtx.isLoggedIn || !authCtx.token) return;

    sendRequest(
      `${API_BASE_URL}/api/users/profile`,
      'GET',
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
  }, [authCtx.isLoggedIn, authCtx.token, sendRequest]);

  // Set formData từ profile
  useEffect(() => {
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        address: profileData.address || '',
        phone: profileData.phone_number || ''
      }));
    }
  }, [profileData]);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    if (name === 'address') {
      if (!value.trim()) errors.address = 'Địa chỉ không được để trống.';
      else delete errors.address;
    }
    if (name === 'phone') {
      const phoneRegex = /^(0[1-9][0-9]{8,9})$/;
      if (!value.trim()) errors.phone = 'Số điện thoại không được để trống.';
      else if (!phoneRegex.test(value)) errors.phone = 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0).';
      else delete errors.phone;
    }
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleNext = () => {
    // validate tất cả trước khi qua confirm
    validateField('address', formData.address);
    validateField('phone', formData.phone);

    if (Object.keys(validationErrors).length > 0 || !formData.address || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ và đúng thông tin.');
      return;
    }

    navigate("/custom-confirm", {
    state: {
      ...location.state,  // dùng trực tiếp location.state, không phải biến state có thể bị rỗng
      address: formData.address,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      fullName: profileData?.full_name || '',
    },
  });
  };

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return <Container className="my-5 text-danger">Lỗi tải thông tin người dùng.</Container>;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4">Thông tin giao hàng</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    label="Thanh toán khi nhận hàng (COD)"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                  />
                  {/* <Form.Check
                    type="radio"
                    name="paymentMethod"
                    value="BANK"
                    label="Chuyển khoản ngân hàng"
                    checked={formData.paymentMethod === 'BANK'}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    name="paymentMethod"
                    value="MOMO"
                    label="Ví MoMo"
                    checked={formData.paymentMethod === 'MOMO'}
                    onChange={handleChange}
                  /> */}
                </div>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleNext}>
                  Tiếp tục
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomCheckoutPage;
