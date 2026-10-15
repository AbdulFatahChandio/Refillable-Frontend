// public/firebase-messagssing-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyCuHlpvqn9stiafX4dneCIa8NrG-QrBjI4",
  authDomain: "bijou-sky.firebaseapp.com",
  projectId: "bijou-sky",
  storageBucket: "bijou-sky.firebasestorage.app",
  messagingSenderId: "391228295757",
  appId: "1:391228295757:web:fefdaa05b5e9ac8caaaa04",
  measurementId: "G-GHHWFKY2JD"
});

const messaging = firebase.messaging();



messaging.onBackgroundMessage(async (payload) => {
  console.log("📩 Background FCM Payload:", payload);

  const allClients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({
      type: "NEW_NOTIFICATION",
      payload,
    });
  }
});