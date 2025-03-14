import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

// Importar el objeto por defecto desde IndexScreens
import Screens from '../screens/IndexScreens';
import DatosFisicosScreen from "../screens/DatosFisicosScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <Stack.Navigator initialRouteName="Inicio">
            <Stack.Screen
                name="Inicio"
                component={Screens.WelcomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Inicio de sesión"
                component={Screens.LoginScreen}
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
                component={Screens.RegisterScreen}
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
                component={Screens.RegisterPhoneScreen}
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
                component={Screens.VerifyCodePhoneScreen}
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
                component={Screens.VerifyCodeEMailScreen}
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
                component={Screens.RegisterDataEmailScreen}
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
                component={Screens.RegisterDataPhoneScreen}
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
                component={Screens.HomeScreen}
                options={({navigation}) => ({
                    title: '',
                    headerTransparent: true,
                    headerStyle: styles.transparentHeader,
                    headerShown: false,
                })}
            />
            <Stack.Screen
                name="ExerciseScreen"
                component={Screens.ExerciseScreen}
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
                component={Screens.VideoPlayerScreen}
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