const APP_BASE_URL = 'https://bitiq-frontend-v-2.vercel.app';
const toAbsolute = (path: string = '/') => {
  try {
    const base = APP_BASE_URL || window.location.origin;
    return base.replace(/\/$/, '') + path;
  } catch {
    return path;
  }
};
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useNotificationStore } from '@/stores/notificationStore';
import { useSignalsRefreshStore } from '@/stores/signalsRefreshStore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// FCM token management
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check support
    if (!('serviceWorker' in navigator)) return null;
    if (!('Notification' in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) return null;

    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = () => {
  console.log("🔥 Firebase: Setting up foreground message listener");
  
  try {
    return onMessage(messaging, (payload) => {
      console.log("🔥 Firebase foreground message received:", payload);
      
      const signalIdRaw = payload?.data?.signal_id;
    const messageType = payload?.data?.type;
    const pair = payload?.data?.pair;
    const direction = payload?.data?.direction;
    const qualityScore = payload?.data?.quality_score;

    console.log("🔥 Parsed message data:", { signalIdRaw, messageType, pair, direction, qualityScore });

    // 1) show badge/count for new signals or AI completion
    if (signalIdRaw) {
      const signalId = parseInt(signalIdRaw);
      if (!isNaN(signalId)) {
        console.log("🔥 Adding notification to store:", { signalId, messageType, data: payload.data });
        useNotificationStore.getState().addNotification(signalId, messageType, payload.data);
      } else {
        console.log("🔥 Invalid signal ID:", signalIdRaw);
      }
    } else {
      console.log("🔥 No signal ID in payload");
    }

    // 2) trigger UI refetch of signals
    console.log("🔥 Triggering signals refresh");
    useSignalsRefreshStore.getState().bump();

    // 3) Handle different message types
    if (messageType === 'ai_analysis_complete') {
      console.log(`AI analysis completed for ${pair} ${direction} signal (Quality: ${qualityScore})`);
      
      // Show browser notification for foreground users
      if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification('🤖 AI Analysis Complete', {
          body: `${pair} ${direction} signal analyzed - Quality: ${qualityScore || 'N/A'}`,
          icon: '/images/favicon.ico',
          tag: `signal-${signalIdRaw}-ai-complete`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {}
          try {
            window.open(toAbsolute('/'), '_blank');
          } catch {}
        };
      }
    } else if (messageType === 'new_signal') {
      console.log(`New ${pair} ${direction} signal received`);
      
      // Show browser notification for foreground users
      if ('Notification' in window && Notification.permission === 'granted') {
        const emoji = direction === 'LONG' ? '🟢' : '🔴';
        const n = new Notification(`${emoji} New Trading Signal`, {
          body: `${pair} ${direction} signal received - AI analysis starting...`,
          icon: '/images/favicon.ico',
          tag: `signal-${signalIdRaw}-new`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {}
          try {
            window.open(toAbsolute('/'), '_blank');
          } catch {}
        };
      }
    }
  });
  } catch (error) {
    console.error("🔥 Firebase: Error setting up message listener:", error);
    return () => {}; // Return empty cleanup function
  }
};

export default app;