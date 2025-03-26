import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import VideoCard from '../components/VideoCard';
import YouTubeService from '../services/YoutubeService';

// Obtener color de cada etapa
const getStageColors = (stageId) => {
    switch (stageId) {
        case 'Etapa 1': return { primary: '#FF6B8B', secondary: '#FF6B8B' };
        case 'Etapa 2': return { primary: '#49A7FF', secondary: '#49A7FF' };
        case 'Etapa 3': return { primary: '#77DD77', secondary: '#77DD77' };
        case 'Etapa 4': return { primary: '#FFA94D', secondary: '#FFA94D' };
        default: return { primary: '#AAAAAA', secondary: '#888888' };
    }
};

const StageExercisesScreen = ({ route, navigation }) => {
    const { stageId, categoryId, categoryTitle, stageTitle } = route.params;
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [usingFallback, setUsingFallback] = useState(false);

    const stageColors = getStageColors(stageId);

    // Función mejorada para filtrar videos
    const filterVideosForStageAndCategory = (allVideos) => {
        // Normalizar cadenas para comparar
        const normalizeString = (str) => str?.toLowerCase().replace(/\s+/g, '') || '';

        // Obtener tag y rango de etapa basado en stageId
        let stageTag, stageRange;
        switch (stageId) {
            case 'Etapa 1':
                stageTag = '0-3meses';
                stageRange = '0-3';
                break;
            case 'Etapa 2':
                stageTag = '4-6meses';
                stageRange = '4-6';
                break;
            case 'Etapa 3':
                stageTag = '7-9meses';
                stageRange = '7-9';
                break;
            case 'Etapa 4':
                stageTag = '10-12meses';
                stageRange = '10-12';
                break;
            default:
                stageTag = '';
                stageRange = '';
        }

        const normalizedCategory = normalizeString(categoryTitle);

        // Filtrar videos con criterios más flexibles
        const filteredVideos = allVideos.filter(video => {
            const tags = video.snippet.tags || [];
            const title = normalizeString(video.snippet.title);
            const description = normalizeString(video.snippet.description);

            // Verificar tags, título y descripción para la etapa
            const hasStageInfo =
                tags.some(tag => normalizeString(tag) === stageTag) ||
                tags.some(tag => normalizeString(tag).includes(stageRange)) ||
                title.includes(stageTag) ||
                description.includes(stageTag) ||
                title.includes(stageRange) ||
                description.includes(stageRange);

            // Verificar tags, título y descripción para la categoría
            const hasCategoryInfo =
                tags.some(tag => normalizeString(tag) === normalizedCategory) ||
                tags.some(tag => normalizeString(tag).includes(normalizedCategory)) ||
                title.includes(normalizedCategory) ||
                description.includes(normalizedCategory);

            return hasStageInfo && hasCategoryInfo;
        });

        // Si no encontramos nada, usar solo categoría como fallback
        if (filteredVideos.length === 0) {
            setUsingFallback(true);
            const categoryOnlyVideos = allVideos.filter(video => {
                const tags = video.snippet.tags || [];
                const title = normalizeString(video.snippet.title);
                const description = normalizeString(video.snippet.description);

                const hasCategoryInfo =
                    tags.some(tag => normalizeString(tag) === normalizedCategory) ||
                    tags.some(tag => normalizeString(tag).includes(normalizedCategory)) ||
                    title.includes(normalizedCategory) ||
                    description.includes(normalizedCategory);

                return hasCategoryInfo;
            });

            return categoryOnlyVideos.slice(0, 10); // Limitamos a 10 videos como fallback
        } else {
            setUsingFallback(false);
        }

        return filteredVideos;
    };

    // Cargar videos
    const loadVideos = useCallback(async (refresh = false) => {
        if (refresh) {
            setIsLoading(true);
            setNextPageToken(null);
        } else if (isLoadingMore) {
            return;
        }

        if (!refresh && nextPageToken) {
            setIsLoadingMore(true);
        }

        try {
            const result = await YouTubeService.getVideos({
                maxResults: 20,
                pageToken: refresh ? null : nextPageToken,
                forceRefresh: refresh
            });

            if (result.videos && result.videos.length > 0) {
                // Filtrar videos por etapa y categoría
                const filteredVideos = filterVideosForStageAndCategory(result.videos);

                if (refresh || !nextPageToken) {
                    setVideos(filteredVideos);
                } else {
                    // Anexar nuevos videos filtrados a los existentes
                    setVideos(prev => [...prev, ...filteredVideos]);
                }

                setNextPageToken(result.nextPageToken);
            } else {
                console.log('No se encontraron videos o respuesta vacía');
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            setRefreshing(false);
        }
    }, [nextPageToken, isLoadingMore, stageId, categoryTitle]);

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadVideos(true);
    }, [loadVideos]);

    // Cargar videos al iniciar
    useEffect(() => {
        loadVideos(true);
    }, []);

    // Manejar "llegó al final de la lista" para cargar más
    const handleEndReached = () => {
        if (nextPageToken && !isLoadingMore && !isLoading) {
            loadVideos();
        }
    };

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor={stageColors.secondary} />
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Cabecera con la etapa y categoría seleccionada */}
                <View
                    style={[styles.header, { backgroundColor: stageColors.secondary }]}
                    accessibilityLabel={`Ejercicios de ${categoryTitle} para ${stageTitle}`}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityLabel="Regresar a la pantalla anterior"
                        accessibilityRole="button"
                        accessibilityHint="Vuelve a la lista de categorías"
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text
                            style={styles.headerSubtitle}
                            accessibilityLabel={`Etapa: ${stageTitle}`}
                        >
                            {stageTitle}
                        </Text>
                        <Text
                            style={styles.headerTitle}
                            accessibilityLabel={`Categoría: ${categoryTitle}`}
                        >
                            {categoryTitle}
                        </Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[stageColors.secondary]}
                            tintColor={stageColors.secondary}
                            accessibilityLabel="Desliza hacia abajo para actualizar"
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
                    accessibilityLabel={`Lista de ejercicios de ${categoryTitle} para ${stageTitle}`}
                >
                    <Text
                        style={styles.sectionTitle}
                        accessibilityRole="text"
                    >
                        Ejercicios para {categoryTitle} en {stageTitle}
                    </Text>

                    {isLoading && !isLoadingMore ? (
                        <View
                            style={styles.loaderContainer}
                            accessibilityLabel="Cargando ejercicios, por favor espere"
                        >
                            <ActivityIndicator size="large" color={stageColors.secondary} />
                            <Text style={styles.loaderText}>Cargando ejercicios...</Text>
                        </View>
                    ) : videos.length === 0 ? (
                        <View
                            style={styles.emptyContainer}
                            accessibilityLabel="No hay ejercicios disponibles para esta categoría y etapa"
                        >
                            <Ionicons name="fitness-outline" size={60} color="#CCCCCC" />
                            <Text style={styles.emptyText}>
                                No hay ejercicios disponibles para esta categoría y etapa.
                            </Text>
                            <TouchableOpacity
                                style={[styles.refreshButton, { backgroundColor: stageColors.secondary }]}
                                onPress={() => loadVideos(true)}
                                accessibilityLabel="Intentar nuevamente"
                                accessibilityRole="button"
                                accessibilityHint="Intenta cargar los ejercicios otra vez"
                            >
                                <Text style={styles.refreshButtonText}>Intentar nuevamente</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View
                            style={styles.videoListContainer}
                            accessibilityLabel={`${videos.length} ejercicios encontrados`}
                        >
                            {usingFallback && (
                                <View
                                    style={styles.fallbackBanner}
                                    accessibilityLabel={`Mostrando todos los ejercicios de ${categoryTitle} sin filtrar por etapa`}
                                >
                                    <Ionicons name="information-circle" size={20} color="#666" />
                                    <Text style={styles.fallbackText}>
                                        Mostrando todos los ejercicios de {categoryTitle}
                                    </Text>
                                </View>
                            )}

                            {videos.map((video, index) => (
                                <VideoCard
                                    key={`${video.id}-${index}`}
                                    videoId={video.id}
                                    title={video.snippet.title}
                                    description={video.snippet.description}
                                    videoTags={video.snippet.tags || []}
                                    videoDuration={video.formattedDuration}
                                    style={{ marginBottom: 16 }}
                                    onPress={() => navigation.navigate('VideoPlayerScreen', {
                                        videoId: video.id,
                                        title: video.snippet.title,
                                        description: video.snippet.description,
                                        videoTags: video.snippet.tags || [],
                                        // Agregar estos parámetros importantes para el seguimiento del progreso
                                        categoryId: categoryId,
                                        categoryTitle: categoryTitle,
                                        stageId: stageId,
                                        stageTitle: stageTitle
                                    })}
                                    accessibilityLabel={`Video: ${video.snippet.title}. Duración: ${video.formattedDuration || 'No disponible'}`}
                                    accessibilityRole="button"
                                    accessibilityHint="Pulsa para reproducir este video"
                                />
                            ))}

                            {isLoadingMore && (
                                <View
                                    style={styles.loadMoreContainer}
                                    accessibilityLabel="Cargando más ejercicios"
                                >
                                    <ActivityIndicator size="small" color={stageColors.secondary} />
                                    <Text style={styles.loadMoreText}>Cargando más ejercicios...</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Información adicional sobre esta categoría para esta etapa */}
                    <View
                        style={styles.infoCard}
                        accessibilityLabel="Información importante sobre los ejercicios"
                    >
                        <Text
                            style={styles.infoTitle}
                            accessibilityRole="text"
                        >
                            ¿Por qué es importante?
                        </Text>
                        <Text
                            style={styles.infoDescription}
                            accessibilityLabel={`Los ejercicios de ${categoryTitle.toLowerCase()} para bebés de ${stageTitle} ayudan a desarrollar la movilidad y fortaleza muscular, preparando al bebé para los hitos de desarrollo correspondientes a su edad.`}
                        >
                            Los ejercicios de {categoryTitle.toLowerCase()} para bebés de {stageTitle} ayudan a desarrollar
                            la movilidad y fortaleza muscular, preparando al bebé para los hitos de desarrollo
                            correspondientes a su edad.
                        </Text>
                        <Text
                            style={styles.infoTitle}
                            accessibilityRole="text"
                        >
                            Consejos para esta etapa
                        </Text>
                        <View style={styles.tipsList}>
                            <View
                                style={styles.tipItem}
                                accessibilityLabel="Consejo: Realiza los ejercicios a diario por periodos cortos"
                            >
                                <Ionicons name="checkmark-circle" size={20} color={stageColors.secondary} />
                                <Text style={styles.tipText}>Realiza los ejercicios a diario por periodos cortos</Text>
                            </View>
                            <View
                                style={styles.tipItem}
                                accessibilityLabel="Consejo: Observa las reacciones del bebé; detente si muestra incomodidad"
                            >
                                <Ionicons name="checkmark-circle" size={20} color={stageColors.secondary} />
                                <Text style={styles.tipText}>Observa las reacciones del bebé; detente si muestra incomodidad</Text>
                            </View>
                            <View
                                style={styles.tipItem}
                                accessibilityLabel="Consejo: Consulta avances con tu pediatra regularmente"
                            >
                                <Ionicons name="checkmark-circle" size={20} color={stageColors.secondary} />
                                <Text style={styles.tipText}>Consulta avances con tu pediatra regularmente</Text>
                            </View>
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 16,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loaderText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    refreshButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    fallbackBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    fallbackText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
    },
    videoListContainer: {
        marginBottom: 10,
    },
    loadMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 14,
        color: '#666666',
    },
    infoCard: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 8,
    },
    infoDescription: {
        fontSize: 15,
        color: '#555555',
        lineHeight: 22,
        marginBottom: 16,
    },
    tipsList: {
        marginTop: 4,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    tipText: {
        fontSize: 14,
        color: '#555555',
        marginLeft: 8,
        flex: 1,
    },
});

export default StageExercisesScreen;