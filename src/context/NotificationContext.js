// src/context/NotificationContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "./AuthContext";
import useFetch from "../hooks/useFetch";

const API_BASE = process.env.REACT_APP_BACKEND_API;

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  refreshNotifications: () => {},
});

export const NotificationProvider = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const { data, sendRequest } = useFetch();
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(() => {
    if (!authCtx.isLoggedIn) return;

    sendRequest(
      `${API_BASE}/api/notifications`,
      "GET",
      null,
      { Authorization: `Bearer ${authCtx.token}` }
    );
  }, [authCtx.isLoggedIn, authCtx.token, sendRequest]);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [authCtx.isLoggedIn, refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refreshNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;
