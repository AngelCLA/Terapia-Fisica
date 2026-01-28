/**
 * Configuración de Firebase
 * 
 * Inicializa y exporta los servicios de Firebase utilizados en la aplicación:
 * - Authentication: Autenticación de usuarios con persistencia local
 * - Firestore: Base de datos NoSQL en la nube
 * - Realtime Database: Base de datos en tiempo real
 * - Google Auth Provider: Proveedor de autenticación con Google
 * 
 * @module firebaseConfig
 * @requires firebase/app
 * @requires firebase/auth
 * @requires firebase/database
 * @requires firebase/firestore
 */

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Objeto de Configuración de Firebase
 * 
 * Credenciales y configuración del proyecto Firebase.
 * Estos valores se obtienen de la consola de Firebase.
 * 
 * @constant {Object}
 */
const firebaseConfig = {
    apiKey: "AIzaSyAiK9Lpxefc-ZCFSxhXU2hUViQvGlI0Nl4",
    authDomain: "terapiafisica-8a788.firebaseapp.com",
    projectId: "terapiafisica-8a788",
    storageBucket: "terapiafisica-8a788.firebasestorage.app",
    messagingSenderId: "767069675314",
    appId: "1:767069675314:web:8faa8854eb1eb461ed012b",
    measurementId: "G-EMVYX3Q9ZG"
};

/** Exporta la configuración de Firebase */
export { firebaseConfig };

/**
 * Inicialización de Servicios Firebase
 */

/** Instancia principal de la aplicación Firebase */
const app = initializeApp(firebaseConfig);

/** Servicio de Realtime Database */
const database = getDatabase(app);

/**
 * Servicio de Autenticación con Persistencia
 * Utiliza AsyncStorage para mantener la sesión entre reinicios de la app
 */
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

/** Proveedor de Autenticación con Google */
const googleProvider = new GoogleAuthProvider();

/** Exporta servicios de Firebase para uso en la aplicación */
export { app, database, auth, googleProvider };

/** Servicio de Firestore (base de datos NoSQL) */
const db = getFirestore(app);
export { db };