/**
 * Servicio de Autenticación con Google
 * 
 * Proporciona funcionalidad completa de autenticación con Google,
 * compatible tanto con Expo Go como con builds nativos de la aplicación.
 * 
 * Características:
 * - Detección automática del entorno de ejecución
 * - Soporte para múltiples plataformas (iOS, Android, Web)
 * - Gestión de credenciales de Firebase
 * - Diferenciación entre usuarios nuevos y existentes
 * - Manejo robusto de errores
 * 
 * @module GoogleAuthService
 * @requires firebase/auth
 * @requires expo-auth-session
 * @requires @react-native-google-signin/google-signin
 */

import { Alert, Platform } from 'react-native';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

/** Instancia de aplicación Firebase inicializada */
const app = initializeApp(firebaseConfig);
/** Servicio de autenticación de Firebase */
const auth = getAuth(app);

/**
 * Credenciales de Cliente de Google OAuth
 * 
 * IDs de cliente para autenticación OAuth de Google en diferentes plataformas.
 * Estos valores deben configurarse en Google Cloud Console.
 * @constant {string}
 */
const WEB_CLIENT_ID = '767069675314-tkdvi7q5j4pa6pof1l8ssn1rkrvbtpul.apps.googleusercontent.com';
const IOS_CLIENT_ID = '767069675314-vsqpsigqviltgigq65nf589doguhi81i.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '767069675314-05oabgv00id0lffhlk9h9na501f8qqn9.apps.googleusercontent.com';
const EXPO_CLIENT_ID = '767069675314-tkdvi7q5j4pa6pof1l8ssn1rkrvbtpul.apps.googleusercontent.com';

/**
 * Hook de Autenticación con Google para Expo Go
 * 
 * Proporciona funcionalidad de inicio de sesión con Google optimizada
 * para el entorno de Expo Go. Utiliza expo-auth-session para gestionar
 * el flujo de autenticación OAuth.
 * 
 * @hook
 * @returns {Object} Objeto con propiedades y métodos de autenticación
 * @returns {boolean} returns.loading - Indica si hay un proceso de autenticación en curso
 * @returns {Object} returns.request - Objeto de solicitud de autenticación
 * @returns {Object} returns.response - Respuesta de la autenticación
 * @returns {function} returns.signInWithGoogleExpo - Función para iniciar el flujo de autenticación
 * 
 * @example
 * const { loading, signInWithGoogleExpo } = useGoogleAuth();
 * await signInWithGoogleExpo(navigation);
 */
