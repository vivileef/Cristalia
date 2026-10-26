import { Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '../theme/colores';
import { fuentes } from '../theme/tipografia';

export default function Boton({ texto, onPress, variante = 'primario', deshabilitado = false, style }) {
    const esPrimario = variante === 'primario';
    return (
        <Pressable
            onPress={onPress}
            disabled={deshabilitado}
            style={[
                styles.base,
                esPrimario ? styles.primario : styles.secundario,
                deshabilitado && styles.deshabilitado,
                style,
            ]}
        >
            <Text style={[styles.texto, esPrimario ? styles.textoClaro : styles.textoOscuro]}>{texto}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minHeight: 48,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    primario: {
        backgroundColor: colores.marca,
    },
    secundario: {
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.marca,
    },
    deshabilitado: { opacity: 0.5 },
    texto: {
        fontFamily: fuentes.semibold,
        fontSize: 15,
    },
    textoClaro: { color: '#ffffff' },
    textoOscuro: { color: colores.primarioOscuro },
});
