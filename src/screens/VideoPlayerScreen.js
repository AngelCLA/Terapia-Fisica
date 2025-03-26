import React, {useCallback, useRef, useState, useEffect} from 'react';
import {Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from "expo-status-bar";
import YouTubeIframe from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityCompletionButton from '../components/ActivityCompletionButton';

const COMPLETED_VIDEOS_KEY = 'completed_videos';

const getRandomColor = () => {
    const colors = [
        '#E6F2FF', '#E0F8E0', '#FFF0E6',
        '#F0E6FF', '#E6FFEA', '#FFFAE6',
        '#E6F3FF', '#F2FFE6', '#FFE6F2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const VideoPlayerScreen = ({route, navigation}) => {
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const {title, description, videoTags, videoId} = route.params;
    const scrollViewRef = useRef(null);
    const playerRef = useRef(null);

    // Cargar el estado de completado al montar el componente
    React.useEffect(() => {
        checkVideoCompletion();
    }, [videoId]);

    // Efecto para detectar cuando el video está por terminar
    useEffect(() => {
        if (duration > 0 && currentTime > 0) {
            // Cuando faltan menos de 0.5 segundos para terminar
            if (duration - currentTime < 0.5 && !videoEnded) {
                // Marcamos que terminó el video
                setVideoEnded(true);
                setIsPlaying(false);
                setVideoCompleted(true);

                // Pausa el video justo antes de que termine
                if (playerRef.current) {
                    // Pausa en el último frame
                    playerRef.current.getCurrentTime().then(time => {
                        playerRef.current.seekTo(time - 0.1, true);
                    });
                }
            }
        }
    }, [currentTime, duration, videoEnded]);

    const checkVideoCompletion = async () => {
        try {
            const completedVideos = await AsyncStorage.getItem(COMPLETED_VIDEOS_KEY);
            if (completedVideos) {
                const videos = JSON.parse(completedVideos);
                if (videos.includes(videoId)) {
                    setVideoCompleted(true);
                }
            }
        } catch (error) {
            console.error('Error al verificar video completado:', error);
        }
    };

    const handleStateChange = useCallback((state) => {
        if (state === 'ended') {
            setVideoCompleted(true);
            setIsPlaying(false);
            setVideoEnded(true);
        } else if (state === 'playing') {
            setIsPlaying(true);
            setVideoEnded(false);
        } else if (state === 'paused') {
            setIsPlaying(false);
        }
    }, []);

    const handleProgress = useCallback(({currentTime, duration}) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);
        setCurrentTime(currentTime);
        setDuration(duration);
    }, []);

    const markVideoAsCompleted = async () => {
        try {
            const existingVideos = await AsyncStorage.getItem(COMPLETED_VIDEOS_KEY);
            const completedVideos = existingVideos ? JSON.parse(existingVideos) : [];

            if (!completedVideos.includes(videoId)) {
                completedVideos.push(videoId);
                await AsyncStorage.setItem(COMPLETED_VIDEOS_KEY, JSON.stringify(completedVideos));
                Alert.alert(
                    "¡Felicitaciones!",
                    "Has completado este video exitosamente.",
                    [{text: "OK"}]
                );
            }
        } catch (error) {
            console.error('Error al marcar video como completado:', error);
            Alert.alert(
                "Error",
                "No se pudo marcar el video como completado. Intenta nuevamente.",
                [{text: "OK"}]
            );
        }
    };

    if (!videoId) {
        return (
            <SafeAreaProvider style={styles.safeArea}>
                <Text
                    style={styles.errorText}
                    accessibilityLabel="No se pudo cargar el video. ID no definido."
                >
                    No se pudo cargar el video. ID no definido.
                </Text>
            </SafeAreaProvider>
        );
    }

    // Capa personalizada para cubrir el reproductor cuando termina
    const EndOverlay = () => (
        <View
            style={styles.endOverlay}
            accessibilityLabel="Video finalizado"
        >
            {/* Aquí puedes poner tu contenido personalizado
                en lugar de las recomendaciones de YouTube */}
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaProvider style={styles.safeArea}>
                <StatusBar style="auto"/>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    accessibilityLabel={`Reproductor de video: ${title}`}
                >
                    <View
                        style={styles.videoContainer}
                        accessibilityLabel="Contenedor del reproductor de video"
                    >
                        <YouTubeIframe
                            ref={playerRef}
                            height={500}
                            videoId={videoId}
                            play={isPlaying}
                            onChangeState={handleStateChange}
                            onProgress={handleProgress}
                            webViewProps={{
                                originWhitelist: ['*'],
                                accessible: true,
                                accessibilityLabel: `Reproductor de YouTube para ${title}`
                            }}
                            params={{
                                modestbranding: 1,
                                rel: 0,
                                controls: 1,
                                showinfo: 0,
                                fs: 1,
                                playsinline: 1,
                                iv_load_policy: 3,
                                cc_load_policy: 0,
                                autohide: 1,
                                color: 'white',
                                enablejsapi: 1,
                                disablekb: 0
                            }}
                            forceAndroidAutoplay={true}
                        />
                        {videoEnded && <EndOverlay />}
                    </View>

                    <View
                        style={styles.detailsContainer}
                        accessibilityLabel="Detalles del video"
                    >
                        <Text
                            style={styles.title}
                            accessibilityRole="text"
                            accessibilityLabel={`Título: ${title}`}
                        >
                            {title}
                        </Text>
                        {videoTags && videoTags.length > 0 && (
                            <View
                                style={styles.tagsContainer}
                                accessibilityLabel="Etiquetas del video"
                            >
                                {videoTags.map((tag, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.tagBubble,
                                            {backgroundColor: getRandomColor()}
                                        ]}
                                        accessibilityLabel={`Etiqueta: ${tag}`}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        <Text
                            style={styles.description}
                            accessibilityLabel={`Descripción: ${description}`}
                        >
                            {description}
                        </Text>
                    </View>

                    {videoProgress > 0 && !videoCompleted && (
                        <View
                            style={styles.progressContainer}
                            accessibilityLabel={`Progreso del video: ${Math.round(videoProgress)}%`}
                        >
                            <View style={[styles.progressBar, {width: `${videoProgress}%`}]}/>
                            <Text style={styles.progressText}>{Math.round(videoProgress)}% completado</Text>
                        </View>
                    )}

                    <View
                        style={styles.completionContainer}
                        accessibilityLabel="Controles de finalización de actividad"
                    >
                        <ActivityCompletionButton
                            activity={{
                                videoId: videoId,
                                videoTitle: title,
                                categoryId: route.params?.categoryId || 'general',
                                categoryTitle: route.params?.categoryTitle || 'General',
                                stageId: route.params?.stageId || 'Etapa 1',
                                stageTitle: route.params?.stageTitle || 'Etapa 1 (0-3 meses)'
                            }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
    },
    videoContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'black',
    },
    detailsContainer: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#606060',
        lineHeight: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 8,
    },
    tagBubble: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    tagText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    progressContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
    progressText: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        padding: 16,
        paddingBottom: 32,
        alignItems: 'stretch',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    completionContainer: {
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    endOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backgroundBlendMode: 'overlay',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default VideoPlayerScreen;