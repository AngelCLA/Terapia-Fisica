import React from 'react';
import { SafeAreaView, ImageBackground, StyleSheet, Text, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ImageBackground
                source={require('../assets/backgroundImage.png')}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>TeraFlu</Text>
                        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Text style={{ color: '#828282', fontSize: 32, fontWeight: 'bold' }}>Bienvenido</Text>
                        <Pressable
                            style={styles.loginButton}
                            onPress={() => navigation.navigate('Inicio de sesión')}
                        >
                            <Text style={{ color: '#7469B6', fontSize: 24, fontWeight: 'bold' }}>Iniciar Sesión</Text>
                        </Pressable>
                        <Pressable
                            style={styles.registerButton}
                            onPress={() => navigation.navigate('Registrarse')}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Registrarse</Text>
                        </Pressable>
                    </View>
                    <StatusBar style="auto" />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    titleContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        marginHorizontal: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#EBEBFF',
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
        paddingVertical: 40,
        borderRadius: 26,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#7469B6',
        alignItems: 'center',
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        color: '#fff',
        fontSize: 16,
    },
});

export default WelcomeScreen;
