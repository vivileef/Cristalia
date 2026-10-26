import { StyleSheet, View } from 'react-native';
import BarraEstado from './barraEstado';
import { colores } from '../theme/colores';

/** Contenedor interior del marco móvil (barra decorativa + contenido). */
export default function PantallaGrupal({ children }) {
    return (
        <View style={styles.pantalla}>
            <BarraEstado />
            <View style={styles.contenido}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: {
        flex: 1,
        width: '100%',
        backgroundColor: colores.tarjeta,
    },
    contenido: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
});
