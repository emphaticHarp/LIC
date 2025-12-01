import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state: Draft<NotificationState>, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state: Draft<NotificationState>, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n: Notification) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state: Draft<NotificationState>) => {
      state.notifications.forEach((n: Notification) => n.read = true);
      state.unreadCount = 0;
    },
    removeNotification: (state: Draft<NotificationState>, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex((n: Notification) => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAll: (state: Draft<NotificationState>) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
