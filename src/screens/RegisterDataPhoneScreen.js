import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterDataPhoneScreen = ({ navigation, route }) => {
    const { phoneNumber, countryCode } = route.params || {
        phoneNumber: '000-000-0000',
        countryCode: '+52'
    };

    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        direccion: '',
    });

    const handleChange = (field, value) => {
        setUserData({
            ...userData,
            [field]: value
        });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleContinue = () => {
        // Validar campos
        if (!userData.nombre.trim()) {
            Alert.alert('Campo requerido', 'Por favor ingresa tu nombre');
            return;
        }
        if (!userData.apellido.trim()) {
            Alert.alert('Campo requerido', 'Por favor ingresa tu apellido');
            return;
        }
        if (!userData.email.trim() || !validateEmail(userData.email)) {
            Alert.alert('Email inválido', 'Por favor ingresa un correo electrónico válido');
            return;
        }
        if (!userData.direccion.trim()) {
            Alert.alert('Campo requerido', 'Por favor ingresa tu dirección');
            return;
        }

        // Navegar a la siguiente pantalla con todos los datos del usuario
        navigation.navigate('Datos Fisicos', {
            ...userData,
            phoneNumber,
            countryCode
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/informacionPersonal.png')} style={styles.contentImage} />
                <View style={styles.content}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.title}>Datos Personales</Text>
                        <TextInput
                            placeholder="Nombre(s)"
                            value={userData.nombre}
                            onChangeText={(text) => handleChange('nombre', text)}
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                        />
                        <TextInput
                            placeholder="Apellido(s)"
                            value={userData.apellido}
                            onChangeText={(text) => handleChange('apellido', text)}
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                        />
                        <TextInput
                            placeholder="Correo electrónico"
                            value={userData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            placeholderTextColor="#888888"
                            keyboardType="email-address"
                            style={styles.inputLabels}
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Dirección"
                            value={userData.direccion}
                            onChangeText={(text) => handleChange('direccion', text)}
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                        />
                        <Pressable
                            style={[
                                styles.registerButton,
                                { opacity: Object.values(userData).some(val => !val.trim()) ? 0.7 : 1 }
                            ]}
                            accessibilityLabel="Continuar"
                            onPress={handleContinue}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                Continuar
                            </Text>
                        </Pressable>
                    </View>
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>He leído y aceptado los</Text>
                        <Text style={styles.termsLink}>Términos y condiciones</Text>
                    </View>
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
    },
    contentImage: {
        width: '50%',
        height: 200,
        resizeMode: 'cover',
        alignSelf: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 30,
        padding: 20,
        paddingTop: 30,
        borderRadius: 26,
        borderColor: '#888888',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    phoneInputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    phoneInput: {
        width: 50,
        height: 60,
        textAlign: 'center',
        backgroundColor: '#ABA9D9',
        borderColor: '#ABA9D9',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 24,
        color: '#FFFFFF',
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    termsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    termsText: {
        color: '#888888',
        fontSize: 18,
        fontWeight: 'bold',
    },
    termsLink: {
        color: '#7469B6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        marginTop: 5,
        alignItems: 'center',
    },
    loginText: {
        color: '#535353',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        color: '#7469B6',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputLabels: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#888888',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
});

export default RegisterDataPhoneScreen;
