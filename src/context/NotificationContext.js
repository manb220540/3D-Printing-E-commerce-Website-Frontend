// src/context/NotificationContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "./AuthContext";
import useFetch from "../hooks/useFetch";

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
      "http://localhost:5000/api/notifications",
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
