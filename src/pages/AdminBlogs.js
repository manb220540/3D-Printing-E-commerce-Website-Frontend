import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, Modal, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { SearchContext } from '../context/SearchContext';
import { FaSearch } from 'react-icons/fa';
import useFetch from '../hooks/useFetch';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
    old_image_url: ''
  });

  const API_BASE_URL = 'http://localhost:5000';
  const { data, isLoading: fetchLoading, error: fetchError, sendRequest } = useFetch();

  const fetchBlogs = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await sendRequest(`${API_BASE_URL}/api/blogs`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`
      });
    } catch (err) {
      setError('Không thể tải danh sách bài viết blog.');
      console.error('Lỗi khi fetch blogs:', err);
      toast.error('Không thể tải danh sách bài viết blog. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [authCtx.token, sendRequest]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (data) {
      setBlogs(data);
    } else if (fetchError) {
      setError(fetchError);
    }
  }, [data, fetchError]);

  const handleShowModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setBlogForm({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        image: null,
        old_image_url: blog.image_url
      });
    } else {
      setCurrentBlog(null);
      setBlogForm({
        title: '',
        content: '',
        author: authCtx.user?.username || '',
        image: null,
        old_image_url: ''
      });
    }
    setError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBlog(null);
    setBlogForm({
      title: '',
      content: '',
      author: '',
      image: null,
      old_image_url: ''
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setBlogForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append('title', blogForm.title);
    formData.append('content', blogForm.content);
    formData.append('author', blogForm.author);

    if (blogForm.image) {
      formData.append('blogImage', blogForm.image);
    } else if (currentBlog && blogForm.old_image_url) {
      formData.append('oldImageUrl', blogForm.old_image_url);
    } else if (currentBlog && !blogForm.image && !blogForm.old_image_url) {
      formData.append('clearImage', 'true');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${authCtx.token}`,
      };
      if (currentBlog) {
        await sendRequest(`${API_BASE_URL}/api/blogs/${currentBlog.id}`, 'PUT', formData, headers);
        toast.success('Bài viết đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await sendRequest(`${API_BASE_URL}/api/blogs`, 'POST', formData, headers);
        toast.success('Bài viết đã được thêm thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      fetchBlogs();
      handleCloseModal();
    } catch (err) {
      console.error('Lỗi khi lưu bài viết blog:', err);
      toast.error(`Lỗi: Không thể lưu bài viết blog. ${err.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết blog này?')) {
      setError(null);
      try {
        await sendRequest(`${API_BASE_URL}/api/blogs/${id}`, 'DELETE', null, {
          Authorization: `Bearer ${authCtx.token}`
        });
        toast.success('Bài viết đã được xóa thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        fetchBlogs();
      } catch (err) {
        console.error('Lỗi khi xóa bài viết blog:', err);
        toast.error(`Lỗi: Không thể xóa bài viết blog. ${err.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="mb-0">Quản lý Blog</h1>
        <Button variant="success" onClick={() => handleShowModal()}>
          Thêm Bài viết mới
        </Button>
      </div>
      <Form className="mb-4">
        <InputGroup className="d-none d-lg-flex me-3">
          <Form.Control
            placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery('')} aria-label="Tìm kiếm">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>

      <Row>
        {filteredBlogs.length === 0 ? (
          <Col><div className="text-center text-info">Không có bài viết nào khớp với tìm kiếm.</div></Col>
        ) : (
          filteredBlogs.map((blog) => (
            <Col key={blog.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {blog.image_url && (
                  <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}${blog.image_url}`}
                    alt={blog.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{blog.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    Tác giả: {blog.author} | Ngày đăng: {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    {blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <Button variant="warning" size="sm" onClick={() => handleShowModal(blog)}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(blog.id)}>
                      Xóa
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentBlog ? 'Sửa Bài viết Blog' : 'Thêm Bài viết Blog mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={blogForm.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={blogForm.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tác giả</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={blogForm.author}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh Blog</Form.Label>
              <Form.Control
                type="file"
                name="blogImage"
                onChange={handleImageChange}
              />
              {currentBlog && blogForm.old_image_url && (
                <div className="mt-2">
                  <img src={`${API_BASE_URL}${blogForm.old_image_url}`} alt="Current Blog" style={{ width: '100px', height: 'auto' }} />
                  <Form.Text className="text-muted ms-2">Ảnh hiện tại</Form.Text>
                </div>
              )}
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Lưu Bài viết
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminBlogs;