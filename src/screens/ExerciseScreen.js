import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoCard from '../components/VideoCard';

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

const CACHE_KEY = 'youtube_videos_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const API_KEY = 'AIzaSyCHS1WP1pkc536u2iIwK3UrEaUsw9faVQA';
const CHANNEL_ID = 'UCNJWe9sVinPkGd1KqGP45cA';

const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');

const ExerciseScreen = ({navigation}) => {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatDuration = (isoDuration) => {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');
        return hours ? `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}` : `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    };

    const fetchVideosFromAPI = async () => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&type=video&key=${API_KEY}`
            );
            const data = await response.json();

            if (!data.items) return null;

            const videoIds = data.items.map((video) => video.id.videoId).join(',');

            const detailsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`
            );
            const detailsData = await detailsResponse.json();

            if (!detailsData.items) return null;

            return detailsData.items.map((video) => ({
                ...video,
                formattedDuration: formatDuration(video.contentDetails.duration),
            }));
        } catch (error) {
            console.error('Error fetching videos:', error);
            return null;
        }
    };

    const saveToCache = async (videosData) => {
        try {
            const cacheData = {
                videos: videosData,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    };

    const loadFromCache = async () => {
        try {
            const cachedData = await AsyncStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const {videos, timestamp} = JSON.parse(cachedData);
                const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

                if (!isExpired) {
                    return videos;
                }
            }
            return null;
        } catch (error) {
            console.error('Error loading from cache:', error);
            return null;
        }
    };

    const loadVideos = async () => {
        setIsLoading(true);
        try {
            // Intentar cargar desde cache primero
            const cachedVideos = await loadFromCache();

            if (cachedVideos) {
                setVideos(cachedVideos);
            } else {
                // Si no hay cache válido, hacer llamada a la API
                const freshVideos = await fetchVideosFromAPI();
                if (freshVideos) {
                    setVideos(freshVideos);
                    await saveToCache(freshVideos);
                }
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, []);

    const filteredVideos = selectedCategory === "Todos"
        ? videos
        : videos.filter((video) => (video.snippet.tags || []).some((tag) => normalizeString(tag) === normalizeString(selectedCategory)));

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
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
                        {isLoading ? (
                            <Text style={styles.loadingText}>Cargando videos...</Text>
                        ) : filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
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
                            ))
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
        marginTop: 20,
    },
});

export default ExerciseScreen;