import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { mostrarAviso } from './feedback';

async function permisoCamaraConcedido() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') return true;
    mostrarAviso('Permiso necesario', 'Activa el acceso a la cámara en ajustes del dispositivo.');
    return false;
}

async function permisoGaleriaConcedido() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') return true;
    mostrarAviso('Permiso necesario', 'Activa el acceso a fotos para elegir una imagen.');
    return false;
}

function uriDesdeResultado(result) {
    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
}

export async function abrirGaleria() {
    if (!(await permisoGaleriaConcedido())) return null;
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
    });
    return uriDesdeResultado(result);
}

export async function abrirCamara() {
    if (!(await permisoCamaraConcedido())) return null;
    if (Platform.OS === 'android') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
    });
    return uriDesdeResultado(result);
}
