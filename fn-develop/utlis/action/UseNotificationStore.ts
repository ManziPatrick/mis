// stores/useNotificationStore.ts
import { create } from 'zustand';



interface NotificationStore {
  notifications: any[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
