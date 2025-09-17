import React, { createContext, useState, useEffect, useContext } from 'react';
import { useInventory } from './InventoryContext';

// Types
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { getLowStockItems } = useInventory();

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add a new notification
  const addNotification = (
    message: string, 
    type: 'info' | 'warning' | 'error' | 'success' = 'info'
  ) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Load initial notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check for low stock items and create notifications
  useEffect(() => {
    const lowStockItems = getLowStockItems();
    
    if (lowStockItems.length > 0) {
      // Only notify about items not already in notifications
      const existingNotificationItems = new Set(
        notifications
          .filter(n => n.type === 'warning' && n.message.includes('low stock'))
          .map(n => {
            // Extract item name from message like "Item XYZ is running low on stock"
            const match = n.message.match(/^(.*?) is running low on stock/);
            return match ? match[1] : null;
          })
          .filter(Boolean)
      );
      
      // Create new notifications for items not already notified
      lowStockItems.forEach(item => {
        if (!existingNotificationItems.has(item.name)) {
          addNotification(
            `${item.name} is running low on stock (${item.quantity} remaining)`,
            'warning'
          );
        }
      });
    }
  }, [getLowStockItems]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};