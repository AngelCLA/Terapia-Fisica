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

const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');

const ExerciseScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Helper to load videos for the selected category
    // Modificación del loadVideos para cargar todos los videos una sola vez
    const loadVideos = useCallback(async (refresh = false) => {
        if (refresh) {
            setIsLoading(true);
        } else if (isLoadingMore) {
            return; // Prevent multiple pagination requests
        }

        // Only set loading more if we're paginating
        if (!refresh && nextPageToken) {
            setIsLoadingMore(true);
        }

        try {
            const result = await YouTubeService.getVideos({
                maxResults: 10,
                category: null, // No filtrar en servidor
                cacheKey: `exercise_all`,
                forceRefresh: refresh,
                pageToken: refresh ? null : nextPageToken
            });

            if (result.videos) {
                if (refresh || !nextPageToken) {
                    // Replace videos on fresh load
                    setVideos(result.videos);
                } else {
                    // Append videos when paginating
                    setVideos(prev => [...prev, ...result.videos]);
                }

                // Update next page token for pagination
                setNextPageToken(result.nextPageToken);
            }
        } catch (error) {
            console.error('Error loading videos in ExerciseScreen:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [nextPageToken, isLoadingMore]);

// Y luego modificarías el useEffect para no pasar la categoría:
    useEffect(() => {
        loadVideos(true);
    }, []);

// Y eliminarías este useEffect:
// useEffect(() => {
//     if (selectedCategory) {
//         loadVideos(selectedCategory, true);
//     }
// }, [selectedCategory]);

    // Handle "reached end of list" to load more
    const handleEndReached = () => {
        if (nextPageToken && !isLoadingMore && !isLoading) {
            loadVideos();
        }
    };

    // Filter videos based on selected category (for client-side filtering)
    const filteredVideos = selectedCategory === "Todos"
        ? videos
        : videos.filter((video) =>
            (video.snippet.tags || []).some((tag) =>
                normalizeString(tag) === normalizeString(selectedCategory)
            )
        );

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
                    scrollEventThrottle={400} // Throttle scroll events
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

                                {/* Loading indicator for pagination */}
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