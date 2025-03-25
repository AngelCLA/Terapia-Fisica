import { getAuth } from 'firebase/auth';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    getDoc,
    updateDoc,
    arrayUnion,
    increment,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/**
 * Servicio para gestionar el progreso de actividades del usuario
 */
const ProgressTrackerService = {
    /**
     * Registra una actividad como completada
     * @param {object} activity - Información de la actividad completada
     * @param {string} activity.videoId - ID del video
     * @param {string} activity.videoTitle - Título del video
     * @param {string} activity.categoryId - ID de la categoría
     * @param {string} activity.categoryTitle - Título de la categoría
     * @param {string} activity.stageId - ID de la etapa
     * @param {string} activity.stageTitle - Título de la etapa
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    markActivityAsCompleted: async (activity) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error('No hay usuario autenticado');
                return false;
            }

            // Crear un ID único para la actividad
            const activityId = `${activity.videoId}-${Date.now()}`;

            // Usar timestamp del cliente en lugar de serverTimestamp para arrays
            const clientTimestamp = new Date();

            // Referencia al documento del historial de actividades del usuario
            const userActivitiesRef = doc(db, 'activities_history', user.uid);

            // Comprobar si el documento existe
            const userActivitiesDoc = await getDoc(userActivitiesRef);

            if (userActivitiesDoc.exists()) {
                // Si existe, añadir la nueva actividad al array
                await updateDoc(userActivitiesRef, {
                    activities: arrayUnion({
                        id: activityId,
                        videoId: activity.videoId,
                        videoTitle: activity.videoTitle,
                        categoryId: activity.categoryId,
                        categoryTitle: activity.categoryTitle,
                        stageId: activity.stageId,
                        stageTitle: activity.stageTitle,
                        completedAt: clientTimestamp, // Usar Date en lugar de serverTimestamp
                        timestamp: clientTimestamp.getTime() // Añadir timestamp en milisegundos para ordenar
                    })
                });
            } else {
                // Si no existe, crear el documento con la primera actividad
                await setDoc(userActivitiesRef, {
                    userId: user.uid,
                    activities: [{
                        id: activityId,
                        videoId: activity.videoId,
                        videoTitle: activity.videoTitle,
                        categoryId: activity.categoryId,
                        categoryTitle: activity.categoryTitle,
                        stageId: activity.stageId,
                        stageTitle: activity.stageTitle,
                        completedAt: clientTimestamp, // Usar Date en lugar de serverTimestamp
                        timestamp: clientTimestamp.getTime() // Añadir timestamp en milisegundos para ordenar
                    }]
                });
            }

            // Actualizar las estadísticas de progreso del usuario
            await ProgressTrackerService.updateUserProgressStats(user.uid, activity);

            return true;
        } catch (error) {
            console.error('Error al marcar actividad como completada:', error);
            return false;
        }
    },

    /**
     * Actualiza las estadísticas de progreso del usuario
     * @param {string} userId - ID del usuario
     * @param {object} activity - Información de la actividad completada
     * @private
     */
    updateUserProgressStats: async (userId, activity) => {
        try {
            // Referencia al documento de estadísticas del usuario
            const userStatsRef = doc(db, 'progress_stats', userId);

            // Comprobar si el documento existe
            const userStatsDoc = await getDoc(userStatsRef);

            const todayDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

            if (userStatsDoc.exists()) {
                // Si existe, actualizar las estadísticas
                const updateData = {
                    totalActivitiesCompleted: increment(1),
                    [`stageStats.${activity.stageId}.completed`]: increment(1),
                    [`categoryStats.${activity.categoryId}.completed`]: increment(1),
                    [`dailyActivity.${todayDate}`]: increment(1),
                    lastActivityDate: serverTimestamp(), // Aquí sí podemos usar serverTimestamp (no está en un array)
                };

                await updateDoc(userStatsRef, updateData);
            } else {
                // Si no existe, crear el documento con las estadísticas iniciales
                const initialStageStats = {};
                initialStageStats[activity.stageId] = { completed: 1 };

                const initialCategoryStats = {};
                initialCategoryStats[activity.categoryId] = { completed: 1 };

                const initialDailyActivity = {};
                initialDailyActivity[todayDate] = 1;

                await setDoc(userStatsRef, {
                    userId,
                    totalActivitiesCompleted: 1,
                    stageStats: initialStageStats,
                    categoryStats: initialCategoryStats,
                    dailyActivity: initialDailyActivity,
                    lastActivityDate: serverTimestamp(), // Aquí sí podemos usar serverTimestamp (no está en un array)
                    createdAt: serverTimestamp() // Aquí sí podemos usar serverTimestamp (no está en un array)
                });
            }
        } catch (error) {
            console.error('Error al actualizar estadísticas de progreso:', error);
        }
    },

    /**
     * Obtiene el historial de actividades completadas por el usuario
     * @returns {Promise<Array>} - Historial de actividades
     */
    getCompletedActivities: async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error('No hay usuario autenticado');
                return [];
            }

            // Referencia al documento del historial de actividades del usuario
            const userActivitiesRef = doc(db, 'activities_history', user.uid);
            const userActivitiesDoc = await getDoc(userActivitiesRef);

            if (userActivitiesDoc.exists()) {
                // Devolver el array de actividades
                const data = userActivitiesDoc.data();
                return data.activities || [];
            }

            return [];
        } catch (error) {
            console.error('Error al obtener actividades completadas:', error);
            return [];
        }
    },

    /**
     * Obtiene las estadísticas de progreso del usuario
     * @returns {Promise<object>} - Estadísticas de progreso
     */
    getUserProgressStats: async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error('No hay usuario autenticado');
                return null;
            }

            // Referencia al documento de estadísticas del usuario
            const userStatsRef = doc(db, 'progress_stats', user.uid);
            const userStatsDoc = await getDoc(userStatsRef);

            if (userStatsDoc.exists()) {
                return userStatsDoc.data();
            }

            return null;
        } catch (error) {
            console.error('Error al obtener estadísticas de progreso:', error);
            return null;
        }
    },

    /**
     * Obtiene el progreso de la etapa actual del usuario
     * @param {string} stageId - ID de la etapa actual
     * @returns {Promise<object>} - Información de progreso de la etapa
     */
    getStageProgress: async (stageId) => {
        try {
            const stats = await ProgressTrackerService.getUserProgressStats();

            if (!stats || !stats.stageStats || !stats.stageStats[stageId]) {
                return {
                    completed: 0,
                    percentage: 0
                };
            }

            // En una implementación real, deberías obtener el número total de actividades
            // disponibles para la etapa para calcular el porcentaje real
            // Aquí usamos un valor ficticio para demostración
            const totalActivitiesInStage = 20; // Valor ejemplo
            const completedActivities = stats.stageStats[stageId].completed;

            return {
                completed: completedActivities,
                percentage: Math.min(100, Math.round((completedActivities / totalActivitiesInStage) * 100))
            };
        } catch (error) {
            console.error('Error al obtener progreso de etapa:', error);
            return {
                completed: 0,
                percentage: 0
            };
        }
    }
};

export default ProgressTrackerService;