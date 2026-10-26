import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconoFigma } from './iconoFigma';
import { iconosFigma, iconosNav } from '../constants/iconosFigma';
import { colores } from '../theme/colores';
import { fuentes } from '../theme/tipografia';

export function CabeceraMarca({ titulo, subtitulo }) {
    return (
        <View style={styles.wrap}>
            <View style={styles.contexto}>
                <IconoFigma source={iconosFigma.panelsTopLeft} size={19} />
                <Text style={styles.marca}>CRISTALIA</Text>
            </View>
            <Text style={styles.titulo}>{titulo}</Text>
            {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
        </View>
    );
}

export function CabeceraVolver({ titulo, subtitulo, onVolver }) {
    return (
        <View style={styles.wrap}>
            <Pressable style={styles.contexto} onPress={onVolver} accessibilityRole="button">
                <Ionicons name={iconosNav.volver} size={19} color={colores.marca} />
                <Text style={styles.volver}>Volver</Text>
            </Pressable>
            <Text style={styles.titulo}>{titulo}</Text>
            {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: colores.tarjeta,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
        gap: 8,
    },
    contexto: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    marca: {
        fontFamily: fuentes.regular,
        fontSize: 13,
        color: colores.marca,
    },
    volver: {
        fontFamily: fuentes.regular,
        fontSize: 13,
        color: colores.marca,
    },
    titulo: {
        fontFamily: fuentes.bold,
        fontSize: 28,
        color: colores.texto,
        lineHeight: 34,
    },
    subtitulo: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        lineHeight: 20,
    },
});
