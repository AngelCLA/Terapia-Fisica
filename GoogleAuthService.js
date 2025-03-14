// Importa Constants para detectar el entorno
import { Alert, Platform } from 'react-native';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ID de cliente de Google para la autenticación
const WEB_CLIENT_ID = '767069675314-tkdvi7q5j4pa6pof1l8ssn1rkrvbtpul.apps.googleusercontent.com';
const IOS_CLIENT_ID = '767069675314-vsqpsigqviltgigq65nf589doguhi81i.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '767069675314-05oabgv00id0lffhlk9h9na501f8qqn9.apps.googleusercontent.com';
const EXPO_CLIENT_ID = '767069675314-tkdvi7q5j4pa6pof1l8ssn1rkrvbtpul.apps.googleusercontent.com';

// Hook personalizado para autenticación con Google en Expo Go
export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        selectAccount: true,
    });

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

                // Verificar si el usuario es nuevo o existente
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

// Configura GoogleSignin para Android y iOS (para builds nativas)
export const configureGoogleSignIn = async () => {
    try {
        // Verificamos si estamos en Expo Go
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

// Función para iniciar sesión con Google usando la implementación nativa
export const signInWithGoogleNative = async (navigation) => {
    try {
        const { GoogleSignin } = require('@react-native-google-signin/google-signin');

        // Asegúrate de que los servicios de Google Play estén disponibles (solo Android)
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

        // Verificar si el usuario es nuevo o existente
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

// Función para cerrar sesión
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

// Función para registrar usuario
export const signUp = async (uid, email, additionalData) => {
    console.log('Registrando usuario con ID:', uid, 'Email:', email, 'Datos adicionales:', additionalData);
    return true; // Implementa tu lógica de guardado en Firestore aquí
};