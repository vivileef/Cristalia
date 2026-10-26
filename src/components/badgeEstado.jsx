import { StyleSheet, Text, View } from 'react-native';
import { estadoTrabajo } from '../theme/colores';

export default function BadgeEstado({ estado }) {
    const cfg = estadoTrabajo[estado] ?? estadoTrabajo.cotizado;
    return (
        <View style={[styles.badge, { backgroundColor: cfg.fondo }]}>
            <Text style={[styles.texto, { color: cfg.color }]}>{cfg.etiqueta}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
    },
    texto: {
        fontSize: 12,
    },
});
