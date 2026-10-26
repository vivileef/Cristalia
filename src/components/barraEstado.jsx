import { Platform, StyleSheet, Text, View } from 'react-native';
import { IconoFigma } from './iconoFigma';
import { iconosFigma } from '../constants/iconosFigma';
import { colores } from '../theme/colores';
import { fuentes } from '../theme/tipografia';
import { horaEstiloIos } from '../utils/resumenFinanciero';

export default function BarraEstado({ hora }) {
    if (Platform.OS === 'web') {
        return null;
    }

    return (
        <View style={styles.barra}>
            <Text style={styles.hora}>{hora ?? horaEstiloIos()}</Text>
            <View style={styles.conectividad}>
                <IconoFigma source={iconosFigma.iosSignal} size={18} />
                <IconoFigma source={iconosFigma.iosWifi} size={18} />
                <IconoFigma source={iconosFigma.iosBattery} size={25} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barra: {
        height: 50,
        backgroundColor: colores.tarjeta,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 26,
    },
    hora: {
        fontFamily: fuentes.regular,
        fontSize: 15,
        color: colores.texto,
    },
    conectividad: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
