import React, { useState } from 'react';
import {
    ImageBackground,
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    FlatList,
    Pressable,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const countries = [
    { code: 'MX', name: 'México', prefix: '+52', flag: '🇲🇽' },
    { code: 'US', name: 'Estados Unidos', prefix: '+1', flag: '🇺🇸' },
    { code: 'ES', name: 'España', prefix: '+34', flag: '🇪🇸' },
    { code: 'AR', name: 'Argentina', prefix: '+54', flag: '🇦🇷' },
    { code: 'CO', name: 'Colombia', prefix: '+57', flag: '🇨🇴' },
];

const RegisterPhoneScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `(${numbers.slice(0, 3)})-${numbers.slice(3)}`;
        return `(${numbers.slice(0, 3)})-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const handleChange = (text) => {
        const input = text.replace(/\D/g, '');
        if (input.length <= 10) {
            setPhone(formatPhoneNumber(input));
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../assets/registrarTelefono.png')}
                    style={styles.imageBackground}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>Verifica tu número de teléfono</Text>
                    <Text style={styles.indicacion}>
                        Ingrese su número de teléfono para enviarle su código de verificación
                    </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.phoneInputContainer}>
                            <TouchableOpacity
                                style={styles.countrySelector}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                                <Text style={styles.prefix}>{selectedCountry.prefix}</Text>
                                <FontAwesome name="chevron-down" size={12} color="#888888" />
                            </TouchableOpacity>
                            <TextInput
                                value={phone}
                                onChangeText={handleChange}
                                placeholder="(123)-456-7890"
                                placeholderTextColor="#888888"
                                keyboardType="numeric"
                                style={styles.phoneInput}
                                maxLength={14}
                            />
                        </View>
                        <Pressable
                            style={styles.registerButton}
                            onPress={() => navigation.navigate('Verificacion de Codigo')}
                        >
                            <Text style={styles.registerButtonText}>Enviar código</Text>
                        </Pressable>
                    </View>
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>He leído y aceptado los</Text>
                        <Text style={styles.termsLink}>Términos y condiciones</Text>
                    </View>
                </View>

                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <FlatList
                                data={countries}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.countryItem}
                                        onPress={() => {
                                            setSelectedCountry(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.flag}>{item.flag}</Text>
                                        <View>
                                            <Text style={styles.countryName}>{item.name}</Text>
                                            <Text style={styles.countryPrefix}>{item.prefix}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.code}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    imageBackground: {
        width: '100%',
        height: 160, // Altura del fondo en la parte superior
        resizeMode: 'contain',
        position: 'absolute',
        top: 150,
    },
    content: {
        flex: 1,
        marginTop: 170, // Espaciado para que el contenido no se superponga con la imagen de fondo
        paddingHorizontal: 16,
        justifyContent: 'center',
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
    },
    buttonContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 30,
        padding: 20,
        borderRadius: 26,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    phoneInputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#888888',
        borderWidth: 1,
        borderRadius: 10,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 10,
        height: 50,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        padding: 10,
        fontSize: 16,
        borderRadius: 10,
    },
    flag: {
        fontSize: 24,
    },
    prefix: {
        fontSize: 14,
        color: '#888888',
        marginRight: 4,
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
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
    },
    termsLink: {
        color: '#7469B6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
        padding: 10,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    countryName: {
        fontSize: 16,
        fontWeight: '500',
    },
    countryPrefix: {
        fontSize: 14,
        color: '#888888',
    },
});

export default RegisterPhoneScreen;
