import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';
import {
    ExerciseScreen,
    HomeScreen,
    LoginScreen,
    RegisterDataEmailScreen,
    RegisterDataPhoneScreen,
    RegisterPhoneScreen,
    RegisterScreen,
    VerifyCodeEMailScreen,
    VerifyCodePhoneScreen,
    VideoPlayerScreen,
    WelcomeScreen,
} from '../screens/IndexScreens';
import DatosFisicosScreen from "../screens/DatosFisicosScreen";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="Inicio">
            <Stack.Screen
                name="Inicio"
                component={WelcomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Inicio de sesión"
                component={LoginScreen}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Registrarse"
                component={RegisterScreen}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Registro con Celular"
                component={RegisterPhoneScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Verificacion de Codigo"
                component={VerifyCodePhoneScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Verificacion de Codigo EMail"
                component={VerifyCodeEMailScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Register Data Email"
                component={RegisterDataEmailScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Register Data Phone"
                component={RegisterDataPhoneScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Datos Fisicos"
                component={DatosFisicosScreen}
                screenOptions={{
                    ...TransitionPresets.SlideFromRightIOS, // Una de las transiciones predefinidas de iOS
                }}
                options={({navigation}) => ({
                    title: '',
                    headerTintColor: '#7469B6',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,

                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({navigation}) => ({
                    title: '',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,
                    headerShown: false,
                })}
            />
            <Stack.Screen
                name="ExerciseScreen"
                component={ExerciseScreen}
                options={({navigation}) => ({
                    title: 'Ejercicios',
                    headerTransparent: false,
                    headerShown: true,
                    gap: 16,
                })}
            />
            {/* Videos */}
            <Stack.Screen
                name="VideoPlayerScreen"
                component={VideoPlayerScreen}
                options={({route, navigation}) => ({
                    title: route.params?.title || 'Reproductor', // Usa el título del video o un valor por defecto
                    headerShown: true,
                })}
            />

        </Stack.Navigator>

    );
};

const styles = StyleSheet.create({
    transparentHeader: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#7469B6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Navigation;
