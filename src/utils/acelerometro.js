import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const INTERVALO_MS = 200;
const GRAVEDAD = 9.80665;

export { INTERVALO_MS };

export function esPlataformaWeb() {
    return Platform.OS === 'web';
}

export async function comprobarAcelerometroDisponible() {
    if (Platform.OS === 'web') {
        return sensorMotionDisponibleEnWeb();
    }
    try {
        return await Accelerometer.isAvailableAsync();
    } catch {
        return false;
    }
}

function sensorMotionDisponibleEnWeb() {
    if (typeof window === 'undefined') return false;
    return typeof DeviceMotionEvent !== 'undefined' || typeof DeviceOrientationEvent !== 'undefined';
}

export async function solicitarPermisoAcelerometro() {
    if (Platform.OS === 'web') {
        return solicitarPermisoMotionWeb();
    }
    const { status } = await Accelerometer.requestPermissionsAsync();
    return status === 'granted';
}

async function solicitarPermisoMotionWeb() {
    try {
        const { status } = await Accelerometer.requestPermissionsAsync();
        if (status === 'granted') return true;
    } catch {
        /* usar API del navegador abajo */
    }

    const pedir =
        typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission
            ? DeviceMotionEvent.requestPermission.bind(DeviceMotionEvent)
            : typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission
              ? DeviceOrientationEvent.requestPermission.bind(DeviceOrientationEvent)
              : null;

    if (!pedir) {
        return !esIosWeb() || sensorMotionDisponibleEnWeb();
    }

    try {
        const resultado = await pedir();
        return resultado === 'granted';
    } catch {
        return false;
    }
}

function esIosWeb() {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export async function obtenerEstadoPermisoAcelerometro() {
    try {
        const { status } = await Accelerometer.getPermissionsAsync();
        return status;
    } catch {
        return 'undetermined';
    }
}

export async function suscribirAcelerometro(onMedicion) {
    if (Platform.OS === 'web') {
        return suscribirDeviceMotionWeb(onMedicion);
    }

    Accelerometer.setUpdateInterval(INTERVALO_MS);
    return Accelerometer.addListener(onMedicion);
}

function suscribirDeviceMotionWeb(onMedicion) {
    if (typeof window === 'undefined') {
        throw new Error('WEB_NO_WINDOW');
    }

    let activo = true;
    let recibido = false;

    const handler = (evento) => {
        const acc = evento.accelerationIncludingGravity ?? evento.acceleration;
        if (acc && acc.x != null && acc.y != null && acc.z != null) {
            recibido = true;
            onMedicion({
                x: acc.x / GRAVEDAD,
                y: acc.y / GRAVEDAD,
                z: acc.z / GRAVEDAD,
                timestamp: evento.timeStamp / 1000,
            });
            return;
        }

        if (evento instanceof DeviceOrientationEvent) {
            const scalar = Math.PI / 180;
            const { alpha, beta, gamma } = evento;
            if (alpha == null || beta == null || gamma == null) return;
            recibido = true;
            onMedicion({
                x: (gamma ?? 0) * scalar,
                y: (beta ?? 0) * scalar,
                z: (alpha ?? 0) * scalar,
                timestamp: evento.timeStamp / 1000,
            });
        }
    };

    window.addEventListener('devicemotion', handler, { passive: true });
    window.addEventListener('deviceorientation', handler, { passive: true });

    const avisoSinDatos = setTimeout(() => {
        if (activo && !recibido && typeof window !== 'undefined' && window.location?.protocol !== 'https:') {
            onMedicion({
                x: 0,
                y: 0,
                z: 0,
                timestamp: Date.now() / 1000,
                _avisoWeb: 'sin_sensor',
            });
        }
    }, 1500);

    return {
        remove() {
            activo = false;
            clearTimeout(avisoSinDatos);
            window.removeEventListener('devicemotion', handler);
            window.removeEventListener('deviceorientation', handler);
        },
    };
}

export function mensajeAcelerometroWeb() {
    if (typeof window !== 'undefined' && window.location?.protocol !== 'https:') {
        return 'En web el sensor suele requerir HTTPS. Usa la app en Expo Go en tu celular.';
    }
    if (esIosWeb()) {
        return 'En iPhone: acepta el permiso de movimiento o activa Ajustes > Safari > Acceso a movimiento y orientación.';
    }
    return 'En PC muchos navegadores no tienen acelerómetro. Prueba en un celular con Expo Go.';
}
