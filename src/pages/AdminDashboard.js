import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { useNotifications } from '../context/NotificationContext';

const API_BASE = process.env.REACT_APP_BACKEND_API;

function AdminDashboard() {
  const authCtx = useContext(AuthContext);
  const { notifications, refreshNotifications } = useNotifications();

  // Fetch multiple metrics
  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    error: errorRevenue,
    sendRequest: fetchRevenue,
  } = useFetch();

  const {
    data: orderCountData,
    isLoading: isLoadingOrders,
    error: errorOrders,
    sendRequest: fetchOrderCount,
  } = useFetch();

  const {
    data: userCountData,
    isLoading: isLoadingUsers,
    error: errorUsers,
    sendRequest: fetchUserCount,
  } = useFetch();

  const {
    data: productCountData,
    isLoading: isLoadingProducts,
    error: errorProducts,
    sendRequest: fetchProductCount,
  } = useFetch();

  const {
    data: blogCountData,
    isLoading: isLoadingBlogs,
    error: errorBlogs,
    sendRequest: fetchBlogCount,
  } = useFetch();

  const {
    data: recentOrdersData,
    isLoading: isLoadingRecentOrders,
    error: errorRecentOrders,
    sendRequest: fetchRecentOrders,
  } = useFetch();

  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (authCtx.token) {
      fetchRevenue(`${API_BASE}/api/orders/revenue`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchOrderCount(`${API_BASE}/api/orders/count`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchUserCount(`${API_BASE}/api/users/count`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchProductCount(`${API_BASE}/api/products/count`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchBlogCount(`${API_BASE}/api/blogs/count`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      fetchRecentOrders(`${API_BASE}/api/orders/recent`, 'GET', null, {
        Authorization: `Bearer ${authCtx.token}`,
      });
    }
  }, [authCtx.token, fetchRevenue, fetchOrderCount, fetchUserCount, fetchProductCount, fetchBlogCount, fetchRecentOrders]);

  useEffect(() => {
    if (revenueData) setRevenue(revenueData.totalRevenue || 0);
    if (orderCountData) setOrderCount(orderCountData.orderCount || 0);
    if (userCountData) setUserCount(userCountData.userCount || 0);
    if (productCountData) setProductCount(productCountData.productCount || 0);
    if (blogCountData) setBlogCount(blogCountData.blogCount || 0);
    if (recentOrdersData) setRecentOrders(recentOrdersData.slice(0, 5)); // Limit to 5 recent orders
  }, [revenueData, orderCountData, userCountData, productCountData, blogCountData, recentOrdersData]);

  // Function to get status color
  // Function to determine status style class
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-unknown';
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Chào mừng, {authCtx.user?.username || 'Admin'}!</h1>
      <p className="text-center lead mb-5">Đây là bảng điều khiển quản trị của bạn.</p>
      <Row className="justify-content-center">
        {/* Revenue */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center" style={{ backgroundColor: '#e6f3ff' }}>
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Doanh thu</Card.Title>
              {isLoadingRevenue ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorRevenue && <Alert variant="danger">Lỗi: {errorRevenue}</Alert>}
                  {!errorRevenue && <Card.Text className="display-4 text-primary fw-bold">{revenue.toLocaleString('vi-VN')} ₫</Card.Text>}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Order Count */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center" style={{ backgroundColor: '#fff3e6' }}>
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Số lượng Đơn hàng</Card.Title>
              {isLoadingOrders ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorOrders && <Alert variant="danger">Lỗi: {errorOrders}</Alert>}
                  {!errorOrders && <Card.Text className="display-4 text-warning fw-bold">{orderCount}</Card.Text>}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* User Count */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center" style={{ backgroundColor: '#e6ffe6' }}>
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Số lượng Người dùng</Card.Title>
              {isLoadingUsers ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorUsers && <Alert variant="danger">Lỗi: {errorUsers}</Alert>}
                  {!errorUsers && <Card.Text className="display-4 text-success fw-bold">{userCount}</Card.Text>}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Product Count */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center" style={{ backgroundColor: '#ffe6e6' }}>
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Số lượng Sản phẩm</Card.Title>
              {isLoadingProducts ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorProducts && <Alert variant="danger">Lỗi: {errorProducts}</Alert>}
                  {!errorProducts && <Card.Text className="display-4 text-danger fw-bold">{productCount}</Card.Text>}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Blog Count */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center" style={{ backgroundColor: '#e6e6ff' }}>
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Số lượng Blog</Card.Title>
              {isLoadingBlogs ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorBlogs && <Alert variant="danger">Lỗi: {errorBlogs}</Alert>}
                  {!errorBlogs && <Card.Text className="display-4 text-info fw-bold">{blogCount}</Card.Text>}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Đơn hàng Gần đây</Card.Title>
              {isLoadingRecentOrders ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <>
                  {errorRecentOrders && <Alert variant="danger">Lỗi: {errorRecentOrders}</Alert>}
                  {!errorRecentOrders && (
                    <Table striped bordered hover responsive className="rounded-table" style={{ backgroundColor: '#f8f9fa' }}>
                      <thead>
                        <tr>
                          <th>Mã Đơn hàng</th>
                          <th>Người dùng</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.order_code}</td>
                            <td>{order.username}</td>
                            <td>{order.total_amount.toLocaleString('vi-VN')} ₫</td>
                            <td> <span className={`status-box ${getStatusStyle(order.status)}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              )}
              <Button variant="info" as={Link} to="/admin/orders" className="mt-3">
                Xem tất cả đơn hàng
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notifications */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Thông báo</Card.Title>
              {notifications.length > 0 ? (
                <ul className="list-unstyled">
                  {notifications.slice(0, 5).map((notification) => (
                    <li key={notification.id} className="mb-2">
                      {notification.message} {notification.is_read ? '(Đã đọc)' : '(Chưa đọc)'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có thông báo mới.</p>
              )}
              <Button variant="warning" as={Link} to="/thong-bao" className="mt-3" onClick={refreshNotifications}>
                Xem tất cả thông báo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Management Links */}
      <Row className="mt-4 justify-content-center">
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Quản lý Sản phẩm</Card.Title>
              <Card.Text>Thêm, sửa, xóa và quản lý danh sách sản phẩm.</Card.Text>
              <Button variant="primary" as={Link} to="/admin/products">
                Đi đến Quản lý Sản phẩm
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Quản lý Blog</Card.Title>
              <Card.Text>Viết, chỉnh sửa và quản lý các bài viết blog.</Card.Text>
              <Button variant="success" as={Link} to="/admin/blogs">
                Đi đến Quản lý Blog
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Quản lý Đơn hàng</Card.Title>
              <Card.Text>Xem và quản lý các đơn đặt hàng từ khách hàng.</Card.Text>
              <Button variant="info" as={Link} to="/admin/orders">
                Đi đến Quản lý Đơn hàng
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Quản lý Người dùng</Card.Title>
              <Card.Text>Quản lý thông tin và vai trò của người dùng.</Card.Text>
              <Button variant="warning" as={Link} to="/admin/users">
                Đi đến Quản lý Người dùng
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
// Add CSS styles for status boxes
const styles = `
  .status-box {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-weight: bold;
    color: white;
    text-align: center;
    min-width: 100px;
  }
  .status-pending {
    background-color: #ff9800; /* Orange for pending */
  }
  .status-confirmed {
    background-color: #4caf50; /* Green for confirmed */
  }
  .status-shipped {
    background-color: #2196f3; /* Blue for shipped */
  }
  .status-cancelled {
    background-color: #f44336; /* Red for cancelled */
  }
  .status-delivered {
    background-color: #9c27b0; /* Purple for delivered */
  }
  .status-unknown {
    background-color: #9e9e9e; /* Gray for unknown */
  }
`;

// Inject CSS into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);


export default AdminDashboard;