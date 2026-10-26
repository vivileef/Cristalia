import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { fuentes } from '../theme/tipografia';
import { CREDENCIALES_DEMO } from '../constants/credencialesDemo';
import { validarLogin } from '../utils/validarLogin';

export default function LoginScreen({ onLogin }) {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [mensajeError, setMensajeError] = useState(null);

    const limpiarError = () => {
        if (mensajeError) setMensajeError(null);
    };

    const iniciarSesion = () => {
        const resultado = validarLogin(correo, clave);
        if (!resultado.valido) {
            setMensajeError(resultado.mensaje);
            return;
        }
        setMensajeError(null);
        onLogin();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoWrap}>
                    <Text style={styles.logo}>C</Text>
                </View>
                <Text style={styles.titulo}>Cristalia</Text>
                <Text style={styles.subtitulo}>
                    Gestión de cotizaciones y trabajos para talleres de vidrio templado
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.etiqueta}>Correo electrónico</Text>
                <TextInput
                    style={[styles.input, mensajeError && !correo.trim() && styles.inputError]}
                    value={correo}
                    onChangeText={(texto) => {
                        setCorreo(texto);
                        limpiarError();
                    }}
                    placeholder="usuario@correo.com"
                    placeholderTextColor={colores.textoSuave}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    onSubmitEditing={iniciarSesion}
                />

                <Text style={styles.etiqueta}>Contraseña</Text>
                <TextInput
                    style={[styles.input, mensajeError && !clave.trim() && styles.inputError]}
                    value={clave}
                    onChangeText={(texto) => {
                        setClave(texto);
                        limpiarError();
                    }}
                    placeholder="Tu contraseña"
                    placeholderTextColor={colores.textoSuave}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    onSubmitEditing={iniciarSesion}
                />

                {mensajeError ? (
                    <View style={styles.cajaError} accessibilityRole="alert">
                        <Text style={styles.textoError}>{mensajeError}</Text>
                    </View>
                ) : null}

                <Pressable style={estilosComunes.botonPrimario} onPress={iniciarSesion}>
                    <Text style={estilosComunes.textoBotonPrimario}>Iniciar sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
        backgroundColor: colores.fondo,
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
        gap: 8,
    },
    logoWrap: {
        backgroundColor: colores.primarioClaro,
        borderRadius: 50,
        padding: 16,
        marginBottom: 4,
    },
    logo: {
        fontFamily: fuentes.bold,
        fontSize: 40,
        color: colores.marca,
    },
    titulo: {
        fontFamily: fuentes.bold,
        fontSize: 26,
        color: colores.texto,
        textAlign: 'center',
    },
    subtitulo: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 320,
    },
    form: {
        width: '100%',
        maxWidth: 360,
        alignSelf: 'center',
        gap: 8,
    },
    etiqueta: {
        fontFamily: fuentes.semibold,
        fontSize: 13,
        color: colores.texto,
        marginTop: 4,
    },
    input: {
        fontFamily: fuentes.regular,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: colores.tarjeta,
        fontSize: 16,
        color: colores.texto,
    },
    inputError: {
        borderColor: '#c53030',
    },
    cajaError: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    textoError: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: '#991b1b',
        lineHeight: 20,
    },
    ayudaDemo: {
        fontFamily: fuentes.regular,
        fontSize: 12,
        color: colores.textoSuave,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 18,
    },
});
