import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const user = getAuth().currentUser;

const RegisterDataEmailScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formComplete, setFormComplete] = useState(false);

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Prevenir que el usuario retroceda sin completar
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Datos incompletos',
                    'Si sales ahora, perderás la información ingresada. ¿Estás seguro de que quieres salir?',
                    [
                        {
                            text: 'Continuar registro',
                            onPress: () => null,
                            style: 'cancel'
                        },
                        {
                            text: 'Salir',
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

    // Verificar si todos los campos están completos
    useEffect(() => {
        const { firstName, lastName, phone, address } = formData;
        setFormComplete(firstName !== '' && lastName !== '' && phone !== '' && address !== '');
    }, [formData]);

    // Manejar cambios en los inputs
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error al editar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validación de formulario
    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Ingresa un número de 10 dígitos';
            isValid = false;
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es obligatoria';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Guardar datos en Firestore
    const saveUserData = async () => {
        if (!validateForm()) {
            Alert.alert('Datos incompletos', 'Por favor completa todos los campos correctamente.');
            return;
        }

        setLoading(true);
        const user = auth.currentUser;

        if (user) {
            try {
                // Combinar datos del formulario con el correo electrónico del usuario
                const userData = {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                    email: user.email,
                    registrationDate: new Date().toISOString(),
                };

                // Guardar los datos en Firestore
                await setDoc(doc(db, 'users', user.uid), userData);

                setLoading(false);
                navigation.navigate('Datos Fisicos', { personalData: userData });
            } catch (error) {
                console.log('Error al guardar los datos:', error);
                setLoading(false);
                Alert.alert('Error', 'No se pudieron guardar los datos. Inténtalo de nuevo.');
            }
        } else {
            setLoading(false);
            Alert.alert('Error', 'No se encontró un usuario autenticado.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.stepIndicator}>
                            <Text style={styles.stepText}>Paso 3 de 3: Datos personales</Text>
                            <View style={styles.stepProgress}>
                                <View style={styles.stepComplete}></View>
                                <View style={styles.stepComplete}></View>
                                <View style={styles.stepInProgress}></View>
                            </View>
                        </View>

                        <Image source={require('../assets/informacionPersonal.png')} style={styles.contentImage} />

                        <View style={styles.content}>
                            <View style={styles.formContainer}>
                                <Text style={styles.title}>Datos Personales</Text>

                                <View style={styles.emailContainer}>
                                    <Text style={styles.emailLabel}>Tu correo verificado:</Text>
                                    <Text style={styles.emailValue}>{auth.currentUser?.email}</Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Nombre(s)</Text>
                                    <TextInput
                                        placeholder="Escribe tu nombre"
                                        placeholderTextColor="#A0A0A0"
                                        style={[
                                            styles.inputField,
                                            errors.firstName ? styles.inputError : null
                                        ]}
                                        value={formData.firstName}
                                        onChangeText={(text) => handleChange('firstName', text)}
                                    />
                                    {errors.firstName && (
                                        <Text style={styles.errorText}>{errors.firstName}</Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Apellido(s)</Text>
                                    <TextInput
                                        placeholder="Escribe tus apellidos"
                                        placeholderTextColor="#A0A0A0"
                                        style={[
                                            styles.inputField,
                                            errors.lastName ? styles.inputError : null
                                        ]}
                                        value={formData.lastName}
                                        onChangeText={(text) => handleChange('lastName', text)}
                                    />
                                    {errors.lastName && (
                                        <Text style={styles.errorText}>{errors.lastName}</Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Teléfono</Text>
                                    <TextInput
                                        placeholder="10 dígitos"
                                        placeholderTextColor="#A0A0A0"
                                        style={[
                                            styles.inputField,
                                            errors.phone ? styles.inputError : null
                                        ]}
                                        value={formData.phone}
                                        onChangeText={(text) => handleChange('phone', text)}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                    {errors.phone && (
                                        <Text style={styles.errorText}>{errors.phone}</Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Dirección</Text>
                                    <TextInput
                                        placeholder="Calle, número, colonia, ciudad"
                                        placeholderTextColor="#A0A0A0"
                                        style={[
                                            styles.inputField,
                                            errors.address ? styles.inputError : null
                                        ]}
                                        value={formData.address}
                                        onChangeText={(text) => handleChange('address', text)}
                                    />
                                    {errors.address && (
                                        <Text style={styles.errorText}>{errors.address}</Text>
                                    )}
                                </View>

                                <Pressable
                                    style={[
                                        styles.continueButton,
                                        (!formComplete || loading) ? styles.buttonDisabled : null
                                    ]}
                                    accessibilityLabel="Continuar"
                                    onPress={saveUserData}
                                    disabled={!formComplete || loading}
                                >
                                    {loading ? (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="small" color="#fff" />
                                            <Text style={styles.buttonText}>Guardando...</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            Continuar
                                        </Text>
                                    )}
                                </Pressable>
                            </View>

                            <View style={styles.termsContainer}>
                                <Text style={styles.termsText}>
                                    Al continuar, acepto los
                                    <Text style={styles.termsLink}> Términos y condiciones</Text>
                                </Text>
                            </View>

                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>
                                    ¡Ya casi terminamos! Solo falta un paso más.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    stepIndicator: {
        width: '100%',
        marginTop: 15,
        marginBottom: 5,
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
    stepInProgress: {
        height: 8,
        backgroundColor: '#9D93DA',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 2,
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    contentImage: {
        width: '50%',
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 15,
        padding: 20,
        paddingTop: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 15,
        textAlign: 'center',
    },
    emailContainer: {
        width: '100%',
        backgroundColor: '#F0EDF9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    emailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    emailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7469B6',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
        paddingLeft: 2,
    },
    inputField: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#FF6B6B',
        borderWidth: 1.5,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: 5,
        paddingLeft: 2,
    },
    continueButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    termsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    termsText: {
        color: '#777',
        fontSize: 14,
    },
    termsLink: {
        color: '#7469B6',
        fontWeight: 'bold',
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    progressText: {
        color: '#7469B6',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RegisterDataEmailScreen;