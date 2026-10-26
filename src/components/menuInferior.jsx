import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../theme/colores';
import { iconosNav } from '../constants/iconosFigma';
import { fuentes } from '../theme/tipografia';
import { RUTAS, RUTAS_CON_MENU_INFERIOR } from '../navigation/rutas';

const SECCIONES = [
    { clave: RUTAS.INICIO, etiqueta: 'Inicio', ...iconosNav.inicio },
    { clave: RUTAS.SOLICITUDES, etiqueta: 'Solicitudes', ...iconosNav.solicitudes },
    { clave: RUTAS.TRABAJOS, etiqueta: 'Trabajos', ...iconosNav.trabajos },
    { clave: RUTAS.REPORTES, etiqueta: 'Reportes', ...iconosNav.reportes },
    { clave: RUTAS.AVISOS, etiqueta: 'Avisos', ...iconosNav.avisos },
    { clave: RUTAS.NOTIFICACIONES, etiqueta: 'Push', ...iconosNav.notificaciones },
    { clave: RUTAS.PERFIL, etiqueta: 'Perfil', ...iconosNav.perfil },
];

export default function MenuInferior({ pantallaActual, cambiarPantalla }) {
    const tabPrincipal = RUTAS_CON_MENU_INFERIOR.includes(pantallaActual) ? pantallaActual : RUTAS.INICIO;

    return (
        <View style={styles.menu}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filaScroll}
            >
                {SECCIONES.map(({ clave, etiqueta, outline, filled }) => {
                    const activo = tabPrincipal === clave;
                    return (
                        <Pressable
                            key={clave}
                            style={styles.seccion}
                            onPress={() => cambiarPantalla(clave)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: activo }}
                        >
                            <View style={[styles.indicador, activo && styles.indicadorActivo]}>
                                <Ionicons
                                    name={activo ? filled : outline}
                                    size={20}
                                    color={activo ? colores.marca : colores.textoSuave}
                                />
                            </View>
                            <Text style={[styles.etiqueta, activo && styles.etiquetaActiva]} numberOfLines={1}>
                                {etiqueta}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            <View style={styles.barraInicio} />
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        backgroundColor: colores.tarjeta,
        borderTopWidth: 1,
        borderTopColor: colores.borde,
        paddingTop: 10,
        paddingBottom: 8,
        alignItems: 'center',
        gap: 10,
    },
    filaScroll: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        minWidth: '100%',
        justifyContent: 'space-between',
    },
    seccion: {
        minWidth: 58,
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 2,
    },
    indicador: {
        width: 48,
        height: 28,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colores.tarjeta,
    },
    indicadorActivo: {
        backgroundColor: colores.primarioClaro,
    },
    etiqueta: {
        fontFamily: fuentes.regular,
        fontSize: 9,
        color: colores.textoSuave,
        textAlign: 'center',
    },
    etiquetaActiva: {
        fontFamily: fuentes.bold,
        color: colores.marca,
    },
    barraInicio: {
        width: 128,
        height: 4,
        borderRadius: 100,
        backgroundColor: colores.indicador,
    },
});
