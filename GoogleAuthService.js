// GoogleAuthService.js
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { Alert } from 'react-native';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configura GoogleSignin
export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        // Using the web client ID from your google-services.json
        webClientId: '767069675314-tkdvi7q5j4pa6pof1l8ssn1rkrvbtpul.apps.googleusercontent.com',
        offlineAccess: true,
    });
};

// Función para iniciar sesión con Google
export const signInWithGoogle = async (navigation) => {
    try {
        // Check for Play Services with a proper error message
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true
        });

        // Sign out first to ensure a clean state
        await GoogleSignin.signOut();

        // Proceed with signin
        const userInfo = await GoogleSignin.signIn();

        console.log('Google Sign-In successful, user info:', userInfo);
        console.log('idToken being used:', idToken);
        console.log('googleCredential created:', googleCredential);

        // FIXED: Create the credential properly using ONLY the idToken
        // The key change is that we're correctly accessing the idToken from the response structure
        const idToken = userInfo.idToken || userInfo.data?.idToken;

        if (!idToken) {
            throw new Error('No idToken available in Google Sign-In response');
        }

        // Create the credential with ONLY the idToken (no need for accessToken)
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Sign in to Firebase
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        console.log('Usuario Google autenticado:', user.email);

        // Verificamos si el usuario es nuevo o ya existente
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
        console.error('Error en la autenticación con Google:', error);

        // Handle specific error cases with helpful messages
        let errorMessage = 'Ocurrió un error al iniciar sesión con Google';

        if (error.code === 'auth/argument-error') {
            errorMessage = 'Error en la configuración de autenticación. Verifique los tokens de Google.';
            console.log('Error detallado:', error.message);
        }

        Alert.alert('Error', errorMessage);
        throw error;
    }
};

// Función para cerrar sesión
export const signOutGoogle = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth.signOut();
        console.log('Sesión cerrada correctamente');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};