import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

function OrderFlowRoute({ children, requireState = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (requireState && !location.state) {
    return (
      <Container className="text-center my-5">
        <h1 className="display-4 ">Bạn không thể truy cập trực tiếp trang này</h1>
        <p className="lead">Vui lòng quay lại giỏ hàng hoặc In 3D theo yêu cầu để tiếp tục.</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" onClick={() => navigate("/gio-hang")}>
            Quay lại Giỏ Hàng
          </Button>
          <Button variant="success" onClick={() => navigate("/custom-order")}>
            In 3D Theo Yêu Cầu
          </Button>
        </div>
      </Container>
    );
  }

  return children;
}

export default OrderFlowRoute;
