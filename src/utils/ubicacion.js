import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { mostrarAviso } from './feedback';

export async function solicitarPermisoUbicacion() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') return true;
    mostrarAviso(
        'Permiso de ubicación',
        'Activa la ubicación para registrar el sitio del trabajo en las solicitudes.'
    );
    return false;
}

export async function obtenerUbicacionActual() {
    if (!(await solicitarPermisoUbicacion())) return null;

    const serviciosActivos = await Location.hasServicesEnabledAsync();
    if (!serviciosActivos) {
        mostrarAviso('GPS desactivado', 'Enciende la ubicación en los ajustes del dispositivo.');
        return null;
    }

    try {
        const posicion = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        return {
            latitude: posicion.coords.latitude,
            longitude: posicion.coords.longitude,
            accuracy: posicion.coords.accuracy ?? null,
            altitude: posicion.coords.altitude ?? null,
            timestamp: posicion.timestamp,
        };
    } catch {
        mostrarAviso('Ubicación', 'No se pudo leer la posición. Intenta de nuevo al aire libre.');
        return null;
    }
}

export function formatearCoordenadas(ubicacion) {
    if (!ubicacion || typeof ubicacion.latitude !== 'number') return 'Sin coordenadas';
    const lat = ubicacion.latitude.toFixed(6);
    const lng = ubicacion.longitude.toFixed(6);
    return `${lat}°, ${lng}°`;
}

export function formatearPrecision(ubicacion) {
    if (!ubicacion?.accuracy) return 'Precisión no disponible';
    return `± ${Math.round(ubicacion.accuracy)} m`;
}

export async function abrirEnMapa(ubicacion) {
    if (!ubicacion) return;
    const { latitude, longitude } = ubicacion;
    const url =
        Platform.OS === 'ios'
            ? `maps:0,0?q=${latitude},${longitude}`
            : `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    const puede = await Linking.canOpenURL(url);
    if (puede) {
        await Linking.openURL(url);
        return;
    }
    await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
}
