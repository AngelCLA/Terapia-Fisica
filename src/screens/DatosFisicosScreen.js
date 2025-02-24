import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const DatosFisicosScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { personalData } = route.params; // Recibir los datos personales

    const [currentView, setCurrentView] = useState('Genero');
    const [formData, setFormData] = useState({
        genero: null,
        edad: '',
        peso: '',
        estatura: '',
        padecimiento: '',
    });
    const [selectedFirstPicker, setSelectedFirstPicker] = useState('0');
    const [selectedSecondPicker, setSelectedSecondPicker] = useState('0');

    const renderGeneroView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu género?</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData((prev) => ({ ...prev, genero: 'Masculino' }))}
                >
                    <Image
                        source={require('../assets/AvatarHombre.png')}
                        style={styles.radioImage}
                    />
                    <View
                        style={[
                            styles.radioCircle,
                            formData.genero === 'Masculino' && styles.radioSelected,
                        ]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData((prev) => ({ ...prev, genero: 'Femenino' }))}
                >
                    <Image
                        source={require('../assets/AvatarMujer.png')}
                        style={styles.radioImage}
                    />
                    <View
                        style={[
                            styles.radioCircle,
                            formData.genero === 'Femenino' && styles.radioSelected,
                        ]}
                    />
                </TouchableOpacity>
            </View>
        </>
    );

    const renderEdadView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu edad?</Text>
            <Text style={styles.subtitle}>{formData.edad} años</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={formData.edad}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, edad: value }))}
                minimumTrackTintColor="#4630EB"
                maximumTrackTintColor="#888888"
                thumbTintColor="#4630EB"
            />
        </>
    );

    const renderPesoView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu peso (kg)?</Text>
            <Image
                source={require('../assets/bascula.png')}
                style={{ height: 199, width: '50%', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 }}
            />
            <View style={styles.weightInputContainer}>
                <TextInput
                    style={styles.weightInput}
                    placeholder="0 0 0"
                    placeholderTextColor="#f2f2f2"
                    keyboardType="numeric"
                    value={formData.peso}
                    onChangeText={(value) => setFormData((prev) => ({ ...prev, peso: value }))}
                />
                <Text style={styles.weightUnit}>kg</Text>
            </View>
        </>
    );

    const renderEstaturaView = () => {
        const optionsPicker1 = Array.from({ length: 3 }, (_, i) => i.toString()); // 0, 1, 2 (metros)
        const optionsPicker2 = Array.from({ length: 100 }, (_, i) => i.toString()); // 0, 1, ..., 99 (centímetros)

        const updateEstatura = (picker1Value, picker2Value) => {
            console.log("Valores seleccionados:", picker1Value, picker2Value); // Depuración

            const metros = parseInt(picker1Value, 10); // Convertir a número base 10
            const centimetros = parseInt(picker2Value, 10); // Convertir a número base 10
            const totalEstatura = metros * 100 + centimetros;

            console.log("Estatura calculada:", totalEstatura); // Depuración

            setFormData((prev) => ({ ...prev, estatura: totalEstatura.toString() }));
        };

        return (
            <>
                <Text style={styles.title}>¿Cuál es tu estatura (cm)?</Text>
                <View style={styles.InputContainer}>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedFirstPicker}
                        onValueChange={(itemValue) => {
                            setSelectedFirstPicker(itemValue);
                            updateEstatura(itemValue, selectedSecondPicker);
                        }}
                    >
                        {optionsPicker1.map((value) => (
                            <Picker.Item key={value} label={`${value} m`} value={value} />
                        ))}
                    </Picker>

                    <Picker
                        style={styles.picker}
                        selectedValue={selectedSecondPicker}
                        onValueChange={(itemValue) => {
                            setSelectedSecondPicker(itemValue);
                            updateEstatura(selectedFirstPicker, itemValue);
                        }}
                    >
                        {optionsPicker2.map((value) => (
                            <Picker.Item key={value} label={`${value} cm`} value={value} />
                        ))}
                    </Picker>
                </View>
            </>
        );
    };

    const items = [
        { id: 1, label: 'Padecimiento 1', image: require('../assets/clipboard.png') },
        { id: 2, label: 'Padecimiento 2', image: require('../assets/clipboard.png') },
        { id: 3, label: 'Padecimiento 3', image: require('../assets/clipboard.png') },
        { id: 4, label: 'Padecimiento 4', image: require('../assets/clipboard.png') },
        { id: 5, label: 'Padecimiento 5', image: require('../assets/clipboard.png') },
        { id: 6, label: 'Padecimiento 6', image: require('../assets/clipboard.png') },
        { id: 7, label: 'Padecimiento 7', image: require('../assets/clipboard.png') },
        { id: 8, label: 'Padecimiento 8', image: require('../assets/clipboard.png') },
        { id: 9, label: 'Padecimiento 9', image: require('../assets/clipboard.png') },
        { id: 10, label: 'Padecimiento 10', image: require('../assets/clipboard.png') },
    ];

    const renderPatologiaView = () => (
        <View style={[styles.containerPatologias]}>
            <Text style={styles.title}>
                Seleccione su Padecimiento
            </Text>
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <Pressable
                        key={item.id}
                        onPress={() => setFormData((prev) => ({ ...prev, padecimiento: item.id }))}
                        style={[
                            styles.pressable,
                            formData.padecimiento === item.id && { backgroundColor: '#ABA9D9' },
                        ]}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text
                            style={[
                                styles.itemText,
                                formData.padecimiento === item.id && { color: '#FFFFFF' }
                            ]}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
                style={styles.flatList}
            />
        </View>
    );

    const handleNext = () => {
        switch (currentView) {
            case 'Genero':
                setCurrentView('Edad');
                break;
            case 'Edad':
                setCurrentView('Peso');
                break;
            case 'Peso':
                setCurrentView('Estatura');
                break;
            case 'Estatura':
                setCurrentView('Patologia');
                break;
            case 'Patologia':
                if (!formData.padecimiento) {
                    alert('Por favor, selecciona una patología antes de continuar.');
                } else {
                    handleSaveData();
                }
                break;
        }
    };

    const handleSaveData = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                // Combinar datos personales y físicos
                const userData = {
                    ...personalData, // Datos personales
                    ...formData,     // Datos físicos
                };

                console.log("Datos a guardar:", userData); // Depuración

                // Guardar todos los datos en Firestore
                await setDoc(doc(db, 'users', user.uid), userData);

                console.log('Datos guardados correctamente en Firestore.');
                navigation.navigate('Home');
            } catch (error) {
                console.log('Error al guardar los datos:', error);
                alert('No se pudieron guardar los datos. Inténtalo de nuevo.');
            }
        } else {
            alert('No se encontró un usuario autenticado.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <StatusBar style="auto" />
                    {currentView === 'Genero' && renderGeneroView()}
                    {currentView === 'Edad' && renderEdadView()}
                    {currentView === 'Peso' && renderPesoView()}
                    {currentView === 'Estatura' && renderEstaturaView()}
                    {currentView === 'Patologia' && renderPatologiaView()}

                    <Pressable
                        style={styles.registerButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>
                            {currentView === 'Patologia' ? 'Finalizar' : 'Continuar'}
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
        backgroundColor: '#FFFFFF',
        marginTop: StatusBar.currentHeight || 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#888888',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#888888',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        fontSize: 18,
        marginBottom: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButton: {
        alignItems: 'center',
        marginHorizontal: 16,
    },
    radioImage: {
        width: 150,
        height: 400,
        marginBottom: 40,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        backgroundColor: '#4630EB',
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    slider: {
        width: '100%',
        height: 10,
        marginBottom: 20,
    },
    weightInputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#EBEBFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    weightInput: {
        width: '80%',
        height: 60,
        textAlign: 'center',
        backgroundColor: '#ABA9D9',
        borderColor: '#ABA9D9',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    weightUnit: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#888888',
        marginLeft: 20,
    },
    InputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    picker: {
        flex: 1,
        height: 200,
        marginHorizontal: 10,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
    },
    containerPatologias: {
        marginTop: StatusBar.currentHeight || 0,
        flex: 1,
    },
    flatList: {
        flexGrow: 0,
        height: 'auto',
    },
    flatListContent: {
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    pressable: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});

export default DatosFisicosScreen;