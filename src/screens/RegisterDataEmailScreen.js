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
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig';

const RegisterDataEmailScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        email: '',
    });

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Manejar cambios en los inputs
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Guardar datos en Firestore
    const saveUserData = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                // Combinar datos del formulario con el correo electrónico del usuario
                const userData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    email: user.email, // Agregar el correo electrónico del usuario
                };

                console.log("Datos a guardar:", userData); // Depuración

                // Guardar los datos en Firestore
                await setDoc(doc(db, 'users', user.uid), userData);

                console.log("Datos guardados correctamente en Firestore.");
                navigation.navigate('Datos Fisicos', { personalData: userData });
            } catch (error) {
                console.log('Error al guardar los datos:', error);
                Alert.alert('Error', 'No se pudieron guardar los datos. Inténtalo de nuevo.');
            }
        } else {
            Alert.alert('Error', 'No se encontró un usuario autenticado.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/informacionPersonal.png')} style={styles.contentImage} />
                <View style={styles.content}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.title}>Datos Personales</Text>

                        {/* Mostrar el correo electrónico */}
                        <Text style={styles.emailText}>
                            Correo electrónico: {auth.currentUser?.email}
                        </Text>

                        <TextInput
                            placeholder="Nombre(s)"
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                            value={formData.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                        />
                        <TextInput
                            placeholder="Apellido(s)"
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                            value={formData.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                        />
                        <TextInput
                            placeholder="Teléfono"
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            placeholder="Dirección"
                            placeholderTextColor="#888888"
                            style={styles.inputLabels}
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                        />
                        <Pressable
                            style={styles.registerButton}
                            accessibilityLabel="Continuar"
                            onPress={saveUserData}
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
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default RegisterDataEmailScreen;