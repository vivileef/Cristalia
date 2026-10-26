import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export function configurarManejadorNotificaciones() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

export async function asegurarCanalAndroid() {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync('default', {
        name: 'Avisos de solicitudes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
    });
}

/** Notificación local tras confirmar guardado exitoso (integración grupal). */
export async function notificarSolicitudRegistrada(cliente) {
    await asegurarCanalAndroid();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const pedido = await Notifications.requestPermissionsAsync();
        if (!pedido.granted) {
            return;
        }
    }

    const cuerpo = cliente
        ? `Cotización guardada para ${cliente}.`
        : 'Tu solicitud se guardó correctamente.';
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Solicitud registrada',
            body: cuerpo,
            data: { tipo: 'solicitud_creada', pantalla: 'solicitudes' },
        },
        trigger: null,
    });
}
