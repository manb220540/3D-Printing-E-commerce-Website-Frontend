// import React, { useState, useContext, useEffect } from 'react';
// import { useLocation } from 'react-router-dom'; // Import useLocation to access state
// import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { CartContext } from '../context/CartContext';
// import AuthContext from '../context/AuthContext';

// function CheckoutPage() {
//   const { cartItems, checkout, isLoading } = useContext(CartContext);
//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation(); // Access location to get state from navigation

//   const [shippingAddress, setShippingAddress] = useState(authCtx.user?.address || '');
//   const [phoneNumber, setPhoneNumber] = useState(authCtx.user?.phoneNumber || '');
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [validationErrors, setValidationErrors] = useState({});

//   // Restore state when navigating back from ConfirmationPage
//   useEffect(() => {
//     if (location.state) {
//       const { shippingAddress: stateAddress, phoneNumber: statePhone, paymentMethod: statePayment } = location.state;
//       if (stateAddress) setShippingAddress(stateAddress);
//       if (statePhone) setPhoneNumber(statePhone);
//       if (statePayment) setPaymentMethod(statePayment);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (!authCtx.isLoggedIn) navigate('/login');
//     if (!cartItems.length) navigate('/gio-hang');
//   }, [authCtx.isLoggedIn, cartItems.length, navigate]);

//   const validateForm = () => {
//     const errors = {};
//     if (!shippingAddress.trim()) errors.shippingAddress = 'Địa chỉ giao hàng không được để trống';
//     const phoneRegex = /^(0[1-9][0-9]{8,9})$/;
//     if (!phoneNumber.trim()) errors.phoneNumber = 'Số điện thoại không được để trống';
//     else if (!phoneRegex.test(phoneNumber)) errors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 chữ số, bắt đầu bằng 0)';
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     // Navigate to confirmation page with the form data
//     navigate('/confirmation', {
//       state: {
//         shippingAddress,
//         phoneNumber,
//         paymentMethod,
//         cartItems,
//       },
//     });
//   };

//   const totalPrice = cartItems.reduce((total, item) => total + item.current_price * item.quantity, 0);

//   return (
//     <Container className="my-5">
//       <h1 className="text-center mb-4">Thanh toán</h1>
//       {cartItems.length > 0 ? (
//         <>
//           <Row>
//             <Col md={8}>
//               <Card className="mb-4 shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Sản phẩm trong giỏ hàng</Card.Title>
//                   {cartItems.map((item) => (
//                     <Row key={item.id} className="mb-3 align-items-center">
//                       <Col md={2}>
//                         <img
//                           src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/50x50'}
//                           alt={item.name}
//                           style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//                         />
//                       </Col>
//                       <Col md={6}>{item.name} x {item.quantity}</Col>
//                       <Col md={4}>{(item.current_price * item.quantity).toLocaleString('vi-VN')} ₫</Col>
//                     </Row>
//                   ))}
//                 </Card.Body>
//               </Card>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Thông tin giao hàng</Card.Title>
//                   <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Địa chỉ giao hàng</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         value={shippingAddress}
//                         onChange={(e) => setShippingAddress(e.target.value)}
//                         isInvalid={!!validationErrors.shippingAddress}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {validationErrors.shippingAddress}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Số điện thoại</Form.Label>
//                       <Form.Control
//                         type="tel"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         isInvalid={!!validationErrors.phoneNumber}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {validationErrors.phoneNumber}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Phương thức thanh toán</Form.Label>
//                       <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//                         <option value="COD">Thanh toán khi nhận hàng (COD)</option>
//                       </Form.Select>
//                     </Form.Group>
//                     <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
//                       {isLoading ? 'Đang xử lý...' : 'Xác nhận Đơn hàng'}
//                     </Button>
//                   </Form>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Tóm tắt đơn hàng</Card.Title>
//                   <Card.Text>Tổng số lượng: {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm</Card.Text>
//                   <Card.Text className="fw-bold">Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫</Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </>
//       ) : (
//         <Alert variant="warning">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</Alert>
//       )}
//     </Container>
//   );
// }

// export default CheckoutPage;
import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const API_BASE = process.env.REACT_APP_BACKEND_API;

function CheckoutPage() {
  const { cartItems, isLoading: cartLoading } = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profileData, isLoading: profileLoading, error, sendRequest } = useFetch();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch profile khi user login
  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!cartItems.length) {
      navigate('/gio-hang');
      return;
    }

    const fetchProfile = async () => {
      try {
        await sendRequest(
          `${API_BASE}/api/users/profile`,
          'GET',
          null,
          { Authorization: `Bearer ${authCtx.token}` }
        );
      } catch (err) {
        console.error("Lỗi lấy thông tin profile:", err);
      }
    };

    fetchProfile();
  }, [authCtx.isLoggedIn, authCtx.token, cartItems.length, navigate, sendRequest]);

  // Cập nhật form nếu có dữ liệu profile
  useEffect(() => {
    if (profileData) {
      if (profileData.address) setShippingAddress(profileData.address);
      if (profileData.phone_number) setPhoneNumber(profileData.phone_number);
    }
  }, [profileData]);

  // Restore state khi quay lại từ ConfirmationPage
  useEffect(() => {
    if (location.state) {
      const { shippingAddress: stateAddress, phoneNumber: statePhone, paymentMethod: statePayment } = location.state;
      if (stateAddress) setShippingAddress(stateAddress);
      if (statePhone) setPhoneNumber(statePhone);
      if (statePayment) setPaymentMethod(statePayment);
    }
  }, [location.state]);

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.trim()) errors.shippingAddress = 'Địa chỉ giao hàng không được để trống';
    const phoneRegex = /^(0[1-9][0-9]{8,9})$/;
    if (!phoneNumber.trim()) errors.phoneNumber = 'Số điện thoại không được để trống';
    else if (!phoneRegex.test(phoneNumber)) errors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 chữ số, bắt đầu bằng 0)';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    navigate('/confirmation', {
      state: {
        shippingAddress,
        phoneNumber,
        paymentMethod,
        cartItems,
        fullName: profileData?.full_name || '', 
      },
    });
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.current_price * item.quantity, 0);

  if (cartLoading || profileLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    toast.error("Không thể tải thông tin người dùng.");
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Thanh toán</h1>
      {cartItems.length > 0 ? (
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>Sản phẩm trong giỏ hàng</Card.Title>
                {cartItems.map((item) => (
                  <Row key={item.id} className="mb-3 align-items-center">
                    <Col md={2}>
                      <img
                        src={item.image_url ? `${API_BASE}${item.image_url}` : 'https://via.placeholder.com/50x50'}
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
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Thông tin giao hàng</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ giao hàng</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      isInvalid={!!validationErrors.shippingAddress}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.shippingAddress}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      isInvalid={!!validationErrors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phương thức thanh toán</Form.Label>
                    <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={cartLoading} className="w-100">
                    {cartLoading ? 'Đang xử lý...' : 'Xác nhận Đơn hàng'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Tóm tắt đơn hàng</Card.Title>
                <Card.Text>Tổng số lượng: {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm</Card.Text>
                <Card.Text className="fw-bold">Tổng tiền: {totalPrice.toLocaleString('vi-VN')} ₫</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Alert variant="warning">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</Alert>
      )}
    </Container>
  );
}

export default CheckoutPage;
