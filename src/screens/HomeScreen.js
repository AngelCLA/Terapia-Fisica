import React, {useEffect, useState} from 'react';
import {
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'expo-status-bar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from "@expo/vector-icons";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';

import VideoCard from '../components/VideoCard';
import YouTubeService from '../services/YoutubeService';

import {getDoc, doc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../../firebaseConfig';

// Definir el Tab.Navigator y las pantallas
const Tab = createBottomTabNavigator();

// Definir las etapas de vida disponibles
const etapasVida = [
    { id: 'Etapa 1', titulo: 'Etapa 1', rango: '0-3 meses', edadMedia: 2, color: '#FF6B8B', colorEnd: '#FF9F9F' },
    { id: 'Etapa 2', titulo: 'Etapa 2', rango: '4-6 meses', edadMedia: 5, color: '#49A7FF', colorEnd: '#6DBDFF' },
    { id: 'Etapa 3', titulo: 'Etapa 3', rango: '7-9 meses', edadMedia: 8, color: '#77DD77', colorEnd: '#B4FF9F' },
    { id: 'Etapa 4', titulo: 'Etapa 4', rango: '10-12 meses', edadMedia: 11, color: '#FFA94D', colorEnd: '#FFD59F' }
];

const HomeScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(true);
    const [currentEtapa, setCurrentEtapa] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            setCurrentUser(user);

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userDocData = userDoc.data();
                        setUserData(userDocData);

                        // Determinar la etapa actual basada en la edad guardada en el perfil
                        const edadMeses = parseInt(userDocData.edad || '0');
                        let etapaId = 'Etapa 1'; // Valor por defecto

                        if (edadMeses >= 0 && edadMeses < 4) {
                            etapaId = 'Etapa 1';
                        } else if (edadMeses >= 4 && edadMeses < 7) {
                            etapaId = 'Etapa 2';
                        } else if (edadMeses >= 7 && edadMeses < 10) {
                            etapaId = 'Etapa 3';
                        } else if (edadMeses >= 10) {
                            etapaId = 'Etapa 4';
                        }

                        setCurrentEtapa(etapaId);
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

    // Función para obtener la etapa actual completa
    const getCurrentEtapaData = () => {
        return etapasVida.find(etapa => etapa.id === currentEtapa) || etapasVida[0];
    };

    // Cargar videos destacados para la pantalla de inicio
    const loadFeaturedVideos = async () => {
        setVideosLoading(true);
        try {
            const result = await YouTubeService.getVideos({
                maxResults: 5,
                forceRefresh: false
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

    // Navegación a ejercicios específicos por etapa
    const navigateToEtapaExercises = () => {
        if (currentEtapa) {
            const etapaData = getCurrentEtapaData();
            navigation.navigate('StageCategoriesScreen', {
                stageId: etapaData.id,
                stageTitle: `${etapaData.titulo} (${etapaData.rango})`
            });
        } else {
            // Si no hay etapa seleccionada, ir a la selección de etapas
            navigation.navigate('StageSelection');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    // Obtener datos de la etapa actual
    const etapaActual = getCurrentEtapaData();

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
                            {/* Sección con la etapa actual del bebé */}
                            <View style={[styles.currentStageContainer, { backgroundColor: etapaActual.color }]}>
                                <View style={styles.stageHeaderContent}>
                                    <View style={styles.stageTextContainer}>
                                        <Text style={styles.currentStageTitle}>
                                            Etapa actual de desarrollo
                                        </Text>
                                        <Text style={styles.currentStageLabel}>
                                            {etapaActual.titulo}: {etapaActual.rango}
                                        </Text>
                                        <Text style={styles.currentStageDescription}>
                                            Ejercicios personalizados para bebés de {etapaActual.rango}
                                        </Text>
                                    </View>
                                    <View style={styles.babyIconContainer}>
                                        <MaterialCommunityIcons name="human-child" size={50} color="#FFFFFF" />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.stageActionButton}
                                    onPress={navigateToEtapaExercises}
                                >
                                    <Text style={styles.stageActionButtonText}>Ver ejercicios recomendados</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.changeStageButton}
                                    onPress={() => navigation.navigate('StageSelection')}
                                >
                                    <Text style={styles.changeStageButtonText}>Cambiar etapa</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Botones - Opciones rápidas */}
                            <Text style={styles.sectionTitle}>Acceso rápido</Text>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Pressable
                                    style={styles.button}
                                    onPress={navigateToEtapaExercises}
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
                                <Text style={styles.sectionTitle}>Videos recomendados para {etapaActual.rango}</Text>

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
                                    </>
                                ) : (
                                    <Text style={styles.noResultsText}>No hay videos disponibles ahora.</Text>
                                )}
                            </View>

                            {/* Otras etapas */}
                            <Text style={styles.sectionTitle}>Explorar otras etapas</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.otherStagesScrollContent}
                            >
                                {etapasVida.map((etapa) => {
                                    // Omitir la etapa actual
                                    if (etapa.id === currentEtapa) return null;

                                    return (
                                        <TouchableOpacity
                                            key={etapa.id}
                                            style={[styles.otherStageCard, {backgroundColor: etapa.color}]}
                                            onPress={() => navigation.navigate('StageCategoriesScreen', {
                                                stageId: etapa.id,
                                                stageTitle: `${etapa.titulo} (${etapa.rango})`
                                            })}
                                        >
                                            <Text style={styles.otherStageTitle}>{etapa.titulo}</Text>
                                            <Text style={styles.otherStageRange}>{etapa.rango}</Text>
                                            <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" style={styles.otherStageIcon} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaProvider>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
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
    noResultsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },

    // Estilos para la sección de etapa actual
    currentStageContainer: {
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    stageHeaderContent: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stageTextContainer: {
        flex: 3,
    },
    babyIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentStageTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 6,
    },
    currentStageLabel: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    currentStageDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    stageActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 10,
    },
    stageActionButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        marginRight: 8,
    },
    changeStageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    changeStageButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
        fontSize: 14,
    },

    // Estilos para la sección de otras etapas
    otherStagesScrollContent: {
        paddingVertical: 10,
        paddingRight: 20,
    },
    otherStageCard: {
        width: 150,
        height: 110,
        borderRadius: 12,
        marginRight: 12,
        padding: 14,
        justifyContent: 'space-between',
    },
    otherStageTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    otherStageRange: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    otherStageIcon: {
        alignSelf: 'flex-end',
        marginTop: 6,
    },
});

export default HomeScreen;