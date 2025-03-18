// Componente para mostrar las categorías como cards estilo médico
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

// Datos de categorías con sus iconos correspondientes
const categoryData = [
    {
        id: 1,
        label: 'Brazo',
        value: 'Brazo',
        icon: 'body-outline',
        subtitle: 'Personalized Treatments',
        color: '#e8fcf8',
        iconColor: '#3DD6BA'
    },
    {
        id: 2,
        label: 'Cardio',
        value: 'Cardio',
        icon: 'heart-outline',
        subtitle: 'Personalized Treatments',
        color: '#FFF1E6',
        iconColor: '#FF8A5C'
    },
    {
        id: 3,
        label: 'Flexibilidad',
        value: 'Flexibilidad',
        icon: 'fitness-outline',
        subtitle: 'Personalized Treatments',
        color: '#FFF9E6',
        iconColor: '#FFC633'
    },
    {
        id: 4,
        label: 'Fuerza',
        value: 'Fuerza',
        icon: 'barbell-outline',
        subtitle: 'Personalized Treatments',
        color: '#EDF6FD',
        iconColor: '#1089FF'
    },
    {
        id: 5,
        label: 'Rehabilitación',
        value: 'Rehabilitación',
        icon: 'medkit-outline',
        subtitle: 'Personalized Treatments',
        color: '#FFE6E6',
        iconColor: '#FF5C5C'
    },
    {
        id: 6,
        label: 'Estiramientos',
        value: 'Estiramientos',
        icon: 'resize-outline',
        subtitle: 'Personalized Treatments',
        color: '#E6FFF1',
        iconColor: '#40A858'
    },
    {
        id: 7,
        label: 'Pilates',
        value: 'Pilates',
        icon: 'body',
        subtitle: 'Personalized Treatments',
        color: '#F1E6FF',
        iconColor: '#8A5CFF'
    },
    {
        id: 8,
        label: 'Meditación',
        value: 'Meditación',
        icon: 'sunny-outline',
        subtitle: 'Personalized Treatments',
        color: '#E6F0FF',
        iconColor: '#2C7BFF'
    },
];

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
                            <View style={styles.iconWrapper}>
                                <Ionicons name={item.icon} size={30} color={item.iconColor} />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.categoryTitle}>{item.label}</Text>
                                <Text style={styles.categorySubtitle}>Entrenamientos personalizados</Text>
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
    },
    categoryCard: {
        width: '100%',
        borderRadius: 18,
        marginBottom: 12,
        paddingVertical: 16,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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
        backgroundColor: '#FFF',
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