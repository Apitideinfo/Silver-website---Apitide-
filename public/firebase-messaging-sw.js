// Give the service worker access to Firebase Messaging.
// Note that you can import standard scripts inside service workers.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "29247600174"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'Order Status Update';
  const notificationOptions = {
    body: payload.notification?.body || 'Your order status has been updated.',
    icon: '/favicon.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
