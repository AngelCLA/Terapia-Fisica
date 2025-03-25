import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Datos de categorías por etapa
const categoriesByStage = {
    // Etapa 1: 0-3 meses
    'Etapa 1': [
        {
            id: 'cadera-1',
            label: 'Cadera',
            value: 'Cadera',
            iconFamily: 'FontAwesome5',
            icon: 'child',
            subtitle: 'Fortalecimiento inicial',
            description: 'Ejercicios suaves de movimiento de cadera',
            color: '#fff',
            iconColor: '#3DD6BA',
            iconWrapperColor: '#e8fcf8'
        },
        {
            id: 'codo-1',
            label: 'Codo',
            value: 'Codo',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'arm-flex',
            subtitle: 'Movimiento y flexibilidad',
            description: 'Desarrollo de articulación del codo',
            color: '#fff',
            iconColor: '#FF8A5C',
            iconWrapperColor: '#FFF1E6'
        },
        {
            id: 'hombro-1',
            label: 'Hombro',
            value: 'Hombro',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'human-handsup',
            subtitle: 'Movilidad temprana',
            description: 'Movimientos para la articulación del hombro',
            color: '#fff',
            iconColor: '#40A858',
            iconWrapperColor: '#E6FFF1'
        },
        {
            id: 'dedos-mano-1',
            label: 'Dedos de la mano',
            value: 'Dedos de la mano',
            iconFamily: 'FontAwesome5',
            icon: 'hand-paper',
            subtitle: 'Estimulación táctil',
            description: 'Ejercicios para mejorar agarre y sensibilidad',
            color: '#fff',
            iconColor: '#1089FF',
            iconWrapperColor: '#EDF6FD'
        },
        {
            id: 'dedos-pies-1',
            label: 'Dedos de los pies',
            value: 'Dedos de los pies',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'foot-print',
            subtitle: 'Sensibilidad y movimiento',
            description: 'Ejercicios para estimular extremidades inferiores',
            color: '#fff',
            iconColor: '#FF5C5C',
            iconWrapperColor: '#FFE6E6'
        },
        {
            id: 'muneca-1',
            label: 'Muñeca',
            value: 'Muñeca',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'watch',
            subtitle: 'Rotación y flexión',
            description: 'Movimientos para desarrollar la muñeca',
            color: '#fff',
            iconColor: '#8A5CFF',
            iconWrapperColor: '#F1E6FF'
        },
        {
            id: 'rodilla-1',
            label: 'Rodilla',
            value: 'Rodilla',
            iconFamily: 'FontAwesome5',
            icon: 'running',
            subtitle: 'Flexión y extensión',
            description: 'Ejercicios para articulación de rodilla',
            color: '#fff',
            iconColor: '#40A858',
            iconWrapperColor: '#E6FFF1'
        },
        {
            id: 'tobillo-1',
            label: 'Tobillo',
            value: 'Tobillo',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'shoe-heel',
            subtitle: 'Movilidad inicial',
            description: 'Movimientos para fortalecer el tobillo',
            color: '#fff',
            iconColor: '#1089FF',
            iconWrapperColor: '#EDF6FD'
        }
    ],

    // Etapa 2: 4-6 meses
    'Etapa 2': [
        {
            id: 'cadera-2',
            label: 'Cadera',
            value: 'Cadera',
            iconFamily: 'FontAwesome5',
            icon: 'child',
            subtitle: 'Preparación para sentarse',
            description: 'Mayor movilidad de la cadera y tronco',
            color: '#fff',
            iconColor: '#3DD6BA',
            iconWrapperColor: '#e8fcf8'
        },
        {
            id: 'torso-2',
            label: 'Torso',
            value: 'Torso',
            iconFamily: 'FontAwesome5',
            icon: 'child',
            subtitle: 'Control de tronco',
            description: 'Fortalecimiento central para sentarse',
            color: '#fff',
            iconColor: '#FF8A5C',
            iconWrapperColor: '#FFF1E6'
        },
        {
            id: 'manos-2',
            label: 'Dedos de la mano',
            value: 'Dedos de la mano',
            iconFamily: 'FontAwesome5',
            icon: 'hand-paper',
            subtitle: 'Agarre consciente',
            description: 'Desarrollo de destreza para agarrar objetos',
            color: '#fff',
            iconColor: '#1089FF',
            iconWrapperColor: '#EDF6FD'
        },
        {
            id: 'rodilla-2',
            label: 'Rodilla',
            value: 'Rodilla',
            iconFamily: 'FontAwesome5',
            icon: 'running',
            subtitle: 'Preparación para el gateo',
            description: 'Fortalecimiento de piernas',
            color: '#fff',
            iconColor: '#40A858',
            iconWrapperColor: '#E6FFF1'
        }
    ],

    // Etapa 3: 7-9 meses
    'Etapa 3': [
        {
            id: 'gateo-3',
            label: 'Gateo',
            value: 'Gateo',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'human-baby-changing-table',
            subtitle: 'Coordinación de movimientos',
            description: 'Ejercicios para fortalecer el gateo',
            color: '#fff',
            iconColor: '#FF8A5C',
            iconWrapperColor: '#FFF1E6'
        },
        {
            id: 'rodilla-3',
            label: 'Rodilla',
            value: 'Rodilla',
            iconFamily: 'FontAwesome5',
            icon: 'running',
            subtitle: 'Apoyo y equilibrio',
            description: 'Fortalecimiento para ponerse de pie',
            color: '#fff',
            iconColor: '#40A858',
            iconWrapperColor: '#E6FFF1'
        },
        {
            id: 'tobillo-3',
            label: 'Tobillo',
            value: 'Tobillo',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'shoe-heel',
            subtitle: 'Preparación para bipedestación',
            description: 'Ejercicios para fortalecer los tobillos',
            color: '#fff',
            iconColor: '#1089FF',
            iconWrapperColor: '#EDF6FD'
        },
        {
            id: 'pinza-fina-3',
            label: 'Pinza fina',
            value: 'Pinza fina',
            iconFamily: 'FontAwesome5',
            icon: 'hand-point-up',
            subtitle: 'Coordinación dedos',
            description: 'Desarrollo de precisión en los dedos',
            color: '#fff',
            iconColor: '#8A5CFF',
            iconWrapperColor: '#F1E6FF'
        }
    ],

    // Etapa 4: 10-12 meses
    'Etapa 4': [
        {
            id: 'marcha-4',
            label: 'Marcha',
            value: 'Marcha',
            iconFamily: 'FontAwesome5',
            icon: 'walking',
            subtitle: 'Primeros pasos',
            description: 'Preparación y apoyo para caminar',
            color: '#fff',
            iconColor: '#3DD6BA',
            iconWrapperColor: '#e8fcf8'
        },
        {
            id: 'equilibrio-4',
            label: 'Equilibrio',
            value: 'Equilibrio',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'human-handsup',
            subtitle: 'Estabilidad para caminar',
            description: 'Ejercicios de estabilidad y balance',
            color: '#fff',
            iconColor: '#40A858',
            iconWrapperColor: '#E6FFF1'
        },
        {
            id: 'coordinacion-4',
            label: 'Coordinación',
            value: 'Coordinación',
            iconFamily: 'MaterialCommunityIcons',
            icon: 'hand-pointing',
            subtitle: 'Ojo-mano avanzada',
            description: 'Actividades para mejorar la coordinación',
            color: '#fff',
            iconColor: '#FF8A5C',
            iconWrapperColor: '#FFF1E6'
        },
        {
            id: 'lenguaje-4',
            label: 'Estimulación del lenguaje',
            value: 'Estimulación del lenguaje',
            iconFamily: 'Ionicons',
            icon: 'chatbubble-outline',
            subtitle: 'Vocalizaciones y primeras palabras',
            description: 'Ejercicios para fomentar el habla',
            color: '#fff',
            iconColor: '#8A5CFF',
            iconWrapperColor: '#F1E6FF'
        }
    ]
};

