import { messaging, db } from '../firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/constants';

// Default VAPID key placeholder. The client can override this in .env.local
const DEFAULT_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

/**
 * Requests notification permission, retrieves the FCM registration token,
 * and associates it with the customer's phone/mobile number in Firestore.
 * @param {string} mobile - Customer's mobile number
 */
export async function requestAndSaveToken(mobile) {
  if (!mobile) return;
  
  // Clean phone number (remove spaces, plus, etc.)
  const cleanMobile = String(mobile).replace(/\D/g, '');

  if (!('Notification' in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("Notification permission denied or dismissed.");
      return;
    }

    if (!messaging) {
      console.warn("Firebase Messaging is not initialized or supported in this browser.");
      return;
    }

    if (!DEFAULT_VAPID_KEY) {
      console.warn("VITE_FIREBASE_VAPID_KEY is not defined in environment variables. FCM registration might fail.");
    }

    const token = await getToken(messaging, { vapidKey: DEFAULT_VAPID_KEY });
    if (token) {
      console.log("FCM Token successfully generated:", token);
      
      // Save token-to-mobile mapping in Firestore
      const tokenRef = doc(db, FIRESTORE_COLLECTIONS.FCM_TOKENS, token);
      await setDoc(tokenRef, {
        token,
        mobile: cleanMobile,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`FCM token successfully registered to mobile: ${cleanMobile}`);
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("Error during FCM token generation/registration:", error);
  }
}
