# 🏥 Terapia Física - Aplicación Móvil de Rehabilitación Infantil

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.79.6-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0.0-000020.svg)
![Firebase](https://img.shields.io/badge/Firebase-11.3.1-ffca28.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

**Aplicación móvil especializada en terapia física para bebés de 0 a 12 meses**

[Características](#-características-principales) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Tecnologías](#-tecnologías) •
[Estructura](#-estructura-del-proyecto)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Servicios y APIs](#-servicios-y-apis)
- [Arquitectura](#-arquitectura)
- [Contribución](#-contribución)
- [Soporte](#-soporte)

---

## 📱 Descripción General

**Terapia Física** es una aplicación móvil multiplataforma (Android/iOS) desarrollada con React Native y Expo, diseñada para proporcionar programas de ejercicios de fisioterapia personalizados para bebés según su etapa de desarrollo (0-12 meses).

### 🎯 Objetivo

Facilitar el acceso a terapias físicas especializadas mediante una plataforma digital que:
- Proporciona ejercicios categorizados por grupos musculares y articulaciones
- Adapta contenido según la edad del bebé (4 etapas de desarrollo)
- Permite seguimiento del progreso y actividades completadas
- Ofrece videos instructivos de YouTube integrados
- Gestiona perfiles de usuario con autenticación segura

### 👶 Etapas de Desarrollo

La aplicación organiza los ejercicios en 4 etapas según la edad del bebé:

| Etapa | Rango de Edad | Enfoque Principal |
|-------|---------------|-------------------|
| **Etapa 1** | 0-3 meses | Movimientos básicos, estimulación inicial |
| **Etapa 2** | 4-6 meses | Fortalecimiento muscular, control de cabeza |
| **Etapa 3** | 7-9 meses | Preparación para gateo, coordinación |
| **Etapa 4** | 10-12 meses | Preparación para caminar, equilibrio |

---

## 🌟 Características Principales

### 🔐 Sistema de Autenticación Completo

- **Múltiples métodos de inicio de sesión:**
  - ✉️ Email y contraseña con verificación
  - 📱 Número de teléfono con código SMS
  - 🔑 Google Sign-In (compatible con Expo Go y builds nativos)
- **Seguridad:**
  - Verificación de email obligatoria
  - Persistencia de sesión con AsyncStorage
  - Integración con Firebase Authentication

### 🎥 Gestión de Ejercicios

- **Categorización inteligente:**
  - 8 categorías por grupo muscular/articular (Cadera, Codo, Hombro, Muñeca, Rodilla, Tobillo, Dedos de mano, Dedos de pies)
  - Filtrado automático por etapa de desarrollo
  - Videos instructivos integrados desde YouTube
  
- **Reproductor de video integrado:**
  - Control de reproducción completo
  - Detección automática de finalización
  - Marcado de progreso por video
  - Sistema de caché para optimizar datos

### 📊 Seguimiento de Progreso

- **Estadísticas detalladas:**
  - Total de actividades completadas
  - Progreso por etapa y categoría
  - Historial de actividades con timestamps
  - Racha semanal de ejercicios
  
- **Visualización:**
  - Gráficos de progreso por etapa
  - Tarjetas de resumen de actividad
  - Historial cronológico de ejercicios completados

### 👤 Perfil de Usuario Personalizado

- **Datos físicos del bebé:**
  - Género
  - Edad (en meses)
  - Peso y estatura
  - Cálculo automático de etapa de desarrollo
  
- **Almacenamiento:**
  - Firebase Firestore para datos de usuario
  - Sincronización en tiempo real

### 🎨 Interfaz de Usuario

- **Diseño moderno y accesible:**
  - Navegación por tabs en pantalla principal
  - Animaciones fluidas con React Native Reanimated
  - Colores distintivos por categoría
  - Iconografía clara con Ionicons, MaterialCommunityIcons y FontAwesome5
  
- **Componentes reutilizables:**
  - VideoCard: Tarjetas de vista previa de videos
  - ActivityCompletionButton: Botón de completado con feedback visual
  - CategorySection: Secciones de categoría con iconos personalizados
  - StageSelection: Selector de etapas con diseño atractivo

---

## 🔧 Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | Biblioteca UI principal |
| **React Native** | 0.79.6 | Framework multiplataforma |
| **Expo** | ~54.0.0 | Plataforma de desarrollo y build |
| **React Navigation** | 7.x | Sistema de navegación |
| **React Native Reanimated** | ~3.17.4 | Animaciones de alto rendimiento |
| **React Native Gesture Handler** | ~2.24.0 | Gestión de gestos |

### Backend y Servicios

| Servicio | Versión | Uso |
|----------|---------|-----|
| **Firebase** | 11.3.1 | Backend completo (Auth, Firestore, Realtime DB) |
| **YouTube Data API v3** | - | Obtención de videos educativos |
| **Google Sign-In** | 13.2.0 | Autenticación con Google |
| **AsyncStorage** | 2.1.2 | Almacenamiento local |

### Herramientas de Desarrollo

- **Metro Bundler**: Empaquetador JavaScript
- **Babel**: Transpilador de código
- **Hermes**: Motor JavaScript optimizado
- **Expo Video**: Reproducción de videos
- **React Native YouTube Iframe**: Integración de YouTube

### APIs Externas

- **YouTube Data API v3**: 
  - Búsqueda de videos
  - Detalles de videos
  - Sistema de rotación de API Keys (3 claves configuradas)
  - Caché de 7 días para optimizar cuota

---

## 📱 Requisitos del Sistema

### Para Android

- **Sistema Operativo:** Android 6.0 (API nivel 23) o superior
- **Memoria RAM:** Mínimo 2GB (recomendado 4GB)
- **Almacenamiento:** 150MB de espacio libre
- **Conectividad:** Conexión a Internet (WiFi o datos móviles)
- **Google Play Services:** Requerido para autenticación con Google

### Para iOS

- **Sistema Operativo:** iOS 12.0 o superior
- **Dispositivos:** Compatible con iPhone, iPad y iPod Touch
- **Almacenamiento:** 150MB de espacio libre
- **Conectividad:** Conexión a Internet (WiFi o datos móviles)

### Para Desarrollo

- **Node.js:** 18.x o superior
- **npm:** 9.x o superior (o yarn 1.22+)
- **Expo CLI:** Instalado globalmente
- **Android Studio:** Para desarrollo Android (con SDK 23+)
- **Xcode:** 12.0+ (solo macOS, para desarrollo iOS)
- **Cuenta de Firebase:** Proyecto configurado
- **YouTube API Key:** Clave de API válida

---

## 🚀 Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/terapia-fisica.git
cd terapia-fisica
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Firebase Configuration
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_auth_domain
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id

# YouTube API
YOUTUBE_API_KEY=tu_youtube_api_key

# Google Sign-In
GOOGLE_WEB_CLIENT_ID=tu_web_client_id
GOOGLE_IOS_CLIENT_ID=tu_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=tu_android_client_id
```

## 📚 Guías de Configuración

### Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication:
   - Email/Password
   - Phone
   - Google
3. Crear base de datos Firestore
4. Descargar archivos de configuración:
   - `google-services.json` para Android
   - `GoogleService-Info.plist` para iOS

### Configurar YouTube API

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o seleccionar existente
3. Habilitar YouTube Data API v3
4. Crear credenciales (API Key)
5. Copiar la API Key al archivo de configuración

## 💻 Uso

### Modo Desarrollo

#### Iniciar con Expo Go

```bash
# Iniciar el servidor de desarrollo
npm start
# o
expo start
```

Escanear el código QR con:
- **Android**: App Expo Go
- **iOS**: Cámara del iPhone

#### Iniciar en emulador/simulador

```bash
# Android
npm run android

# iOS (solo macOS)
npm run ios
```

### Build de Producción

#### Build local

```bash
# Android
eas build --platform android --local

# iOS
eas build --platform ios --local
```

#### Build en la nube (EAS)

```bash
# Configurar EAS
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 📂 Estructura del Proyecto

```
Terapia-Fisica/
├── android/                          # Configuración nativa de Android
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/terapiafisica/app/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   └── MainApplication.kt
│   │   │   └── res/                  # Recursos Android (iconos, etc.)
│   │   ├── build.gradle
│   │   └── google-services.json      # Configuración Firebase Android
│   └── build.gradle
│
├── src/                              # Código fuente principal
│   ├── assets/                       # Recursos estáticos
│   │   ├── splash-logo.png
│   │   ├── AvatarMujer.png
│   │   ├── AvatarHombre.png
│   │   └── ...
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── ActivityCompletionButton.js
│   │   ├── CategorySection.js
│   │   ├── StageSelection.js
│   │   └── VideoCard.jsx
│   │
│   ├── navigation/                   # Configuración de navegación
│   │   └── Navigation.js             # Definición de rutas y stacks
│   │
│   ├── screens/                      # Pantallas de la aplicación
│   │   ├── WelcomeScreen.js          # Pantalla de bienvenida
│   │   ├── LoginScreen.js            # Inicio de sesión
│   │   ├── RegisterScreen.js         # Registro de usuario
│   │   ├── RegisterPhoneScreen.js    # Registro con teléfono
│   │   ├── RegisterDataEmailScreen.js # Datos adicionales (email)
│   │   ├── RegisterDataPhoneScreen.js # Datos adicionales (teléfono)
│   │   ├── VerifyCodeEMailScreen.js  # Verificación email
│   │   ├── VerifyCodePhoneScreen.js  # Verificación teléfono
│   │   ├── DatosFisicosScreen.js     # Perfil físico del bebé
│   │   ├── HomeScreen.js             # Dashboard principal
│   │   ├── ExerciseScreen.js         # Biblioteca de ejercicios
│   │   ├── StageCategoriesScreen.js  # Categorías por etapa
│   │   ├── StageExercisesScreen.js   # Ejercicios por categoría
│   │   ├── VideoPlayerScreen.js      # Reproductor de videos
│   │   ├── ProgressScreen.js         # Seguimiento de progreso
│   │   └── IndexScreens.js           # Exportación centralizada
│   │
│   ├── services/                     # Servicios y lógica de negocio
│   │   ├── ProgressTrackerService.js # Gestión de progreso
│   │   └── YoutubeService.js         # Integración YouTube API
│   │
│   ├── App.js                        # Componente raíz
│   └── index.js                      # Punto de entrada
│
├── firebaseConfig.js                 # Configuración de Firebase
├── GoogleAuthService.js              # Servicio de autenticación Google
├── google-services.json              # Config Firebase Android (raíz)
├── GoogleService-Info.plist          # Config Firebase iOS
├── app.json                          # Configuración de Expo
├── babel.config.js                   # Configuración de Babel
├── metro.config.js                   # Configuración de Metro bundler
├── package.json                      # Dependencias y scripts
├── MANUAL_TECNICO.md                 # Documentación técnica detallada
└── README.md                         # Este archivo
```

### 📄 Descripción de Archivos Clave

#### Configuración

- **`app.json`**: Configuración de Expo (nombre, versión, iconos, splash screen)
- **`package.json`**: Dependencias del proyecto y scripts npm
- **`babel.config.js`**: Transpilación de código JavaScript
- **`metro.config.js`**: Configuración del empaquetador
- **`firebaseConfig.js`**: Credenciales y configuración de Firebase
- **`GoogleAuthService.js`**: Lógica de autenticación con Google

#### Punto de Entrada

- **`src/index.js`**: Registra el componente principal
- **`src/App.js`**: Configura NavigationContainer y proveedores

---

## 🔌 Servicios y APIs

### ProgressTrackerService

Servicio para gestionar el seguimiento del progreso del usuario.

#### Métodos principales:

```javascript
// Marcar actividad como completada
await ProgressTrackerService.markActivityAsCompleted({
  videoId: 'video_id',
  videoTitle: 'Título del video',
  categoryId: 'Cadera',
  categoryTitle: 'Cadera',
  stageId: 'Etapa 1',
  stageTitle: 'Etapa 1 (0-3 meses)'
});

// Obtener estadísticas de progreso
const stats = await ProgressTrackerService.getUserProgressStats();

// Obtener historial de actividades
const history = await ProgressTrackerService.getCompletedActivities();

// Obtener progreso por etapa
const progress = await ProgressTrackerService.getStageProgress('Etapa 1');
```

#### Estructura de datos:

```javascript
// Documento en Firestore: activities_history/{userId}
{
  userId: 'user_uid',
  activities: [
    {
      id: 'unique_activity_id',
      videoId: 'youtube_video_id',
      videoTitle: 'Título',
      categoryId: 'Cadera',
      categoryTitle: 'Cadera',
      stageId: 'Etapa 1',
      stageTitle: 'Etapa 1 (0-3 meses)',
      completedAt: Timestamp,
      timestamp: 1234567890
    }
  ]
}

// Documento en Firestore: user_progress/{userId}
{
  userId: 'user_uid',
  totalActivitiesCompleted: 25,
  stageStats: {
    'Etapa 1': { count: 10, lastActivity: Timestamp },
    'Etapa 2': { count: 15, lastActivity: Timestamp }
  },
  categoryStats: {
    'Cadera': 8,
    'Codo': 5,
    'Hombro': 12
  },
  dailyActivity: {
    '2026-01-15': 3,
    '2026-01-16': 5
  },
  lastUpdated: Timestamp
}
```

### YouTubeService

Servicio optimizado para interactuar con la API de YouTube.

#### Características:

- **Rotación automática de API Keys**: 3 claves configuradas
- **Sistema de caché**: 7 días de duración
- **Gestión de cuota**: Detecta y cambia claves cuando se excede la cuota
- **Paginación**: Soporte para cargar más videos

#### Métodos principales:

```javascript
// Obtener videos del canal
const result = await YouTubeService.getVideos({
  maxResults: 20,           // Cantidad de videos
  pageToken: null,          // Token de página (para paginación)
  forceRefresh: false       // Forzar actualización de caché
});

// Respuesta:
{
  videos: [
    {
      id: 'video_id',
      title: 'Título del video',
      description: 'Descripción',
      thumbnail: 'url_thumbnail',
      tags: ['tag1', 'tag2']
    }
  ],
  nextPageToken: 'token_for_next_page'
}
```

#### Configuración:

```javascript
// En YoutubeService.js
const YOUTUBE_API_KEYS = [
  'AIzaSyCHS1WP1pkc536u2iIwK3UrEaUsw9faVQA',
  'AIzaSyAOXwmfmBNYYNIRJJpn8x8ePgI6_yfQWEU',
  'AIzaSyCgDbVMY3OGNd4q5TEJ2sypxXhUw8U4ZNw'
];

const CHANNEL_ID = 'UCqf7TAAqkN-qbTe1m-l1trg';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días
```

### GoogleAuthService

Servicio de autenticación con Google compatible con Expo Go y builds nativos.

#### Hook personalizado:

```javascript
import { useGoogleAuth } from './GoogleAuthService';

const MyComponent = () => {
  const { signInWithGoogleExpo, loading } = useGoogleAuth();
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogleExpo(navigation);
  };
  
  return (
    <Button onPress={handleGoogleSignIn} disabled={loading} />
  );
};
```

#### Configuración de clientes:

- **Web Client ID**: Para autenticación web y Expo Go
- **iOS Client ID**: Para builds nativos iOS
- **Android Client ID**: Para builds nativos Android
- **Expo Client ID**: Para Expo Go

---

## 🏛️ Arquitectura

### Patrón de Diseño

La aplicación sigue una arquitectura basada en componentes con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────┐
│                    Presentation Layer                │
│  (Screens + Components + Navigation)                │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│                   Business Logic Layer               │
│  (Services: ProgressTracker, YouTube, GoogleAuth)   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│                      Data Layer                      │
│  (Firebase: Auth, Firestore, AsyncStorage)          │
└─────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
Usuario abre app
      │
      ▼
¿Sesión activa? ──No──> WelcomeScreen
      │                      │
     Sí                      ▼
      │              LoginScreen/RegisterScreen
      │                      │
      │                      ▼
      │              Firebase Auth
      │                      │
      │                      ▼
      │              ¿Email verificado?
      │                      │
      │                     Sí
      │                      │
      ▼                      ▼
  HomeScreen <──────────────┘
```

### Flujo de Ejercicios

```
Usuario en HomeScreen
      │
      ▼
Selecciona etapa actual
      │
      ▼
StageCategoriesScreen (muestra categorías)
      │
      ▼
Selecciona categoría (ej: Cadera)
      │
      ▼
StageExercisesScreen (lista videos de esa categoría)
      │
      ▼
Selecciona video
      │
      ▼
VideoPlayerScreen (reproduce y marca progreso)
      │
      ▼
Marca como completado
      │
      ▼
ProgressTrackerService.markActivityAsCompleted()
      │
      ▼
Actualiza Firestore (activities_history + user_progress)
```

### Gestión de Estado

- **Estado Local**: `useState` y `useEffect` en componentes
- **Persistencia**: AsyncStorage para datos locales y caché
- **Estado Global**: Firebase Authentication para usuario actual
- **Base de Datos**: Firestore para datos de usuario y progreso

---

## 🎨 Temas y Diseño

### Paleta de Colores por Categoría

| Categoría | Color Principal | Color de Fondo |
|-----------|----------------|----------------|
| Todos | #4A90E2 | #E6F0FD |
| Cadera | #3DD6BA | #e8fcf8 |
| Codo | #FF8A5C | #FFF1E6 |
| Dedos de la mano | #1089FF | #EDF6FD |
| Dedos de los pies | #FF5C5C | #FFE6E6 |
| Hombro | #40A858 | #E6FFF1 |
| Muñeca | #8A5CFF | #F1E6FF |
| Rodilla | #40A858 | #E6FFF1 |
| Tobillo | #1089FF | #EDF6FD |

### Paleta de Colores por Etapa

| Etapa | Degradado | Uso |
|-------|-----------|-----|
| Etapa 1 | #FF6B8B → #FF9F9F | Fondo de tarjetas |
| Etapa 2 | #49A7FF → #6DBDFF | Fondo de tarjetas |
| Etapa 3 | #77DD77 → #B4FF9F | Fondo de tarjetas |
| Etapa 4 | #FFA94D → #FFD59F | Fondo de tarjetas |

---

## 📊 Base de Datos (Firestore)

### Colecciones

#### `users`

Información de perfil de usuario.

```javascript
{
  uid: string,                    // ID único del usuario (Firebase Auth)
  email: string | null,           // Email del usuario
  phoneNumber: string | null,     // Teléfono del usuario
  displayName: string,            // Nombre completo
  genero: 'masculino' | 'femenino', // Género del bebé
  edad: string,                   // Edad en meses
  peso: string,                   // Peso en kg
  estatura: string,               // Estatura en cm
  createdAt: Timestamp,           // Fecha de creación
  updatedAt: Timestamp            // Última actualización
}
```

#### `activities_history`

Historial de actividades completadas por usuario.

```javascript
{
  userId: string,                 // ID del usuario
  activities: [
    {
      id: string,                 // ID único de la actividad
      videoId: string,            // ID del video de YouTube
      videoTitle: string,         // Título del video
      categoryId: string,         // ID de la categoría
      categoryTitle: string,      // Nombre de la categoría
      stageId: string,            // ID de la etapa
      stageTitle: string,         // Nombre de la etapa
      completedAt: Timestamp,     // Fecha/hora de completado
      timestamp: number           // Timestamp en milisegundos
    }
  ]
}
```

#### `user_progress`

Estadísticas agregadas de progreso.

```javascript
{
  userId: string,
  totalActivitiesCompleted: number,
  stageStats: {
    [stageId]: {
      count: number,
      lastActivity: Timestamp
    }
  },
  categoryStats: {
    [categoryName]: number
  },
  dailyActivity: {
    [dateString]: number          // 'YYYY-MM-DD': count
  },
  lastUpdated: Timestamp
}
```

---

## 🧪 Testing

### Ejecutar Tests (si están configurados)

```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests end-to-end
npm run test:e2e
```

### Herramientas Recomendadas

- **Jest**: Framework de testing
- **React Native Testing Library**: Testing de componentes
- **Detox**: Testing end-to-end

---

## 🚀 Despliegue

### Requisitos previos

1. Cuenta de [Expo](https://expo.dev/)
2. EAS CLI instalado: `npm install -g eas-cli`
3. Cuenta de desarrollador:
   - Google Play Console (Android)
   - Apple Developer Program (iOS)

### Proceso de Build y Despliegue

#### 1. Configurar EAS

```bash
# Login en Expo
eas login

# Configurar proyecto
eas build:configure
```

#### 2. Build para Android

```bash
# Build APK (para testing)
eas build -p android --profile preview

# Build AAB (para Google Play)
eas build -p android --profile production
```

#### 3. Build para iOS

```bash
# Build para TestFlight
eas build -p ios --profile preview

# Build para App Store
eas build -p ios --profile production
```

#### 4. Publicar Actualizaciones OTA

```bash
# Publicar actualización over-the-air
eas update --branch production --message "Descripción del cambio"
```

---

## 🔒 Seguridad y Buenas Prácticas

### Variables Sensibles

- ✅ **Nunca** commitear claves de API directamente en el código
- ✅ Usar variables de entorno o servicios de secretos
- ✅ Rotar claves de API periódicamente
- ✅ Implementar límites de tasa en llamadas a API

### Autenticación

- ✅ Validar email antes de permitir acceso completo
- ✅ Usar Firebase Security Rules para proteger Firestore
- ✅ Implementar verificación en dos factores cuando sea posible
- ✅ Cerrar sesión automáticamente después de inactividad prolongada

### Datos de Usuario

- ✅ Cumplir con GDPR y regulaciones de privacidad
- ✅ Permitir a usuarios eliminar sus datos
- ✅ Encriptar datos sensibles
- ✅ Usar HTTPS para todas las comunicaciones

---

## 🐛 Troubleshooting

### Problemas Comunes

#### Error: "YouTube API quota exceeded"

**Solución**: El servicio cambia automáticamente a la siguiente API key. Si todas están excedidas, esperar hasta el siguiente día (cuota diaria).

#### Error al iniciar sesión con Google en Expo Go

**Solución**: Asegurarse de que los Client IDs estén correctamente configurados en `GoogleAuthService.js` y que coincidan con los de Firebase Console.

#### Videos no se cargan

**Solución**: 
1. Verificar conexión a Internet
2. Verificar que las API keys de YouTube sean válidas
3. Limpiar caché: `AsyncStorage.clear()`

#### Build falla en Android

**Solución**:
1. Verificar que `google-services.json` esté en `/android/app/`
2. Ejecutar `cd android && ./gradlew clean`
3. Verificar versiones de Gradle y SDK

#### Errores de navegación

**Solución**:
1. Verificar que todas las pantallas estén registradas en `Navigation.js`
2. Asegurarse de pasar parámetros correctos en `navigation.navigate()`

---

## 📝 Roadmap y Características Futuras

### v1.1 (Próxima versión)

- [ ] Modo offline con sincronización automática
- [ ] Notificaciones push para recordatorios de ejercicios
- [ ] Compartir progreso en redes sociales
- [ ] Integración con Apple Health y Google Fit

### v1.2

- [ ] Videos descargables para ver sin conexión
- [ ] Chat con terapeutas profesionales
- [ ] Programas de ejercicios personalizados con IA
- [ ] Gamificación: insignias y logros

### v2.0

- [ ] Soporte para múltiples idiomas (inglés, francés, portugués)
- [ ] Realidad aumentada para demostración de ejercicios
- [ ] Comunidad de padres y foro de discusión
- [ ] Versión web responsive

---

## 👥 Contribución

### Cómo Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Guía de Estilo de Código

- Usar ESLint y Prettier para formateo consistente
- Seguir convenciones de nomenclatura de React Native
- Comentar código complejo
- Escribir tests para nuevas características
- Actualizar documentación cuando sea necesario

### Convenciones de Commits

```
Add: Nueva característica
Fix: Corrección de bug
Update: Actualización de funcionalidad existente
Refactor: Refactorización de código
Docs: Cambios en documentación
Style: Cambios de formato (sin afectar funcionalidad)
Test: Añadir o modificar tests
Chore: Cambios en build, configuración, etc.
```

---

## 📄 Licencia

Este proyecto es de uso privado y confidencial. Todos los derechos reservados.

**Restricciones:**
- No se permite la distribución sin autorización
- No se permite el uso comercial sin licencia
- No se permite la modificación sin permiso
- El código fuente es propiedad de los desarrolladores originales

---

## 👨‍💻 Autores y Reconocimientos

### Equipo de Desarrollo

- **Desarrollador Principal**: [Nombre]
- **Diseño UI/UX**: [Nombre]
- **Backend/Firebase**: [Nombre]
- **Testing QA**: [Nombre]

### Agradecimientos

- Comunidad de React Native y Expo
- Firebase team por la excelente documentación
- YouTube Data API
- Iconos: Ionicons, MaterialCommunityIcons, FontAwesome5

---

## 📞 Soporte

### Contacto

- **Email**: soporte@terapiafisica.com
- **Website**: https://www.terapiafisica.com
- **Documentación**: Ver [MANUAL_TECNICO.md](MANUAL_TECNICO.md)

### Reportar Bugs

Por favor reportar bugs a través de:
1. GitHub Issues (si aplicable)
2. Email a soporte técnico
3. Sistema interno de tickets

### FAQ

**P: ¿La app funciona sin conexión a Internet?**
R: Actualmente requiere conexión para cargar videos y sincronizar progreso. Modo offline planeado para v1.1.

**P: ¿Puedo usar la app para niños mayores de 12 meses?**
R: La app está diseñada específicamente para bebés de 0-12 meses. Para niños mayores, consultar con un terapeuta profesional.

**P: ¿Los videos son creados por profesionales?**
R: Sí, todos los videos son revisados y aprobados por fisioterapeutas pediátricos certificados.

**P: ¿Cuánto espacio ocupa la app?**
R: Aproximadamente 50MB la app base, más caché de videos (puede variar).

---

## 📚 Recursos Adicionales

### Documentación Relacionada

- [Manual Técnico Completo](MANUAL_TECNICO.md)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

### Tutoriales y Guías

- [Configuración de Firebase en React Native](https://rnfirebase.io/)
- [Guía de React Navigation](https://reactnavigation.org/docs/getting-started)
- [YouTube Data API Guide](https://developers.google.com/youtube/v3)

---

<div align="center">

**Hecho con ❤️ para el bienestar infantil**

[⬆ Volver arriba](#-terapia-física---aplicación-móvil-de-rehabilitación-infantil)

</div>
