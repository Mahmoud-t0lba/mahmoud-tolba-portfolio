import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    type Firestore
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFunctions, type Functions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const requiredKeys = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId
];

export const firebaseEnabled = requiredKeys.every(Boolean);

let app = null as unknown as FirebaseApp;
let db = null as unknown as Firestore;
let auth = null as unknown as Auth;
let storage = null as unknown as FirebaseStorage;
let functions = null as unknown as Functions;

if (firebaseEnabled) {
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        })
    });
    auth = getAuth(app);
    storage = getStorage(app);
    functions = getFunctions(app);
} else if (typeof window !== 'undefined') {
    console.info('[Firebase] Running in local-only mode. Add NEXT_PUBLIC_FIREBASE_* variables to enable dashboard, forms, and analytics.');
}

if (typeof window !== 'undefined' && firebaseEnabled) {
    window.addEventListener('offline', () => {
        console.warn('%c[Firebase] Network connectivity lost. Switching to offline mode.', 'color: #ff9800; font-weight: bold;');
    });
    window.addEventListener('online', () => {
        console.info('%c[Firebase] Network connectivity restored.', 'color: #4caf50; font-weight: bold;');
    });
}

export { app, db, auth, storage, functions };
export default app;
