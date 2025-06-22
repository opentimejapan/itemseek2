import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'alert';
  title: string;
  message: string;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
  persistent?: boolean;
  read?: boolean;
  timestamp: Date;
}

interface WebSocketStore {
  // Connection state
  onlineUsers: string[];
  setOnlineUsers: (updater: string[] | ((prev: string[]) => string[])) => void;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // User activity
  userActivities: Map<string, { action: string; timestamp: Date }>;
  updateUserActivity: (userId: string, action: string) => void;
  
  // Collaborative features
  editingItems: Map<string, string>; // itemId -> userId
  setItemEditing: (itemId: string, userId: string | null) => void;
}

export const useWebSocketStore = create<WebSocketStore>()(
  subscribeWithSelector((set, get) => ({
    // Connection state
    onlineUsers: [],
    setOnlineUsers: (updater) =>
      set((state) => ({
        onlineUsers: typeof updater === 'function' ? updater(state.onlineUsers) : updater,
      })),
    
    // Notifications
    notifications: [],
    unreadCount: 0,
    
    addNotification: (notification) =>
      set((state) => {
        const newNotifications = [notification, ...state.notifications];
        const unreadCount = newNotifications.filter(n => !n.read).length;
        
        return {
          notifications: newNotifications,
          unreadCount,
        };
      }),
    
    markAsRead: (id) =>
      set((state) => {
        const notifications = state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        );
        const unreadCount = notifications.filter(n => !n.read).length;
        
        return { notifications, unreadCount };
      }),
    
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),
    
    removeNotification: (id) =>
      set((state) => {
        const notifications = state.notifications.filter(n => n.id !== id);
        const unreadCount = notifications.filter(n => !n.read).length;
        
        return { notifications, unreadCount };
      }),
    
    clearNotifications: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),
    
    // User activity
    userActivities: new Map(),
    
    updateUserActivity: (userId, action) =>
      set((state) => {
        const activities = new Map(state.userActivities);
        activities.set(userId, { action, timestamp: new Date() });
        return { userActivities: activities };
      }),
    
    // Collaborative features
    editingItems: new Map(),
    
    setItemEditing: (itemId, userId) =>
      set((state) => {
        const editingItems = new Map(state.editingItems);
        if (userId) {
          editingItems.set(itemId, userId);
        } else {
          editingItems.delete(itemId);
        }
        return { editingItems };
      }),
  }))
);

// Selectors
export const selectOnlineUsers = (state: WebSocketStore) => state.onlineUsers;
export const selectNotifications = (state: WebSocketStore) => state.notifications;
export const selectUnreadCount = (state: WebSocketStore) => state.unreadCount;
export const selectEditingItems = (state: WebSocketStore) => state.editingItems;
export const selectUserActivities = (state: WebSocketStore) => state.userActivities;