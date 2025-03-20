import React, {useEffect, useState, useCallback} from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    StatusBar
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from "@expo/vector-icons";
import VideoCard from '../components/VideoCard';
import YouTubeService from '../services/YoutubeService';

// Configuración de colores para cada categoría
const categoryConfig = {
    "Todos": {
        color: "#4A90E2",
        bgColor: "#E6F0FD"
    },
    "Brazo": {
        color: "#3DD6BA",
        bgColor: "#e8fcf8"
    },
    "Cadera": {
        color: "#FF8A5C",
        bgColor: "#FFF1E6"
    },
    "Codo": {
        color: "#FFC633",
        bgColor: "#FFF9E6"
    },
    "Dedos de la mano": {
        color: "#1089FF",
        bgColor: "#EDF6FD"
    },
    "Dedos de los pies": {
        color: "#FF5C5C",
        bgColor: "#FFE6E6"
    },
    "Hombro": {
        color: "#40A858",
        bgColor: "#E6FFF1"
    },
    "Muñeca": {
        color: "#8A5CFF",
        bgColor: "#F1E6FF"
    },
    "Rodilla": {
        color: "#40A858",
        bgColor: "#E6FFF1"
    },
    "Tobillo": {
        color: "#1089FF",
        bgColor: "#EDF6FD"
    }
};

const categories = Object.keys(categoryConfig);

const ExerciseScreen = ({navigation, route}) => {
    // Verificar si se pasó una categoría por parámetro en la ruta
    const initialCategory = route.params?.selectedCategory || "Todos";
    const [selectedCategory, setSelectedCategory] = useState(
        typeof initialCategory === 'string' ? initialCategory : initialCategory.value
    );
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Cargar videos solo una vez al inicio
    const loadVideos = useCallback(async (refresh = false) => {
        if (refresh) {
            setIsLoading(true);
            setNextPageToken(null);
        } else if (isLoadingMore) {
            return; // Prevenir múltiples solicitudes de paginación
        }

        // Sólo establecer loadingMore si estamos paginando
        if (!refresh && nextPageToken) {
            setIsLoadingMore(true);
        }

        try {
            // Usar el servicio optimizado
            const result = await YouTubeService.getVideos({
                maxResults: 20, // Cargar más videos de una vez
                pageToken: refresh ? null : nextPageToken,
                forceRefresh: refresh
            });

            if (result.videos) {
                if (refresh || !nextPageToken) {
                    // Reemplazar videos en carga inicial
                    setVideos(result.videos);
                    filterVideosByCategory(result.videos, selectedCategory);
                } else {
                    // Anexar videos al paginar
                    const updatedVideos = [...videos, ...result.videos];
                    setVideos(updatedVideos);
                    filterVideosByCategory(updatedVideos, selectedCategory);
                }

                // Actualizar token para paginación
                setNextPageToken(result.nextPageToken);
            }
        } catch (error) {
            console.error('Error loading videos in ExerciseScreen:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            setRefreshing(false);
        }
    }, [nextPageToken, isLoadingMore, selectedCategory]);

    // Filtrar videos basados en la categoría seleccionada (filtrado del lado del cliente)
    const filterVideosByCategory = useCallback((videosToFilter, category) => {
        if (category === "Todos") {
            setFilteredVideos(videosToFilter);
        } else {
            const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');
            const normalizedCategory = normalizeString(category);

            const filtered = videosToFilter.filter((video) =>
                (video.snippet.tags || []).some((tag) =>
                    normalizeString(tag) === normalizedCategory
                )
            );
            setFilteredVideos(filtered);
        }
    }, []);

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadVideos(true);
    }, [loadVideos]);

    // Cargar videos al iniciar
    useEffect(() => {
        loadVideos(true);
    }, []);

    // Cuando cambie la categoría, filtrar los videos ya cargados
    useEffect(() => {
        filterVideosByCategory(videos, selectedCategory);
    }, [selectedCategory, filterVideosByCategory]);

    // Manejar "llegó al final de la lista" para cargar más
    const handleEndReached = () => {
        if (nextPageToken && !isLoadingMore && !isLoading) {
            loadVideos();
        }
    };

    // Renderizar categorías con tamaño adaptativo
    const renderCategoryGrid = () => (
        <View style={styles.categoryGridContainer}>
            <View style={styles.categoryFlowContainer}>
                {categories.map((category) => {
                    const config = categoryConfig[category];
                    const isSelected = selectedCategory === category;

                    return (
                        <Pressable
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={[
                                styles.categoryChip,
                                { backgroundColor: isSelected ? config.color : config.bgColor }
                            ]}
                        >
                            <Text style={[
                                styles.categoryLabel,
                                { color: isSelected ? '#fff' : '#2D4665' }
                            ]}>
                                {category}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );

    // Renderizar mensajes de estado (cargando/no hay resultados)
    const renderStatusMessage = () => {
        if (isLoading && !isLoadingMore) {
            return (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.statusText}>Cargando ejercicios...</Text>
                </View>
            );
        }

        if (!isLoading && filteredVideos.length === 0) {
            return (
                <View style={styles.statusContainer}>
                    <Ionicons name="search-outline" size={50} color="#CCCCCC" />
                    <Text style={styles.statusText}>No hay ejercicios disponibles para esta categoría.</Text>
                    <Pressable
                        style={styles.refreshButton}
                        onPress={() => loadVideos(true)}
                    >
                        <Text style={styles.refreshButtonText}>Intentar nuevamente</Text>
                    </Pressable>
                </View>
            );
        }

        return null;
    };

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4A90E2']}
                            tintColor="#4A90E2"
                        />
                    }
                    onScroll={({nativeEvent}) => {
                        const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
                        const paddingToBottom = 50;
                        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
                            contentSize.height - paddingToBottom;

                        if (isCloseToBottom) {
                            handleEndReached();
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    {renderCategoryGrid()}

                    <View style={styles.videosSection}>
                        <Text style={styles.videosSectionTitle}>
                            {selectedCategory === "Todos"
                                ? "Todos los ejercicios"
                                : `Ejercicios para ${selectedCategory.toLowerCase()}`}
                        </Text>

                        {renderStatusMessage()}

                        {!isLoading && filteredVideos.length > 0 && (
                            <View style={styles.videoList}>
                                {filteredVideos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        videoId={video.id}
                                        title={video.snippet.title}
                                        description={video.snippet.description}
                                        videoTags={video.snippet.tags || []}
                                        videoDuration={video.formattedDuration}
                                        onPress={() =>
                                            navigation.navigate('VideoPlayerScreen', {
                                                videoId: video.id,
                                                title: video.snippet.title,
                                                description: video.snippet.description,
                                                videoTags: video.snippet.tags || [],
                                            })
                                        }
                                    />
                                ))}
                            </View>
                        )}

                        {isLoadingMore && (
                            <View style={styles.loadMoreContainer}>
                                <ActivityIndicator size="small" color="#4A90E2" />
                                <Text style={styles.loadMoreText}>Cargando más ejercicios...</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        paddingBottom: 24,
        paddingTop: 8
    },
    categoryGridContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D4665',
        marginBottom: 12,
    },
    categoryFlowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4, // Compensar el margen de los chips
    },
    categoryChip: {
        margin: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryLabel: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    videosSection: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    videosSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D4665',
        marginBottom: 16,
        marginTop: 8,
    },
    videoList: {
        gap: 16,
    },
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    statusText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 12,
    },
    refreshButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#4A90E2',
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    loadMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 14,
        color: '#666666',
    },
});

export default ExerciseScreen;