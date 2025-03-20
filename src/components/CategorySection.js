// Componente para mostrar las categorías como cards estilo médico
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Datos de categorías con sus iconos correspondientes
const categoryData = [
    {
        id: 1,
        label: 'Brazo',
        value: 'Brazo',
        iconFamily: 'MaterialCommunityIcons',
        icon: 'arm-flex',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#3DD6BA',
        iconWrapperColor: '#e8fcf8'
    },
    {
        id: 2,
        label: 'Cadera',
        value: 'Cadera',
        iconFamily: 'FontAwesome5',
        icon: 'child',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#FF8A5C',
        iconWrapperColor: '#FFF1E6'
    },
    {
        id: 3,
        label: 'Codo',
        value: 'Codo',
        iconFamily: 'FontAwesome5',
        icon: 'hand-rock',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#FFC633',
        iconWrapperColor: '#FFF9E6'
    },
    {
        id: 4,
        label: 'Dedos de la mano',
        value: 'Dedos de la mano',
        iconFamily: 'FontAwesome5',
        icon: 'hand-paper',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#1089FF',
        iconWrapperColor: '#EDF6FD',
    },
    {
        id: 5,
        label: 'Dedos de los pies',
        value: 'Dedos de los pies',
        iconFamily: 'MaterialCommunityIcons',
        icon: 'foot-print',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#FF5C5C',
        iconWrapperColor: '#FFE6E6',
    },
    {
        id: 6,
        label: 'Hombro',
        value: 'Hombro',
        iconFamily: 'MaterialCommunityIcons',
        icon: 'human-handsup',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#40A858',
        iconWrapperColor: '#E6FFF1',
    },
    {
        id: 7,
        label: 'Muñeca',
        value: 'Muñeca',
        iconFamily: 'MaterialCommunityIcons',
        icon: 'watch',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#8A5CFF',
        iconWrapperColor: '#F1E6FF',
    },
    {
        id: 8,
        label: 'Rodilla',
        value: 'Rodilla',
        iconFamily: 'FontAwesome5',
        icon: 'running',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#40A858',
        iconWrapperColor: '#E6FFF1',
    },
    {
        id: 9,
        label: 'Tobillo',
        value: 'Tobillo',
        iconFamily: 'MaterialCommunityIcons',
        icon: 'shoe-heel',
        subtitle: 'Entrenamientos personalizados',
        color: '#fff',
        iconColor: '#1089FF',
        iconWrapperColor: '#EDF6FD',
    },
];

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

const CategorySection = ({ navigation }) => {
    // Función para manejar cuando se presiona una categoría
    const handleCategoryPress = (category) => {
        // Navegación a la pantalla de ejercicios con la categoría seleccionada
        navigation.navigate('ExerciseScreen', { selectedCategory: category });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Categorías</Text>

            {/* Lista de categorías en formato de tarjetas médicas */}
            <View style={styles.categoryList}>
                {categoryData.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.categoryCard, { backgroundColor: item.color }]}
                        onPress={() => handleCategoryPress(item.value)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconWrapper, { backgroundColor: item.iconWrapperColor }]}>
                                <IconRenderer
                                    family={item.iconFamily}
                                    name={item.icon}
                                    size={30}
                                    color={item.iconColor}
                                />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.categoryTitle}>{item.label}</Text>
                                <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
                            </View>

                            <Ionicons name="chevron-forward" size={22} color="#5B87BA" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    categoryList: {
        width: '100%',
        alignItems: 'center',
    },
    categoryCard: {
        width: '100%',
        borderRadius: 15,
        marginBottom: 12,
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderColor: '#efefef',
        borderWidth: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconWrapper: {
        width: 46,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 14,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D4665',
        marginBottom: 3,
    },
    categorySubtitle: {
        fontSize: 14,
        color: '#8D9DB0',
        fontWeight: '400',
    },
    chevron: {
        marginLeft: 10,
    }
});

export default CategorySection;