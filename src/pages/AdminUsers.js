import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import { SearchContext } from '../context/SearchContext';
import { FaSearch } from 'react-icons/fa';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { data, isLoading, error, sendRequest } = useFetch();

  const fetchUsers = () => {
    sendRequest(
      "http://localhost:5000/api/users",
      "GET",
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
  };

  useEffect(() => {
    if (!authCtx.isLoggedIn || authCtx.user?.role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [authCtx.isLoggedIn, authCtx.user?.role, navigate]);

  useEffect(() => {
    if (data) {
      console.log('Fetched users data:', data); // Log raw data
      if (Array.isArray(data)) {
        const sanitizedUsers = data.map(user => {
          const validRole = ['user', 'admin'].includes(user.role) ? user.role : 'user';
          console.log(`User ${user.id} role sanitized from ${user.role} to ${validRole}`);
          return { ...user, role: validRole };
        });
        setUsers(sanitizedUsers);
      } else if (data.message && data.message.includes('đã được cập nhật')) {
        toast.success(data.message); // Show success message
        fetchUsers(); // Refetch users to update the list
      }
    }
  }, [data]);

  const updateRole = async (userId, role) => {
    console.log(`Attempting to update role for userId ${userId} to ${role}, type: ${typeof role}`);
    if (!role || !['user', 'admin'].includes(role)) {
      toast.error('Vai trò không hợp lệ. Vui lòng chọn lại.');
      return;
    }
    await sendRequest(
      `http://localhost:5000/api/users/update-role/${userId}`,
      "PUT",
      { role },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      }
    );

    if (!error) {
      fetchUsers();
    } else {
      toast.error("Không thể cập nhật vai trò: " + error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Quản lý Người dùng</h1>
      <Form className="mb-4">
        <InputGroup className="d-none d-lg-flex me-3">
          <Form.Control
            placeholder="Tìm kiếm theo tên người dùng hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery('')} aria-label="Tìm kiếm">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>
      {error && <p className="text-danger text-center">{error?.message || "Error for change role of user"}</p>}
      {filteredUsers.length === 0 ? (
        <p className="text-center">Không có người dùng nào khớp với tìm kiếm.</p>
      ) : (
        filteredUsers.map((user) => (
          <Card key={user.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text>
                Email: {user.email}
                <br />
                Họ tên: {user.full_name || "Chưa cập nhật"}
                <br />
                Vai trò: {user.role}
              </Card.Text>
              {user.id === authCtx.user?.id ? (
                <>
                  <Form.Select value={user.role} disabled>
                    <option value={user.role}>{user.role}</option>
                  </Form.Select>
                  <p className="text-muted small mt-2">Cannot change role for logged-in user</p>
                </>
              ) : (
                <Form.Select
                  value={user.role}
                  onChange={(e) => {
                    console.log(`Selected value for user ${user.id}: ${e.target.value}`);
                    updateRole(user.id, e.target.value);
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default AdminUsers;