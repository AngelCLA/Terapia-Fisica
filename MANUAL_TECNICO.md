# Manual Técnico - Aplicación de Terapia Física

## 1. Arquitectura del Sistema

### 1.1 Arquitectura General
```
Terapia-Fisica/
├── src/                    # Código fuente principal
├── android/                # Configuración específica de Android
├── ios/                    # Configuración específica de iOS
└── node_modules/           # Dependencias del proyecto
```

### 1.2 Patrones de Diseño
- **MVC (Model-View-Controller)**
  - Models: Servicios y gestores de datos
  - Views: Componentes y pantallas
  - Controllers: Lógica de negocio en servicios

- **Provider Pattern**
  - Gestión de estado global
  - Contextos para autenticación
  - Manejo de temas

### 1.3 Estructura de Datos
```javascript
// Ejemplo de estructura de usuario
interface User {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName: string;
  photoURL?: string;
  physicalData: PhysicalData;
  progress: ProgressData;
}

interface PhysicalData {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  medicalConditions: string[];
}

interface ProgressData {
  completedExercises: string[];
  currentStage: number;
  achievements: Achievement[];
  lastActivity: Date;
}
```

## 2. Componentes del Sistema

### 2.1 Sistema de Autenticación
```javascript
// GoogleAuthService.js
export class GoogleAuthService {
  static async signIn() {
    // Implementación de autenticación con Google
  }
  
  static async signOut() {
    // Implementación de cierre de sesión
  }
}

// Firebase Authentication
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... otras configuraciones
};
```

### 2.2 Gestión de Estado
```javascript
// Ejemplo de Context para autenticación
const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
```

### 2.3 Sistema de Navegación
```javascript
// Navigation.js
const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Exercise" component={ExerciseScreen} />
    // ... otras pantallas
  </Stack.Navigator>
);
```

## 3. APIs y Servicios

### 3.1 Firebase
#### Configuración
```javascript
// firebaseConfig.js
export const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx"
};
```

#### Métodos Principales
```javascript
// Autenticación
auth.signInWithEmailAndPassword(email, password);
auth.signInWithPhoneNumber(phoneNumber);
auth.signInWithGoogle();

// Base de datos
db.collection('users').doc(userId).set(userData);
db.collection('exercises').get();
```

### 3.2 YouTube API
```javascript
// YoutubeService.js
export class YoutubeService {
  static async getVideoDetails(videoId) {
    // Implementación
  }
  
  static async getPlaylistVideos(playlistId) {
    // Implementación
  }
}
```

## 4. Componentes UI Principales

### 4.1 VideoCard
```javascript
interface VideoCardProps {
  videoId: string;
  title: string;
  duration: string;
  thumbnail: string;
  onPress: () => void;
}
```

### 4.2 ActivityCompletionButton
```javascript
interface CompletionButtonProps {
  exerciseId: string;
  isCompleted: boolean;
  onComplete: () => void;
}
```

## 5. Flujos de Datos

### 5.1 Autenticación
1. Usuario inicia proceso de login
2. Validación de credenciales
3. Creación de sesión
4. Redirección a Home

### 5.2 Ejercicios
1. Carga de categorías
2. Selección de ejercicio
3. Reproducción de video
4. Marcado de completado

## 6. Seguridad

### 6.1 Autenticación
- JWT para tokens
- Refresh tokens
- Validación de sesiones

### 6.2 Base de Datos
- Reglas de seguridad Firebase
- Validación de datos
- Sanitización de inputs

## 7. Optimización

### 7.1 Caché
- Videos precargados
- Datos de usuario en AsyncStorage
- Imágenes en caché

### 7.2 Rendimiento
- Lazy loading de componentes
- Memorización de cálculos pesados
- Compresión de imágenes

## 8. Testing

### 8.1 Unit Tests
```javascript
// Ejemplo de test unitario
describe('AuthService', () => {
  it('should authenticate user', async () => {
    // Implementación del test
  });
});
```

### 8.2 Integration Tests
```javascript
// Ejemplo de test de integración
describe('Exercise Flow', () => {
  it('should complete exercise', async () => {
    // Implementación del test
  });
});
```

## 9. Dependencias Principales

```json
{
  "dependencies": {
    "react": "^17.0.2",
    "react-native": "^0.66.0",
    "firebase": "^9.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-native-firebase/app": "^14.0.0",
    "react-native-youtube": "^2.0.0"
  }
}
```

## 10. Configuración del Entorno

### 10.1 Variables de Entorno
```env
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
YOUTUBE_API_KEY=xxx
```

### 10.2 Configuración de Desarrollo
```bash
# Instalación
npm install

# Desarrollo Android
npm run android

# Desarrollo iOS
npm run ios

# Tests
npm run test
```

## 11. Mantenimiento

### 11.1 Logs
- Firebase Analytics
- Crashlytics
- Console logs en desarrollo

### 11.2 Backups
- Firebase Database Backups
- Configuración automática
- Retención de datos

## 12. Despliegue

### 12.1 Android
```bash
# Generar APK
cd android && ./gradlew assembleRelease

# Bundle
cd android && ./gradlew bundleRelease
```

### 12.2 iOS
```bash
# Generar IPA
cd ios && xcodebuild -workspace TerapiaFisica.xcworkspace -scheme TerapiaFisica archive
```

## 13. Resolución de Problemas

### 13.1 Problemas Comunes
1. Errores de autenticación
2. Fallos en reproducción de video
3. Problemas de caché

### 13.2 Soluciones
- Limpieza de caché
- Reinstalación de dependencias
- Actualización de tokens

## 14. Referencias

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Firebase Docs](https://firebase.google.com/docs)
- [YouTube API Docs](https://developers.google.com/youtube/v3)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
