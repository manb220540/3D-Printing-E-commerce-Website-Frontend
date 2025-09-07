


import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Spinner, Form, InputGroup, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SearchContext } from '../context/SearchContext';
import { FaSearch, FaDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.REACT_APP_BACKEND_API;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [notes, setNotes] = useState({});
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const { data, isLoading, error, sendRequest } = useFetch();

  // Load orders
  useEffect(() => {
    if (!authCtx.isLoggedIn || authCtx.user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    sendRequest(`${API_BASE}/api/orders`, 'GET', null, {
      Authorization: `Bearer ${authCtx.token}`,
    });
  }, [authCtx.isLoggedIn, authCtx.user?.role, authCtx.token, navigate, sendRequest]);

  useEffect(() => {
    if (data) setOrders(Array.isArray(data) ? data : []);
    else if (error) setOrders([]);
  }, [data, error]);

  // Lấy chi tiết đơn hàng
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
    } catch (err) {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  // Xuất Excel
const exportToExcel = (orderId) => {
    if (!orderDetails[orderId]) {
    toast.error("Chưa tải chi tiết đơn hàng");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(orderDetails[orderId]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");
  XLSX.writeFile(workbook, `order_${orderId}.xlsx`);
  toast.success(`Đã xuất Excel cho đơn #${orderId}`);
};

// Xuất PDF
const exportToPDF = (orderId) => {
    if (!orderDetails[orderId]) {
    toast.error("Chưa tải chi tiết đơn hàng");
    return;
  }

  const doc = new jsPDF();
  const img = new Image();
  img.src = "/logo.png";
  doc.addImage(img, "PNG", 14, 10, 25, 25);

  doc.setFontSize(16);
  doc.text("CÔNG TY IN 3D VIỆT NAM", 50, 20);
  doc.setFontSize(11);
  doc.text(`Admin: ${authCtx.user?.username || "N/A"}`, 50, 28);
  doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 50, 35);

  doc.setFontSize(14);
  doc.text(`Chi tiết đơn hàng #${orderId}`, 14, 50);

  autoTable(doc, {
    startY: 55,
    head: [["Tên sản phẩm", "Số lượng", "Giá"]],
    body: orderDetails[orderId].map((item) => [
      item.name,
      item.quantity,
      item.price.toLocaleString("vi-VN") + " ₫",
    ]),
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("Báo cáo được tạo tự động từ hệ thống quản lý đơn hàng.", 14, pageHeight - 10);

  doc.save(`order_${orderId}.pdf`);
  toast.success(`Đã xuất PDF cho đơn #${orderId}`);

};

// Tải file in
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


  // Update trạng thái
  const updateStatus = async (orderId, status) => {
    const note = notes[orderId] || '';
    let msg = '';
    switch (status) {
      case 'shipped': msg = 'Xác nhận & vận chuyển đơn hàng này?'; break;
      case 'delivered': msg = 'Đánh dấu đơn hàng này là hoàn thành?'; break;
      case 'cancelled': msg = 'Bạn có chắc muốn hủy đơn hàng này?'; break;
      default: msg = 'Cập nhật trạng thái đơn hàng này?';
    }

    const result = await MySwal.fire({
      title: 'Xác nhận thay đổi trạng thái',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    });

    if (result.isConfirmed) {
      try {
        await sendRequest(
          `${API_BASE}/api/orders/${orderId}/status`,
          'PUT',
          { status, note },
          {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authCtx.token}`,
          }
        );
        toast.success('Cập nhật trạng thái thành công');
        await sendRequest(`${API_BASE}/api/orders`, 'GET', null, {
          Authorization: `Bearer ${authCtx.token}`,
        });
      } catch (err) {
        toast.error("Không thể cập nhật trạng thái");
      }
    }
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

  const filteredOrders = orders.filter(
    (o) =>
      o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Quản lý Đơn hàng</h1>
      <Form className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Tìm kiếm theo mã đơn hàng hoặc người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
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
              <div className="mb-3">
                Người dùng: {order.username}<br />
                Tổng tiền: {order.total_amount.toLocaleString('vi-VN')} ₫<br />
                Trạng thái: <span className={`status-box ${getStatusStyle(order.status)}`}>{order.status}</span><br />
                Địa chỉ giao hàng: {order.shipping_address}<br />
                SĐT: {order.phone_number}<br />
                Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN')}<br />
                Cập nhật: {new Date(order.updated_at).toLocaleDateString('vi-VN')}
              </div>

              {order.file_path ? (
                <div className="mt-3 p-3 border rounded bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>File in:</strong>
                    <Button size="sm" variant="outline-primary" onClick={() => downloadFile(order.file_path)}>
                      <FaDownload className="me-1" /> Tải về
                    </Button>
                  </div>
                  <ul className="mt-2 mb-0">
                    <li>Vật liệu: {order.material}</li>
                    <li>Màu: <span style={{ background: order.color, padding: "0 12px", border: "1px solid #ccc" }}>{order.color}</span></li>
                    <li>Độ dày: {order.layer_height} mm</li>
                    <li>Độ đầy: {order.infill}%</li>
                    <li>Kích thước: {order.size_x} x {order.size_y} x {order.size_z} mm</li>
                  </ul>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-info" onClick={() => fetchOrderDetails(order.id)}>
                      {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </Button>
                    {expandedOrderId === order.id && orderDetails[order.id] && (
                      <>
                        <Button size="sm" variant="success" onClick={() => exportToExcel(order.id)}>
                          <FaFileExcel className="me-1" /> Excel
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => exportToPDF(order.id)}>
                          <FaFilePdf className="me-1" /> PDF
                        </Button>
                      </>
                    )}
                      
                  </div>

                  {expandedOrderId === order.id && orderDetails[order.id] && (
                    <Table striped bordered hover size="sm" className="mt-2">
                      <thead><tr><th>Ảnh</th><th>Tên</th><th>SL</th><th>Giá</th></tr></thead>
                      <tbody>
                        {orderDetails[order.id].map((item, i) => (
                          <tr key={i}>
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

              {/* Nút cập nhật trạng thái */}
              <div className="mt-3 d-flex gap-2">
                {order.status === 'confirmed' && (
                  <Button variant="success" onClick={() => updateStatus(order.id, 'shipped')}>Xác nhận & Gửi hàng</Button>
                )}
                {order.status === 'shipped' && (
                  <Button variant="success" onClick={() => updateStatus(order.id, 'delivered')}>Hoàn thành</Button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button variant="danger" onClick={() => updateStatus(order.id, 'cancelled')}>Hủy</Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

// CSS trạng thái
const styles = `
  .status-box { padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-weight: bold; color: white; }
  .status-pending { background:#ff9800 }
  .status-confirmed { background:#4caf50 }
  .status-shipped { background:#2196f3 }
  .status-cancelled { background:#f44336 }
  .status-delivered { background:#9c27b0 }
  .status-unknown { background:#9e9e9e }
`;
const styleSheet = document.createElement('style'); styleSheet.textContent = styles; document.head.appendChild(styleSheet);

export default AdminOrders;

