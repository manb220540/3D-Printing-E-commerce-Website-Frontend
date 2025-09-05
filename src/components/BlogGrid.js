import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const API_BASE = process.env.REACT_APP_BACKEND_API;


function BlogGrid() {
  const { data: blogs, isLoading, error, sendRequest } = useFetch();

  useEffect(() => {
    // Gọi API để lấy danh sách blog khi component mount
    sendRequest(`${API_BASE}/api/blogs`);
  }, [sendRequest]);

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải bài viết...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error === '404' ? 'Không tìm thấy bài viết.' : error || 'Lỗi không xác định, vui lòng thử lại sau.'}
        </Alert>
      </Container>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">
          Chưa có bài viết nào được đăng.
        </Alert>
      </Container>
    );
  }

  return (
    <Row>
      {blogs.map((post) => (
        <Col key={post.id} md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            {post.image_url && (
              <Card.Img
                variant="top"
                // src={`http://localhost:5000${post.image_url}`}
                src={`${API_BASE}${post.image_url}`}
                alt={post.title}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none'; // Ẩn ảnh nếu không tải được
                }}
              />
            )}
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fw-bold">{post.title || 'Chưa có tiêu đề'}</Card.Title>
              <Card.Text className="text-muted small">
                Ngày đăng:{' '}
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString('vi-VN')
                  : 'Không xác định'}
              </Card.Text>
              <Card.Text className="flex-grow-1">
                {post.content
                  ? post.content.length > 150
                    ? post.content.substring(0, 150) + '...'
                    : post.content
                  : 'Chưa có nội dung'}
              </Card.Text>
              <div className="mt-auto">
                <Button variant="primary" as={Link} to={`/blog/${post.id}`}>
                  Đọc thêm
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default BlogGrid;