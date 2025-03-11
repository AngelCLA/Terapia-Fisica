import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
        //padecimiento: '',
        //nivelActividad: null,
    });
    const [selectedFirstPicker, setSelectedFirstPicker] = useState('0');
    const [selectedSecondPicker, setSelectedSecondPicker] = useState('0');

    // Lista de niveles de actividad física
    const activityLevels = [
        {
            id: 'sedentario',
            title: 'Sedentario',
            description: 'Poco o ningún ejercicio, trabajo de escritorio',
            icon: require('../assets/clipboard.png'), // Puedes reemplazar con íconos propios
        },
        {
            id: 'ligero',
            title: 'Ligero',
            description: 'Ejercicio ligero 1-3 días por semana',
            icon: require('../assets/clipboard.png'),
        },
        {
            id: 'moderado',
            title: 'Moderado',
            description: 'Ejercicio moderado 3-5 días por semana',
            icon: require('../assets/clipboard.png'),
        },
        {
            id: 'activo',
            title: 'Muy Activo',
            description: 'Ejercicio intenso 6-7 días por semana',
            icon: require('../assets/clipboard.png'),
        },
        {
            id: 'extremo',
            title: 'Extremadamente Activo',
            description: 'Ejercicio muy intenso, trabajo físico o atleta',
            icon: require('../assets/clipboard.png'),
        },
    ];

    // Lista de padecimientos
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

    // Función para obtener el nombre del padecimiento según ID
    const getPadecimientoName = (id) => {
        const padecimiento = items.find(item => item.id === id);
        return padecimiento ? padecimiento.label : 'No especificado';
    };

    // Función para obtener texto descriptivo del nivel de actividad
    const getNivelActividadText = (nivel) => {
        const actividad = activityLevels.find(item => item.id === nivel);
        return actividad ? actividad.title : 'No especificado';
    };

    // Función para formatear estatura
    const formatEstatura = (estaturaCm) => {
        if (!estaturaCm) return 'No especificada';
        const cm = parseInt(estaturaCm, 10);
        const metros = Math.floor(cm / 100);
        const centimetros = cm % 100;
        return `${metros}.${centimetros < 10 ? '0' + centimetros : centimetros} m`;
    };

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

    // Esta vista se mantiene pero no se usa en el flujo actual
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

    // Esta vista se mantiene pero no se usa en el flujo actual
    const renderActividadView = () => (
        <View style={styles.containerActividad}>
            <Text style={styles.title}>¿Cuál es tu nivel de actividad física?</Text>

            <View style={styles.activityOptionsContainer}>
                {activityLevels.map((activity) => (
                    <TouchableOpacity
                        key={activity.id}
                        style={[
                            styles.activityOption,
                            formData.nivelActividad === activity.id && styles.activitySelected,
                        ]}
                        onPress={() => setFormData((prev) => ({ ...prev, nivelActividad: activity.id }))}
                    >
                        <Image source={activity.icon} style={styles.activityIcon} />
                        <View style={styles.activityTextContainer}>
                            <Text style={[
                                styles.activityTitle,
                                formData.nivelActividad === activity.id && styles.textSelected
                            ]}>
                                {activity.title}
                            </Text>
                            <Text style={[
                                styles.activityDescription,
                                formData.nivelActividad === activity.id && styles.textSelected
                            ]}>
                                {activity.description}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.radioCircle,
                                formData.nivelActividad === activity.id && styles.radioSelected,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    // Nueva vista: Resumen de todos los datos
    const renderResumenView = () => {
        // Combinar datos personales y físicos
        const allData = {
            ...personalData, // Datos personales
            ...formData,     // Datos físicos
        };

        return (
            <SafeAreaProvider style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar style="auto"/>
                <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
                    <Text style={styles.title}>Resumen de tus datos</Text>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Datos Personales</Text>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Nombre:</Text>
                            <Text style={styles.dataValue}>{allData.firstName || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Apellido:</Text>
                            <Text style={styles.dataValue}>{allData.lastName || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Email:</Text>
                            <Text style={styles.dataValue}>{allData.email || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Teléfono:</Text>
                            <Text style={styles.dataValue}>{allData.phone || 'No especificado'}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Datos Físicos</Text>

                        <View style={styles.iconDataRow}>
                            <Image
                                source={allData.genero === 'Masculino'
                                    ? require('../assets/AvatarHombre.png')
                                    : require('../assets/AvatarMujer.png')}
                                style={styles.smallIcon}
                            />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Género:</Text>
                                <Text style={styles.dataValue}>{allData.genero || 'No especificado'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <Image source={require('../assets/bascula.png')} style={styles.smallIcon} />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Edad:</Text>
                                <Text style={styles.dataValue}>{allData.edad ? `${allData.edad} años` : 'No especificada'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <Image source={require('../assets/bascula.png')} style={styles.smallIcon} />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Peso:</Text>
                                <Text style={styles.dataValue}>{allData.peso ? `${allData.peso} kg` : 'No especificado'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <Image source={require('../assets/bascula.png')} style={styles.smallIcon} />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Estatura:</Text>
                                <Text style={styles.dataValue}>{formatEstatura(allData.estatura)}</Text>
                            </View>
                        </View>
                    </View>


                    {/* Estas secciones se mantienen pero con valores por defecto
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Información Médica</Text>
                        <View style={styles.iconDataRow}>
                            <Image source={require('../assets/clipboard.png')} style={styles.smallIcon} />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Padecimiento:</Text>
                                <Text style={styles.dataValue}>No especificado</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Actividad Física</Text>
                        <View style={styles.iconDataRow}>
                            <Image
                                source={require('../assets/clipboard.png')}
                                style={styles.smallIcon}
                            />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Nivel:</Text>
                                <Text style={styles.dataValue}>No especificado</Text>
                            </View>
                        </View>
                    </View>
                    */}

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.editButton}
                            onPress={() => setCurrentView('Genero')}
                        >
                            <Text style={styles.editButtonText}>Editar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        );
    };

    const handleNext = () => {
        switch (currentView) {
            case 'Genero':
                if (!formData.genero) {
                    alert('Por favor, selecciona un género antes de continuar.');
                } else {
                    setCurrentView('Edad');
                }
                break;
            case 'Edad':
                if (!formData.edad) {
                    alert('Por favor, indica tu edad antes de continuar.');
                } else {
                    setCurrentView('Peso');
                }
                break;
            case 'Peso':
                if (!formData.peso) {
                    alert('Por favor, indica tu peso antes de continuar.');
                } else {
                    setCurrentView('Estatura');
                }
                break;
            case 'Estatura':
                if (!formData.estatura) {
                    alert('Por favor, indica tu estatura antes de continuar.');
                } else {
                    // Cambiamos el flujo para ir directamente al resumen, saltando Patologia y Actividad
                    setCurrentView('Resumen');

                    // Establecemos valores por defecto para los campos que estamos saltando
                    setFormData(prev => ({
                        ...prev,
                        padecimiento: '',
                        nivelActividad: null
                    }));
                }
                break;
            case 'Patologia': // Mantenemos esta lógica por si en el futuro se vuelve a habilitar
                if (!formData.padecimiento) {
                    alert('Por favor, selecciona una patología antes de continuar.');
                } else {
                    setCurrentView('Actividad');
                }
                break;
            case 'Actividad': // Mantenemos esta lógica por si en el futuro se vuelve a habilitar
                if (!formData.nivelActividad) {
                    alert('Por favor, selecciona un nivel de actividad antes de continuar.');
                } else {
                    setCurrentView('Resumen');
                }
                break;
            case 'Resumen':
                handleSaveData();
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
                    {/* Mantenemos las referencias a las vistas deshabilitadas, pero nunca se mostrarán en el flujo actual */}
                    {currentView === 'Patologia' && renderPatologiaView()}
                    {currentView === 'Actividad' && renderActividadView()}
                    {currentView === 'Resumen' && renderResumenView()}

                    {currentView !== 'Resumen' && (
                        <Pressable
                            style={styles.registerButton}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>
                                {currentView === 'Actividad' ? 'Ver Resumen' : 'Continuar'}
                            </Text>
                        </Pressable>
                    )}

                    {currentView === 'Resumen' && (
                        <Pressable
                            style={styles.registerButton}
                            onPress={handleSaveData}
                        >
                            <Text style={styles.buttonText}>Finalizar</Text>
                        </Pressable>
                    )}
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

    // Estilos para la vista de Actividad
    containerActividad: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    activityOptionsContainer: {
        width: '100%',
    },
    activityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    activitySelected: {
        backgroundColor: '#ABA9D9',
    },
    activityIcon: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    activityTextContainer: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
        marginBottom: 4,
    },
    activityDescription: {
        fontSize: 14,
        color: '#888888',
    },
    textSelected: {
        color: '#FFFFFF',
    },

    // Estilos para la vista de Resumen
    scrollContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 16,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    iconDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    dataRowFlex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 12,
    },
    dataLabel: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    dataValue: {
        fontSize: 16,
        color: '#444444',
        fontWeight: 'bold',
    },
    smallIcon: {
        width: 30,
        height: 30,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    editButton: {
        backgroundColor: '#EBEBFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#7469B6',
    },
    editButtonText: {
        color: '#7469B6',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DatosFisicosScreen;