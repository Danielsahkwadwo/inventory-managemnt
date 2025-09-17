import React, { useEffect, useRef } from 'react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { Check, Trash } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    
    // If less than 24 hours ago, show relative time
    if (Date.now() - date.getTime() < 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show the actual date
    return format(date, 'MMM d, yyyy');
  };

  const getIconForType = (type: Notification['type']) => {
    const iconColors = {
      info: 'bg-blue-100 text-blue-600',
      warning: 'bg-amber-100 text-amber-600',
      error: 'bg-rose-100 text-rose-600',
      success: 'bg-emerald-100 text-emerald-600'
    };

    return (
      <div className={`p-2 rounded-full ${iconColors[type]}`}>
        <span className="block h-2 w-2 rounded-full bg-current"></span>
      </div>
    );
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="text-sm font-medium">Notifications</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Check size={14} className="mr-1" />
            Mark all read
          </button>
          <button 
            onClick={clearNotifications}
            className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
          >
            <Trash size={14} className="mr-1" />
            Clear all
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto py-1">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                notification.read ? 'opacity-75' : 'bg-blue-50'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                {getIconForType(notification.type)}
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;