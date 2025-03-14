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
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VideoCard from '../components/VideoCard';
import YouTubeService from '../services/YoutubeService';

import {getDoc, doc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../../firebaseConfig';

// Definir el Tab.Navigator y las pantallas
const Tab = createBottomTabNavigator();

const data = [
    {label: 'Brazo', value: 'Brazo'},
    {label: 'Cardio', value: 'Cardio'},
    {label: 'Flexibilidad', value: 'Flexibilidad'},
    {label: 'Fuerza', value: 'Fuerza'},
    {label: 'Rehabilitación', value: 'Rehabilitación'},
    {label: 'Estiramientos', value: 'Estiramientos'},
    {label: 'Pilates', value: 'Pilates'},
    {label: 'Meditación', value: 'Meditación'},
];

const HomeScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            setCurrentUser(user);

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
        loadFeaturedVideos();
    }, []);

    // Cargar videos destacados para la pantalla de inicio
    const loadFeaturedVideos = async () => {
        setVideosLoading(true);
        try {
            // Usar el servicio optimizado para cargar los videos
            // No forzamos la actualización, siempre usamos caché si está disponible
            const result = await YouTubeService.getVideos({
                maxResults: 5,  // Solo necesitamos unos pocos para la página principal
                forceRefresh: false  // Usar caché si está disponible
            });

            if (result && result.videos && result.videos.length > 0) {
                setFeaturedVideos(result.videos);
            }
        } catch (error) {
            console.error('Error loading featured videos:', error);
        } finally {
            setVideosLoading(false);
        }
    };

    // Función para manejar la selección de categoría desde el dropdown
    const handleCategorySelect = (item) => {
        setValue(item.value);
        setIsFocus(false);
        console.log('Ha elegido el "' + item.value + '"');
        // Navegar a la pantalla de ejercicios con la categoría seleccionada
        navigation.navigate('ExerciseScreen', { selectedCategory: item.value });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaProvider style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar style="dark" />
                <View style={[styles.containerFixed, { paddingTop: insets.top }]}>
                    {/* Header */}
                    <View style={styles.titleContainer}>
                        <View style={styles.textContainer}>
                            <Text style={{color: '#444444', fontSize: 20, fontWeight: '400'}}>👏 Bienvenido,</Text>
                            {userData ? (
                                <Text style={styles.title}>{userData.firstName}{' '}{userData.lastName}</Text>
                            ) : (
                                <Text style={styles.title}>Guest</Text>
                            )}
                        </View>
                        <Image source={require('../assets/avatar2.png')} style={styles.image}/>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={true}
                    >
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
                                        onChange={handleCategorySelect}
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
                                <Text style={styles.sectionTitle}>Videos recomendados</Text>

                                {videosLoading ? (
                                    <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
                                ) : featuredVideos.length > 0 ? (
                                    <>
                                        {/* First featured video (larger) */}
                                        {featuredVideos[0] && (
                                            <VideoCard
                                                videoId={featuredVideos[0].id}
                                                title={featuredVideos[0].snippet.title}
                                                description={featuredVideos[0].snippet.description}
                                                videoTags={featuredVideos[0].snippet.tags || []}
                                                videoDuration={featuredVideos[0].formattedDuration}
                                                style={{marginTop: 20}}
                                                onPress={() => {
                                                    navigation.navigate("VideoPlayerScreen", {
                                                        videoId: featuredVideos[0].id,
                                                        title: featuredVideos[0].snippet.title,
                                                        description: featuredVideos[0].snippet.description,
                                                        videoTags: featuredVideos[0].snippet.tags || [],
                                                    });
                                                }}
                                            />
                                        )}

                                        {/* Cards en 2 columnas */}
                                        {featuredVideos.length > 1 && (
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                gap: 16,
                                                marginTop: 20
                                            }}>
                                                {/* Primer video de la columna */}
                                                {featuredVideos[1] && (
                                                    <VideoCard
                                                        videoId={featuredVideos[1].id}
                                                        title={featuredVideos[1].snippet.title}
                                                        description={featuredVideos[1].snippet.description}
                                                        videoTags={featuredVideos[1].snippet.tags || []}
                                                        videoDuration={featuredVideos[1].formattedDuration}
                                                        style={{flex: 1}}
                                                        onPress={() => {
                                                            navigation.navigate("VideoPlayerScreen", {
                                                                videoId: featuredVideos[1].id,
                                                                title: featuredVideos[1].snippet.title,
                                                                description: featuredVideos[1].snippet.description,
                                                                videoTags: featuredVideos[1].snippet.tags || [],
                                                            });
                                                        }}
                                                    />
                                                )}

                                                {/* Segundo video de la columna */}
                                                {featuredVideos[2] && (
                                                    <VideoCard
                                                        videoId={featuredVideos[2].id}
                                                        title={featuredVideos[2].snippet.title}
                                                        description={featuredVideos[2].snippet.description}
                                                        videoTags={featuredVideos[2].snippet.tags || []}
                                                        videoDuration={featuredVideos[2].formattedDuration}
                                                        style={{flex: 1}}
                                                        onPress={() => {
                                                            navigation.navigate("VideoPlayerScreen", {
                                                                videoId: featuredVideos[2].id,
                                                                title: featuredVideos[2].snippet.title,
                                                                description: featuredVideos[2].snippet.description,
                                                                videoTags: featuredVideos[2].snippet.tags || [],
                                                            });
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        )}

                                        {/* Additional videos */}
                                        {featuredVideos.length > 3 && (
                                            <>
                                                <Text style={[styles.sectionTitle, {marginTop: 24}]}>Videos populares</Text>
                                                {featuredVideos.slice(3).map((video, index) => (
                                                    <VideoCard
                                                        key={index}
                                                        videoId={video.id}
                                                        title={video.snippet.title}
                                                        description={video.snippet.description}
                                                        videoTags={video.snippet.tags || []}
                                                        videoDuration={video.formattedDuration}
                                                        style={{marginTop: 16}}
                                                        onPress={() => {
                                                            navigation.navigate("VideoPlayerScreen", {
                                                                videoId: video.id,
                                                                title: video.snippet.title,
                                                                description: video.snippet.description,
                                                                videoTags: video.snippet.tags || [],
                                                            });
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Text style={styles.noResultsText}>No hay videos disponibles ahora.</Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaProvider>
        </TouchableWithoutFeedback>
    );
};

const ProfileScreen = ({navigation}) => {
    const insets = useSafeAreaInsets(); // Obtener los insets de SafeArea
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
                <View style={[styles.container, { paddingTop: insets.top }]}>
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

export default MyTabs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    containerFixed: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        paddingBottom: 120, // Espacio adicional en la parte inferior
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginTop: 24,
        marginBottom: 8,
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
        flex: 1,
        alignItems: 'flex-start',
    },
    image: {
        width: 60,
        height: 60,
        marginLeft: 10,
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
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 5,
        maxWidth: '100%',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    noResultsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    //============ Estilos de DropDown ============//
    dropdownContainer: {
        marginVertical: 5,
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