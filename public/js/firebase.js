// ===============================
// Firebase core imports (v9)
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// ===============================
// Your Firebase configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyA_ktyvnfldoL9s16MVmXSX1sOOhmKtf-c",
  authDomain: "roadtrace-a5e72.firebaseapp.com",
  projectId: "roadtrace-a5e72",
  storageBucket: "roadtrace-a5e72.firebasestorage.app",
  messagingSenderId: "1003421397183",
  appId: "1:1003421397183:web:b85a06172744941fe0d60a"
};

// ===============================
// Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);

// ===============================
// Initialize services
// ===============================
const db = getFirestore(app);      // Firestore database
const auth = getAuth(app);         // Authentication
const storage = getStorage(app);   // Image/file storage

// ===============================
// Export for other JS files
// ===============================
export { db, auth, storage };
