import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_TRABAJOS = '@cristalia/trabajos';
const CLAVE_SESION = '@cristalia/sesion';

export async function restaurarDatosApp() {
    try {
        const [rawTrabajos, rawSesion] = await Promise.all([
            AsyncStorage.getItem(CLAVE_TRABAJOS),
            AsyncStorage.getItem(CLAVE_SESION),
        ]);

        let trabajos = null;
        if (rawTrabajos) {
            const parsed = JSON.parse(rawTrabajos);
            if (Array.isArray(parsed)) trabajos = parsed;
        }

        const sesionActiva = rawSesion === '1';

        return { trabajos, sesionActiva };
    } catch {
        return { trabajos: null, sesionActiva: false };
    }
}

export async function persistirTrabajos(trabajos) {
    try {
        await AsyncStorage.setItem(CLAVE_TRABAJOS, JSON.stringify(trabajos ?? []));
    } catch {
        // Sin backend: fallo silencioso; los datos siguen en memoria.
    }
}

export async function persistirSesion(activa) {
    try {
        if (activa) {
            await AsyncStorage.setItem(CLAVE_SESION, '1');
        } else {
            await AsyncStorage.removeItem(CLAVE_SESION);
        }
    } catch {
        // ignore
    }
}
