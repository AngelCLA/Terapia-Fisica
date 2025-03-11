import React from 'react';
import { useState, useEffect } from 'react';
import {
    ImageBackground,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig.js';
import { configureGoogleSignIn, signInWithGoogle, signUp } from "../../GoogleAuthService"; // Importar signUp

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    useEffect(() => {
        configureGoogleSignIn();
    }, []);

    // Validación de email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validación de contraseña
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    // Manejo de cambios en los inputs
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar errores al escribir
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    // Validación del formulario completo
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
            isValid = false;
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra y un número';
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }
        if (!acceptedTerms) {
            Alert.alert('Error', 'Debes aceptar los términos y condiciones');
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // Manejar el registro con Firebase
    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Crear usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            console.log('Usuario registrado:', user.email);

            // Enviar el correo de verificación
            await sendEmailVerification(user);

            // Guardar datos adicionales en Firestore
            await signUp(user.uid, user.email, {
                // Aquí puedes agregar más datos del usuario si es necesario
                name: '', // Por ejemplo, el nombre del usuario
                lastName: '', // Apellido del usuario
            });

            Alert.alert(
                'Registro exitoso',
                'Se ha enviado un correo de verificación a tu dirección de correo electrónico.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Register Data Email', {
                            uid: user.uid,
                            email: user.email
                        })
                    },
                ]
            );
        } catch (error) {
            let errorMessage = 'No se pudo completar el registro';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo electrónico ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El correo electrónico no es válido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es demasiado débil';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de red. Verifica tu conexión';
                    break;
                default:
                    console.log('Error de registro:', error.code, error.message);
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await signInWithGoogle(navigation);
        } catch (error) {
            console.log('Error manejado en LoginScreen:', error);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/registerScreen.png')}
                    style={styles.contentImage}
                />
                <View style={styles.content}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.title}>Registrate</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Correo electrónico"
                                placeholderTextColor="#888888"
                                style={[styles.inputLabels, errors.email && styles.inputError]}
                                value={formData.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Contraseña"
                                placeholderTextColor="#888888"
                                style={[styles.inputLabels, errors.password && styles.inputError]}
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                secureTextEntry
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#888888"
                                style={[styles.inputLabels, errors.confirmPassword && styles.inputError]}
                                value={formData.confirmPassword}
                                onChangeText={(text) => handleChange('confirmPassword', text)}
                                secureTextEntry
                            />
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        <Pressable
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            accessibilityLabel={'Registrarse'}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            )}
                        </Pressable>

                        <Text style={styles.orText}>O</Text>
                        <View style={styles.termsContainer}>
                            <Pressable
                                style={styles.termsCheckbox}
                                onPress={() => setAcceptedTerms(!acceptedTerms)}
                            >
                                <FontAwesome
                                    name={acceptedTerms ? 'check-square-o' : 'square-o'}
                                    size={24}
                                    color="#7469B6"
                                />
                            </Pressable>
                            <Text style={styles.termsText}>
                                He leído y acepto los{' '}
                                <Text style={styles.termsLink}>Términos y condiciones</Text>
                            </Text>
                        </View>
                        <View style={styles.socialButtonsContainer}>
                            {/* Botón Google */}
                            <Pressable
                                style={[styles.buttonGoogle, googleLoading && styles.buttonDisabled]}
                                onPress={handleGoogleSignIn}
                                disabled={googleLoading || loading}
                            >
                                {googleLoading ? (
                                    <ActivityIndicator size="small" color="#535353" />
                                ) : (
                                    <FontAwesome name="google" size={32} color="#535353" />
                                )}
                            </Pressable>
                            <Pressable
                                style={styles.buttonFacebook}
                                onPress={() => {
                                    console.log('Botón Facebook presionado');
                                    navigation.navigate('Home');
                                }}
                            >
                                <FontAwesome name="facebook" size={32} color="white" />
                            </Pressable>


                        </View>

                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
                            <Text
                                style={styles.loginLink}
                                onPress={() => navigation.navigate('Inicio de sesión')}
                            >
                                Inicia sesión
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
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
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#535353',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#EBEBFF',
        alignItems: 'center',
        marginTop: -100,
        padding: 16,
        paddingTop: 30,
        borderRadius: 26,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    inputLabels: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#535353',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff3333',
        borderWidth: 1,
    },
    errorText: {
        color: '#ff3333',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    registerButtonDisabled: {
        backgroundColor: '#a99ee0',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    orText: {
        color: '#888888',
        fontSize: 22,
        fontWeight: 'bold',
        //marginVertical: 10,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
        elevation: 5,
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
        elevation: 5,
    },
    loginLinkContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    loginText: {
        color: '#535353',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        color: '#0091FF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
       // marginTop: 20,
        paddingHorizontal: 20,
    },
    termsCheckbox: {
        marginRight: 10,
    },
    termsText: {
        color: '#888888',
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    termsLink: {
        color: '#7469B6',
    },
});

export default RegisterScreen;