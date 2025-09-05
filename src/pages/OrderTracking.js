// import React, { useState, useEffect, useContext } from 'react';
// import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import useFetch from '../hooks/useFetch';
// import Swal from 'sweetalert2'; // Import SweetAlert2
// import withReactContent from 'sweetalert2-react-content'; // Import React content wrapper

// const MySwal = withReactContent(Swal); // Create a React-compatible SweetAlert instance

// function OrderTracking() {
//   const [orders, setOrders] = useState([]);
//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();

//   // dùng custom hook
//   const { data, isLoading, error, sendRequest, clearState } = useFetch();

//   useEffect(() => {
//     if (!authCtx.isLoggedIn) {
//       navigate('/login');
//       return;
//     }

//     // Gọi API lấy đơn hàng khi component mount
//     fetchOrders();
//   }, [authCtx.isLoggedIn, authCtx.token, navigate, sendRequest]);

//   // Hàm riêng để fetch orders
//   const fetchOrders = () => {
//     sendRequest(
//       'http://localhost:5000/api/orders/user',
//       'GET',
//       null,
//       { Authorization: `Bearer ${authCtx.token}` }
//     );
//   };

//   // Khi data thay đổi thì setOrders, đảm bảo data là mảng
//   useEffect(() => {
//     if (data) {
//       // Debug log to check data structure
//       console.log('Received data:', data);
//       // Ensure orders is always an array, handle success message from status update
//       if (Array.isArray(data)) {
//         setOrders(data);
//       } else if (data.message && data.message.includes('thành công')) {
//         toast.success(data.message); // Show success toast for status update
//         fetchOrders(); // Refresh order list after status update
//       } else {
//         setOrders([]);
//       }
//     } else {
//       setOrders([]);
//     }
//   }, [data]);

//   // Khi error thay đổi
//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   const cancelOrder = async (orderId) => {
//     const result = await MySwal.fire({
//       title: 'Xác nhận hủy đơn hàng',
//       text: 'Bạn có chắc muốn hủy đơn hàng này?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Có',
//       cancelButtonText: 'Không',
//     });

//     if (result.isConfirmed) {
//       const orderToCancel = orders.find(order => order.id === orderId);
//       if (orderToCancel?.status === 'shipped') {
//         toast.error('Không thể hủy đơn hàng đã được giao hàng.');
//         return;
//       }

//       await sendRequest(
//         `http://localhost:5000/api/orders/${orderId}/status`,
//         'PUT',
//         { status: 'cancelled' },
//         { Authorization: `Bearer ${authCtx.token}`, 'Content-Type': 'application/json' }
//       );
//       // No need to check !error here since it’s handled in the useEffect for error
//     }
//   };

//   // Function to determine status style class
//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return 'status-pending';
//       case 'confirmed':
//         return 'status-confirmed';
//       case 'shipped':
//         return 'status-shipped';
//       case 'cancelled':
//         return 'status-cancelled';
//       case 'delivered':
//         return 'status-delivered';
//       default:
//         return 'status-unknown';
//     }
//   };

//   if (isLoading) {
//     return (
//       <Container className="my-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Đang tải...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <h1 className="text-center mb-4">Theo dõi Đơn hàng</h1>
//       {orders.length === 0 ? (
//         <p className="text-center">Bạn chưa có đơn hàng nào.</p>
//       ) : (
//         orders.map((order) => (
//           <Card key={order.id} className="mb-3 shadow-sm">
//             <Card.Body>
//               <Card.Title>Mã đơn hàng: {order.order_code}</Card.Title>
//               <Card.Text>
//                 Tổng tiền: {(order.total_amount ?? 0).toLocaleString('vi-VN')} ₫
//                 <br />
//                 Trạng thái: <span className={`status-box ${getStatusStyle(order.status)}`}>{order.status || 'Chưa xác định'}</span>
//                 <br />
//                 Địa chỉ giao hàng: {order.shipping_address || 'Chưa có thông tin'}
//                 <br />
//                 Số điện thoại: {order.phone_number || 'Chưa có thông tin'}
//                 <br />
//                 Ngày đặt: {order.order_date ? new Date(order.order_date).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
//                 <br />
//                 Cập nhật lần cuối: {order.updated_at ? new Date(order.updated_at).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
//               </Card.Text>
//               {order.status === 'confirmed' && ( // Only show cancel button for 'confirmed' status
//                 <Button variant="danger" onClick={() => cancelOrder(order.id)}>
//                   Hủy Đơn hàng
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// }

