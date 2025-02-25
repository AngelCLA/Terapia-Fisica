import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Pressable,
    Alert,
    BackHandler,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const VerifyEmailScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [autoVerifying, setAutoVerifying] = useState(false);
    const auth = getAuth(initializeApp(firebaseConfig));

    // Prevenir que el usuario retroceda sin verificar
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    '¿Estás seguro?',
                    'Es necesario verificar tu correo para continuar con el registro. Si sales ahora, tendrás que iniciar el proceso nuevamente.',
                    [
                        {
                            text: 'Permanecer aquí',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        {
                            text: 'Salir y cancelar',
                            onPress: () => {
                                auth.signOut();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            },
                            style: 'destructive'
                        }
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    // Verificación automática periódica
    useEffect(() => {
        let interval;
        if (autoVerifying) {
            interval = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(prevTime => prevTime - 1);
                } else {
                    setTimeLeft(60);
                    checkEmailVerification(false);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [autoVerifying, timeLeft]);

    // Iniciar verificación automática al cargar la pantalla
    useEffect(() => {
        setAutoVerifying(true);
        // Verificar correo de inmediato
        checkEmailVerification(false);
    }, []);

    // Función para reenviar el correo de verificación
    const resendVerificationEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                setLoading(true);
                await sendEmailVerification(user);
                setLoading(false);
                setTimeLeft(60);
                Alert.alert(
                    'Correo enviado',
                    'Hemos enviado un nuevo correo de verificación. Por favor revisa tu bandeja de entrada.',
                    [{ text: 'OK' }]
                );
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'No se pudo enviar el correo de verificación. Inténtalo de nuevo más tarde.');
            }
        }
    };

    // Función para verificar si el correo electrónico está verificado
    const checkEmailVerification = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        } else {
            setCheckingStatus(true);
        }

        const user = auth.currentUser;

        if (user) {
            try {
                await user.reload();
                const updatedUser = auth.currentUser;

                if (updatedUser.emailVerified) {
                    setLoading(false);
                    setCheckingStatus(false);
                    setAutoVerifying(false);
                    Alert.alert(
                        '¡Verificación exitosa!',
                        'Tu correo ha sido verificado correctamente. Continuemos con tu registro.',
                        [
                            {
                                text: 'Continuar',
                                onPress: () => navigation.navigate('Register Data Email')
                            }
                        ]
                    );
                } else {
                    setLoading(false);
                    setCheckingStatus(false);
                    if (showLoading) {
                        Alert.alert(
                            'Correo no verificado',
                            'Aún no hemos detectado la verificación de tu correo. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.',
                            [{ text: 'Entendido' }]
                        );
                    }
                }
            } catch (error) {
                setLoading(false);
                setCheckingStatus(false);
                if (showLoading) {
                    Alert.alert('Error', 'No se pudo verificar el correo electrónico.');
                }
                console.log('Error al recargar el usuario:', error);
            }
        } else {
            // Si no hay usuario, redirigir al inicio de sesión
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>No cierres esta pantalla</Text>
                </View>

                <Image source={require('../assets/email.png')} style={styles.contentImage} />

                <View style={styles.content}>
                    <Text style={styles.title}>Verificación de Correo</Text>
                    {/* Mostrar el correo electrónico */}
                    <Text style={styles.emailText}>
                        Correo electrónico: {auth.currentUser?.email}
                    </Text>

                    <View style={styles.stepIndicator}>
                        <Text style={styles.stepText}>Paso 2 de 3: Verificar tu correo</Text>
                        <View style={styles.stepProgress}>
                            <View style={styles.stepComplete}></View>
                            <View style={styles.stepComplete}></View>
                            <View style={styles.stepIncomplete}></View>
                        </View>
                    </View>

                    <View style={styles.instructionCard}>
                        <Text style={styles.instructionTitle}>Instrucciones:</Text>
                        <Text style={styles.instruction}>1. Hemos enviado un correo de verificación</Text>
                        <Text style={styles.instruction}>2. Revisa tu bandeja de entrada y spam</Text>
                        <Text style={styles.instruction}>3. Haz clic en el enlace de verificación</Text>
                        <Text style={styles.instruction}>4. Regresa a esta pantalla y continúa</Text>
                    </View>

                    {checkingStatus && (
                        <View style={styles.verificationStatus}>
                            <ActivityIndicator size="small" color="#7469B6" />
                            <Text style={styles.verificationStatusText}>
                                Verificando estado automáticamente...
                            </Text>
                        </View>
                    )}

                    {autoVerifying && (
                        <Text style={styles.autoVerifyText}>
                            Verificaremos automáticamente en {timeLeft} segundos
                        </Text>
                    )}

                    <Pressable
                        style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
                        onPress={() => checkEmailVerification(true)}
                        disabled={loading}
                    >
                        {loading ? (
                            <View style={styles.buttonLoadingContainer}>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text style={styles.verifyButtonText}>Verificando...</Text>
                            </View>
                        ) : (
                            <Text style={styles.verifyButtonText}>Verificar Ahora</Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.resendButton}
                        onPress={resendVerificationEmail}
                        disabled={loading}
                    >
                        <Text style={styles.resendButtonText}>
                            Reenviar correo de verificación
                        </Text>
                    </Pressable>

                    <Text style={styles.warningText}>
                        IMPORTANTE: Es necesario verificar tu correo para continuar con tu registro
                    </Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        backgroundColor: '#FF6B6B',
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    contentImage: {
        width: '60%',
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 10,
        textAlign: 'center',
    },
    stepIndicator: {
        width: '90%',
        marginBottom: 20,
        alignItems: 'center',
    },
    stepText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    stepProgress: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    stepComplete: {
        height: 8,
        backgroundColor: '#7469B6',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 2,
    },
    stepIncomplete: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 2,
    },
    instructionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 20,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        lineHeight: 20,
    },
    verificationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    verificationStatusText: {
        color: '#7469B6',
        marginLeft: 10,
        fontSize: 14,
    },
    autoVerifyText: {
        color: '#666',
        fontSize: 14,
        marginBottom: 15,
    },
    verifyButton: {
        width: '90%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    resendButton: {
        width: '90%',
        backgroundColor: 'transparent',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    resendButtonText: {
        color: '#7469B6',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    warningText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    }
});

export default VerifyEmailScreen;