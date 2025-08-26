import { Container } from 'react-bootstrap';
import ProductGrid from '../components/ProductGrid'; // Tái sử dụng component lưới sản phẩm

function ProductsPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Tất Cả Sản Phẩm Của Chúng Tôi</h1>
      <p className="text-center lead mb-5">
        Khám phá danh mục đa dạng các sản phẩm in 3D chất lượng cao.
      </p>
      {/* Đây sẽ là nơi hiển thị toàn bộ danh sách sản phẩm */}
      <ProductGrid />
    </Container>
  );
}

export default ProductsPage;