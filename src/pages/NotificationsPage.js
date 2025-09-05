// src/pages/NotificationsPage.js
import React, { useContext, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const API_BASE = process.env.REACT_APP_BACKEND_API;

function NotificationsPage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { notifications, refreshNotifications } = useNotifications();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate("/login");
      return;
    }
    refreshNotifications();
  }, [authCtx.isLoggedIn, navigate, refreshNotifications]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${authCtx.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể đánh dấu đã đọc");
      }

      // Refresh danh sách sau khi đánh dấu đã đọc
      refreshNotifications();
    } catch (err) {
      toast.error(err.message || "Không thể đánh dấu đã đọc");
    }
  };

  if (!notifications) {
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
      <h1 className="text-center mb-4">Thông báo</h1>
      {notifications.length === 0 ? (
        <p className="text-center">Không có thông báo nào.</p>
      ) : (
        notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`mb-3 shadow-sm ${
              notification.is_read ? "bg-light" : ""
            }`}
          >
            <Card.Body>
              <Card.Text>
                {notification.message}
                <br />
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleString("vi-VN")}
                </small>
              </Card.Text>
              {!notification.is_read && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default NotificationsPage;
