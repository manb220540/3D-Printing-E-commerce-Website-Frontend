import { Container } from 'react-bootstrap';
import CartList from '../components/CartList'; // Tái sử dụng component danh sách giỏ hàng

function CartPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Giỏ Hàng Của Bạn</h1>
      <p className="text-center lead mb-5">
        Xem lại các sản phẩm bạn đã chọn và tiến hành thanh toán.
      </p>
      {/* Đây sẽ là nơi hiển thị danh sách các sản phẩm trong giỏ hàng */}
      <CartList />
    </Container>
  );
}

export default CartPage;