// Datos de hitos de desarrollo por etapa
const milestonesByStage = {
    'Etapa 1': [
        'Levanta ligeramente la cabeza cuando está boca abajo',
        'Sigue objetos con la mirada',
        'Agarra un objeto colocado en su mano',
        'Sonríe como respuesta a estímulos'
    ],
    'Etapa 2': [
        'Se mantiene sentado con apoyo',
        'Gira sobre su cuerpo',
        'Agarra objetos voluntariamente',
        'Balbucea y produce sonidos'
    ],
    'Etapa 3': [
        'Se sienta sin apoyo',
        'Comienza a gatear',
        'Utiliza la pinza para agarrar objetos pequeños',
        'Responde a su nombre'
    ],
    'Etapa 4': [
        'Se pone de pie con apoyo',
        'Da los primeros pasos con ayuda',
        'Dice algunas palabras',
        'Entiende órdenes sencillas'
    ]
};

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

// Componente para renderizar el icono según la familia
const IconRenderer = ({ family, name, size, color }) => {
    switch (family) {
        case 'Ionicons':
            return <Ionicons name={name} size={size} color={color} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={name} size={size} color={color} />;
        case 'FontAwesome5':
            return <FontAwesome5 name={name} size={size} color={color} />;
        default:
            return <Ionicons name="help-outline" size={size} color={color} />;
    }
};

