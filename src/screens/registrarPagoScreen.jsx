import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd, saldoPendiente } from '../data/datosGrupo';

export default function RegistrarPagoScreen({ trabajo, onVolver, onConfirmar }) {
    const saldo = saldoPendiente(trabajo);
    const [monto, setMonto] = useState(String(Math.min(saldo, 195.6).toFixed(2)).replace('.', ','));
    const [metodo, setMetodo] = useState('Transferencia');

    const confirmar = () => {
        const valor = parseFloat(String(monto).replace(',', '.'));
        if (!valor || valor <= 0) {
            Alert.alert('Monto inválido', 'Ingresa un valor mayor a cero.');
            return;
        }
        if (valor > saldo + 0.01) {
            Alert.alert('Monto excedido', `El saldo pendiente es ${formatearUsd(saldo)}.`);
            return;
        }
        onConfirmar({ monto: valor, metodo });
    };

    if (!trabajo) return null;

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Registrar pago"
                subtitulo={`${trabajo.referencia} · Saldo ${formatearUsd(saldo)}`}
                onVolver={onVolver}
            />
            <ContenedorScroll>
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Importe recibido (USD)</Text>
                    <TextInput
                        style={styles.entrada}
                        value={monto}
                        onChangeText={setMonto}
                        keyboardType="decimal-pad"
                    />
                </View>
                <View style={styles.campo}>
                    <Text style={styles.etiqueta}>Forma de pago</Text>
                    <TextInput style={styles.entrada} value={metodo} onChangeText={setMetodo} />
                </View>
                <Pressable style={estilosComunes.botonPrimario} onPress={confirmar}>
                    <Text style={estilosComunes.textoBotonPrimario}>Guardar pago</Text>
                </Pressable>
            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    campo: { gap: 8 },
    etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
    entrada: {
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        padding: 14,
        minHeight: 54,
        fontSize: 16,
        color: colores.texto,
    },
});
