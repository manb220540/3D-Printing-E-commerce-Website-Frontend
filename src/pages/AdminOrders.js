import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SearchContext } from '../context/SearchContext';
import { FaSearch } from 'react-icons/fa';


const MySwal = withReactContent(Swal); // Create a React-compatible SweetAlert instance

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState({}); // lưu note tạm cho từng đơn
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const { data, isLoading, error, sendRequest } = useFetch();

  // Tải danh sách đơn hàng
  useEffect(() => {
    if (!authCtx.isLoggedIn || authCtx.user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      await sendRequest(
        'http://localhost:5000/api/orders',
        'GET',
        null,
        { Authorization: `Bearer ${authCtx.token}` }
      );
    };

    fetchOrders();
  }, [authCtx.isLoggedIn, authCtx.user?.role, authCtx.token, navigate, sendRequest]);

  // Cập nhật state khi fetch thành công
  useEffect(() => {
    if (data) {
      setOrders(Array.isArray(data) ? data : []); // Ensure orders is an array
    } else if (error) {
      setOrders([]); // Reset to empty array on error
    }
  }, [data, error]);

  // Xử lý cập nhật trạng thái với xác nhận
  const updateStatus = async (orderId, status) => {
    const note = notes[orderId] || ''; // lấy note từ state
    let confirmationMessage = '';

    switch (status) {
      case 'shipped':
        confirmationMessage = 'Bạn có chắc muốn xác nhận và vận chuyển đơn hàng này?';
        break;
      case 'delivered':
        confirmationMessage = 'Bạn có chắc muốn đánh dấu đơn hàng này là hoàn thành?';
        break;
      case 'cancelled':
        confirmationMessage = 'Bạn có chắc muốn hủy đơn hàng này?';
        break;
      default:
        confirmationMessage = 'Bạn có chắc muốn cập nhật trạng thái này?';
    }

    console.log('Showing confirmation dialog for order:', orderId, 'status:', status); // Debug log
    const result = await MySwal.fire({
      title: 'Xác nhận thay đổi trạng thái',
      text: confirmationMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    console.log('Confirmation result:', result); // Debug log
    if (result.isConfirmed) {
      console.log(`Updating status for order ${orderId} to ${status} with note: ${note}`); // Debug log
      try {
        await sendRequest(
          `http://localhost:5000/api/orders/${orderId}/status`,
          'PUT',
          { status, note },
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authCtx.token}`,
          }
        );

        if (!error) {
          toast.success('Cập nhật trạng thái thành công');
          // Sau khi update thì tải lại danh sách
          await sendRequest(
            'http://localhost:5000/api/orders',
            'GET',
            null,
            { Authorization: `Bearer ${authCtx.token}` }
          );
        } else {
          throw new Error(error);
        }
      } catch (err) {
        toast.error(`Không thể cập nhật trạng thái: ${err.message}`);
      }
    }
  };

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

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <p className="text-danger">Lỗi: {error}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Quản lý Đơn hàng</h1>
      <Form className="mb-4">
        <InputGroup className="d-none d-lg-flex me-3">
          <Form.Control
            placeholder="Tìm kiếm theo mã đơn hàng hoặc người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery('')} aria-label="Tìm kiếm">
              <FaSearch />
            </Button>
        </InputGroup>
      </Form>
      
      {filteredOrders.length === 0 ? (
        <p className="text-center">Không có đơn hàng nào khớp với tìm kiếm.</p>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Mã đơn hàng: {order.order_code}</Card.Title>
              <Card.Text>
                Người dùng: {order.username}
                <br />
                Tổng tiền: {order.total_amount.toLocaleString('vi-VN')} ₫
                <br />
                Trạng thái: <span className={`status-box ${getStatusStyle(order.status)}`}>{order.status}</span>
                <br />
                Địa chỉ giao hàng: {order.shipping_address}
                <br />
                Số điện thoại: {order.phone_number}
                <br />
                Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN')}
                <br />
                Cập nhật lần cuối: {new Date(order.updated_at).toLocaleDateString('vi-VN')}
              </Card.Text>

              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  value={notes[order.id] || ''}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [order.id]: e.target.value }))
                  }
                />
              </Form.Group>

              <div className="d-flex gap-2">
                {order.status === 'confirmed' && (
                  <Button
                    variant="success"
                    onClick={() => updateStatus(order.id, 'shipped')}
                  >
                    Xác nhận & Vận chuyển
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button
                    variant="success"
                    onClick={() => updateStatus(order.id, 'delivered')}
                  >
                    Hoàn thành
                  </Button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button
                    variant="danger"
                    onClick={() => updateStatus(order.id, 'cancelled')}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
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

export default AdminOrders;