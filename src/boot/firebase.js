// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyD25VKBtcBhQk7X4ragNT5tzHGWAfiZFtc',
    authDomain: 'ecschool-631f6.firebaseapp.com',
    projectId: 'ecschool-631f6',
    storageBucket: 'ecschool-631f6.appspot.com',
    messagingSenderId: '4499469115',
    appId: '1:4499469115:web:9d7bc65f5865fbcc1efd1e',
    measurementId: 'G-X21Y17TY0G',
    databaseURL: 'https://ecschool-631f6-default-rtdb.europe-west1.firebasedatabase.app/'
};

// Initialize Firebase
//const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const realtimeDB = getDatabase(app);

const auth = getAuth();

export { firestoreDB, realtimeDB, auth, app }