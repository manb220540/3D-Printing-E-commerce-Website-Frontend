import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap'; // Thêm InputGroup
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import AuthContext from '../context/AuthContext';

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // State mới cho file ảnh
    const [stock, setStock] = useState('');

    const { data, isLoading, error, sendRequest, clearState } = useFetch();
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    // Bảo vệ Route: Chỉ admin mới được truy cập
    useEffect(() => {
        if (!authCtx.isLoggedIn || !authCtx.isAdmin) {
            navigate('/'); 
        }
    }, [authCtx, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearState();

        const formData = new FormData(); // Sử dụng FormData để gửi file và dữ liệu khác
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock, 10));

        // Chỉ thêm file ảnh vào FormData nếu có file được chọn
        if (selectedImage) {
            formData.append('productImage', selectedImage); // 'productImage' phải khớp với tên trường trong upload.single() của Multer
        }

        const token = authCtx.token;
        if (!token) {
            alert('Bạn cần đăng nhập để thêm sản phẩm.');
            return;
        }

        try {
            await sendRequest(
                'http://localhost:8080/api/products', // URL API của bạn để tạo sản phẩm
                'POST',
                formData, // Gửi FormData thay vì JSON
                { 
                    // **QUAN TRỌNG:** KHÔNG đặt 'Content-Type': 'application/json' ở đây khi gửi FormData.
                    // Trình duyệt sẽ tự động đặt 'Content-Type': 'multipart/form-data' với boundary cần thiết.
                    'Authorization': `Bearer ${token}` 
                }
            );
        } catch (err) {
            // Lỗi đã được useFetch bắt, nhưng có thể thêm logic ở đây nếu muốn
            console.error("Lỗi khi gửi request thêm sản phẩm:", err);
        }
    };

    // Theo dõi `data` từ useFetch để xử lý thành công
    useEffect(() => {
        if (data && data.productId) { // Giả sử backend trả về productId khi thành công
            alert('Sản phẩm đã được thêm thành công!');
            // Reset form sau khi thêm thành công
            setName('');
            setDescription('');
            setPrice('');
            //setImageUrl(''); // Nếu bạn đã có imageUrl từ backend response
            setSelectedImage(null); // Reset file input
            setStock('');
            // Có thể chuyển hướng về trang sản phẩm hoặc danh sách admin
            navigate('/san-pham'); 
        }
    }, [data, navigate]);

    // Xử lý lỗi từ useFetch
    useEffect(() => {
        if (error) {
            alert(`Lỗi: ${error}`); // Hiển thị lỗi từ backend
        }
    }, [error]);

    if (!authCtx.isLoggedIn || !authCtx.isAdmin) {
        return <Container className="my-5"><p className="text-center">Bạn không có quyền truy cập trang này.</p></Container>;
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h2 className="mb-4 text-center">Thêm Sản phẩm mới</h2>
                        <Form onSubmit={handleSubmit}>
                            {isLoading && <Alert variant="info" className="text-center">Đang thêm sản phẩm...</Alert>}

                            <Form.Group className="mb-3" controlId="productName">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên sản phẩm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productDescription">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Mô tả sản phẩm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="productPrice">
                                <Form.Label>Giá</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        step="0.01" 
                                        placeholder="Nhập giá"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Trường chọn file ảnh */}
                            <Form.Group controlId="productImage" className="mb-3">
                                <Form.Label>Hình ảnh sản phẩm</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*" // Chỉ cho phép chọn file ảnh
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                />
                            </Form.Group>
                            {/* Có thể hiển thị ảnh preview nếu muốn */}
                            {selectedImage && (
                                <div className="mb-3 text-center">
                                    <img 
                                        src={URL.createObjectURL(selectedImage)} 
                                        alt="Xem trước ảnh" 
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                                    />
                                </div>
                            )}


                            <Form.Group className="mb-3" controlId="productStock">
                                <Form.Label>Số lượng tồn kho</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số lượng tồn kho"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Đang thêm...' : 'Thêm sản phẩm'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddProductForm;