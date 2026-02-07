import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationItem {
  signalId: number;
  type: 'new_signal' | 'ai_analysis_complete';
  pair: string;
  direction: string;
  timestamp: number;
  qualityScore?: string;
  strategy?: string;
  timeframe?: string;
}

interface NotificationState {
  hasUnreadNotifications: boolean;
  unreadCount: number;
  lastNotificationId: number | null;
  lastSeenNotificationId: number | null;
  newSignalIds: number[];
  notifications: NotificationItem[];
  lastViewedAt: number | null;
}

interface NotificationActions {
  markAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (signalId: number, type?: string, additionalData?: any) => void;
  refreshSignals: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  clearAll: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

const MAX_TRACKED_IDS = 50;

const initialState: NotificationState = {
  hasUnreadNotifications: false,
  unreadCount: 0,
  lastNotificationId: null,
  lastSeenNotificationId: null,
  newSignalIds: [],
  notifications: [],
  lastViewedAt: null,
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      markAsRead: () => {
        set({
          hasUnreadNotifications: false,
          unreadCount: 0,
          lastSeenNotificationId: get().lastNotificationId,
          lastViewedAt: Date.now(),
        });
      },

      clearNotifications: () => {
        set({
          notifications: [],
          newSignalIds: [],
          hasUnreadNotifications: false,
          unreadCount: 0,
        });
      },

      addNotification: (signalId: number, type: string = 'new_signal', additionalData: any = {}) => {
        console.log("📱 NotificationStore: addNotification called", { signalId, type, additionalData });
        
        set((state) => {
          const exists = state.newSignalIds.includes(signalId);
          const updatedIds = [signalId, ...state.newSignalIds.filter((id) => id !== signalId)].slice(0, MAX_TRACKED_IDS);
          
          console.log("📱 NotificationStore: Processing notification", { exists, updatedIds });
          
          // Create notification item
          const notificationItem: NotificationItem = {
            signalId,
            type: type as 'new_signal' | 'ai_analysis_complete',
            pair: additionalData.pair || '',
            direction: additionalData.direction || '',
            timestamp: Date.now(),
            qualityScore: additionalData.quality_score,
            strategy: additionalData.strategy,
            timeframe: additionalData.timeframe,
          };

          console.log("📱 NotificationStore: Created notification item", notificationItem);

          // For AI analysis complete, update existing notification or add new one
          let updatedNotifications = [...state.notifications];
          if (type === 'ai_analysis_complete') {
            const existingIndex = updatedNotifications.findIndex(n => n.signalId === signalId);
            if (existingIndex >= 0) {
              // Update existing notification with AI data
              updatedNotifications[existingIndex] = {
                ...updatedNotifications[existingIndex],
                type: 'ai_analysis_complete',
                qualityScore: additionalData.quality_score,
                timestamp: Date.now()
              };
              console.log("📱 NotificationStore: Updated existing AI notification");
            } else {
              // Add new AI complete notification
              updatedNotifications = [notificationItem, ...updatedNotifications].slice(0, MAX_TRACKED_IDS);
              console.log("📱 NotificationStore: Added new AI notification");
            }
          } else {
            // Add new signal notification
            updatedNotifications = [notificationItem, ...updatedNotifications].slice(0, MAX_TRACKED_IDS);
            console.log("📱 NotificationStore: Added new signal notification");
          }

          const newState = {
            hasUnreadNotifications: true,
            unreadCount: exists ? state.unreadCount : state.unreadCount + 1,
            lastNotificationId: signalId,
            newSignalIds: updatedIds,
            notifications: updatedNotifications,
          };
          
          console.log("📱 NotificationStore: New state", newState);
          return newState;
        });
      },

      // Do not clear unread on refresh; just keep any helpful metadata if needed
      refreshSignals: () => {
        set((state) => ({
          lastSeenNotificationId: state.lastNotificationId,
        }));
      },

      loadFromStorage: () => {
        try {
          const stored = localStorage.getItem('notification-state');
          if (stored) {
            const parsed = JSON.parse(stored);
            set(parsed);
          }
        } catch (error) {
          console.error('Error loading notification state from storage:', error);
        }
      },

      saveToStorage: () => {
        try {
          const state = get();
          localStorage.setItem('notification-state', JSON.stringify(state));
        } catch (error) {
          console.error('Error saving notification state to storage:', error);
        }
      },

      clearAll: () => {
        set(initialState);
        localStorage.removeItem('notification-state');
      },
    }),
    {
      name: 'notification-state',
      partialize: (state) => ({
        hasUnreadNotifications: state.hasUnreadNotifications,
        unreadCount: state.unreadCount,
        lastNotificationId: state.lastNotificationId,
        lastSeenNotificationId: state.lastSeenNotificationId,
        newSignalIds: state.newSignalIds,
        notifications: state.notifications,
        lastViewedAt: state.lastViewedAt,
      }),
    }
  )
);

// Auto-save on every change
useNotificationStore.subscribe((state) => {
  // Only save if we have meaningful data
  if (state.lastNotificationId !== null) {
    state.saveToStorage();
  }
}); 