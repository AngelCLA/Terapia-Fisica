import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressTrackerService from '../services/ProgressTrackerService';

/**
 * Botón para marcar actividades como completadas
 * @param {object} props - Propiedades del componente
 * @param {object} props.activity - Información de la actividad
 * @param {function} props.onCompletion - Función a ejecutar después de completar
 */
const ActivityCompletionButton = ({ activity, onCompletion }) => {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Verificar si la actividad ya ha sido completada anteriormente
    useEffect(() => {
        const checkCompletionStatus = async () => {
            try {
                // Obtener actividades completadas
                const completedActivities = await ProgressTrackerService.getCompletedActivities();

                // Comprobar si esta actividad está en la lista
                const isCompleted = completedActivities.some(
                    item => item.videoId === activity.videoId
                );

                setCompleted(isCompleted);
            } catch (err) {
                console.log('Error al verificar estado de finalización:', err);
            }
        };

        if (activity && activity.videoId) {
            checkCompletionStatus();
        }
    }, [activity]);

    const handleMarkAsCompleted = async () => {
        if (loading || completed) return;

        setLoading(true);

        try {
            // Marcar la actividad como completada
            const result = await ProgressTrackerService.markActivityAsCompleted(activity);

            if (result) {
                setCompleted(true);

                // Mostrar mensaje de éxito
                Alert.alert(
                    "¡Felicidades!",
                    "Actividad registrada en tu progreso.",
                    [{ text: "OK" }]
                );

                // Ejecutar callback si existe
                if (onCompletion && typeof onCompletion === 'function') {
                    onCompletion();
                }
            } else {
                Alert.alert(
                    "Error",
                    "No se pudo registrar la actividad",
                    [{ text: "OK" }]
                );
            }
        } catch (err) {
            console.log('Error al marcar actividad como completada:', err);
            Alert.alert(
                "Error",
                "Ocurrió un error al registrar la actividad",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    // Crear etiquetas de accesibilidad apropiadas según el estado
    const getAccessibilityLabel = () => {
        if (loading) {
            return "Registrando actividad, por favor espere";
        } else if (completed) {
            return `Actividad completada: ${activity.videoTitle || 'Ejercicio'}`;
        } else {
            return `Marcar como completado: ${activity.videoTitle || 'Ejercicio'}`;
        }
    };

    const getAccessibilityHint = () => {
        if (completed) {
            return "Esta actividad ya ha sido registrada en tu progreso";
        } else if (!loading) {
            return "Pulsa para registrar esta actividad en tu progreso";
        }
        return "";
    };

    return (
        <View
            style={styles.container}
            accessibilityLabel="Control de registro de actividad"
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    completed ? styles.completedButton : styles.pendingButton
                ]}
                onPress={handleMarkAsCompleted}
                disabled={loading || completed}
                accessibilityLabel={getAccessibilityLabel()}
                accessibilityRole="button"
                accessibilityHint={getAccessibilityHint()}
                accessibilityState={{
                    disabled: loading || completed,
                    busy: loading,
                    checked: completed
                }}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : completed ? (
                    <>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#FFFFFF"
                            accessibilityLabel="Ícono de completado"
                        />
                        <Text style={styles.buttonText}>Completado</Text>
                    </>
                ) : (
                    <>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color="#FFFFFF"
                            accessibilityLabel="Ícono de marcar como completado"
                        />
                        <Text style={styles.buttonText}>Marcar como completado</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pendingButton: {
        backgroundColor: '#1089FF',
    },
    completedButton: {
        backgroundColor: '#40A858',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    }
});

export default ActivityCompletionButton;