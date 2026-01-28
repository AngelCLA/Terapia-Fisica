import React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {getDatabase} from '../../firebaseConfig.js';
import {firebaseConfig} from '../../firebaseConfig.js';
import {initializeApp} from 'firebase/app';
import { configureGoogleSignIn, useGoogleAuth, signInWithGoogleNative } from '../../GoogleAuthService';
import Constants from 'expo-constants';

import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

/**
 * Pantalla de Inicio de Sesión
 * 
 * Componente que maneja la autenticación de usuarios mediante:
 * - Correo electrónico y contraseña
 * - Google Sign-In (compatible con Expo Go y builds nativas)
 * - Facebook (en desarrollo)
 * 
 * Gestiona el flujo de verificación de email y redirige al usuario
 * según el estado de su cuenta.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.navigation - Objeto de navegación de React Navigation
 * @returns {React.ReactElement} Componente de pantalla de inicio de sesión
 */
const LoginScreen = ({ navigation }) => {

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    /** Inicializa la instancia de Firebase */
    const app = initializeApp(firebaseConfig);
    /** Servicio de autenticación de Firebase */
    const auth = getAuth(app);

    /**
     * Detección de Entorno de Ejecución
     * 
     * Determina si la aplicación se ejecuta en Expo Go o en un build nativo.
     * Esto es necesario para seleccionar el método correcto de autenticación con Google.
     * @type {boolean}
     */
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    console.log('Entorno de ejecución:', Constants.executionEnvironment, 'isExpoGo:', isExpoGo);

    /** Hook personalizado para autenticación con Google (compatible con Expo Go) */
    const googleAuth = useGoogleAuth();

    /**
     * Effect: Configuración de Google Sign-In
     * 
     * Inicializa la configuración necesaria para la autenticación con Google
     * al montar el componente.
     */
    useEffect(() => {
        const setupGoogleAuth = async () => {
            await configureGoogleSignIn();
        };

        setupGoogleAuth();
    }, []);

    /**
     * Crea una Nueva Cuenta de Usuario
     * 
     * NOTA: Esta función se mantiene para propósitos de desarrollo/debug
     * pero no se utiliza en el flujo principal de la aplicación.
     * 
     * @async
     * @deprecated No se utiliza en el flujo actual
     */
    const handleCreateAccount = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Creado usuario con éxito');
                const user = userCredential.user;
                console.log(user.email);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * Maneja el Inicio de Sesión con Email
     * 
     * Autentica al usuario con correo electrónico y contraseña.
     * Verifica si el email está confirmado antes de permitir el acceso.
     * Si el email no está verificado, redirige a la pantalla de verificación.
     * 
     * @async
     * @function
     */
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
            return;
        }

        setLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Signed in');
                const user = userCredential.user;
                console.log(user.email);

                /** Verifica si el email del usuario ha sido confirmado */
                if (!user.emailVerified) {
                    /** Email no verificado - redirigir a pantalla de verificación */
                    Alert.alert(
                        'Cuenta no verificada',
                        'Tu cuenta no ha sido verificada. Necesitas completar el proceso de verificación para continuar.',
                        [
                            {
                                text: 'Continuar verificación',
                                onPress: () => navigation.navigate('Verificacion de Codigo EMail', { user })
                            }
                        ]
                    );
                } else {
                    /** Email verificado - navegar a la pantalla principal */
                    navigation.navigate('Home');
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);

                let errorMessage = 'Error al iniciar sesión';
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Esta cuenta ha sido deshabilitada';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No existe una cuenta con este correo electrónico';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Contraseña incorrecta';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Error de conexión. Verifica tu internet';
                        break;
                    default:
                        console.log('Error de inicio de sesión:', error.code, error.message);
                }

                Alert.alert('Error', errorMessage);
            });
    }

    /**
     * Maneja el Inicio de Sesión con Google
     * 
     * Gestiona la autenticación mediante Google Sign-In, adaptando el método
     * según el entorno de ejecución (Expo Go vs. build nativo).
     * 
     * @async
     * @function
     */
    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            console.log('Iniciando autenticación de Google en:', isExpoGo ? 'Expo Go' : 'Entorno nativo');

            if (isExpoGo) {
                /** En Expo Go, utiliza el método del hook personalizado */
                console.log('Usando signInWithGoogleExpo');
                if (!googleAuth || !googleAuth.signInWithGoogleExpo) {
                    throw new Error('Método de autenticación no disponible en Expo Go');
                }
                await googleAuth.signInWithGoogleExpo(navigation);
            } else {
                /** En build nativo, utiliza el método tradicional de Google Sign-In */
                console.log('Usando signInWithGoogleNative');
                await signInWithGoogleNative(navigation);
            }
        } catch (error) {
            console.log('Error manejado en LoginScreen:', error);
            let errorMessage = 'Ha ocurrido un error al iniciar sesión con Google.';

            if (error.message) {
                errorMessage += ' ' + error.message;
            }

            Alert.alert(
                'Error de inicio de sesión',
                errorMessage
            );
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.container}>
                    <ImageBackground
                        source={require('../assets/loginScreen.png')}
                        style={styles.contentImage}
                    >
                    </ImageBackground>
                    <View style={styles.content}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.title}>
                                Inicia Sesión
                            </Text>
                            <TextInput
                                onChangeText={(text) => setEmail(text)}
                                placeholder="Correo electrónico o número de teléfono"
                                placeholderTextColor="#888888"
                                style={styles.inputLabels}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                onChangeText={(text) => setPassword(text)}
                                placeholder="Contraseña"
                                placeholderTextColor="#888888"
                                style={styles.inputLabels}
                                secureTextEntry
                            />
                            <Text style={{ color: '#888888', fontSize: 16 }}>
                                ¿Olvidaste tu contraseña? <Text style={{ color: '#0091FF' }} onPress={() => navigation.navigate('Recuperar contraseña')}>Reestablecer</Text>
                            </Text>
                            <Pressable
                                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                accessibilityLabel={'Home'}
                                onPress={handleSignIn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <View style={styles.buttonLoadingContainer}>
                                        <ActivityIndicator size="small" color="#ffffff" />
                                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginLeft: 10 }}>
                                            Iniciando...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                        Iniciar Sesión
                                    </Text>
                                )}
                            </Pressable>
                            <Text style={{ color: '#888888', fontSize: 22, fontWeight: 'bold' }}>
                                O
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                {/* Botón Google */}
                                <Pressable
                                    style={[styles.buttonGoogle, googleLoading && styles.buttonDisabled]}
                                    onPress={handleGoogleSignIn}
                                    disabled={googleLoading}
                                >
                                    {googleLoading ? (
                                        <ActivityIndicator size="small" color="#535353" />
                                    ) : (
                                        <FontAwesome name="google" size={32} color="#535353" />
                                    )}
                                </Pressable>

                                {/* Botón Facebook */}
                                <Pressable
                                    style={styles.buttonFacebook}
                                    onPress={() => console.log('Botón Facebook presionado')}
                                >
                                    <FontAwesome name="facebook" size={32} color="white" />
                                </Pressable>
                            </View>
                            <Text style={{ color: '#535353', fontSize: 16, fontWeight: 'bold', marginTop: 15 }}>
                                ¿Aun no tienes cuenta?
                            </Text>
                            <Text style={{ color: '#0091FF', fontSize: 16, fontWeight: 'bold', }} onPress={() => navigation.navigate('Registrarse')}>Registrate aqui</Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#888888', fontSize: 18, fontWeight: 'bold' }}>
                                He leido y aceptado los
                            </Text>
                            <Text style={{ color: '#7469B6', fontSize: 18, fontWeight: 'bold' }}>
                                Términos y condiciones
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeAreaProvider>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
    },
    contentImage: {
        width: '100%',
        height: 400,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#535353',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#EBEBFF',
        alignItems: 'center',
        marginTop: -100,
        padding: 16,
        borderRadius: 26,
        paddingTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    loginButtonDisabled: {
        backgroundColor: '#a99ee0',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputLabels: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#535353',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    buttonFacebook: {
        width: 65,
        height: 65,
        backgroundColor: '#316FF6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    buttonGoogle: {
        width: 65,
        height: 65,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
});

export default LoginScreen;