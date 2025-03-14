// YouTubeService.js - Versión optimizada
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de múltiples claves API de YouTube
const YOUTUBE_API_KEYS = [
    'AIzaSyCHS1WP1pkc536u2iIwK3UrEaUsw9faVQA',
    'AIzaSyAOXwmfmBNYYNIRJJpn8x8ePgI6_yfQWEU',
    'AIzaSyCgDbVMY3OGNd4q5TEJ2sypxXhUw8U4ZNw' // Puedes agregar tantas como necesites
];

// URL base de la API de YouTube
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// ID del canal específico
const CHANNEL_ID = 'UCNJWe9sVinPkGd1KqGP45cA';

// Lleva un registro del índice de la API que se está usando actualmente
let currentApiKeyIndex = 0;

// Registra qué claves API han excedido su cuota diaria
const apiQuotaExceeded = {};

// Constantes para caché
const CACHE_MAIN_DATA = 'youtube_videos_main_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos (aumentamos el tiempo de caché)

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

    // MÉTODO PRINCIPAL PARA OBTENER VIDEOS
    static async getVideos(options = {}) {
        // Cargar el estado de las API keys al inicio
        await this.loadApiKeyStatus();

        const {
            forceRefresh = false,
            cacheKey = CACHE_MAIN_DATA,
            maxResults = 30, // Aumentado para tener más videos en una sola carga
            category = null,
            pageToken = null
        } = options;

        // 1. OPTIMIZACIÓN PRINCIPAL: Intentar usar caché global primero
        try {
            const mainCacheData = await AsyncStorage.getItem(CACHE_MAIN_DATA);
            if (mainCacheData && !forceRefresh) {
                const { data, timestamp } = JSON.parse(mainCacheData);
                const cacheAge = Date.now() - timestamp;

                // Usar caché si tiene menos de X días (extendemos periodo)
                if (cacheAge < CACHE_EXPIRY) {
                    console.log(`Usando datos en caché principal`);

                    // Si hay pageToken, manejamos la paginación desde la caché
                    if (pageToken) {
                        // Encontrar dónde comenzar en nuestros datos cacheados
                        const startIndex = data.videos.findIndex(v => v.id === pageToken);
                        if (startIndex >= 0 && startIndex + 1 < data.videos.length) {
                            // Simular paginación desde la caché
                            return {
                                videos: data.videos.slice(startIndex + 1, startIndex + 1 + maxResults),
                                nextPageToken: startIndex + 1 + maxResults < data.videos.length ?
                                    data.videos[startIndex + 1 + maxResults].id : null
                            };
                        }
                    }

                    // Si hay categoría, filtramos localmente
                    if (category && category !== "Todos") {
                        const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');
                        const normalizedCategory = normalizeString(category);

                        const filteredVideos = data.videos.filter(video =>
                            (video.snippet.tags || []).some(tag =>
                                normalizeString(tag) === normalizedCategory
                            )
                        );

                        // Devolver videos filtrados con paginación simulada
                        return {
                            videos: filteredVideos.slice(0, maxResults),
                            nextPageToken: filteredVideos.length > maxResults ?
                                filteredVideos[maxResults].id : null
                        };
                    }

                    // Caso normal: devolver primeros videos de caché
                    return {
                        videos: data.videos.slice(0, maxResults),
                        nextPageToken: data.videos.length > maxResults ?
                            data.videos[maxResults].id : null
                    };
                }
            }
        } catch (error) {
            console.warn('Error al acceder a la caché principal:', error);
        }

        // 2. Si llegamos aquí, necesitamos hacer llamada a la API
        // Máximo número de reintentos entre API keys
        const maxRetries = YOUTUBE_API_KEYS.length;
        let retryCount = 0;
        let currentApiKey = YOUTUBE_API_KEYS[currentApiKeyIndex];

        while (retryCount < maxRetries) {
            try {
                // OPTIMIZACIÓN: Aumentamos maxResults para obtener más videos en una sola llamada
                // esto reduce las llamadas futuras con paginación
                const apiMaxResults = 50; // máximo permitido por YouTube API

                // Construir la consulta de búsqueda
                let searchQuery = '/search?part=snippet';
                searchQuery += `&channelId=${CHANNEL_ID}`;
                searchQuery += `&maxResults=${apiMaxResults}`;

                // Solo agregamos filtro de categoría en la API si es necesario
                if (category && category !== "Todos") {
                    searchQuery += `&q=${encodeURIComponent(category)}`;
                }

                searchQuery += '&type=video';
                searchQuery += '&order=date'; // Ordenar por fecha (más recientes primero)

                // Solo usamos pageToken real con la API si no tenemos suficientes videos en caché
                if (pageToken && !mainCacheData) {
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

                // OPTIMIZACIÓN: Guardar TODOS los videos obtenidos en caché global
                try {
                    await AsyncStorage.setItem(
                        CACHE_MAIN_DATA,
                        JSON.stringify({
                            data: {
                                videos,
                                nextPageToken: searchData.nextPageToken || null
                            },
                            timestamp: Date.now()
                        })
                    );
                } catch (cacheError) {
                    console.warn('Error al guardar en caché principal:', cacheError);
                }

                // OPTIMIZACIÓN: Filtrar por categoría en el lado del cliente
                let filteredVideos = videos;
                if (category && category !== "Todos") {
                    const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');
                    const normalizedCategory = normalizeString(category);

                    filteredVideos = videos.filter(video =>
                        (video.snippet.tags || []).some(tag =>
                            normalizeString(tag) === normalizedCategory
                        )
                    );

                    if (filteredVideos.length === 0) {
                        filteredVideos = videos;
                    }
                }

                // Limitar resultados a lo solicitado por el cliente
                filteredVideos = filteredVideos.slice(0, maxResults);

                const result = {
                    videos: filteredVideos,
                    nextPageToken: videos.length > maxResults ? videos[maxResults].id : null
                };

                // También guardar en caché específica si se proporcionó cacheKey
                if (cacheKey && cacheKey !== CACHE_MAIN_DATA) {
                    try {
                        await AsyncStorage.setItem(
                            `video_cache_${cacheKey}`,
                            JSON.stringify({
                                data: result,
                                timestamp: Date.now()
                            })
                        );
                    } catch (cacheError) {
                        console.warn('Error al guardar en caché específica:', cacheError);
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

        // 3. FALLBACK: Si todas las API keys fallan, intentar usar cualquier dato en caché
        try {
            const cachedData = await AsyncStorage.getItem(CACHE_MAIN_DATA);
            if (cachedData) {
                const { data } = JSON.parse(cachedData);
                console.warn('Usando caché de emergencia debido a errores de API');

                // Si hay categoría, filtramos localmente
                if (category && category !== "Todos") {
                    const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');
                    const normalizedCategory = normalizeString(category);

                    const filteredVideos = data.videos.filter(video =>
                        (video.snippet.tags || []).some(tag =>
                            normalizeString(tag) === normalizedCategory
                        )
                    );

                    return {
                        videos: filteredVideos.slice(0, maxResults),
                        nextPageToken: null // Desactivamos paginación en modo emergencia
                    };
                }

                return {
                    videos: data.videos.slice(0, maxResults),
                    nextPageToken: null // Desactivamos paginación en modo emergencia
                };
            }
        } catch (error) {
            console.error('Error al intentar usar caché de emergencia:', error);
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

    // NUEVO MÉTODO: Iniciar precarga en background
    static async prefetchVideos() {
        try {
            // Verificar si ya tenemos caché reciente
            const cachedData = await AsyncStorage.getItem(CACHE_MAIN_DATA);
            if (cachedData) {
                const { timestamp } = JSON.parse(cachedData);
                // Si la caché tiene menos de 3 días, no hacer nada
                if (Date.now() - timestamp < 3 * 24 * 60 * 60 * 1000) {
                    console.log('Caché principal reciente, omitiendo precarga');
                    return;
                }
            }

            // Si llegamos aquí, hacemos la precarga
            console.log('Iniciando precarga de videos en background...');
            this.getVideos({
                forceRefresh: true,
                maxResults: 50 // Cargar muchos videos de una vez
            }).catch(error => {
                console.warn('Error en precarga de videos:', error);
            });
        } catch (error) {
            console.warn('Error al verificar necesidad de precarga:', error);
        }
    }

    // NUEVA FUNCIÓN: Proporcionar videos de respaldo si todo falla
    static async getFallbackVideos() {
        // Datos de videos de respaldo para emergencias extremas
        // Estos se mostrarían si todas las API keys fallan y no hay caché
        return {
            videos: [
                {
                    id: 'VIDEO_ID_1',
                    snippet: {
                        title: 'Video de respaldo 1',
                        description: 'Este video se muestra cuando no hay conexión',
                        tags: ['Respaldo', 'Ejercicio'],
                        thumbnails: {
                            high: { url: 'https://via.placeholder.com/480x360.png?text=Video+No+Disponible' }
                        }
                    },
                    formattedDuration: '10:00'
                },
                // Puedes agregar más videos de respaldo aquí
            ],
            nextPageToken: null
        };
    }
}

export default YouTubeService;