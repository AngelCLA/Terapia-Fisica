import React, {useEffect, useState, useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import VideoCard from '../components/VideoCard';
import YouTubeService from '../services/YoutubeService';

const categories = [
    "Todos",
    "Brazo",
    "Cardio",
    "Flexibilidad",
    "Fuerza",
    "Rehabilitación",
    "Estiramientos",
    "Pilates",
    "Meditación"
];

const ExerciseScreen = ({navigation, route}) => {
    // Verificar si se pasó una categoría por parámetro en la ruta
    const initialCategory = route.params?.selectedCategory || "Todos";
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Cargar videos solo una vez al inicio
    const loadVideos = useCallback(async (refresh = false) => {
        if (refresh) {
            setIsLoading(true);
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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    onScroll={({nativeEvent}) => {
                        const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
                        const paddingToBottom = 20;
                        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
                            contentSize.height - paddingToBottom;

                        if (isCloseToBottom) {
                            handleEndReached();
                        }
                    }}
                    scrollEventThrottle={400} // Limitar eventos de scroll
                >
                    <View style={styles.tagsContainer}>
                        {categories.map((category, index) => (
                            <Pressable
                                key={index}
                                onPress={() => setSelectedCategory(category)}
                                style={[styles.tagBubble, selectedCategory === category && {backgroundColor: 'rgba(0,123,255,0.6)'}]}
                            >
                                <Text style={[styles.tagText, selectedCategory === category && {color: '#fff'}]}>
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    <View style={styles.videoList}>
                        {isLoading && !isLoadingMore ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text style={styles.loadingText}>Cargando videos...</Text>
                            </View>
                        ) : filteredVideos.length > 0 ? (
                            <>
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

                                {/* Indicador de carga para paginación */}
                                {isLoadingMore && (
                                    <View style={styles.paginationLoader}>
                                        <ActivityIndicator size="small" color="#0000ff" />
                                        <Text style={styles.loadingMoreText}>Cargando más videos...</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <Text style={styles.noResultsText}>No hay videos disponibles para esta categoría.</Text>
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
        paddingHorizontal: 16,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        paddingBottom: 24,
        backgroundColor: '#FFFFFF',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 16,
        gap: 8,
    },
    tagBubble: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    videoList: {
        width: '100%',
        gap: 16,
    },
    noResultsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    loaderContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    paginationLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    loadingMoreText: {
        fontSize: 14,
        color: '#666',
    }
});

export default ExerciseScreen;