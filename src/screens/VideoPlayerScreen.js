import React, {useCallback, useRef, useState} from 'react';
import {Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from "expo-status-bar";
import YouTubeIframe from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const {title, description, videoTags, videoId} = route.params;
    const scrollViewRef = useRef(null);

    // Cargar el estado de completado al montar el componente
    React.useEffect(() => {
        checkVideoCompletion();
    }, [videoId]);

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
        } else if (state === 'playing') {
            setIsPlaying(true);
        } else if (state === 'paused') {
            setIsPlaying(false);
        }
    }, []);

    const handleProgress = useCallback(({currentTime, duration}) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);
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
                <Text style={styles.errorText}>No se pudo cargar el video. ID no definido.</Text>
            </SafeAreaProvider>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaProvider style={styles.safeArea}>
                <StatusBar style="auto"/>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.videoContainer}>
                        <YouTubeIframe
                            height={300}
                            videoId={videoId}
                            play={isPlaying}
                            onChangeState={handleStateChange}
                            onProgress={handleProgress}
                            params={{
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                fs: 1,
                            }}
                        />
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{title}</Text>
                        {videoTags && videoTags.length > 0 && (
                            <View style={styles.tagsContainer}>
                                {videoTags.map((tag, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.tagBubble,
                                            {backgroundColor: getRandomColor()}
                                        ]}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        <Text style={styles.description}>{description}</Text>
                    </View>

                    {videoProgress > 0 && !videoCompleted && (
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, {width: `${videoProgress}%`}]}/>
                            <Text style={styles.progressText}>{Math.round(videoProgress)}% completado</Text>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <Pressable
                            onPress={markVideoAsCompleted}
                            disabled={!videoCompleted}
                            style={({pressed}) => [
                                styles.button,
                                {
                                    backgroundColor: videoCompleted
                                        ? (pressed ? '#005AE2' : '#007AFF')
                                        : '#D1D5DB',
                                    opacity: videoCompleted ? 1 : 0.8,
                                }
                            ]}
                        >
                            <Text style={[
                                styles.buttonText,
                                {color: videoCompleted ? '#FFFFFF' : '#666666'}
                            ]}>
                                {videoCompleted ? 'Marcar como realizado' : 'Ver video completo para marcar'}
                            </Text>
                        </Pressable>
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
        alignItems: 'center',
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
});

export default VideoPlayerScreen;