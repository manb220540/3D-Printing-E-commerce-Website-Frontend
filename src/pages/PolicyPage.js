import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link nếu bạn muốn có liên kết nội bộ trong trang chính sách

const PolicyPage = () => {
  return (
    <Container className="my-5 py-3">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h1 className="text-center mb-4 text-primary">Chính Sách Bảo Mật</h1>
              <p className="lead text-center mb-5">
                Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
              </p>

              <h3 className="mb-3 text-secondary">1. Thông Tin Chúng Tôi Thu Thập</h3>
              <p>
                Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi khi bạn tạo tài khoản, đặt hàng, đăng ký nhận bản tin hoặc liên hệ với chúng tôi. Thông tin này có thể bao gồm:
              </p>
              <ul>
                <li>Tên, địa chỉ email, số điện thoại, địa chỉ giao hàng.</li>
                <li>Thông tin đăng nhập tài khoản (tên người dùng, mật khẩu đã mã hóa).</li>
                <li>Thông tin thanh toán (chúng tôi không lưu trữ trực tiếp thông tin thẻ tín dụng nhạy cảm).</li>
                <li>Thông tin về các sản phẩm bạn đã xem hoặc mua.</li>
              </ul>
              <p>
                Chúng tôi cũng có thể thu thập thông tin phi cá nhân thông qua cookie và các công nghệ theo dõi tương tự, bao gồm địa chỉ IP, loại trình duyệt, trang đã truy cập và thời gian truy cập.
              </p>

              <h3 className="mb-3 text-secondary">2. Cách Chúng Tôi Sử Dụng Thông Tin</h3>
              <p>Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:</p>
              <ul>
                <li>Xử lý và hoàn thành đơn hàng của bạn.</li>
                <li>Cung cấp dịch vụ khách hàng và hỗ trợ.</li>
                <li>Cải thiện sản phẩm, dịch vụ và trải nghiệm người dùng của chúng tôi.</li>
                <li>Gửi thông tin cập nhật về đơn hàng, khuyến mãi và tin tức (nếu bạn đã đăng ký).</li>
                <li>Ngăn chặn gian lận và đảm bảo an ninh trang web.</li>
                <li>Tuân thủ các yêu cầu pháp lý.</li>
              </ul>

              <h3 className="mb-3 text-secondary">3. Chia Sẻ Thông Tin</h3>
              <p>
                Chúng tôi cam kết không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích tiếp thị của họ. Chúng tôi có thể chia sẻ thông tin với:
              </p>
              <ul>
                <li>Các nhà cung cấp dịch vụ bên thứ ba hỗ trợ hoạt động của chúng tôi (ví dụ: vận chuyển, xử lý thanh toán).</li>
                <li>Cơ quan thực thi pháp luật hoặc cơ quan chính phủ theo yêu cầu của pháp luật.</li>
                <li>Các bên liên quan trong trường hợp sáp nhập, mua lại hoặc bán tài sản.</li>
              </ul>

              <h3 className="mb-3 text-secondary">4. Bảo Mật Thông Tin</h3>
              <p>
                Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép, sử dụng hoặc tiết lộ. Tuy nhiên, không có phương pháp truyền tải qua internet hoặc lưu trữ điện tử nào là an toàn tuyệt đối.
              </p>

              <h3 className="mb-3 text-secondary">5. Quyền Của Bạn</h3>
              <p>Bạn có quyền:</p>
              <ul>
                <li>Truy cập và xem xét thông tin cá nhân của bạn.</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
                <li>Yêu cầu xóa thông tin cá nhân của bạn (trong giới hạn pháp luật).</li>
                <li>Từ chối nhận các thông báo tiếp thị từ chúng tôi.</li>
              </ul>
              <p>
                Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua [Email liên hệ của bạn] hoặc [Số điện thoại liên hệ của bạn].
              </p>

              <h3 className="mb-3 text-secondary">6. Thay Đổi Chính Sách Bảo Mật</h3>
              <p>
                Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được đăng tải trên trang này và có hiệu lực ngay lập tức. Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ.
              </p>
              <p className="mt-4">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi tại <Link to="/lien-he" className="text-decoration-none">trang Liên hệ</Link> của chúng tôi.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PolicyPage;