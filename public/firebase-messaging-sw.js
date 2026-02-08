// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(async function(payload) {
  console.log("🔔 Service Worker: Background message received:", payload);
  
  const signalId = payload?.data?.signal_id;
  const messageType = payload?.data?.type;
  const pair = payload?.data?.pair;
  const direction = payload?.data?.direction;
  const qualityScore = payload?.data?.quality_score;
  
  console.log("🔔 Service Worker: Parsed data:", { signalId, messageType, pair, direction, qualityScore });
  
  // Different notification content based on message type
  let notificationTitle, notificationBody;
  
  if (messageType === 'ai_analysis_complete') {
    // AI Analysis Complete Notification
    notificationTitle = '🤖 AI Analysis Complete';
    notificationBody = `${pair} ${direction} signal analyzed - Quality: ${qualityScore || 'N/A'}`;
  } else {
    // New Trading Signal Notification
    const emoji = direction === 'LONG' ? '🟢' : '🔴';
    notificationTitle = `${emoji} New Trading Signal`;
    notificationBody = `${pair} ${direction} signal received - AI analysis starting...`;
  }
  
  console.log("🔔 Service Worker: Notification content:", { notificationTitle, notificationBody });
  
  const notificationTag = signalId ? `signal-${signalId}-${messageType || 'new'}` : undefined;

  // If the message already contains a notification payload, FCM will display it.
  // Do NOT call showNotification to prevent duplicates.
  if (!payload.notification) {
    const notificationOptions = {
      body: notificationBody,
      icon: '/images/favicon.ico',
      badge: '/images/favicon.ico',
      data: payload.data,
      tag: notificationTag,
      renotify: true, // Allow renotification for AI updates
    };

    // Show notification (allow both new and AI complete notifications)
    await self.registration.showNotification(notificationTitle, notificationOptions);
  }

  // Notify open clients to refresh signals
  try {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    let clientMessageType;
    
    if (messageType === 'ai_analysis_complete') {
      clientMessageType = 'signals:ai_complete';
    } else if (messageType === 'new_signal') {
      clientMessageType = 'signals:new';
    } else {
      // Fallback for backward compatibility
      clientMessageType = 'signals:new';
    }
    
    console.log("🔔 Service Worker: Sending message to clients:", { clientMessageType, clientCount: clientList.length, payload: payload.data });
    
    clientList.forEach((client) => {
      console.log("🔔 Service Worker: Sending to client:", client.url);
      client.postMessage({ type: clientMessageType, payload: payload.data || {} });
    });
  } catch (err) {
    // Fallback: still try to notify clients
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      let clientMessageType;
      
      if (messageType === 'ai_analysis_complete') {
        clientMessageType = 'signals:ai_complete';
      } else if (messageType === 'new_signal') {
        clientMessageType = 'signals:new';
      } else {
        clientMessageType = 'signals:new';
      }
      
      clientList.forEach((client) => {
        client.postMessage({ type: clientMessageType, payload: payload.data || {} });
      });
    });
  }
});

// Open the app on notification click
self.APP_BASE_URL = 'https://bitiq-frontend-v-2.vercel.app';
self.getAppUrl = function(path = '/') {
  try {
    // Prefer explicit base, fallback to current origin
    const base = self.APP_BASE_URL || (self.location && self.location.origin) || '';
    return base.replace(/\/$/, '') + path;
  } catch {
    return path;
  }
};

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil((async () => {
    try {
      // Always open a new window/tab to avoid cross-origin navigate limitations
      const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || self.getAppUrl('/');
      if (self.clients && self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
        return;
      }
    } catch (err) {
      // Fallback: no-op
    }
  })());
});
