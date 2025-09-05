import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Modal, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { SearchContext } from '../context/SearchContext';
import { FaSearch } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_BACKEND_API;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
    old_image_url: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm.');
      console.error('Lỗi khi fetch products:', err);
      toast.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleShowModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: null,
        old_image_url: product.image_url
      });
    } else {
      setCurrentProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null,
        old_image_url: ''
      });
    }
    setValidationErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: null,
      old_image_url: ''
    });
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    setProductForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    if (name === 'stock') {
      const stockValue = parseInt(value) || 0;
      if (stockValue <= 0) errors.stock = 'Số lượng tồn kho phải lớn hơn 0.';
      else delete errors.stock;
    }
    setValidationErrors(errors);
    if (name === 'price') {
      const priceValue = parseFloat(value) || 0;
      if (priceValue < 0) errors.price = 'Giá không thể âm.';
      else delete errors.price;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate stock before submission
    validateField('stock', productForm.stock);
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Vui lòng sửa các lỗi trước khi lưu.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('stock', productForm.stock);
    if (productForm.image) {
      formData.append('productImage', productForm.image);
    } else if (productForm.old_image_url) {
      formData.append('old_image_url', productForm.old_image_url);
    } else if (currentProduct && !productForm.image && !productForm.old_image_url) {
      formData.append('clearImage', 'true');
    }

    try {
      if (currentProduct) {
        await axios.put(`${API_BASE}/api/products/${currentProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authCtx.token}`
          }
        });
        toast.success('Sản phẩm đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await axios.post(`${API_BASE}/api/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authCtx.token}`
          }
        });
        toast.success('Sản phẩm đã được thêm thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      toast.error(`Lỗi: Không thể lưu sản phẩm. ${err.response?.data?.message || err.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await axios.delete(`${API_BASE}/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${authCtx.token}`
          }
        });
        toast.success('Sản phẩm đã được xóa thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchProducts();
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        toast.error(`Lỗi: Không thể xóa sản phẩm. ${err.response?.data?.message || err.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
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

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Quản lý Sản phẩm</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Thêm Sản phẩm mới
        </Button>
      </div>
      <Form className="mb-4">
        <InputGroup className="d-none d-lg-flex me-3">
          <Form.Control
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery('')} aria-label="Tìm kiếm">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>
      <Row>
        {filteredProducts.length === 0 ? (
          <Col><div className="text-center text-info">Không có sản phẩm nào khớp với tìm kiếm.</div></Col>
        ) : (
          filteredProducts.map((product) => (
            <Col key={product.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {product.image_url && (
                  <Card.Img
                    variant="top"
                    src={`${API_BASE}${product.image_url}`}
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{product.name}</Card.Title>
                  <Card.Text className="text-muted small">
                    Giá: ${product.price} | Tồn kho: {product.stock}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    {product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <Button variant="warning" size="sm" onClick={() => handleShowModal(product)}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                      Xóa
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productForm.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleChange}
                isInvalid={!!validationErrors.price}
                step="0.01"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.price}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng tồn kho</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={productForm.stock}
                onChange={handleChange}
                isInvalid={!!validationErrors.stock}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.stock}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                name="productImage"
                onChange={handleImageChange}
              />
              {currentProduct && productForm.old_image_url && (
                <div className="mt-2">
                  <img src={`${API_BASE}${productForm.old_image_url}`} alt="Current Product" style={{ width: '100px', height: 'auto' }} />
                  <Form.Text className="text-muted ms-2">Ảnh hiện tại</Form.Text>
                </div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Lưu Sản phẩm
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminProducts;