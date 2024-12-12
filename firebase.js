import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA3sGD8q6PJ2OBpakqaVeh6rFbacna--u8",
    authDomain: "cinescore-6e4b9.firebaseapp.com",
    projectId: "cinescore-6e4b9",
    storageBucket: "cinescore-6e4b9.appspot.com",
    messagingSenderId: "614788465962",
    appId: "1:614788465962:web:30dea761d66ff83d4cca53",
};

const app = initializeApp(firebaseConfig);

let auth;
if (!getAuth()) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} else {
    auth = getAuth();
}

const db = getFirestore(app);

export { auth, db };

