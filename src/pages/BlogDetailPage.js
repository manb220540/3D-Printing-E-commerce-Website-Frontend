import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Image } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';

function BlogDetailPage() {
  const { id } = useParams(); // Lấy ID từ URL
  const { data: blog, isLoading, error, sendRequest } = useFetch();

  useEffect(() => {
    // Gọi API để lấy chi tiết blog khi component mount hoặc id thay đổi
    sendRequest(`http://localhost:5000/api/blogs/${id}`);
  }, [id, sendRequest]);

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
        <Alert variant="danger">{error || 'Không thể tải bài viết. Vui lòng thử lại sau.'}</Alert>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">Bài viết không tồn tại.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-3">
      <Card className="shadow-sm border-0">
        {/* Header với tiêu đề và thông tin */}
        <Card.Header className="bg-white border-0 p-4">
          <h1 className="text-center mb-3 text-primary fw-bold">{blog.title || 'Chưa có tiêu đề'}</h1>
          <p className="text-center text-muted mb-0">
            <small>
              Ngày đăng: {new Date(blog.created_at || Date.now()).toLocaleDateString('vi-VN')}{' '}
              {blog.author && `| Tác giả: ${blog.author}`}
            </small>
          </p>
        </Card.Header>

        {/* Nội dung chính */}
        <Card.Body className="p-4">
          {/* Hình ảnh nổi bật */}
          {blog.image_url && (
            <div className="text-center mb-4">
              <Image
                src={`http://localhost:5000${blog.image_url}`}
                alt={blog.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none'; // Ẩn ảnh nếu không tải được
                }}
              />
            </div>
          )}

          {/* Nội dung bài viết */}
          <div className="blog-content">
            {blog.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="text-muted lead"
              />
            ) : (
              <p className="text-muted">Chưa có nội dung.</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BlogDetailPage;