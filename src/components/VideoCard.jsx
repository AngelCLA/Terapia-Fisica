import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, Text, View} from 'react-native';

const VideoCard = ({
                       videoId,
                       title,
                       description,
                       videoTags,
                       videoDuration,
                       style = {},
                       imageHeight = 'auto',
                       onPress
                   }) => {
    const navigation = useNavigation();

    const getRandomColor = () => {
        const colors = [
            '#E6F2FF', '#E0F8E0', '#FFF0E6',
            '#F0E6FF', '#E6FFEA', '#FFFAE6',
            '#E6F3FF', '#F2FFE6', '#FFE6F2'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Pressable
            onPress={onPress || (() => {
                navigation.navigate("VideoPlayerScreen", {
                    videoId,
                    title,
                    description,
                    videoTags,
                });
            })}
            style={{borderRadius: 10, overflow: 'hidden', ...style}}
        >
            <View style={{position: 'relative'}}>
                <Image
                    source={{uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}}
                    style={{
                        width: '100%',
                        height: imageHeight,
                        borderRadius: 10,
                        aspectRatio: 16 / 9,
                    }}
                />
                <View style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 5,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                }}>
                    <Text style={{color: '#FFF', fontSize: 14, fontWeight: '600'}}>
                        {videoDuration}
                    </Text>
                </View>
            </View>
            <View style={{paddingTop: 10}}>
                <Text
                    style={{
                        color: '#333',
                        fontSize: 18,
                        fontWeight: '700',
                        marginBottom: 5
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <Text
                    style={{
                        color: '#666',
                        fontSize: 16,
                        fontWeight: '500'
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {description}
                </Text>
                {/* Sección de Tags */}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 5,
                    gap: 8
                }}>
                    {videoTags?.map((tag, index) => (
                        <View
                            key={index}
                            style={{
                                backgroundColor: getRandomColor(),
                                borderRadius: 15,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                marginBottom: 5,
                            }}
                        >
                            <Text style={{color: '#333', fontSize: 14}}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Pressable>
    );
};

export default VideoCard;