import { Container } from 'react-bootstrap';
import BlogGrid from '../components/BlogGrid'; // Import BlogGrid

function BlogPage() {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Blog Công Nghệ In 3D</h1>
      <p className="text-center lead mb-5">
        Cập nhật những kiến thức, tin tức và xu hướng mới nhất về in 3D.
      </p>
      {/* Thay thế nội dung tĩnh bằng BlogGrid */}
      <BlogGrid />
    </Container>
  );
}

export default BlogPage;