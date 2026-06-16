"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { api } from './api';

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/user/${user.id}`);
      const data = Array.isArray(res) ? res : (res.data || []);
      // Sort by latest first if backend doesn't
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Optional: Polling every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user?.id]);


  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    try {
      await api.get(`/notifications/read/${notificationId}`);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    try {
      await Promise.all(unread.map(n => api.get(`/notifications/read/${n.id}`)));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    setNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}