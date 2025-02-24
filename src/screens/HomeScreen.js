import React, {useEffect, useState} from 'react';
import {
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'expo-status-bar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from "@expo/vector-icons";
import {Dropdown} from 'react-native-element-dropdown';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import VideoCard from '../components/VideoCard';

import {getDoc, doc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../../firebaseConfig';

// Definir el Tab.Navigator y las pantallas
const Tab = createBottomTabNavigator();

const data = [
    {label: 'Ejercicio 1', value: 'Ejercicio 1'},
    {label: 'Ejercicio 2', value: 'Ejercicio 2'},
    {label: 'Ejercicio 3', value: 'Ejercicio 3'},
    {label: 'Ejercicio 4', value: 'Ejercicio 4'},
    {label: 'Ejercicio 5', value: 'Ejercicio 5'},
    {label: 'Ejercicio 6', value: 'Ejercicio 6'},
    {label: 'Ejercicio 7', value: 'Ejercicio 7'},
    {label: 'Ejercicio 8', value: 'Ejercicio 8'},
];

const HomeScreen = ({navigation}) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        console.log('No se encontraron datos para este usuario.');
                    }
                } catch (error) {
                    console.log('Error al recuperar los datos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('No hay un usuario autenticado.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaProvider style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar style="auto"/>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.titleContainer}>
                        <View style={styles.textContainer}>
                            <Text style={{color: '#444444', fontSize: 20, fontWeight: '400'}}>👏 Bienvenido,</Text>
                            <Text style={styles.title}>{userData.firstName}{' '}{userData.lastName}</Text>
                        </View>
                        <Image source={require('../assets/avatar2.png')} style={styles.image}/>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
                        <View>
                            {/* Ejercicio Perfecto Section */}
                            <View style={{
                                padding: 10,
                                paddingVertical: 20,
                                backgroundColor: '#EDF6FD',
                                borderRadius: 10
                            }}>
                                <View style={styles.inputTitleContainer}>
                                    <Text style={{
                                        color: '#333',
                                        fontSize: 28,
                                        fontWeight: '800',
                                        marginBottom: 15,
                                        width: '60%'
                                    }}>
                                        ¡Encuentra el ejercicio perfecto{' '}
                                        <Text style={{color: '#1089FF'}}>para ti</Text>!
                                    </Text>
                                    <Image source={require('../assets/yoga.png')}
                                           style={{borderRadius: 10, width: '40%', height: 140}}/>
                                </View>

                                {/* Dropdown - Search */}
                                <View style={styles.dropdownContainer}>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus && {borderColor: '#1089FF'}]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={data}
                                        search
                                        maxHeight={400}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Buscar' : 'Buscando...'}
                                        searchPlaceholder="Buscar..."
                                        value={value}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={(item) => {
                                            setValue(item.value);
                                            setIsFocus(false);
                                            console.log('Ha elegido el "' + item.value + '"');
                                        }}
                                        renderLeftIcon={() => (
                                            <Ionicons
                                                name="search-outline"
                                                size={20}
                                                color={'#888'}
                                                style={{marginRight: 5}}
                                            />
                                        )}
                                    />
                                </View>
                            </View>

                            {/* Botones - Opciones generales */}
                            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 20}}>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => navigation.navigate('ExerciseScreen')}
                                    accessibilityLabel={"Ir a la pantalla de Ejercicios"}
                                >
                                    <Ionicons name="barbell" size={24} color="black"/>
                                    <Text style={styles.buttonText}>Ejercicios</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => navigation.navigate('Progreso')}
                                    accessibilityLabel={"Ir a la pantalla de Progreso"}
                                >
                                    <Ionicons name="bar-chart" size={24} color="black"/>
                                    <Text style={styles.buttonText}>Progreso</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => navigation.navigate('Datos')}
                                    accessibilityLabel={"Ir a la pantalla de Datos"}
                                >
                                    <Ionicons name="file-tray-stacked" size={24} color="black"/>
                                    <Text style={styles.buttonText}>Datos</Text>
                                </Pressable>
                            </View>

                            {/* ========== Sección de videos ========== */}
                            <View>
                                <VideoCard
                                    onPress={() => {
                                        console.log("Navegando a VideoPlayerScreen...");
                                        navigation.navigate("VideoPlayerScreen", {
                                            videoId,
                                            title: videoTitle,
                                            description: videoDescription,
                                            videoTags,
                                        });
                                        console.log("Video seleccionado:", videoId);
                                    }}
                                    thumbnailSource={require('../assets/yogaHuman.png')}
                                    duration="00:00"
                                    title="Example Video"
                                    description="Example description"
                                    videoId="17VnGoUxt5Y"  // Esto ya está bien como prop
                                    style={{marginTop: 20, flex: 1}} // Estilo personalizado
                                />


                                {/* ========== Cards en 2 columnas ========== */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 16,
                                    marginBottom: 20
                                }}>
                                    <VideoCard
                                        onPress={() => {
                                            navigation.navigate('VideoPlayerScreen', {
                                                title: 'Example Video 2',
                                                description: 'Example description',
                                                videoId: 'Dlm0HsTEsuA'
                                            });
                                        }}
                                        thumbnailSource={require('../assets/yogaHuman.png')}
                                        duration="00:00"
                                        title="Example Video 2"
                                        description="Example description"
                                        videoId="Dlm0HsTEsuA"  // También pásarlo como prop
                                        style={{marginTop: 20, flex: 1}}
                                    />

                                    <VideoCard
                                        onPress={() => {
                                            navigation.navigate('VideoPlayerScreen', {
                                                title: 'Example Video 3',
                                                description: 'Example description',
                                                videoId: 'Jr5MjhgPz_c'
                                            });
                                        }}
                                        thumbnailSource={require('../assets/yogaHuman.png')}
                                        duration="00:00"
                                        title="Example Video 3"
                                        description="Example description"
                                        videoId="Jr5MjhgPz_c"  // También pásarlo como prop
                                        style={{marginTop: 20, flex: 1}}
                                    />
                                </View>


                                {/* ========== Card de video ========== */}
                                <View style={styles.inputTitleContainer}>
                                    <Image source={require('../assets/yogaHuman.png')}
                                           style={{borderRadius: 10, width: '40%', height: 140}}/>

                                    <Text style={{
                                        color: '#333',
                                        fontSize: 18,
                                        fontWeight: '800',
                                        marginBottom: 15,
                                        marginLeft: 15,
                                        width: '60%'
                                    }}>
                                        ¡Encuentra el ejercicio perfecto{' '}
                                        <Text style={{color: '#1089FF'}}>para ti</Text>!
                                    </Text>
                                </View>


                                <View style={styles.inputTitleContainer}>
                                    <Image source={require('../assets/yogaHuman.png')}
                                           style={{borderRadius: 10, width: '40%', height: 140}}/>

                                    <Text style={{
                                        color: '#333',
                                        fontSize: 18,
                                        fontWeight: '800',
                                        marginBottom: 15,
                                        marginLeft: 15,
                                        width: '60%'
                                    }}>
                                        ¡This card is a{' '}
                                        <Text style={{color: '#1089FF'}}>test</Text>!
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaProvider>
        </TouchableWithoutFeedback>
    );
};

