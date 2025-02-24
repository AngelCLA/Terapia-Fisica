import React from 'react';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {getDatabase} from '../../firebaseConfig.js';
import {firebaseConfig} from '../../firebaseConfig.js';
import {initializeApp} from 'firebase/app';

const LoginScreen = ({ navigation }) => {

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

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

    const handleSignIn = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Signed in');
                const user = userCredential.user;
                console.log(user.email);
                navigation.navigate('Home');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
                            />
                            <TextInput
                                onChangeText={(text) => setPassword(text)}
                                placeholder="Contraseña"
                                placeholderTextColor="#888888"
                                style={styles.inputLabels}
                            />
                            <Text style={{ color: '#888888', fontSize: 16 }}>
                                ¿Olvidaste tu contraseña? <Text style={{ color: '#0091FF' }} onPress={() => navigation.navigate('Recuperar contraseña')}>Reestablecer</Text>
                            </Text>
                            <Pressable
                                style={styles.loginButton}
                                accessibilityLabel={'Home'}
                                onPress={handleSignIn}

                            >
                                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                    Iniciar Sesión
                                </Text>
                            </Pressable>
                            <Text style={{ color: '#888888', fontSize: 22, fontWeight: 'bold' }}>
                                O
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                {/* Botón Google */}
                                <Pressable
                                    style={styles.buttonGoogle}
                                    onPress={() => console.log('Botón Google presionado')}
                                >
                                    <FontAwesome name="google" size={32} color="#535353" />
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
            </SafeAreaView>
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
