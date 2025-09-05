import React, { useEffect, useContext, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';
import AuthContext from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_BACKEND_API;

const ProductGrid = () => {
  const { data: products, isLoading, error, sendRequest } = useFetch();
  const { addToCart } = useContext(CartContext);
  const { searchQuery } = useContext(SearchContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    sendRequest(`${API_BASE}/api/products`);
  }, [sendRequest]);

  useEffect(() => {
    if (products && products.length > 0) {
      if (searchQuery.trim() === '') {
        setFilteredProducts(products);
      } else {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerQuery))
        );
        setFilteredProducts(filtered);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchQuery]);

  const handleAddToCart = async (productId, quantity) => {
    if (!isLoggedIn) {
      toast.warning('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Vui lòng đăng nhập.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      await addToCart(productId, quantity);
      toast.success('Sản phẩm đã được thêm vào giỏ hàng!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Lỗi: ${err.message || 'Không thể thêm sản phẩm vào giỏ hàng.'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải sản phẩm...</span>
        </Spinner>
        <p className="mt-3">Đang tải sản phẩm...</p>
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

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Container className="my-5 text-center">
        <p>Không tìm thấy sản phẩm nào.</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm d-flex flex-column">
              {product.image_url ? (
                <Card.Img
                  variant="top"
                  src={`${API_BASE}${product.image_url}`}
                  alt={product.name}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src="https://via.placeholder.com/300x200?text=No+Image"
                  alt="No Image"
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column p-3">
                <Card.Title className="fw-bold">{product.name}</Card.Title>
                <Card.Text className="text-muted small">
                  Giá: {product.price ? product.price.toLocaleString('vi-VN') : '0'} ₫ | Tồn kho: {product.stock}
                </Card.Text>
                <Card.Text className="flex-grow-1">
                  {product.description && product.description.length > 150
                    ? product.description.substring(0, 150) + '...'
                    : product.description || 'Không có mô tả.'}
                </Card.Text>
                <div className="mt-auto">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleAddToCart(product.id, 1)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;