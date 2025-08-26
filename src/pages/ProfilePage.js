import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const { data: profileData, isLoading, error, sendRequest } = useFetch();
  console.log('useFetch returned:', { data: profileData, isLoading, error, sendRequest });

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    email: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    console.log('profileData updated:', profileData);
    if (profileData) {
      setProfile(profileData);
      setFormData({
        full_name: profileData.full_name || '',
        address: profileData.address || '',
        phone_number: profileData.phone_number || '',
        email: profileData.email || ''
      });
      setValidationErrors({});
    }
  }, [profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authCtx.isLoggedIn || !authCtx.token) {
        console.log('User not logged in:', { isLoggedIn: authCtx.isLoggedIn, token: authCtx.token });
        toast.error('Bạn cần đăng nhập để xem thông tin cá nhân.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      console.log("AuthContext Token:", authCtx.token);
      console.log("AuthContext isLoggedIn:", authCtx.isLoggedIn);
      console.log("AuthContext User:", authCtx.user);

      try {
        await sendRequest(
          `${API_BASE_URL}/api/users/profile`,
          'GET',
          null,
          { Authorization: `Bearer ${authCtx.token}` }
        );
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        toast.error('Không thể tải thông tin người dùng. Vui lòng thử lại.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };

    fetchProfile();
  }, [authCtx.isLoggedIn, authCtx.token, authCtx.user, sendRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    switch (name) {
      case 'full_name':
        if (!value.trim()) errors.full_name = 'Họ và tên không được để trống.';
        else delete errors.full_name;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errors.email = 'Email không được để trống.';
        else if (!emailRegex.test(value)) errors.email = 'Email không hợp lệ.';
        else delete errors.email;
        break;
      case 'phone_number':
        const phoneRegex = /^(0[1-9][0-9]{8,9})$/;
        if (!value.trim()) errors.phone_number = 'Số điện thoại không được để trống.';
        else if (!phoneRegex.test(value)) errors.phone_number = 'Số điện thoại không hợp lệ (10-11 chữ số, bắt đầu bằng 0).';
        else delete errors.phone_number;
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const allFields = ['full_name', 'email', 'phone_number'];
    let hasErrors = false;
    allFields.forEach(field => validateField(field, formData[field]));
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Vui lòng sửa các lỗi trước khi lưu.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      await sendRequest(
        `${API_BASE_URL}/api/users/profile`,
        'PUT',
        formData,
        { Authorization: `Bearer ${authCtx.token}`, 'Content-Type': 'application/json' }
      );
      toast.success('Cập nhật thông tin thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', err);
      toast.error(`Cập nhật thông tin thất bại: ${err.message || 'Lỗi không xác định.'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <div className="text-center text-danger">{error}</div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="my-5">
        <div className="text-center text-info">Không tìm thấy thông tin người dùng.</div>
    </Container>
    );
  }

  return (
    <Container className="my-5 py-3">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h1 className="text-center mb-4 text-primary">Thông tin cá nhân</h1>

              {!isEditing ? (
                <>
                  <p><strong>Tên tài khoản:</strong> {profile.username}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Họ và tên:</strong> {profile.full_name || 'Chưa cập nhật'}</p>
                  <p><strong>Địa chỉ:</strong> {profile.address || 'Chưa cập nhật'}</p>
                  <p><strong>Số điện thoại:</strong> {profile.phone_number || 'Chưa cập nhật'}</p>
                  {/* <p><strong>Vai trò:</strong> {profile.role || 'user'}</p> */}
                  <Button variant="primary" onClick={() => setIsEditing(true)} className="w-100 mt-3">
                    Chỉnh sửa thông tin
                  </Button>
                </>
              ) : (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên tài khoản</Form.Label>
                    <Form.Control type="text" value={profile.username} readOnly disabled />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      isInvalid={!!validationErrors.full_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.full_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      isInvalid={!!validationErrors.phone_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phone_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                      {isLoading ? <Spinner animation="border" size="sm" /> : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;