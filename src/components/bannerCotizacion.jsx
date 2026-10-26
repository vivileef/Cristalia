import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../theme/colores';
import { fuentes } from '../theme/tipografia';
import { iconosNav } from '../constants/iconosFigma';

/** Banner compartido Inicio ↔ Solicitudes (misma copy y estilo). */
export function BannerCotizacion({ variante = 'completo', onAccion }) {
    const esEncabezado = variante === 'encabezado';

    return (
        <View style={[styles.banner, esEncabezado ? styles.bannerEncabezado : styles.bannerSuelto]}>
            <Text style={styles.titulo}>De las medidas al precio, sin complicarte.</Text>
            <Text style={styles.sub}>Calcula materiales y mano de obra en una sola cotización.</Text>
            {!esEncabezado && onAccion ? (
                <Pressable style={styles.boton} onPress={onAccion} accessibilityRole="button">
                    <Ionicons name={iconosNav.crear} size={21} color={colores.marca} />
                    <Text style={styles.botonTexto}>Crear cotización</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: colores.primarioOscuro,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 22,
        gap: 12,
    },
    bannerSuelto: {
        borderRadius: 18,
    },
    bannerEncabezado: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    titulo: {
        fontFamily: fuentes.regular,
        color: '#fff',
        fontSize: 22,
        lineHeight: 28,
    },
    sub: {
        fontFamily: fuentes.regular,
        color: colores.subtituloClaro,
        fontSize: 14,
        lineHeight: 20,
    },
    boton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 4,
    },
    botonTexto: {
        fontFamily: fuentes.regular,
        color: colores.marca,
        fontSize: 16,
    },
});
