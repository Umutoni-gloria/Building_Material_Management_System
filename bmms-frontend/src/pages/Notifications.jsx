import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useOutletContext } from 'react-router-dom';

const Notifications = () => {
  const { notifications, markNotificationAsRead } = useOutletContext();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'alert':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case 'info':
      default:
        return <FiInfo className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-600">View and manage your notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FiInfo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 