import { Alert, Platform } from 'react-native';

export function mostrarAviso(titulo, mensaje) {
    const texto = mensaje ? `${titulo}\n${mensaje}` : titulo;
    if (Platform.OS === 'web') {
        window.alert(texto);
        return;
    }
    Alert.alert(titulo, mensaje);
}

export function confirmarAccion(titulo, mensaje, alConfirmar) {
    if (Platform.OS === 'web') {
        if (window.confirm(`${titulo}\n${mensaje}`)) alConfirmar();
        return;
    }
    Alert.alert(titulo, mensaje, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceptar', onPress: alConfirmar },
    ]);
}