const StageCategoriesScreen = ({ route, navigation }) => {
    const { stageId, stageTitle } = route.params;
    const [categories, setCategories] = useState([]);

    // Obtenemos colores para esta etapa
    const stageColors = getStageColors(stageId);
    const milestones = milestonesByStage[stageId] || [];

    useEffect(() => {
        // Cargar las categorías según la etapa seleccionada
        const stageCategories = categoriesByStage[stageId] || [];
        setCategories(stageCategories);
    }, [stageId]);

    const handleCategoryPress = (category) => {
        // Navegar a la pantalla de ejercicios específicos para esta categoría y etapa
        navigation.navigate('StageExercisesScreen', {
            stageId: stageId,
            categoryId: category.id,
            categoryTitle: category.label,
            stageTitle: stageTitle
        });
    };

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor={stageColors.secondary} translucent={true} />
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Cabecera con la etapa seleccionada */}
                <View style={[styles.header, { backgroundColor: stageColors.secondary }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{stageTitle}</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                    {/* Banner informativo sobre esta etapa */}
                    <View style={[styles.stageBanner, { backgroundColor: stageColors.primary }]}>
                        <View style={styles.stageBannerContent}>
                            <View style={styles.stageBannerTextContent}>
                                <Text style={styles.stageBannerTitle}>
                                    Hitos de desarrollo
                                </Text>
                                <View style={styles.milestonesList}>
                                    {milestones.map((milestone, index) => (
                                        <View key={index} style={styles.milestoneItem}>
                                            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                                            <Text style={styles.milestoneText}>{milestone}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.stageIconContainer}>
                                <Ionicons name="body" size={60} color="#FFFFFF" style={{opacity: 0.8}} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Categorías de ejercicios</Text>
                        <Text style={styles.sectionSubtitle}>
                            Selecciona una categoría para ver ejercicios específicos para {stageTitle}
                        </Text>

                        {/* Lista de categorías */}
                        <View style={styles.categoryList}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.categoryCard}
                                    onPress={() => handleCategoryPress(category)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={[styles.iconWrapper, { backgroundColor: category.iconWrapperColor }]}>
                                            <IconRenderer
                                                family={category.iconFamily}
                                                name={category.icon}
                                                size={30}
                                                color={category.iconColor}
                                            />
                                        </View>

                                        <View style={styles.textContainer}>
                                            <Text style={styles.categoryTitle}>{category.label}</Text>
                                            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                                            <Text style={styles.categoryDescription}>{category.description}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <Text style={[styles.viewExercises, {color: stageColors.secondary}]}>Ver ejercicios</Text>
                                        <Ionicons name="chevron-forward" size={20} color={stageColors.secondary} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {categories.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="fitness-outline" size={60} color="#CCCCCC" />
                                <Text style={styles.emptyText}>
                                    No hay categorías disponibles para esta etapa.
                                </Text>
                            </View>
                        )}

                        {/* Sección de información adicional */}
                        <View style={styles.infoSection}>
                            <Text style={styles.infoSectionTitle}>Consejos para esta etapa</Text>

                            <View style={styles.tipCard}>
                                <View style={styles.tipIconContainer}>
                                    <Ionicons name="time-outline" size={28} color={stageColors.secondary} />
                                </View>
                                <View style={styles.tipTextContainer}>
                                    <Text style={styles.tipTitle}>Duración adecuada</Text>
                                    <Text style={styles.tipDescription}>
                                        Realiza los ejercicios por períodos cortos (5-10 minutos) varias veces al día
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.tipCard}>
                                <View style={styles.tipIconContainer}>
                                    <Ionicons name="happy-outline" size={28} color={stageColors.secondary} />
                                </View>
                                <View style={styles.tipTextContainer}>
                                    <Text style={styles.tipTitle}>Estado de ánimo</Text>
                                    <Text style={styles.tipDescription}>
                                        Realiza los ejercicios cuando el bebé esté tranquilo y alerta, no cuando tenga hambre o sueño
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.tipCard}>
                                <View style={styles.tipIconContainer}>
                                    <Ionicons name="calendar-outline" size={28} color={stageColors.secondary} />
                                </View>
                                <View style={styles.tipTextContainer}>
                                    <Text style={styles.tipTitle}>Consistencia</Text>
                                    <Text style={styles.tipDescription}>
                                        La regularidad es clave. Establece una rutina diaria para los ejercicios
                                    </Text>
                                </View>
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
        paddingVertical: 14,
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    stageBanner: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    stageBannerContent: {
        flexDirection: 'row',
    },
    stageBannerTextContent: {
        flex: 3,
    },
    stageBannerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    milestonesList: {
        marginTop: 4,
    },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    milestoneText: {
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 8,
        flex: 1,
    },
    stageIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 20,
    },
    categoryList: {
        width: '100%',
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    categorySubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#888',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    viewExercises: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
    },
    infoSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    infoSectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    tipIconContainer: {
        marginRight: 16,
        justifyContent: 'center',
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    tipDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default StageCategoriesScreen;