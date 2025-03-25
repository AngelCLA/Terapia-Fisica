import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import ProgressTrackerService from '../services/ProgressTrackerService';

// Definir las etapas de vida disponibles
const etapasVida = [
    { id: 'Etapa 1', titulo: 'Etapa 1', rango: '0-3 meses', edadMedia: 2, color: '#FF9F9F', colorEnd: '#FF6B8B' },
    { id: 'Etapa 2', titulo: 'Etapa 2', rango: '4-6 meses', edadMedia: 5, color: '#80D8FF', colorEnd: '#49A7FF' },
    { id: 'Etapa 3', titulo: 'Etapa 3', rango: '7-9 meses', edadMedia: 8, color: '#B4FF9F', colorEnd: '#77DD77' },
    { id: 'Etapa 4', titulo: 'Etapa 4', rango: '10-12 meses', edadMedia: 11, color: '#FFD59F', colorEnd: '#FFA94D' }
];

// Obtener ancho de la ventana para gráficos responsivos
const windowWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [progressStats, setProgressStats] = useState(null);
    const [activityHistory, setActivityHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'history', 'streaks'
    const [currentWeekStreak, setCurrentWeekStreak] = useState(0);
    const [stageProgress, setStageProgress] = useState({});

    // Cargar datos de progreso
    const loadProgressData = useCallback(async () => {
        setLoading(true);
        try {
            // Obtener estadísticas de progreso
            const stats = await ProgressTrackerService.getUserProgressStats();
            setProgressStats(stats || {
                totalActivitiesCompleted: 0,
                stageStats: {},
                categoryStats: {},
                dailyActivity: {}
            });

            // Obtener historial de actividades
            const history = await ProgressTrackerService.getCompletedActivities();
            setActivityHistory(history || []);

            // Calcular racha actual
            calculateCurrentStreak(stats?.dailyActivity || {});

            // Obtener progreso por etapa
            const stageProgressData = {};
            for (const etapa of etapasVida) {
                const progress = await ProgressTrackerService.getStageProgress(etapa.id);
                stageProgressData[etapa.id] = progress;
            }
            setStageProgress(stageProgressData);

        } catch (error) {
            console.error('Error al cargar datos de progreso:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Calcular racha actual
    const calculateCurrentStreak = (dailyActivity) => {
        if (!dailyActivity || Object.keys(dailyActivity).length === 0) {
            setCurrentWeekStreak(0);
            return;
        }

        // Obtener días con actividad en esta semana
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Domingo, 6 = Sábado
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);

        let daysWithActivity = 0;

        for (let i = 0; i <= dayOfWeek; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            if (dailyActivity[dateStr] && dailyActivity[dateStr] > 0) {
                daysWithActivity++;
            }
        }

        setCurrentWeekStreak(daysWithActivity);
    };

    // Hacer pull para refrescar
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadProgressData();
    }, [loadProgressData]);

    // Cargar datos al iniciar
    useEffect(() => {
        loadProgressData();
    }, [loadProgressData]);

    // Renderizar componente de resumen
    const renderSummary = () => {
        if (!progressStats) return null;

        return (
            <View style={styles.summaryContainer}>
                {/* Tarjeta de estadísticas generales */}
                <View style={styles.statsCard}>
                    <Text style={styles.cardTitle}>Estadísticas generales</Text>

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="checkmark-circle" size={24} color="#40A858" />
                        </View>
                        <View style={styles.statTextContainer}>
                            <Text style={styles.statLabel}>Actividades completadas</Text>
                            <Text style={styles.statValue}>{progressStats.totalActivitiesCompleted || 0}</Text>
                        </View>
                    </View>

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="calendar" size={24} color="#1089FF" />
                        </View>
                        <View style={styles.statTextContainer}>
                            <Text style={styles.statLabel}>Racha semanal actual</Text>
                            <Text style={styles.statValue}>{currentWeekStreak} día{currentWeekStreak !== 1 ? 's' : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Ionicons name="time" size={24} color="#FF8A5C" />
                        </View>
                        <View style={styles.statTextContainer}>
                            <Text style={styles.statLabel}>Última actividad</Text>
                            <Text style={styles.statValue}>
                                {progressStats.lastActivityDate
                                    ? new Date(progressStats.lastActivityDate.seconds * 1000).toLocaleDateString()
                                    : 'No hay actividades recientes'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Progreso por etapa */}
                <Text style={styles.sectionTitle}>Progreso por etapa</Text>

                {etapasVida.map(etapa => {
                    const progress = stageProgress[etapa.id] || { completed: 0, percentage: 0 };

                    return (
                        <View key={etapa.id} style={styles.stageProgressCard}>
                            <View style={styles.stageProgressHeader}>
                                <Text style={styles.stageTitle}>{etapa.titulo}: {etapa.rango}</Text>
                                <Text style={styles.stageProgressText}>{progress.percentage}% completado</Text>
                            </View>

                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${progress.percentage}%`,
                                            backgroundColor: etapa.colorEnd
                                        }
                                    ]}
                                />
                            </View>

                            <Text style={styles.exercisesCompletedText}>
                                {progress.completed} ejercicio{progress.completed !== 1 ? 's' : ''} completado{progress.completed !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    // Renderizar componente de historial
    const renderHistory = () => {
        if (activityHistory.length === 0) {
            return (
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="calendar-outline" size={60} color="#CCCCCC" />
                    <Text style={styles.emptyStateText}>
                        No hay actividades completadas aún.
                    </Text>
                    <TouchableOpacity
                        style={styles.emptyStateButton}
                        onPress={() => navigation.navigate('StageCategoriesScreen', {
                            stageId: 'Etapa 1',
                            stageTitle: 'Etapa 1 (0-3 meses)'
                        })}
                    >
                        <Text style={styles.emptyStateButtonText}>Explorar ejercicios</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Ordenar actividades por fecha (más recientes primero)
        const sortedActivities = [...activityHistory].sort((a, b) => {
            // Usar el campo timestamp o bien obtener la fecha de completedAt
            if (a.timestamp && b.timestamp) {
                return b.timestamp - a.timestamp;
            }

            // Si no hay timestamp, intentar obtener la fecha desde completedAt
            const dateA = a.completedAt ?
                (a.completedAt.seconds ? new Date(a.completedAt.seconds * 1000) : a.completedAt)
                : new Date(0);
            const dateB = b.completedAt ?
                (b.completedAt.seconds ? new Date(b.completedAt.seconds * 1000) : b.completedAt)
                : new Date(0);

            return dateB.getTime() - dateA.getTime();
        });

        return (
            <View style={styles.historyContainer}>
                {sortedActivities.map((activity, index) => {
                    // Encontrar datos de etapa para obtener el color
                    const etapa = etapasVida.find(e => e.id === activity.stageId) || etapasVida[0];

                    // Formatear la fecha correctamente según el tipo de dato
                    let formattedDate = 'Fecha desconocida';
                    if (activity.completedAt) {
                        if (activity.completedAt.seconds) {
                            // Es un timestamp de Firestore
                            formattedDate = new Date(activity.completedAt.seconds * 1000).toLocaleDateString();
                        } else if (activity.completedAt instanceof Date) {
                            // Es un objeto Date
                            formattedDate = activity.completedAt.toLocaleDateString();
                        } else if (typeof activity.completedAt === 'string') {
                            // Es una cadena de texto
                            formattedDate = new Date(activity.completedAt).toLocaleDateString();
                        }
                    }

                    return (
                        <View key={index} style={styles.historyItem}>
                            <View style={[styles.historyIconContainer, { backgroundColor: etapa.color }]}>
                                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                            </View>

                            <View style={styles.historyContent}>
                                <Text style={styles.historyTitle} numberOfLines={1}>
                                    {activity.videoTitle || 'Actividad completada'}
                                </Text>

                                <View style={styles.historyDetails}>
                                    <Text style={styles.historyCategory}>
                                        {activity.categoryTitle || 'Categoría'} • {activity.stageTitle || 'Etapa'}
                                    </Text>

                                    <Text style={styles.historyDate}>
                                        {formattedDate}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    // Renderizar componente de rachas
    const renderStreaks = () => {
        // Obtener datos de actividad diaria
        const dailyActivity = progressStats?.dailyActivity || {};

        // Obtener los últimos 7 días
        const lastSevenDays = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase();

            lastSevenDays.push({
                date: dateStr,
                dayName: dayName,
                count: dailyActivity[dateStr] || 0
            });
        }

        return (
            <View style={styles.streaksContainer}>
                <View style={styles.statsCard}>
                    <Text style={styles.cardTitle}>Tu actividad semanal</Text>

                    <View style={styles.weeklyActivityChart}>
                        {lastSevenDays.map((day, index) => {
                            // Calcular altura de la barra (máximo 100)
                            const barHeight = day.count > 0 ? Math.min(20 + day.count * 10, 100) : 20;

                            return (
                                <View key={index} style={styles.activityBarContainer}>
                                    <View style={styles.activityBarLabelContainer}>
                                        <Text style={styles.activityCount}>{day.count}</Text>
                                    </View>

                                    <View style={styles.activityBarWrapper}>
                                        <View
                                            style={[
                                                styles.activityBar,
                                                {
                                                    height: barHeight,
                                                    backgroundColor: day.count > 0 ? '#1089FF' : '#EEEEEE'
                                                }
                                            ]}
                                        />
                                    </View>

                                    <Text style={styles.dayLabel}>{day.dayName}</Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.streakInfoContainer}>
                        <Text style={styles.streakInfoText}>
                            Has completado ejercicios en <Text style={styles.streakCount}>{currentWeekStreak}</Text> de 7 días esta semana
                        </Text>
                    </View>
                </View>

                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>Consejos para mejorar tu constancia</Text>

                    <View style={styles.tipItem}>
                        <Ionicons name="time-outline" size={20} color="#1089FF" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                            Establece un horario fijo para los ejercicios cada día
                        </Text>
                    </View>

                    <View style={styles.tipItem}>
                        <Ionicons name="calendar-outline" size={20} color="#1089FF" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                            Intenta completar al menos un ejercicio diario
                        </Text>
                    </View>

                    <View style={styles.tipItem}>
                        <Ionicons name="notifications-outline" size={20} color="#1089FF" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                            Activa recordatorios para no olvidar tu rutina diaria
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar style="dark" />
            <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Progreso</Text>
                        <Text style={styles.headerSubtitle}>Seguimiento de tus actividades</Text>
                    </View>

                    <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                        <Ionicons name="refresh" size={24} color="#1089FF" />
                    </TouchableOpacity>
                </View>

                {/* Tabs de navegación */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'summary' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('summary')}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                activeTab === 'summary' && styles.activeTabButtonText
                            ]}
                        >
                            Resumen
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'history' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                activeTab === 'history' && styles.activeTabButtonText
                            ]}
                        >
                            Historial
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'streaks' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('streaks')}
                    >
                        <Text
                            style={[
                                styles.tabButtonText,
                                activeTab === 'streaks' && styles.activeTabButtonText
                            ]}
                        >
                            Rachas
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1089FF" />
                        <Text style={styles.loadingText}>Cargando datos de progreso...</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#1089FF']}
                                tintColor="#1089FF"
                            />
                        }
                    >
                        {/* Contenido según la pestaña activa */}
                        {activeTab === 'summary' && renderSummary()}
                        {activeTab === 'history' && renderHistory()}
                        {activeTab === 'streaks' && renderStreaks()}
                    </ScrollView>
                )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    refreshButton: {
        padding: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 16,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#1089FF',
    },
    tabButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666666',
    },
    activeTabButtonText: {
        color: '#1089FF',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 12,
    },

    // Estilos para la pestaña de resumen
    summaryContainer: {
        padding: 16,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F6F6F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statTextContainer: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 12,
        marginTop: 8,
    },
    stageProgressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    stageProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    stageTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    stageProgressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1089FF',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    exercisesCompletedText: {
        fontSize: 14,
        color: '#666666',
    },

    // Estilos para la pestaña de historial
    historyContainer: {
        padding: 16,
    },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    historyIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    historyContent: {
        flex: 1,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    historyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyCategory: {
        fontSize: 14,
        color: '#666666',
    },
    historyDate: {
        fontSize: 12,
        color: '#999999',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    emptyStateButton: {
        backgroundColor: '#1089FF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    emptyStateButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Estilos para la pestaña de rachas
    streaksContainer: {
        padding: 16,
    },
    weeklyActivityChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
        marginBottom: 12,
        paddingTop: 20,
    },
    activityBarContainer: {
        alignItems: 'center',
        width: (windowWidth - 64) / 7,
    },
    activityBarLabelContainer: {
        height: 20,
        justifyContent: 'center',
    },
    activityCount: {
        fontSize: 12,
        color: '#666666',
    },
    activityBarWrapper: {
        height: 100,
        justifyContent: 'flex-end',
    },
    activityBar: {
        width: 16,
        borderRadius: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#666666',
        marginTop: 6,
    },
    streakInfoContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    streakInfoText: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
    },
    streakCount: {
        fontWeight: '700',
        color: '#1089FF',
    },
    tipsCard: {
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    tipIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    tipText: {
        fontSize: 14,
        color: '#666666',
        flex: 1,
        lineHeight: 20,
    },
});

export default ProgressScreen;