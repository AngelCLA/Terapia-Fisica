import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

// Definir las etapas de vida disponibles
const etapasVida = [
    { id: 'Etapa 1', titulo: 'Etapa 1', rango: '0-3 meses', edadMedia: 2, color: '#FF6B8B', colorEnd: '#FF9F9F' },
    { id: 'Etapa 2', titulo: 'Etapa 2', rango: '4-6 meses', edadMedia: 5, color: '#49A7FF', colorEnd: '#80D8FF' },
    { id: 'Etapa 3', titulo: 'Etapa 3', rango: '7-9 meses', edadMedia: 8, color: '#77DD77', colorEnd: '#B4FF9F' },
    { id: 'Etapa 4', titulo: 'Etapa 4', rango: '10-12 meses', edadMedia: 11, color: '#FFA94D', colorEnd: '#FFD59F' }
];

const StageSelection = ({ navigation, previewMode = false }) => {
    const handleStagePress = (stage) => {
        navigation.navigate('StageCategoriesScreen', {
            stageId: stage.id,
            stageTitle: `${stage.titulo} (${stage.rango})`
        });
    };

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }}>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {!previewMode && (
                    <View style={styles.introSection}>

                    </View>
                )}

                <View style={styles.stageList}>
                    {etapasVida.map((stage) => (
                        <TouchableOpacity
                            key={stage.id}
                            style={[
                                styles.stageCard,
                                { backgroundColor: stage.color },
                                previewMode && styles.stageCardSmall
                            ]}
                            onPress={() => handleStagePress(stage)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.stageContent}>
                                <View style={styles.stageTextContent}>
                                    <Text style={styles.stageTitle}>{stage.titulo}</Text>
                                    <Text style={styles.stageRange}>{stage.rango}</Text>

                                    {!previewMode && (
                                        <View style={styles.stageBadge}>
                                            <Text style={styles.stageBadgeText}>Ver ejercicios</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.stageIconContainer}>
                                    <Ionicons name="body" size={previewMode ? 30 : 45} color="#FFFFFF" style={{opacity: 0.8}} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
    },
    introSection: {
        marginBottom: 24,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#333333',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 22,
    },
    stageList: {
        width: '100%',
    },
    stageCard: {
        width: '100%',
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stageCardSmall: {
        padding: 12,
        marginBottom: 12,
    },
    stageContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stageTextContent: {
        flex: 3,
    },
    stageTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    stageRange: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 12,
    },
    stageBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    stageBadgeText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    stageIconContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default StageSelection;