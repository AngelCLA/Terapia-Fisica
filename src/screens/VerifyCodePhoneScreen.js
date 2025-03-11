import React, { useState, useRef, useEffect } from 'react';
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

const VerifyCodePhoneScreen = ({ navigation, route }) => {
    const { phoneNumber, countryCode, countryFlag } = route.params || {
        phoneNumber: '000-000-0000',
        countryCode: '+52',
        countryFlag: '🇲🇽'
    };

    const inputCount = 6; // Número de inputs
    const [codes, setCodes] = useState(Array(inputCount).fill('')); // Array de estados para los inputs
    const inputsRef = useRef([]); // Referencias para los TextInput
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (resendDisabled) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendDisabled]);

    // Maneja cambios en el texto de un input específico
    const handleChange = (text, index) => {
        if (/^\d?$/.test(text)) { // Permite solo números o vacío
            const updatedCodes = [...codes];
            updatedCodes[index] = text;
            setCodes(updatedCodes);

            // Salta al siguiente input si se ingresa un número
            if (text !== '' && index < inputCount - 1) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    // Detecta la tecla Backspace para retroceder al input anterior
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && codes[index] === '' && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleResendCode = () => {
        // Aquí normalmente reenviarías un código de verificación
        setResendDisabled(true);
        setCountdown(30);
        Alert.alert('Código reenviado', 'Se ha enviado un nuevo código a tu número de teléfono');
    };

    const handleVerifyCode = () => {
        const code = codes.join('');
        if (code.length < inputCount) {
            Alert.alert('Código incompleto', 'Por favor ingresa el código completo de 6 dígitos');
            return;
        }

        // Aquí normalmente verificarías el código con un backend
        // Por ahora, solo navegaremos a la siguiente pantalla
        navigation.navigate('Register Data Phone', {
            phoneNumber,
            countryCode
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/telefono.png')} style={styles.contentImage} />
                <View style={styles.content}>
                    <Text style={styles.title}>Verificación</Text>
                    <Text style={styles.indicacion}>
                        Ingrese el código de 6 dígitos enviado al número {countryFlag} {countryCode} {phoneNumber}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.phoneInputContainer}>
                            {Array.from({ length: inputCount }).map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputsRef.current[index] = ref)} // Asignar referencia
                                    value={codes[index]} // Valor correspondiente del array
                                    onChangeText={(text) => handleChange(text, index)} // Maneja cambios
                                    onKeyPress={(e) => handleKeyPress(e, index)} // Detecta Backspace
                                    placeholder={codes[index] === '' ? '-' : ''} // Desaparece el placeholder si hay texto
                                    placeholderTextColor="#FFFFFF"
                                    keyboardType="numeric"
                                    style={[
                                        styles.phoneInput,
                                        { textAlignVertical: 'center' }, // Centra el cursor verticalmente
                                    ]}
                                    maxLength={1} // Limita a 1 carácter
                                />
                            ))}
                        </View>
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>¿No recibiste el código?</Text>
                            <Pressable
                                onPress={resendDisabled ? null : handleResendCode}
                                style={{ opacity: resendDisabled ? 0.5 : 1 }}
                            >
                                <Text style={styles.loginLink}>
                                    {resendDisabled ? `Reenviar (${countdown}s)` : 'Reenviar'}
                                </Text>
                            </Pressable>
                        </View>
                        <Pressable
                            style={[
                                styles.registerButton,
                                { opacity: codes.join('').length < inputCount ? 0.7 : 1 }
                            ]}
                            accessibilityLabel="Verificar código"
                            onPress={handleVerifyCode}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                Verificar código
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
        width: '49%',
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
        marginTop: 20,
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
    indicacion: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888888',
    },
});

export default VerifyCodePhoneScreen;