const ProfileScreen = ({navigation}) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        console.log('No se encontraron datos para este usuario.');
                    }
                } catch (error) {
                    console.log('Error al recuperar los datos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('No hay un usuario autenticado.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar style="auto"/>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.titleContainer}>
                        <View style={styles.textContainer}>
                            <Text style={{color: '#444444', fontSize: 20, fontWeight: '400'}}>👏 Bienvenido,</Text>
                            <Text style={styles.title}>{userData.firstName}{' '}{userData.lastName}</Text>
                        </View>
                        <Image source={require('../assets/avatar2.png')} style={styles.image}/>
                    </View>
                        <View>
                            <Text>Nombre: {userData?.firstName}</Text>
                            <Text>Apellido: {userData?.lastName}</Text>
                            <Text>Teléfono: {userData?.phone}</Text>
                            <Text>Dirección: {userData?.address}</Text>
                            <Text>Correo electrónico: {userData?.email}</Text>
                            <Text>Genero: {userData?.genero}</Text>
                            <Text>Edad: {userData?.edad}</Text>
                            <Text>Peso: {userData?.peso}</Text>
                            <Text>Estatura: {userData?.estatura}</Text>
                            <Text>Padecimiento: {userData?.padecimiento}</Text>
                        </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

// Tab.Navigator conteniendo las pantallas Home y Profile
const MyTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Inicio" component={HomeScreen}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({color, size}) => (
                                <Icon name="home-sharp" size={size} color={color}/>
                            ),
                            tabBarLabelStyle: {
                                fontSize: 14,
                            },
                        }}
            />
            <Tab.Screen name="Perfil" component={ProfileScreen}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({color, size}) => (
                                <Icon name="person-outline" size={size} color={color}/>
                            ),
                            tabBarLabel: 'Perfil',
                            tabBarLabelStyle: {
                                fontSize: 14,
                            },
                            style: {
                                paddingBottom: 10
                            }
                        }}
            />
        </Tab.Navigator>
    );
};

// Este es el componente principal. No es necesario envolver con un NavigationContainer aquí.
export default MyTabs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        position: 'fixed',
        top: 50,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        marginBottom: 5,
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 20,
    },
    textContainer: {
        flex: 1, // Toma el espacio disponible
        alignItems: 'flex-start', // Alinea el texto a la izquierda
    },
    image: {
        width: 60,  // Ajusta el tamaño de la imagen según lo necesites
        height: 60,
        marginLeft: 10,  // Separación entre el texto y la imagen
        borderRadius: 20,
    },
    buttonContainer: {
        bottom: 50,
        width: '100%',
        marginHorizontal: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#EBEBFF',
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
        paddingVertical: 40,
        borderRadius: 26,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#efefef',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        paddingTop: 5,
        fontSize: 16,
        textAlign: "center",
        fontWeight: "500",
    },
    inputTitleContainer: {
        flexDirection: 'row', // Posiciona los elementos en línea
        alignItems: 'center', // Alinea verticalmente
        borderRadius: 10,
        paddingVertical: 5,
        maxWidth: '100%',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row', // Posiciona los elementos en línea
        alignItems: 'center', // Alinea verticalmente
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1, // Toma el espacio restante
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    //============ Estilos de DropDown ============//
    dropdownContainer: {
        marginVertical: 5, // Espaciado entre el dropdown y otros elementos
    },
    dropdown: {
        height: 55,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
    },
    placeholderStyle: {
        fontSize: 16,
        borderRadius: 10,
        color: '#888',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#FFFFFF',
    },
    inputSearchStyle: {
        height: 55,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFF',
        borderWidth: 1,

    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    firstName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },

});