import React, { useState, useEffect } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Platform,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

/**
 * Asset Imports
 * Imágenes utilizadas en la interfaz de usuario
 */
const ClipboardImage = require('../assets/clipboard.png');
const AvatarMujerImage = require('../assets/AvatarMujer.png');
const AvatarHombreImage = require('../assets/AvatarHombre.png');
const BasculaImage = require('../assets/bascula.png');

/**
 * Definición de Etapas de Vida
 * Array constante que define las etapas de desarrollo del bebé.
 * Se mantiene fuera del componente para evitar recreación en cada render.
 * @constant {Array<Object>} etapasVida
 * @property {string} id - Identificador único de la etapa
 * @property {string} titulo - Nombre descriptivo de la etapa
 * @property {string} rango - Rango de edad en meses
 * @property {number} edadMedia - Edad representativa en meses
 */
const etapasVida = [
    { id: 'Etapa 1', titulo: 'Etapa 1', rango: '0-3 meses', edadMedia: 2 },
    { id: 'Etapa 2', titulo: 'Etapa 2', rango: '4-6 meses', edadMedia: 5 },
    { id: 'Etapa 3', titulo: 'Etapa 3', rango: '7-9 meses', edadMedia: 8 },
    { id: 'Etapa 4', titulo: 'Etapa 4', rango: '10-12 meses', edadMedia: 11 }
];

/**
 * Pantalla de Datos Físicos
 * 
 * Componente que maneja el flujo de recopilación de datos físicos del bebé.
 * Incluye múltiples vistas secuenciales para capturar:
 * - Género del bebé
 * - Edad (etapa de vida)
 * - Peso
 * - Estatura
 * - Resumen y confirmación de datos
 * 
 * @component
 * @returns {React.ReactElement} Componente de pantalla para captura de datos físicos
 */
const DatosFisicosScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    /** Datos personales recibidos desde la pantalla anterior */
    const { personalData } = route.params;

    const [currentView, setCurrentView] = useState('Genero');
    const [formData, setFormData] = useState({
        genero: null,
        edad: '',
        peso: '',
        estatura: '',
        //padecimiento: '',
        //nivelActividad: null,
    });
    const [selectedFirstPicker, setSelectedFirstPicker] = useState('0');
    const [selectedSecondPicker, setSelectedSecondPicker] = useState('0');
    const [etapaSeleccionada, setEtapaSeleccionada] = useState('0');

    /**
     * Effect: Determinación Automática de Etapa
     * 
     * Calcula y establece la etapa de vida correspondiente basándose
     * en la edad del bebé ingresada por el usuario.
     * Se ejecuta cada vez que cambia el valor de edad en formData.
     */
    useEffect(() => {
        if (formData.edad) {
            const edad = parseInt(formData.edad);
            if (edad < 4) setEtapaSeleccionada('Etapa 1');
            else if (edad < 7) setEtapaSeleccionada('Etapa 2');
            else if (edad < 10) setEtapaSeleccionada('Etapa 3');
            else if (edad < 13) setEtapaSeleccionada('Etapa 4');
            else setEtapaSeleccionada('Etapa 5');
        }
    }, [formData.edad]);

    /**
     * Niveles de Actividad Física
     * 
     * Define los diferentes niveles de actividad que puede tener el usuario.
     * Aunque actualmente no se usa en el flujo principal, se mantiene para
     * futuras implementaciones.
     * @constant {Array<Object>} activityLevels
     */
    const activityLevels = [
        {
            id: 'sedentario',
            title: 'Sedentario',
            description: 'Poco o ningún ejercicio, trabajo de escritorio',
            icon: ClipboardImage, // Usar la constante en lugar de require()
        },
        {
            id: 'ligero',
            title: 'Ligero',
            description: 'Ejercicio ligero 1-3 días por semana',
            icon: ClipboardImage,
        },
        {
            id: 'moderado',
            title: 'Moderado',
            description: 'Ejercicio moderado 3-5 días por semana',
            icon: ClipboardImage,
        },
        {
            id: 'activo',
            title: 'Muy Activo',
            description: 'Ejercicio intenso 6-7 días por semana',
            icon: ClipboardImage,
        },
        {
            id: 'extremo',
            title: 'Extremadamente Activo',
            description: 'Ejercicio muy intenso, trabajo físico o atleta',
            icon: ClipboardImage,
        },
    ];

    /**
     * Lista de Padecimientos
     * 
     * Catálogo de condiciones médicas disponibles para selección.
     * Actualmente no se utiliza en el flujo principal pero se mantiene
     * para posibles expansiones futuras del sistema.
     * @constant {Array<Object>} items
     */
    const items = [
        { id: 1, label: 'Padecimiento 1', image: ClipboardImage },
        { id: 2, label: 'Padecimiento 2', image: ClipboardImage },
        { id: 3, label: 'Padecimiento 3', image: ClipboardImage },
        { id: 4, label: 'Padecimiento 4', image: ClipboardImage },
        { id: 5, label: 'Padecimiento 5', image: ClipboardImage },
        { id: 6, label: 'Padecimiento 6', image: ClipboardImage },
        { id: 7, label: 'Padecimiento 7', image: ClipboardImage },
        { id: 8, label: 'Padecimiento 8', image: ClipboardImage },
        { id: 9, label: 'Padecimiento 9', image: ClipboardImage },
        { id: 10, label: 'Padecimiento 10', image: ClipboardImage },
    ];

    /**
     * Obtiene el Nombre del Padecimiento
     * 
     * Busca y retorna el nombre descriptivo de un padecimiento
     * basándose en su ID.
     * 
     * @param {number} id - ID del padecimiento a buscar
     * @returns {string} Nombre del padecimiento o 'No especificado'
     */
    const getPadecimientoName = (id) => {
        const padecimiento = items.find(item => item.id === id);
        return padecimiento ? padecimiento.label : 'No especificado';
    };

    /**
     * Obtiene el Texto del Nivel de Actividad
     * 
     * Retorna la descripción textual del nivel de actividad física
     * basándose en su identificador.
     * 
     * @param {string} nivel - ID del nivel de actividad
     * @returns {string} Descripción del nivel o 'No especificado'
     */
    const getNivelActividadText = (nivel) => {
        const actividad = activityLevels.find(item => item.id === nivel);
        return actividad ? actividad.title : 'No especificado';
    };

    /**
     * Formatea la Estatura
     * 
     * Convierte la estatura de centímetros a un formato legible
     * en metros y centímetros (e.g., "1.75 m").
     * 
     * @param {string|number} estaturaCm - Estatura en centímetros
     * @returns {string} Estatura formateada o 'No especificada'
     */
    const formatEstatura = (estaturaCm) => {
        if (!estaturaCm) return 'No especificada';
        const cm = parseInt(estaturaCm, 10);
        const metros = Math.floor(cm / 100);
        const centimetros = cm % 100;
        return `${metros}.${centimetros < 10 ? '0' + centimetros : centimetros} m`;
    };

    const renderGeneroView = () => (
        <View style={styles.genderContainer}>
            <Text style={styles.title}>¿Cuál es tu género?</Text>
            <Text style={styles.genderSubtitle}>
                Transformamos tu cuerpo y elevamos tu salud.
            </Text>

            <View style={styles.genderOptionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.genderOption,
                        formData.genero === 'Masculino' ? styles.genderOptionSelected : styles.genderOptionUnselected
                    ]}
                    onPress={() => setFormData((prev) => ({ ...prev, genero: 'Masculino' }))}
                >
                    <Text style={[
                        styles.genderSymbol,
                        formData.genero === 'Masculino' ? styles.genderTextSelected : styles.genderTextUnselected
                    ]}>♂</Text>
                    <Text style={[
                        styles.genderText,
                        formData.genero === 'Masculino' ? styles.genderTextSelected : styles.genderTextUnselected
                    ]}>Hombre</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.genderOption,
                        formData.genero === 'Femenino' ? styles.genderOptionSelected : styles.genderOptionUnselected
                    ]}
                    onPress={() => setFormData((prev) => ({ ...prev, genero: 'Femenino' }))}
                >
                    <Text style={[
                        styles.genderSymbol,
                        formData.genero === 'Femenino' ? styles.genderTextSelected : styles.genderTextUnselected
                    ]}>♀</Text>
                    <Text style={[
                        styles.genderText,
                        formData.genero === 'Femenino' ? styles.genderTextSelected : styles.genderTextUnselected
                    ]}>Mujer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    /**
     * Renderiza Vista de Selección de Edad
     * 
     * Muestra las diferentes etapas de vida disponibles para que el usuario
     * seleccione la etapa correspondiente a la edad del bebé.
     * 
     * @returns {React.ReactElement} Componente de selección de etapa
     */
    const renderEdadView = () => {
        /**
         * Maneja el cambio de etapa seleccionada
         * 
         * Actualiza la etapa y establece la edad media correspondiente
         * en el estado del formulario.
         * 
         * @param {string} etapaId - ID de la etapa seleccionada
         */
        const cambiarEtapa = (etapaId) => {
            setEtapaSeleccionada(etapaId);

            // Encontrar la etapa seleccionada
            const etapa = etapasVida.find(e => e.id === etapaId);

            // Actualizar formData con la edad media representativa de esa etapa
            setFormData(prev => ({
                ...prev,
                edad: etapa.edadMedia.toString()
            }));
        };

        return (
            <View style={styles.etapasContainer}>
                <Text style={styles.title}>¿Cuál es su etapa de vida?</Text>

                <View style={styles.etapasOptionsContainer}>
                    {etapasVida.map(etapa => (
                        <TouchableOpacity
                            key={etapa.id}
                            style={[
                                styles.etapaOption,
                                etapaSeleccionada === etapa.id ? styles.etapaOptionSelected : styles.etapaOptionUnselected
                            ]}
                            onPress={() => cambiarEtapa(etapa.id)}
                        >
                            <View style={styles.etapaContent}>
                                <Text
                                    style={[
                                        styles.etapaTitulo,
                                        etapaSeleccionada === etapa.id ? styles.etapaTextSelected : styles.etapaTextUnselected
                                    ]}
                                >
                                    {etapa.titulo}
                                </Text>
                                <Text
                                    style={[
                                        styles.etapaRango,
                                        etapaSeleccionada === etapa.id ? styles.etapaTextSelected : styles.etapaTextUnselected
                                    ]}
                                >
                                    {etapa.rango}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.radioCircle,
                                    etapaSeleccionada === etapa.id && styles.radioSelected,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    /**
     * Renderiza Vista de Ingreso de Peso
     * 
     * Muestra un campo de entrada numérico para que el usuario
     * introduzca el peso del bebé en kilogramos.
     * 
     * @returns {React.ReactElement} Componente de entrada de peso
     */
    const renderPesoView = () => (
        <>
            <Text style={styles.title}>¿Cuál es tu peso (kg)?</Text>
            <Image
                source={BasculaImage}
                style={{ height: 199, width: '50%', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 }}
            />
            <View style={styles.weightInputContainer}>
                <TextInput
                    style={styles.weightInput}
                    placeholder="0 0 0"
                    placeholderTextColor="#f2f2f2"
                    keyboardType="numeric"
                    value={formData.peso}
                    onChangeText={(value) => setFormData((prev) => ({ ...prev, peso: value }))}
                />
                <Text style={styles.weightUnit}>kg</Text>
            </View>
        </>
    );

    /**
     * Renderiza Vista de Selección de Estatura
     * 
     * Proporciona dos selectores (pickers) para que el usuario elija
     * la estatura del bebé en metros y centímetros.
     * La vista muestra la estatura seleccionada en formato legible.
     * 
     * @returns {React.ReactElement} Componente de selección de estatura
     */
    const renderEstaturaView = () => {
        /** Opciones para el selector de metros (0-2) */
        const optionsPicker1 = Array.from({ length: 3 }, (_, i) => i.toString());
        /** Opciones para el selector de centímetros (0-99) */
        const optionsPicker2 = Array.from({ length: 100 }, (_, i) => i.toString());

        // Obtener la altura actual para mostrarla visualmente
        const metros = parseInt(selectedFirstPicker, 10);
        const centimetros = parseInt(selectedSecondPicker, 10);
        const estaturaTotal = (metros * 100 + centimetros);

        /**
         * Actualiza el valor de estatura en el estado
         * 
         * Calcula la estatura total en centímetros a partir de los valores
         * seleccionados en los pickers de metros y centímetros.
         * 
         * @param {string} picker1Value - Valor del selector de metros
         * @param {string} picker2Value - Valor del selector de centímetros
         */
        const updateEstatura = (picker1Value, picker2Value) => {
            console.log("Valores seleccionados:", picker1Value, picker2Value);

            const metros = parseInt(picker1Value, 10);
            const centimetros = parseInt(picker2Value, 10);
            const totalEstatura = metros * 100 + centimetros;

            console.log("Estatura calculada:", totalEstatura);

            setFormData((prev) => ({ ...prev, estatura: totalEstatura.toString() }));
        };

        return (
            <View style={styles.estaturaContainer}>
                <Text style={styles.title}>¿Cuál es tu estatura (cm)?</Text>

                {/* Mostrar la estatura actual */}
                <Text style={styles.estaturaDisplay}>
                    {`${metros}.${centimetros < 10 ? '0' + centimetros : centimetros} m`}
                </Text>

                {/* Pickers actuales con estilo mejorado */}
                <View style={styles.InputContainer}>
                    <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Metros</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedFirstPicker}
                            onValueChange={(itemValue) => {
                                setSelectedFirstPicker(itemValue);
                                updateEstatura(itemValue, selectedSecondPicker);
                            }}
                        >
                            {optionsPicker1.map((value) => (
                                <Picker.Item key={value} label={`${value} m`} value={value} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Centímetros</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedSecondPicker}
                            onValueChange={(itemValue) => {
                                setSelectedSecondPicker(itemValue);
                                updateEstatura(selectedFirstPicker, itemValue);
                            }}
                        >
                            {optionsPicker2.map((value) => (
                                <Picker.Item key={value} label={`${value} cm`} value={value} />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>
        );
    };

    /**
     * Renderiza Vista de Selección de Patología
     * 
     * Muestra una lista de padecimientos disponibles para selección.
     * NOTA: Esta vista se mantiene en el código pero actualmente no se utiliza
     * en el flujo principal de la aplicación.
     * 
     * @deprecated Actualmente no está en uso en el flujo principal
     * @returns {React.ReactElement} Componente de selección de patología
     */
    const renderPatologiaView = () => (
        <View style={[styles.containerPatologias]}>
            <Text style={styles.title}>
                Seleccione su Padecimiento
            </Text>
            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <Pressable
                        key={item.id}
                        onPress={() => setFormData((prev) => ({ ...prev, padecimiento: item.id }))}
                        style={[
                            styles.pressable,
                            formData.padecimiento === item.id && { backgroundColor: '#ABA9D9' },
                        ]}
                    >
                        <Image source={item.image} style={styles.image} />
                        <Text
                            style={[
                                styles.itemText,
                                formData.padecimiento === item.id && { color: '#FFFFFF' }
                            ]}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.flatListContent}
                style={styles.flatList}
            />
        </View>
    );

    /**
     * Renderiza Vista de Selección de Nivel de Actividad
     * 
     * Permite al usuario seleccionar su nivel de actividad física diaria.
     * NOTA: Esta vista se mantiene en el código pero actualmente no se utiliza
     * en el flujo principal de la aplicación.
     * 
     * @deprecated Actualmente no está en uso en el flujo principal
     * @returns {React.ReactElement} Componente de selección de nivel de actividad
     */
    const renderActividadView = () => (
        <View style={styles.containerActividad}>
            <Text style={styles.title}>¿Cuál es tu nivel de actividad física?</Text>

            <View style={styles.activityOptionsContainer}>
                {activityLevels.map((activity) => (
                    <TouchableOpacity
                        key={activity.id}
                        style={[
                            styles.activityOption,
                            formData.nivelActividad === activity.id && styles.activitySelected,
                        ]}
                        onPress={() => setFormData((prev) => ({ ...prev, nivelActividad: activity.id }))}
                    >
                        <Image source={activity.icon} style={styles.activityIcon} />
                        <View style={styles.activityTextContainer}>
                            <Text style={[
                                styles.activityTitle,
                                formData.nivelActividad === activity.id && styles.textSelected
                            ]}>
                                {activity.title}
                            </Text>
                            <Text style={[
                                styles.activityDescription,
                                formData.nivelActividad === activity.id && styles.textSelected
                            ]}>
                                {activity.description}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.radioCircle,
                                formData.nivelActividad === activity.id && styles.radioSelected,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    /**
     * Renderiza Vista de Resumen de Datos
     * 
     * Muestra un resumen completo de todos los datos personales y físicos
     * capturados durante el proceso de registro. Permite al usuario revisar
     * y editar la información antes de guardarla.
     * 
     * @returns {React.ReactElement} Componente de resumen y confirmación
     */
    const renderResumenView = () => {
        /** Combina datos personales y físicos en un solo objeto */
        const allData = {
            ...personalData, // Datos personales
            ...formData,     // Datos físicos
        };

        return (
            <SafeAreaProvider style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"/>
                <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
                    <Text style={styles.title}>Resumen de tus datos</Text>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Datos Personales</Text>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Nombre:</Text>
                            <Text style={styles.dataValue}>{allData.firstName || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Apellido:</Text>
                            <Text style={styles.dataValue}>{allData.lastName || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Email:</Text>
                            <Text style={styles.dataValue}>{allData.email || 'No especificado'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Teléfono:</Text>
                            <Text style={styles.dataValue}>{allData.phone || 'No especificado'}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Datos Físicos</Text>

                        <View style={styles.iconDataRow}>
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Género:</Text>
                                <Text style={styles.dataValue}>{allData.genero || 'No especificado'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Edad:</Text>
                                <Text style={styles.dataValue}>{allData.edad ? `${allData.edad} meses` : 'No especificada'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Peso:</Text>
                                <Text style={styles.dataValue}>{allData.peso ? `${allData.peso} kg` : 'No especificado'}</Text>
                            </View>
                        </View>

                        <View style={styles.iconDataRow}>
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Estatura:</Text>
                                <Text style={styles.dataValue}>{formatEstatura(allData.estatura)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Estas secciones se mantienen pero con valores por defecto
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Información Médica</Text>
                        <View style={styles.iconDataRow}>
                            <Image source={ClipboardImage} style={styles.smallIcon} />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Padecimiento:</Text>
                                <Text style={styles.dataValue}>No especificado</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Actividad Física</Text>
                        <View style={styles.iconDataRow}>
                            <Image
                                source={ClipboardImage}
                                style={styles.smallIcon}
                            />
                            <View style={styles.dataRowFlex}>
                                <Text style={styles.dataLabel}>Nivel:</Text>
                                <Text style={styles.dataValue}>No especificado</Text>
                            </View>
                        </View>
                    </View>
                    */}

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.editButton}
                            onPress={() => setCurrentView('Genero')}
                        >
                            <Text style={styles.editButtonText}>Editar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        );
    };

    /**
     * Maneja la Navegación entre Vistas
     * 
     * Controla el flujo de navegación entre las diferentes vistas del formulario,
     * validando los datos ingresados antes de avanzar a la siguiente vista.
     * El flujo actual es: Género → Edad → Peso → Estatura → Resumen
     * 
     * @function
     */
    const handleNext = () => {
        switch (currentView) {
            case 'Genero':
                if (!formData.genero) {
                    alert('Por favor, selecciona un género antes de continuar.');
                } else {
                    setCurrentView('Edad');
                }
                break;
            case 'Edad':
                if (!formData.edad) {
                    alert('Por favor, indica tu edad antes de continuar.');
                } else {
                    setCurrentView('Peso');
                }
                break;
            case 'Peso':
                if (!formData.peso) {
                    alert('Por favor, indica tu peso antes de continuar.');
                } else {
                    setCurrentView('Estatura');
                }
                break;
            case 'Estatura':
                if (!formData.estatura) {
                    alert('Por favor, indica tu estatura antes de continuar.');
                } else {
                    // Avanzar al resumen, omitiendo las vistas de Patología y Actividad
                    setCurrentView('Resumen');

                    // Establecer valores por defecto para los campos opcionales omitidos
                    setFormData(prev => ({
                        ...prev,
                        padecimiento: '',
                        nivelActividad: null
                    }));
                }
                break;
            case 'Patologia': // Mantenemos esta lógica por si en el futuro se vuelve a habilitar
                if (!formData.padecimiento) {
                    alert('Por favor, selecciona una patología antes de continuar.');
                } else {
                    setCurrentView('Actividad');
                }
                break;
            case 'Actividad': // Mantenemos esta lógica por si en el futuro se vuelve a habilitar
                if (!formData.nivelActividad) {
                    alert('Por favor, selecciona un nivel de actividad antes de continuar.');
                } else {
                    setCurrentView('Resumen');
                }
                break;
            case 'Resumen':
                handleSaveData();
                break;
        }
    };

    /**
     * Guarda los Datos en Firestore
     * 
     * Combina los datos personales y físicos del usuario y los guarda
     * en la base de datos de Firestore. Tras guardar exitosamente,
     * navega a la pantalla principal (Home).
     * 
     * @async
     * @function
     */
    const handleSaveData = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                /** Combina datos personales y físicos del usuario */
                const userData = {
                    ...personalData,
                    ...formData,
                };

                console.log("Datos a guardar:", userData);

                /** Guarda todos los datos en la colección 'users' de Firestore */
                await setDoc(doc(db, 'users', user.uid), userData);

                console.log('Datos guardados correctamente en Firestore.');
                navigation.navigate('Home');
            } catch (error) {
                console.log('Error al guardar los datos:', error);
                alert('No se pudieron guardar los datos. Inténtalo de nuevo.');
            }
        } else {
            alert('No se encontró un usuario autenticado.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                    {currentView === 'Genero' && renderGeneroView()}
                    {currentView === 'Edad' && renderEdadView()}
                    {currentView === 'Peso' && renderPesoView()}
                    {currentView === 'Estatura' && renderEstaturaView()}
                    {/* Mantenemos las referencias a las vistas deshabilitadas, pero nunca se mostrarán en el flujo actual */}
                    {currentView === 'Patologia' && renderPatologiaView()}
                    {currentView === 'Actividad' && renderActividadView()}
                    {currentView === 'Resumen' && renderResumenView()}

                    {currentView !== 'Resumen' && (
                        <Pressable
                            style={[styles.registerButton, currentView === 'Genero' && styles.nextButton]}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>
                                {currentView === 'Actividad' ? 'Ver Resumen' : 'Siguiente'}
                            </Text>
                        </Pressable>
                    )}

                    {currentView === 'Resumen' && (
                        <Pressable
                            style={styles.registerButton}
                            onPress={handleSaveData}
                        >
                            <Text style={styles.buttonText}>Finalizar</Text>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#888888',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#888888',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        fontSize: 18,
        marginBottom: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButton: {
        alignItems: 'center',
        marginHorizontal: 16,
    },
    radioImage: {
        width: 150,
        height: 400,
        marginBottom: 40,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        backgroundColor: '#4630EB',
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#7469B6',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#7469B6',
        borderRadius: 8,
        marginTop: 'auto',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    slider: {
        width: '100%',
        height: 10,
        marginBottom: 20,
    },
    weightInputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#EBEBFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    weightInput: {
        width: '80%',
        height: 60,
        textAlign: 'center',
        backgroundColor: '#ABA9D9',
        borderColor: '#ABA9D9',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    weightUnit: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#888888',
        marginLeft: 20,
    },
    InputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
    },
    containerPatologias: {
        marginTop: StatusBar.currentHeight || 0,
        flex: 1,
    },
    flatList: {
        flexGrow: 0,
        height: 'auto',
    },
    flatListContent: {
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    pressable: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },

    // Estilos para la vista de Actividad
    containerActividad: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    activityOptionsContainer: {
        width: '100%',
    },
    activityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    activitySelected: {
        backgroundColor: '#ABA9D9',
    },
    activityIcon: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    activityTextContainer: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
        marginBottom: 4,
    },
    activityDescription: {
        fontSize: 14,
        color: '#888888',
    },
    textSelected: {
        color: '#FFFFFF',
    },

    // Estilos para la vista de Resumen
    scrollContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#EBEBFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7469B6',
        marginBottom: 16,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    iconDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
    },
    dataRowFlex: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 12,
    },
    dataLabel: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    dataValue: {
        fontSize: 16,
        color: '#444444',
        fontWeight: 'bold',
    },
    smallIcon: {
        width: 30,
        height: 30,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    editButton: {
        backgroundColor: '#EBEBFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#7469B6',
    },
    editButtonText: {
        color: '#7469B6',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Nuevos estilos para el UI actualizado del género
    genderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    genderSubtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 30,
    },
    genderOptionsContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        gap: 16,
    },
    genderOption: {
        width: '100%',
        height: 110,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    genderOptionSelected: {
        backgroundColor: '#7469B6', // Color principal para seleccionado
    },
    genderOptionUnselected: {
        backgroundColor: '#F2F2F2', // Gris claro para no seleccionado
    },
    genderSymbol: {
        fontSize: 48,
        marginRight: 12,
    },
    genderText: {
        fontSize: 24,
        fontWeight: '600',
    },
    genderTextSelected: {
        color: 'white',
    },
    genderTextUnselected: {
        color: '#666666',
    },

    // Estilos para el nuevo componente de etapas de vida
    etapasContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    etapasSubtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 30,
    },
    etapasOptionsContainer: {
        width: '100%',
        marginTop: 20,
    },
    etapaOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    etapaOptionSelected: {
        backgroundColor: '#7469B6',
    },
    etapaOptionUnselected: {
        backgroundColor: '#F2F2F2',
    },
    etapaContent: {
        flex: 1,
    },
    etapaTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    etapaRango: {
        fontSize: 14,
    },
    etapaTextSelected: {
        color: 'white',
    },
    etapaTextUnselected: {
        color: '#666666',
    },

    estaturaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    estaturaDisplay: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#7469B6',
        marginVertical: 30,
        textAlign: 'center',
    },
    pickerColumn: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
    picker: {
        flex: 1,
        height: 200,
        marginHorizontal: 5,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        padding: 10,
    },
});

export default DatosFisicosScreen;