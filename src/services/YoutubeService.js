// YouTubeService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de múltiples claves API de YouTube
const YOUTUBE_API_KEYS = [
    'AIzaSyCHS1WP1pkc536u2iIwK3UrEaUsw9faVQA',
    'AIzaSyAOXwmfmBNYYNIRJJpn8x8ePgI6_yfQWEU',
    'YOUR_YOUTUBE_API_KEY_3' // Puedes agregar tantas como necesites
];

// URL base de la API de YouTube
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// ID del canal específico
const CHANNEL_ID = 'UCNJWe9sVinPkGd1KqGP45cA';

// Lleva un registro del índice de la API que se está usando actualmente
let currentApiKeyIndex = 0;

// Registra qué claves API han excedido su cuota diaria
const apiQuotaExceeded = {};

class YouTubeService {
    // Método para cambiar a la siguiente clave API disponible
    static switchToNextAvailableApiKey() {
        const startIndex = currentApiKeyIndex;

        do {
            currentApiKeyIndex = (currentApiKeyIndex + 1) % YOUTUBE_API_KEYS.length;

            // Si volvimos al índice inicial, todas las claves API están agotadas
            if (currentApiKeyIndex === startIndex) {
                console.warn('Todas las claves API de YouTube han excedido su cuota. Reintentando con la primera.');
                // Resetear para el próximo día o intento
                Object.keys(apiQuotaExceeded).forEach(key => {
                    apiQuotaExceeded[key] = false;
                });
            }
        } while (apiQuotaExceeded[currentApiKeyIndex] && currentApiKeyIndex !== startIndex);

        console.log(`Cambiando a clave API de YouTube #${currentApiKeyIndex + 1}`);
        return YOUTUBE_API_KEYS[currentApiKeyIndex];
    }