export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        selectAccount: true,
    });

    /**
     * Inicia Sesión con Google (Expo Go)
     * 
     * Ejecuta el flujo completo de autenticación con Google en Expo Go:
     * 1. Inicia el prompt de autenticación de Google
     * 2. Obtiene el token de ID
     * 3. Crea credenciales de Firebase
     * 4. Autentica al usuario en Firebase
     * 5. Determina si es usuario nuevo o existente
     * 6. Navega a la pantalla correspondiente
     * 
     * @async
     * @param {Object} navigation - Objeto de navegación de React Navigation
     * @returns {Promise<Object>} Usuario autenticado de Firebase
     * @throws {Error} Si el proceso de autenticación falla
     */
    const signInWithGoogleExpo = async (navigation) => {
        try {
            setLoading(true);
            console.log('Iniciando promptAsync para obtener token de Google');

            // Comprobar si tenemos los elementos necesarios para la autenticación
            if (!promptAsync) {
                throw new Error('promptAsync no está disponible');
            }

            const result = await promptAsync();
            console.log('Resultado de promptAsync:', result.type);

            if (result.type === 'success') {
                // Extraer el token ID de los parámetros
                const { id_token } = result.params;

                if (!id_token) {
                    throw new Error('No se pudo obtener el token de ID');
                }

                console.log('Token de ID obtenido, creando credencial para Firebase');
                const credential = GoogleAuthProvider.credential(id_token);

                console.log('Iniciando sesión en Firebase con credencial');
                const userCredential = await signInWithCredential(auth, credential);
                const user = userCredential.user;

                console.log('Autenticación exitosa en Firebase:', user.email);

                /**
                 * Determina si el usuario es nuevo comparando timestamps
                 * de creación e último inicio de sesión
                 */
                const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

                if (isNewUser) {
                    console.log('Usuario nuevo, navegando a Register Data Email');
                    navigation.navigate('Register Data Email', {
                        uid: user.uid,
                        email: user.email,
                    });
                } else {
                    console.log('Usuario existente, navegando a Home');
                    navigation.navigate('Home');
                }

                return user;
            } else if (result.type === 'cancel') {
                console.log('Autenticación cancelada por el usuario');
                throw new Error('Inicio de sesión cancelado por el usuario');
            } else {
                console.log('Resultado inesperado de promptAsync:', result);
                throw new Error(`Inicio de sesión fallido: ${result.type}`);
            }
        } catch (error) {
            console.error('Error en signInWithGoogleExpo:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        request,
        response,
        signInWithGoogleExpo,
    };
};

/**
 * Configura Google Sign-In para Builds Nativos
 * 
 * Inicializa y configura el servicio de Google Sign-In para aplicaciones
 * compiladas nativamente (no Expo Go). Detecta automáticamente el entorno
 * y omite la configuración si se ejecuta en Expo Go.
 * 
 * @async
 * @function
 * @returns {Promise<void>}
 */
export const configureGoogleSignIn = async () => {
    try {
        /**
         * Detecta si la aplicación se ejecuta en Expo Go
         * Expo Go requiere un método diferente de autenticación
         */
        const isExpoGo = Platform.OS !== 'web' &&
            (Constants?.executionEnvironment === 'storeClient' ||
                Constants?.executionEnvironment === 'standalone');

        // Solo intentamos cargar GoogleSignin si NO estamos en Expo Go
        if (Platform.OS !== 'web' && !isExpoGo) {
            try {
                const { GoogleSignin } = require('@react-native-google-signin/google-signin');

                GoogleSignin.configure({
                    webClientId: WEB_CLIENT_ID,
                    offlineAccess: true,
                    // Para iOS, si se necesita solicitar el email
                    iosClientId: Platform.OS === 'ios' ? IOS_CLIENT_ID : undefined,
                });

                console.log('GoogleSignin configurado correctamente');
            } catch (error) {
                console.log('No se pudo cargar GoogleSignin:', error);
            }
        } else {
            console.log('Omitiendo configuración de GoogleSignin en Expo Go');
        }
    } catch (error) {
        console.error('Error al configurar GoogleSignin:', error);
    }
};

/**
 * Inicia Sesión con Google (Build Nativo)
 * 
 * Implementa el flujo de autenticación con Google para aplicaciones
 * compiladas nativamente usando @react-native-google-signin/google-signin.
 * 
 * Proceso:
 * 1. Verifica disponibilidad de Google Play Services (Android)
 * 2. Cierra cualquier sesión previa para estado limpio
 * 3. Inicia el flujo de autenticación de Google
 * 4. Obtiene el token de ID
 * 5. Autentica en Firebase
 * 6. Navega según el estado del usuario (nuevo/existente)
 * 
 * @async
 * @param {Object} navigation - Objeto de navegación de React Navigation
 * @returns {Promise<Object>} Usuario autenticado de Firebase
 * @throws {Error} Si falla la autenticación
 */
export const signInWithGoogleNative = async (navigation) => {
    try {
        const { GoogleSignin } = require('@react-native-google-signin/google-signin');

        /**
         * Verifica que Google Play Services esté disponible (solo Android)
         * Muestra diálogo de actualización si es necesario
         */
        if (Platform.OS === 'android') {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }

        // Cerrar sesión primero para un estado limpio
        await GoogleSignin.signOut();

        // Iniciar el flujo de autenticación
        const userInfo = await GoogleSignin.signIn();
        console.log('Google Sign-In exitoso', userInfo);

        // Obtener el token de ID - verificamos si está directamente o en data.idToken
        const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);

        if (!idToken) {
            console.error('Estructura del objeto userInfo:', JSON.stringify(userInfo, null, 2));
            throw new Error('No se pudo obtener el token de ID de Google');
        }

        console.log('Token ID obtenido correctamente');

        // Crear credencial para Firebase
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Iniciar sesión en Firebase
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        console.log('Usuario autenticado en Firebase:', user.email);

        /**
         * Determina si es un usuario nuevo o existente
         * para dirigirlo a la pantalla apropiada
         */
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

        if (isNewUser) {
            navigation.navigate('Register Data Email', {
                uid: user.uid,
                email: user.email,
            });
        } else {
            navigation.navigate('Home');
        }

        return user;
    } catch (error) {
        console.error('Error en signInWithGoogleNative:', error);

        let errorMessage = 'Error al iniciar sesión con Google';
        if (error.code === 'CANCELED') {
            errorMessage = 'Inicio de sesión cancelado';
        } else if (error.code === 'SIGN_IN_REQUIRED') {
            errorMessage = 'Se requiere iniciar sesión con Google';
        }

        Alert.alert('Error', errorMessage);
        throw error;
    }
};

// Asegurar compatibilidad con código existente
export const signInWithGoogle = signInWithGoogleNative;

/**
 * Cierra Sesión de Google
 * 
 * Cierra la sesión del usuario tanto en Google Sign-In como en Firebase.
 * Revoca el acceso y limpia todas las credenciales almacenadas.
 * 
 * @async
 * @function
 * @returns {Promise<void>}
 */
export const signOutGoogle = async () => {
    try {
        if (Platform.OS !== 'web') {
            try {
                // Cerrar sesión en GoogleSignin
                const { GoogleSignin } = require('@react-native-google-signin/google-signin');
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            } catch (error) {
                console.log('Error al cerrar sesión en GoogleSignin:', error);
            }
        }

        // Cerrar sesión en Firebase
        await auth.signOut();
        console.log('Sesión cerrada correctamente');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};

/**
 * Registra un Nuevo Usuario
 * 
 * Guarda los datos adicionales del usuario en la base de datos.
 * Esta es una función placeholder que debe implementar la lógica
 * de guardado en Firestore.
 * 
 * @param {string} uid - ID único del usuario en Firebase
 * @param {string} email - Correo electrónico del usuario
 * @param {Object} additionalData - Datos adicionales del usuario a guardar
 * @returns {boolean} true si el registro fue exitoso
 * @todo Implementar lógica completa de guardado en Firestore
 */
export const signUp = async (uid, email, additionalData) => {
    console.log('Registrando usuario con ID:', uid, 'Email:', email, 'Datos adicionales:', additionalData);
    return true; // Implementa tu lógica de guardado en Firestore aquí
};