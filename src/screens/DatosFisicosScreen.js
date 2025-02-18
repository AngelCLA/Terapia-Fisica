import React, {useState} from 'react';
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
    View
} from 'react-native'
import Slider from '@react-native-community/slider';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';

const DatosFisicosScreen = () => {
    const navigation = useNavigation();  // Obtener el objeto navigation
    const [currentView, setCurrentView] = useState('Genero'); // Controla la vista actual
    const [genero, setGenero] = useState(null); // Guarda el género seleccionado
    const [edad, setEdad] = useState('');
    const [peso, setPeso] = useState('');
    const [estatura, setEstatura] = useState('');
    const [patologia, setPatologia] = useState('');
    const [selectedFirstPicker, setSelectedFirstPicker] = useState('0');
    const [selectedSecondPicker, setSelectedSecondPicker] = useState('0');

    const renderGeneroView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu género?</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setGenero('Masculino')}
                >
                    <Image
                        source={require('../assets/AvatarHombre.png')}
                        style={styles.radioImage}
                    />
                    <View
                        style={[
                            styles.radioCircle,
                            genero === 'Masculino' && styles.radioSelected,
                        ]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setGenero('Femenino')}
                >
                    <Image
                        source={require('../assets/AvatarMujer.png')}
                        style={styles.radioImage}
                    />
                    <View
                        style={[
                            styles.radioCircle,
                            genero === 'Femenino' && styles.radioSelected,
                        ]}
                    />
                </TouchableOpacity>
            </View>
        </>
    );

    const renderEdadView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu edad?</Text>
            <Text style={styles.subtitle}>{edad} años</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={edad}
                onValueChange={setEdad}
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
                style={{height: 199, width: '50%', justifyContent: 'center', alignSelf: 'center', marginBottom: 20}}
            />
            <View style={styles.weightInputContainer}>
                <TextInput
                    style={styles.weightInput}
                    placeholder="0 0 0"
                    placeholderTextColor="#f2f2f2"
                    keyboardType="numeric"
                    value={peso}
                    onChangeText={setPeso}
                />
                <Text style={styles.weightUnit}>kg</Text>
            </View>
        </>
    );

    const renderEstaturaView = () => {
        const optionsPicker1 = Array.from({length: 3}, (_, i) => i.toString()); // Opciones del 0 al 3
        const optionsPicker2 = Array.from({length: 100}, (_, i) => i.toString()); // Opciones del 0 al 100

        const updateEstatura = (picker1Value, picker2Value) => {
            const totalEstatura = parseInt(picker1Value) * 100 + parseInt(picker2Value);
            setEstatura(totalEstatura.toString()); // Actualiza la estatura en cm como string
        };

        return (
            <>
                <Text style={styles.title}>¿Cuál es tu estatura (cm)?</Text>
                <View style={styles.InputContainer}>
                    {/* Primer Picker: Valores de 0 a 3 */}
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedFirstPicker}
                        onValueChange={(itemValue) => {
                            setSelectedFirstPicker(itemValue);
                            updateEstatura(itemValue, selectedSecondPicker); // Actualiza la estatura
                        }}
                    >
                        {optionsPicker1.map((value) => (
                            <Picker.Item key={value} label={value} value={value}/>
                        ))}
                    </Picker>

                    {/* Segundo Picker: Valores de 0 a 100 */}
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedSecondPicker}
                        onValueChange={(itemValue) => {
                            setSelectedSecondPicker(itemValue);
                            updateEstatura(selectedFirstPicker, itemValue); // Actualiza la estatura
                        }}
                    >
                        {optionsPicker2.map((value) => (
                            <Picker.Item key={value} label={value} value={value}/>
                        ))}
                    </Picker>
                </View>
            </>
        );
    };


    const items = [
        {id: 1, label: 'Padecimiento 1', image: require('../assets/clipboard.png')},
        {id: 2, label: 'Padecimiento 2', image: require('../assets/clipboard.png')},
        {id: 3, label: 'Padecimiento 3', image: require('../assets/clipboard.png')},
        {id: 4, label: 'Padecimiento 4', image: require('../assets/clipboard.png')},
        {id: 5, label: 'Padecimiento 5', image: require('../assets/clipboard.png')},
        {id: 6, label: 'Padecimiento 6', image: require('../assets/clipboard.png')},
        {id: 7, label: 'Padecimiento 7', image: require('../assets/clipboard.png')},
        {id: 8, label: 'Padecimiento 8', image: require('../assets/clipboard.png')},
        {id: 9, label: 'Padecimiento 9', image: require('../assets/clipboard.png')},
        {id: 10, label: 'Padecimiento 10', image: require('../assets/clipboard.png')},
    ];

    const renderPatologiaView = () => (
        <View style={[styles.containerPatologias]}>
            <Text style={styles.title}>
                Seleccione su Padecimiento
            </Text>
            <FlatList
                data={items}
                renderItem={({item}) => (
                    <Pressable
                        key={item.id}
                        onPress={() => setPatologia(item.id)} // Selecciona el id de la patología
                        style={[
                            styles.pressable,
                            patologia === item.id && {backgroundColor: '#ABA9D9'}, // Marca la selección
                        ]}
                    >
                        <Image source={item.image} style={styles.image}/>
                        <Text
                            style={[
                                styles.itemText,
                                patologia === item.id && {color: '#FFFFFF'} // Cambia el color si está seleccionado
                            ]}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // Muestra dos columnas
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
                if (!patologia) {
                    alert('Por favor, selecciona una patología antes de continuar.');
                } else {
                    console.log({genero, edad, peso, estatura, patologia});
                    navigation.navigate('Home');  // Aquí navegas a la pantalla "Home"
                }
                break;
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <StatusBar style="auto"/>
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
        flex: 1, // Asegura que los Picker ocupen el mismo espacio
        height: 200, // Altura mínima visible
        marginHorizontal: 10, // Espaciado entre los pickers
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
        flexGrow: 0, // Restringe el tamaño de la lista
        height: 'auto', // Altura fija para mostrar solo dos filas
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