    // Almacenar en AsyncStorage qué API keys han excedido su cuota
    static async saveApiKeyStatus() {
        try {
            await AsyncStorage.setItem('youtube_api_quota_status', JSON.stringify({
                apiQuotaExceeded,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Error al guardar estado de las claves API:', error);
        }
    }

    // Cargar desde AsyncStorage el estado de las API keys
    static async loadApiKeyStatus() {
        try {
            const status = await AsyncStorage.getItem('youtube_api_quota_status');
            if (status) {
                const { apiQuotaExceeded: savedStatus, timestamp } = JSON.parse(status);

                // Comprobar si ha pasado un día completo (reseteo de cuota)
                const oneDayMs = 24 * 60 * 60 * 1000;
                if (Date.now() - timestamp > oneDayMs) {
                    // Ha pasado más de un día, resetear todos los estados
                    Object.keys(apiQuotaExceeded).forEach(key => {
                        apiQuotaExceeded[key] = false;
                    });
                } else {
                    // Actualizar con el estado guardado
                    Object.keys(savedStatus).forEach(key => {
                        apiQuotaExceeded[key] = savedStatus[key];
                    });
                }
            }
        } catch (error) {
            console.warn('Error al cargar estado de las claves API:', error);
        }
    }

    // Método principal para obtener videos con rotación de API keys
    static async getVideos(options = {}) {
        // Cargar el estado de las API keys al inicio
        await this.loadApiKeyStatus();

        const { forceRefresh = false, cacheKey, maxResults = 10, category = null, pageToken = null } = options;

        // Intentar cargar desde caché si no se fuerza actualización
        if (!forceRefresh && cacheKey) {
            try {
                const cachedData = await AsyncStorage.getItem(`video_cache_${cacheKey}`);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const cacheAge = Date.now() - timestamp;

                    // Usar caché si tiene menos de 24 horas
                    if (cacheAge < 24 * 60 * 60 * 1000) {
                        console.log(`Usando datos en caché para: ${cacheKey}`);
                        return data;
                    }
                }
            } catch (error) {
                console.warn('Error al acceder a la caché:', error);
            }
        }

        // Máximo número de reintentos entre API keys
        const maxRetries = YOUTUBE_API_KEYS.length;
        let retryCount = 0;
        let currentApiKey = YOUTUBE_API_KEYS[currentApiKeyIndex];

        while (retryCount < maxRetries) {
            try {
                // Hay dos opciones para obtener videos de un canal específico:

                // OPCIÓN 1: Usar search con channelId
                let searchQuery = '/search?part=snippet';
                searchQuery += `&channelId=${CHANNEL_ID}`; // Filtrar por canal específico
                searchQuery += `&maxResults=${maxResults}`;

                // Agregar filtro de categoría si está especificado
                if (category && category !== "Todos") {
                    searchQuery += `&q=${encodeURIComponent(category)}`;
                }

                searchQuery += '&type=video';
                searchQuery += '&order=date'; // Ordenar por fecha (más recientes primero)

                if (pageToken) {
                    searchQuery += `&pageToken=${pageToken}`;
                }
                searchQuery += `&key=${currentApiKey}`;

                // Realizar petición de búsqueda
                const searchResponse = await fetch(`${YOUTUBE_API_BASE_URL}${searchQuery}`);

                if (!searchResponse.ok) {
                    const errorData = await searchResponse.json();
                    if (this.isQuotaExceededError(errorData)) {
                        throw { quotaExceeded: true, errorData };
                    }
                    throw new Error(`Error en la API de YouTube: ${JSON.stringify(errorData)}`);
                }

                const searchData = await searchResponse.json();

                // Si no hay resultados, puede ser que no haya videos que coincidan
                if (!searchData.items || searchData.items.length === 0) {
                    return { videos: [], nextPageToken: null };
                }

                // Extraer los IDs de los videos para obtener detalles adicionales
                const videoIds = searchData.items
                    .filter(item => item.id && item.id.videoId)
                    .map(item => item.id.videoId)
                    .join(',');

                // Obtener detalles adicionales (duración, etc.)
                const detailsQuery = `/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${currentApiKey}`;
                const detailsResponse = await fetch(`${YOUTUBE_API_BASE_URL}${detailsQuery}`);

                if (!detailsResponse.ok) {
                    const errorData = await detailsResponse.json();
                    if (this.isQuotaExceededError(errorData)) {
                        throw { quotaExceeded: true, errorData };
                    }
                    console.warn('Error al obtener detalles de videos:', errorData);
                }

                const detailsData = await detailsResponse.json();

                // Combinar datos de búsqueda con detalles
                const videos = searchData.items.map(item => {
                    const videoId = item.id.videoId;
                    const details = detailsData.items.find(detail => detail.id === videoId);

                    // Si tenemos los detalles, usar las etiquetas desde allí
                    const tags = details && details.snippet && details.snippet.tags ? details.snippet.tags : [];

                    return {
                        id: videoId,
                        snippet: {
                            ...item.snippet,
                            tags: tags // Agregar tags desde la respuesta detallada
                        },
                        contentDetails: details ? details.contentDetails : null,
                        statistics: details ? details.statistics : null,
                        formattedDuration: details && details.contentDetails ?
                            this.formatDuration(details.contentDetails.duration) : '0:00'
                    };
                });

                // Aplicar filtro de categoría en el cliente si es necesario
                let filteredVideos = videos;
                if (category && category !== "Todos") {
                    // Este es un filtrado adicional basado en etiquetas,
                    // útil si la búsqueda por 'q' no es suficientemente precisa
                    const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');
                    const normalizedCategory = normalizeString(category);

                    filteredVideos = videos.filter(video =>
                        (video.snippet.tags || []).some(tag =>
                            normalizeString(tag) === normalizedCategory
                        )
                    );

                    // Si el filtrado eliminó todos los resultados, usar los originales
                    if (filteredVideos.length === 0) {
                        filteredVideos = videos;
                    }
                }

                const result = {
                    videos: filteredVideos,
                    nextPageToken: searchData.nextPageToken || null
                };

                // Guardar en caché si se especificó una clave
                if (cacheKey) {
                    try {
                        await AsyncStorage.setItem(
                            `video_cache_${cacheKey}`,
                            JSON.stringify({
                                data: result,
                                timestamp: Date.now()
                            })
                        );
                    } catch (cacheError) {
                        console.warn('Error al guardar en caché:', cacheError);
                    }
                }

                return result;
            } catch (error) {
                if (error.quotaExceeded) {
                    console.warn(`La clave API #${currentApiKeyIndex + 1} ha excedido su cuota. Cambiando a otra clave.`);
                    apiQuotaExceeded[currentApiKeyIndex] = true;
                    this.saveApiKeyStatus();
                    currentApiKey = this.switchToNextAvailableApiKey();
                    retryCount++;
                } else {
                    // Si es otro tipo de error, lo propagamos
                    console.error('Error con la API de YouTube:', error);
                    throw error;
                }
            }
        }

        throw new Error('No se pudieron obtener videos. Todas las claves API han alcanzado su límite de cuota.');
    }

    // Verifica si un error es por exceso de cuota
    static isQuotaExceededError(errorData) {
        return errorData &&
            errorData.error &&
            errorData.error.errors &&
            errorData.error.errors.some(e =>
                e.reason === 'quotaExceeded' ||
                e.reason === 'dailyLimitExceeded'
            );
    }

    // Utilidad para formatear duración
    static formatDuration(isoDuration) {
        // Formatea duración ISO 8601 (PT1H2M3S) a un formato legible (1:02:03)
        const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!matches) return '0:00';

        const hours = matches[1] ? parseInt(matches[1]) : 0;
        const minutes = matches[2] ? parseInt(matches[2]) : 0;
        const seconds = matches[3] ? parseInt(matches[3]) : 0;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

export default YouTubeService;