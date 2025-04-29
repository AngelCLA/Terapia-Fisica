# Terapia Física - Documentación del Sistema

## 📱 Descripción General
Aplicación móvil desarrollada con React Native que proporciona servicios de terapia física. La aplicación incluye sistema de autenticación de usuarios, seguimiento de progreso personalizado, y visualización de ejercicios mediante videos interactivos.

## 🏗️ Estructura del Proyecto

### 📂 Directorios Principales
```
src/
├── assets/          # Recursos gráficos y medios
├── components/      # Componentes reutilizables
├── navigation/      # Configuración de navegación
├── screens/         # Pantallas de la aplicación
└── services/        # Servicios y lógica de negocio
```

### 🔐 Sistema de Autenticación
#### Pantallas
- `LoginScreen.js`: Pantalla principal de inicio de sesión
- `RegisterScreen.js`: Registro de nuevos usuarios
- `RegisterDataEmailScreen.js`: Formulario de registro con email
- `RegisterDataPhoneScreen.js`: Formulario de registro con teléfono
- `VerifyCodeEMailScreen.js`: Verificación de código por email
- `VerifyCodePhoneScreen.js`: Verificación de código por teléfono

### 📱 Pantallas Principales
- `HomeScreen.js`: Dashboard principal de la aplicación
- `ExerciseScreen.js`: Visualización y gestión de ejercicios
- `ProgressScreen.js`: Seguimiento del progreso personal
- `DatosFisicosScreen.js`: Gestión de datos físicos del usuario
- `VideoPlayerScreen.js`: Reproductor integrado de videos de ejercicios
- `StageCategoriesScreen.js`: Categorías de etapas de ejercicios
- `StageExercisesScreen.js`: Listado de ejercicios por etapa

### 🧩 Componentes
- `ActivityCompletionButton.js`: Botón para marcar actividades completadas
- `CategorySection.js`: Sección de categorías de ejercicios
- `StageSelection.js`: Selector de etapas de ejercicios
- `VideoCard.jsx`: Componente de visualización de videos

### 🛠️ Servicios
- `ProgressTrackerService.js`: Seguimiento del progreso del usuario
- `YoutubeService.js`: Integración con API de YouTube
- `GoogleAuthService.js`: Servicio de autenticación con Google
- `firebaseConfig.js`: Configuración de Firebase

## 🔧 Tecnologías Utilizadas

### Frontend
- **React Native**: Framework principal para desarrollo móvil
- **React Navigation**: Sistema de navegación entre pantallas
- **React Native Elements**: Biblioteca de componentes UI

### Backend y Servicios
- **Firebase**
  - Authentication: Sistema de autenticación
  - Realtime Database: Base de datos en tiempo real
  - Storage: Almacenamiento de archivos
- **Google Services**: Integración con servicios de Google
- **YouTube API**: Reproducción de videos de ejercicios

## 🌟 Características Principales

### 1. Sistema de Autenticación
- Múltiples métodos de inicio de sesión
  - Email y contraseña
  - Número de teléfono
  - Cuenta de Google
- Verificación en dos pasos
- Recuperación de contraseña

### 2. Gestión de Ejercicios
- Categorización por etapas y dificultad
- Reproducción de videos instructivos
- Sistema de progreso y seguimiento
- Marcado de ejercicios completados

### 3. Seguimiento Personal
- Registro de datos físicos
- Historial de ejercicios realizados
- Estadísticas de progreso
- Recordatorios y notificaciones

### 4. Interfaz de Usuario
- Diseño responsive y adaptativo
- Navegación intuitiva
- Componentes reutilizables
- Temas claro/oscuro

## 📱 Requisitos del Sistema

### Android
- Android 6.0 (API nivel 23) o superior
- 2GB RAM mínimo recomendado
- 100MB de espacio libre en almacenamiento

### iOS
- iOS 12.0 o superior
- Compatible con iPhone y iPad
- 100MB de espacio libre en almacenamiento

## 🚀 Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone [URL_del_repositorio]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
- Crear archivo `.env` basado en `.env.example`
- Configurar las claves de API necesarias

4. Iniciar la aplicación:
```bash
# Para Android
npm run android

# Para iOS
npm run ios
```

## 🔒 Seguridad
- Autenticación segura mediante Firebase
- Encriptación de datos sensibles
- Validación de tokens
- Protección contra ataques comunes

## 📝 Mantenimiento
- Actualizaciones regulares de seguridad
- Optimización de rendimiento
- Backups automáticos de datos
- Monitoreo de errores

## 👥 Soporte
Para soporte técnico o consultas:
- Email: [correo_de_soporte]
- Documentación: [URL_de_documentación]
- Issues: GitHub Issues
