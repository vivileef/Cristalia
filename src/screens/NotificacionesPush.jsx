/**
 * Pantalla de práctica — push Expo (individual + grupal).
 * Requisitos: permisos, token enmascarado, notificación local, listeners.
 */
import { useEffect, useState } from 'react';
import { Alert, Platform, Text, View, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import Boton from '../components/Boton';
import { CabeceraMarca, CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { colores } from '../theme/colores';
import { fuentes } from '../theme/tipografia';
import { asegurarCanalAndroid } from '../utils/notificaciones';

function enmascararToken(token) {
    if (!token || token.length < 24) return token || '';
    return `${token.slice(0, 20)}…${token.slice(-8)}`;
}

export default function NotificacionesPush({ onVolver, enMenu = false }) {
    const [token, setToken] = useState('');
    const [ultimoAviso, setUltimoAviso] = useState('Sin notificaciones');
    const [estado, setEstado] = useState('Pendiente');

    useEffect(() => {
        const recibida = Notifications.addNotificationReceivedListener((n) => {
            setUltimoAviso(n.request.content.title || 'Notificación recibida');
        });
        const pulsada = Notifications.addNotificationResponseReceivedListener((r) => {
            console.log('Datos al pulsar:', r.notification.request.content.data);
        });
        return () => {
            recibida.remove();
            pulsada.remove();
        };
    }, []);

    async function registrarDispositivo() {
        try {
            await asegurarCanalAndroid();
            if (!Device.isDevice) {
                setEstado('La prueba push requiere un dispositivo físico');
                return;
            }
            const actual = await Notifications.getPermissionsAsync();
            let concedido = actual.granted;
            if (!concedido) {
                const nuevo = await Notifications.requestPermissionsAsync();
                concedido = nuevo.granted;
            }
            if (!concedido) {
                setEstado('Permiso denegado; revisar ajustes del teléfono');
                return;
            }
            const projectId =
                Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Falta extra.eas.projectId (ejecuta eas init y fusiona app.config.js)');
            }
            const resultado = await Notifications.getExpoPushTokenAsync({ projectId });
            const completo = resultado.data;
            console.log('Expo Push Token (solo pruebas, no publicar):', completo);
            setToken(enmascararToken(completo));
            setEstado('Token obtenido correctamente');
        } catch (e) {
            setEstado(`Error: ${e.message}`);
            Alert.alert('Registro fallido', e.message);
        }
    }

    async function probarNotificacionLocal() {
        try {
            await asegurarCanalAndroid();
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Solicitud registrada',
                    body: 'Tu solicitud fue registrada correctamente.',
                    data: { pantalla: 'solicitudes', tipo: 'registro' },
                },
                trigger: null,
            });
        } catch (e) {
            Alert.alert('Error local', e.message);
        }
    }

    const Cabecera = enMenu ? CabeceraMarca : CabeceraVolver;
    const propsCabecera = enMenu
        ? {
              titulo: 'Notificaciones push',
              subtitulo: 'Permisos, token Expo y prueba local. Push remota requiere EAS + FCM en Android.',
          }
        : {
              titulo: 'Notificaciones push',
              subtitulo: 'Registra el dispositivo para push remota. La prueba local no reemplaza Expo Push Service.',
              onVolver,
          };

    return (
        <View style={styles.pantalla}>
            <Cabecera {...propsCabecera} />
            <ContenedorScroll contentStyle={styles.contenido}>
                <Text style={styles.intro}>
                    getPermissionsAsync revisa el estado; requestPermissionsAsync pide acceso; getExpoPushTokenAsync
                    obtiene el destino en Expo Push Service.
                </Text>

                <Boton texto="Solicitar permisos y obtener token" onPress={registrarDispositivo} />
                <Text style={styles.estado}>Estado: {estado}</Text>
                <Text style={styles.etiqueta}>Expo Push Token (parcial):</Text>
                <Text selectable style={styles.token}>
                    {token || 'Aún no disponible'}
                </Text>
                <Text style={styles.notaToken}>
                    Copia el token completo desde la consola de Metro al registrar. No lo subas a Git ni a evidencias
                    con el valor completo.
                </Text>

                <Boton texto="Probar notificación local" variante="secundario" onPress={probarNotificacionLocal} />
                <Text style={styles.ultimo}>Último aviso: {ultimoAviso}</Text>

                {Platform.OS === 'android' ? (
                    <Text style={styles.avisoBuild}>
                        Push remota en Android: development build (expo-dev-client), google-services.json, credencial
                        FCM V1 en eas credentials, luego https://expo.dev/notifications
                    </Text>
                ) : null}
            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    contenido: { gap: 14 },
    intro: {
        fontFamily: fuentes.regular,
        fontSize: 13,
        color: colores.textoSuave,
        lineHeight: 19,
    },
    estado: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.texto,
    },
    etiqueta: {
        fontFamily: fuentes.semibold,
        fontSize: 13,
        color: colores.textoSuave,
    },
    token: {
        fontSize: 13,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        color: colores.primarioOscuro,
        backgroundColor: colores.primarioClaro,
        padding: 10,
        borderRadius: 8,
    },
    notaToken: {
        fontFamily: fuentes.regular,
        fontSize: 12,
        color: colores.textoSuave,
        lineHeight: 18,
    },
    ultimo: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.texto,
    },
    avisoBuild: {
        fontFamily: fuentes.regular,
        fontSize: 12,
        color: colores.advertencia,
        lineHeight: 18,
    },
});
