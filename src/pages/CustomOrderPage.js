import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { toast } from "react-toastify";


function CustomOrderPage() {
  const authCtx = useRef(useContext(AuthContext)).current;
  const [file, setFile] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("#FFFFFF");
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [infill, setInfill] = useState(20);
  const [sizeX, setSizeX] = useState(100);
  const [sizeY, setSizeY] = useState(100);
  const [sizeZ, setSizeZ] = useState(100);
  const [price, setPrice] = useState(0);
  const { setOrderData } = useOrder();

  const navigate = useNavigate();

  // Tính giá
  useEffect(() => {
    const basePrice = 10.0;
    const materialCost = { PLA: 1.0, ABS: 1.5, PETG: 1.2 }[material] || 1.0;
    const weightEstimate = (sizeX * sizeY * sizeZ) / 1000;
    const printTimeEstimate = (sizeZ / layerHeight) * 10;
    const totalPrice =
      basePrice + weightEstimate * materialCost * 5 + printTimeEstimate * 0.1;
    setPrice(totalPrice.toFixed(2));
  }, [material, layerHeight, infill, sizeX, sizeY, sizeZ]);

  // Xử lý file STL
  useEffect(() => {
    if (file) {
      const loader = new STLLoader();
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const geometry = loader.parse(event.target.result);
          geometry.center();
          setGeometry(geometry);
        } catch (error) {
          toast.error("Lỗi tải file 3D: " + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const handleNext = (e) => {
    e.preventDefault();
    if (!authCtx.isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đặt hàng.");
      return;
    }
    if (!file) {
      toast.error("Vui lòng chọn file STL để tải lên.");
      return;
    }
    // Lưu dữ liệu vào context
    setOrderData({
      file,
      material,
      color,
      layerHeight,
      infill,
      sizeX,
      sizeY,
      sizeZ,
      price,
    });

    // chuyển sang trang nhập địa chỉ, mang theo dữ liệu
    navigate("/custom-checkout");
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Đặt Hàng In 3D</h1>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleNext}>
            <Form.Group className="mb-3">
              <Form.Label>Tải lên file (.STL)</Form.Label>
              <Form.Control
                type="file"
                accept=".stl"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vật liệu</Form.Label>
              <Form.Select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="PLA">PLA</option>
                <option value="ABS">ABS</option>
                <option value="PETG">PETG</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Màu sắc</Form.Label>
              <Form.Control
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Độ dày lớp (mm)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Độ đầy ruột (%)</Form.Label>
              <Form.Control
                type="number"
                value={infill}
                onChange={(e) => setInfill(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kích thước (mm)</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    value={sizeX}
                    onChange={(e) => setSizeX(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    value={sizeY}
                    onChange={(e) => setSizeY(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    value={sizeZ}
                    onChange={(e) => setSizeZ(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Button type="submit">Tiếp tục</Button>
          </Form>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Xem trước 3D</Card.Title>
              <Canvas style={{ height: "400px" }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {geometry && (
                  <mesh geometry={geometry}>
                    <meshStandardMaterial color={color || "gray"} />
                  </mesh>
                )}
                <OrbitControls />
              </Canvas>
              <Card.Text>Giá ước tính: {price} ₫</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomOrderPage;

