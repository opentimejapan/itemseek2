'use client';

import React from 'react';
import { useWebSocketStore, useNotifications } from '@itemseek/websocket';
import { TouchButton } from '@itemseek2/ui-mobile';

export function NotificationCenter() {
  const notifications = useWebSocketStore((state) => state.notifications);
  const unreadCount = useWebSocketStore((state) => state.unreadCount);
  const { markAsRead, markAllAsRead, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 left-4 z-40 max-h-96 overflow-y-auto">
      {unreadCount > 0 && (
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">{unreadCount} unread</span>
          <TouchButton size="sm" variant="ghost" onClick={markAllAsRead}>
            Mark all read
          </TouchButton>
        </div>
      )}
      
      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-lg p-4 ${
              !notification.read ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  notification.type === 'error' ? 'text-red-600' :
                  notification.type === 'warning' ? 'text-yellow-600' :
                  notification.type === 'success' ? 'text-green-600' :
                  'text-gray-900'
                }`}>
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                
                {notification.actions && (
                  <div className="mt-2 flex gap-2">
                    {notification.actions.map((action) => (
                      <TouchButton
                        key={action.label}
                        size="sm"
                        variant={action.action === 'reorder' ? 'primary' : 'secondary'}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle action
                          console.log('Action:', action);
                        }}
                      >
                        {action.label}
                      </TouchButton>
                    ))}
                  </div>
                )}
              </div>
              
              <TouchButton
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
              >
                ×
              </TouchButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}