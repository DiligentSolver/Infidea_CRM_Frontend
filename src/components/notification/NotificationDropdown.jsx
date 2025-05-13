import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiX, FiSettings, FiCheck, FiVolume2 } from 'react-icons/fi';
import { Scrollbars } from 'react-custom-scrollbars-2';
import NotificationServices from '@/services/NotificationServices';
import { notifyError } from '@/utils/toast';
import useNotification from '@/hooks/useNotification';
import NotificationItem from './NotificationItem';

/**
 * Notification dropdown component for the header
 * @param {Object} props Component props
 * @param {React.RefObject} props.notificationRef Reference to the dropdown element for handling outside clicks
 */
const NotificationDropdown = ({ notificationRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { unreadCount, setUpdated, markAllAsReadViaSocket, socket, fetchUnreadCount, playNotificationSound } = useNotification();

  // Toggle dropdown
  const toggleDropdown = async () => {
    setOpen(!open);
    if (!open) {
      await fetchNotifications();
      // Also refresh the unread count when opening dropdown
      fetchUnreadCount();
    }
  };

  // Test playing notification sound
  const handleTestSound = (e) => {
    e.stopPropagation();
    playNotificationSound()
      .then(() => console.log("Test notification sound played successfully"))
      .catch(error => console.error("Failed to play test notification sound:", error));
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotificationServices.getMyNotifications();
      // Only show first 5 notifications in dropdown
      setNotifications(res.notifications.slice(0, 5));
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await NotificationServices.markAsRead(id);
      fetchNotifications();
      setUpdated(true);
      // Refresh unread count immediately
      fetchUnreadCount();
      // Close dropdown after marking as read
      setOpen(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id) => {
    try {
      await NotificationServices.deleteNotification(id);
      fetchNotifications();
      setUpdated(true);
      // Refresh unread count immediately
      fetchUnreadCount();
      // Close dropdown after deleting
      setOpen(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      // Try to mark all as read via socket first, fall back to HTTP API
      const socketWorked = markAllAsReadViaSocket();
      if (!socketWorked) {
        await NotificationServices.markAllAsRead();
      }
      fetchNotifications();
      setUpdated(true);
      // Refresh unread count immediately
      fetchUnreadCount();
      // Close dropdown after marking all as read
      setOpen(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // Update notifications when unreadCount changes or when a new notification is received
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [unreadCount, open]);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!socket) return;

    // When a new notification arrives, update the list
    socket.on('new_notification', () => {
      if (open) {
        fetchNotifications();
      }
      // Always refresh the unread count for the badge
      fetchUnreadCount();
    });

    // When a notification is marked as read via socket
    socket.on('notification_read', () => {
      if (open) {
        fetchNotifications();
      }
      // Always refresh the unread count for the badge
      fetchUnreadCount();
    });

    // When all notifications are marked as read via socket
    socket.on('all_notifications_read', () => {
      if (open) {
        fetchNotifications();
      }
      // Always refresh the unread count for the badge
      fetchUnreadCount();
    });

    // When a notification is deleted via socket
    socket.on('notification_deleted', () => {
      if (open) {
        fetchNotifications();
      }
      // Always refresh the unread count for the badge
      fetchUnreadCount();
    });

    return () => {
      socket.off('new_notification');
      socket.off('notification_read');
      socket.off('all_notifications_read');
      socket.off('notification_deleted');
    };
  }, [socket, open, fetchUnreadCount]);

  return (
    <div className="relative inline-block text-left" ref={notificationRef}>
      <button
        className="relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <FiBell
          className="w-5 h-5 md:w-5 md:h-5 text-gray-600 dark:text-gray-300"
          aria-hidden="true"
        />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center p-0.5 h-4 w-4 text-xs font-medium leading-none text-white transform translate-x-1/2 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 md:w-96 rounded-md shadow-lg bg-white dark:bg-gray-800 focus:outline-none ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
            <div className="flex space-x-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
                  title="Mark all as read"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
              )}
              <Link 
                to="/notifications" 
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
                title="All notifications"
              >
                <FiSettings className="w-4 h-4" />
              </Link>
              <button
                onClick={handleTestSound}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
                title="Test notification sound"
              >
                <FiVolume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
                title="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <Scrollbars autoHeight autoHeightMax={288} universal={true}>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                      showActions={false}
                      inDropdown={true}
                    />
                  ))}
                </ul>
              </Scrollbars>
            )}
          </div>
          
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 