// // Add CSS styles for status boxes
// const styles = `
//   .status-box {
//     display: inline-block;
//     padding: 0.25rem 0.75rem;
//     border-radius: 0.25rem;
//     font-weight: bold;
//     color: white;
//     text-align: center;
//     min-width: 100px;
//   }
//   .status-pending {
//     background-color: #ff9800; /* Orange for pending */
//   }
//   .status-confirmed {
//     background-color: #4caf50; /* Green for confirmed */
//   }
//   .status-shipped {
//     background-color: #2196f3; /* Blue for shipped */
//   }
//   .status-cancelled {
//     background-color: #f44336; /* Red for cancelled */
//   }
//   .status-delivered {
//     background-color: #9c27b0; /* Purple for delivered */
//   }
//   .status-unknown {
//     background-color: #9e9e9e; /* Gray for unknown */
//   }
// `;

// // Inject CSS into the document
// const styleSheet = document.createElement('style');
// styleSheet.textContent = styles;
// document.head.appendChild(styleSheet);

// export default OrderTracking;
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_BASE = process.env.REACT_APP_BACKEND_API;

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { data, isLoading, error, sendRequest } = useFetch();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [authCtx.isLoggedIn, authCtx.token]);

  const fetchOrders = () => {
    sendRequest(`${API_BASE}/api/orders/user`, 'GET', null, {
      Authorization: `Bearer ${authCtx.token}`,
    });
  };

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.message) {
        // toast.success(data.message);
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        fetchOrders(); // refresh sau khi update trạng thái
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });
      const details = await res.json();
      setOrderDetails((prev) => ({ ...prev, [orderId]: details.items }));
      setExpandedOrderId(orderId);
    } catch {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const cancelOrder = async (orderId) => {
    const result = await MySwal.fire({
      title: 'Xác nhận hủy đơn hàng',
      text: 'Bạn có chắc muốn hủy đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      const orderToCancel = orders.find(order => order.id === orderId);
      if (orderToCancel?.status === 'shipped') {
        toast.error('Không thể hủy đơn hàng đã được giao hàng.');
        return;
      }

      await sendRequest(
        `${API_BASE}/api/orders/${orderId}/status`,
        'PUT',
        { status: 'cancelled' },
        { Authorization: `Bearer ${authCtx.token}`, 'Content-Type': 'application/json' }
      );
    }
  };

  const downloadFile = (filePath) => {
    const url = `${API_BASE}${filePath}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Đang tải file in...");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      case 'delivered': return 'status-delivered';
      default: return 'status-unknown';
    }
  };

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Theo dõi Đơn hàng</h1>
      {orders.length === 0 ? (
        <p className="text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Mã đơn hàng: {order.order_code}</Card.Title>
              <div>
                Tổng tiền: {(order.total_amount ?? 0).toLocaleString('vi-VN')} ₫ <br />
                Trạng thái:{" "}
                <span className={`status-box ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
                <br />
                Địa chỉ giao hàng: {order.shipping_address || 'Chưa có thông tin'} <br />
                Số điện thoại: {order.phone_number || 'Chưa có thông tin'} <br />
                Ngày đặt: {order.order_date ? new Date(order.order_date).toLocaleDateString('vi-VN') : '---'} <br />
                Cập nhật lần cuối: {order.updated_at ? new Date(order.updated_at).toLocaleDateString('vi-VN') : '---'}
              </div>

              {/* Nếu đơn hàng in 3D */}
              {order.file_path ? (
                <div className="mt-3 p-3 border rounded bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>File in:</strong>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => downloadFile(order.file_path)}
                    >
                      Tải về
                    </Button>
                  </div>
                  <div className="mt-2">
                    <strong>Thông số in:</strong>
                    <ul className="mb-0">
                      <li>Vật liệu: {order.material}</li>
                      <li>
                        Màu sắc:
                        <span style={{ background: order.color, padding: "0 12px", border: "1px solid #ccc", marginLeft: "5px" }}>
                          {order.color}
                        </span>
                      </li>
                      <li>Độ dày lớp: {order.layer_height} mm</li>
                      <li>Độ đầy ruột: {order.infill}%</li>
                      <li>Kích thước: {order.size_x} x {order.size_y} x {order.size_z} mm</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </Button>

                  {expandedOrderId === order.id && orderDetails[order.id] && (
                    <Table striped bordered hover size="sm" className="mt-2">
                      <thead>
                        <tr>
                          <th>Ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails[order.id].map((item, idx) => (
                          <tr key={idx}>
                            <td><img src={`${API_BASE}${item.image_url}`} alt={item.name} style={{ width: "50px" }} /></td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString('vi-VN')} ₫</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}

              {/* Nút hủy đơn */}
              {order.status === 'confirmed' && (
                <div className="mt-3">
                  <Button variant="danger" size="sm" onClick={() => cancelOrder(order.id)}>
                    Hủy Đơn hàng
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

// Thêm CSS
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
  .status-pending { background-color: #ff9800; }
  .status-confirmed { background-color: #4caf50; }
  .status-shipped { background-color: #2196f3; }
  .status-cancelled { background-color: #f44336; }
  .status-delivered { background-color: #9c27b0; }
  .status-unknown { background-color: #9e9e9e; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default OrderTracking;

