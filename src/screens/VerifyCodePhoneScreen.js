import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VerifyCodePhoneScreen = ({ navigation }) => {
    const inputCount = 6; // Número de inputs
    const [codes, setCodes] = useState(Array(inputCount).fill('')); // Array de estados para los inputs
    const inputsRef = useRef([]); // Referencias para los TextInput

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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/telefono.png')} style={styles.contentImage} />
                <View style={styles.content}>
                    <Text style={styles.title}>Verificación</Text>
                    <Text style={styles.indicacion}>
                        Ingrese el código de 6 dígitos enviado al número (+52) 000-000-0000
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
                            <Text
                                style={styles.loginLink}
                                onPress={() => navigation.navigate('Reenviar Código')}
                            >
                                Reenviar
                            </Text>
                        </View>
                        <Pressable
                            style={styles.registerButton}
                            accessibilityLabel="Registrarse"
                            onPress={() => navigation.navigate('Register Data Phone')}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                                Enviar código
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
