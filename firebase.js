

import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCuHlpvqn9stiafX4dneCIa8NrG-QrBjI4",
  authDomain: "bijou-sky.firebaseapp.com",
  projectId: "bijou-sky",
  storageBucket: "bijou-sky.firebasestorage.app",
  messagingSenderId: "391228295757",
  appId: "1:391228295757:web:fefdaa05b5e9ac8caaaa04",
  measurementId: "G-GHHWFKY2JD"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// returns Messaging instance OR null (never throws out)
async function getMessagingSafe() {
    if (typeof window === "undefined") return null;
    if (!("serviceWorker" in navigator)) return null; // IG/FB iOS me often missing

    try {
        const { isSupported, getMessaging } = await import("firebase/messaging");
        const ok = await isSupported(); // Firebase recommended guard :contentReference[oaicite:2]{index=2}
        if (!ok) return null;

        return getMessaging(app);
    } catch (e) {
        console.warn("FCM messaging not supported here:", e);
        return null;
    }
}

export const getFcmToken = async () => {
    try {
        const messaging = await getMessagingSafe();
        if (!messaging) return null;

        // Optional: permission guard (in-app browsers often won't grant)
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
            try { await Notification.requestPermission(); } catch { }
        }
        if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
            return null;
        }

        // Ensure SW is registered before getToken (recommended in many setups)
        const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const { getToken } = await import("firebase/messaging");
        const token = await getToken(messaging, {
            vapidKey: "BOTpbF7sy2TINPxfZ5hEKcXC9wdmrbqAW2JKShSsPItB4-esApxt14ebK2aBDNJyCTm-7RTudYDXUlus6PcmEb0",
            serviceWorkerRegistration: swReg,
        });

        return token || null;
    } catch (error) {
        console.warn("FCM Token Error:", error);
        return null;
    }
};

export const subscribeToMessages = async (callback) => {
    const messaging = await getMessagingSafe();
    if (!messaging) return;

    try {
        const { onMessage } = await import("firebase/messaging");
        return onMessage(messaging, callback);
    } catch (e) {
        console.warn("onMessage failed:", e);
    }
};

export default app;