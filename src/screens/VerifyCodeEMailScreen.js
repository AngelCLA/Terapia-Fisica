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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';

const VerifyEmailScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false); // Estado para mostrar un spinner mientras se verifica el correo
    const auth = getAuth(initializeApp(firebaseConfig)); // Inicializar Firebase

    // Función para verificar si el correo electrónico está verificado
    const checkEmailVerification = async () => {
        setLoading(true); // Mostrar un estado de carga en el botón
        const user = auth.currentUser;

        if (user) {
            try {
                await user.reload(); // Recargar el usuario para obtener el estado más reciente
                const updatedUser = auth.currentUser;

                if (updatedUser.emailVerified) {
                    setLoading(false); // Detener el estado de carga
                    navigation.navigate('Register Data Email'); // Redirigir a la pantalla principal
                } else {
                    setLoading(false); // Detener el estado de cargax|
                    Alert.alert(
                        'Correo no verificado',
                        'Por favor, verifica tu correo electrónico antes de continuar.'
                    );
                }
            } catch (error) {
                setLoading(false); // Detener el estado de carga
                Alert.alert('Error', 'No se pudo verificar el correo electrónico.');
                console.log('Error al recargar el usuario:', error);
            }
        } else {
            // Si no hay usuario, redirigir al inicio de sesión
            navigation.navigate('Inicio de sesión');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/email.png')} style={styles.contentImage} />
                <View style={styles.content}>
                    <Text style={styles.title}>Verificación de Correo</Text>
                    <Text style={styles.indicacion}>
                        Por favor, verifica tu correo electrónico. Revisa tu bandeja de entrada y haz clic en el enlace de verificación.
                    </Text>

                    <Pressable
                        style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
                        onPress={checkEmailVerification}
                        disabled={loading}
                    >
                        <Text style={styles.verifyButtonText}>
                            {loading ? 'Verificando...' : 'Verificar Correo'}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentImage: {
        width: '60%',
        height: 200,
        resizeMode: 'cover',
        alignSelf: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 10,
        textAlign: 'center',
    },
    indicacion: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888888',
        marginBottom: 20,
    },
    verifyButton: {
        width: '80%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    verifyButtonDisabled: {
        backgroundColor: '#A9A9A9', // Color cuando el botón está deshabilitado
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default VerifyEmailScreen;