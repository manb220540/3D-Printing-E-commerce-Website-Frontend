import React, { useContext } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { toast } from "react-toastify";
import { useOrder } from "../context/OrderContext";

const API_BASE = process.env.REACT_APP_BACKEND_API;

function CustomConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { sendRequest } = useFetch();
  const { orderData, setOrderData } = useOrder();

  if (!state) {
    toast.error("Thiếu thông tin đơn hàng.");
    navigate("/custom-order");
    return null;
  }

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("printFile", state.file);
    formData.append("shippingAddress", state.address);
    formData.append("phoneNumber", state.phone);
    formData.append("paymentMethod", state.paymentMethod);
    formData.append("material", state.material);
    formData.append("color", state.color);
    formData.append("layerHeight", state.layerHeight);
    formData.append("infill", state.infill);
    formData.append("sizeX", state.sizeX);
    formData.append("sizeY", state.sizeY);
    formData.append("sizeZ", state.sizeZ);
    formData.append("price", state.price);

    try {
      await sendRequest(`${API_BASE}/api/orders/custom`, "POST", formData, {
        Authorization: `Bearer ${authCtx.token}`,
      });
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const dataToDisplay = state || orderData;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Xác nhận đơn hàng</h2>
      <Card className="p-4 shadow-sm">
        <Row>
          <Col md={6}>
            <h5>Thông tin giao hàng</h5>
            <p><strong>Họ và tên:</strong> {dataToDisplay.fullName || "Không xác định"}</p>
            <p><strong>Địa chỉ:</strong> {dataToDisplay.address}</p>
            <p><strong>Số điện thoại:</strong> {dataToDisplay.phone}</p>
            <p><strong>Thanh toán:</strong> {dataToDisplay.paymentMethod}</p>
          </Col>
          <Col md={6}>
            <h5>Thông tin in 3D</h5>
            <p><strong>File in:</strong> {dataToDisplay.file?.name}</p>
            <p><strong>Vật liệu:</strong> {dataToDisplay.material}</p>
            <p><strong>Màu sắc:</strong> <span style={{ background: dataToDisplay.color, padding: "0 10px", border: "1px solid #ccc" }}>{dataToDisplay.color}</span></p>
            <p><strong>Kích thước:</strong> {dataToDisplay.sizeX} x {dataToDisplay.sizeY} x {dataToDisplay.sizeZ} mm</p>
            <p><strong>Độ dày lớp:</strong> {dataToDisplay.layerHeight} mm</p>
            <p><strong>Infill:</strong> {dataToDisplay.infill}%</p>
          </Col>
        </Row>
        <hr />
        <h4 className="mt-3 text-end">Tổng: {dataToDisplay.price} ₫</h4>
      </Card>
      <div className="mt-3 d-flex gap-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
        <Button variant="primary" onClick={handleConfirm}>Xác nhận đặt hàng</Button>
      </div>
    </Container>
  );
}

export default CustomConfirmPage;
