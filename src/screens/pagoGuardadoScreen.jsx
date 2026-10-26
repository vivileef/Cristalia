import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd, saldoPendiente } from '../data/datosGrupo';

export default function PagoGuardadoScreen({ trabajo, pago, onVolverDetalle }) {
    if (!trabajo || !pago) return null;
    const saldo = saldoPendiente(trabajo);

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver titulo="Pago guardado" subtitulo={trabajo.referencia} onVolver={onVolverDetalle} />
            <ContenedorScroll>
                <View style={styles.hero}>
                    <View style={styles.sello}>
                        <Ionicons name="checkmark" size={32} color="#fff" />
                    </View>
                    <Text style={styles.importe}>{formatearUsd(pago.monto)}</Text>
                    <Text style={styles.tipo}>{pago.metodo}</Text>
                </View>

                <View style={estilosComunes.tarjeta}>
                    <Text style={styles.ref}>{pago.referenciaPago}</Text>
                    <Fila label="Cliente" valor={trabajo.cliente} />
                    <Fila label="Trabajo" valor={trabajo.descripcion} />
                    <Fila label="Fecha" valor={pago.fechaLabel} />
                    <View style={estilosComunes.separador} />
                    <Fila label="Total del trabajo" valor={formatearUsd(trabajo.total)} />
                    <Fila label="Pagado acumulado" valor={formatearUsd(trabajo.pagado)} />
                </View>

                <View style={estilosComunes.tarjeta}>
                    <Fila label="Saldo restante" valor={formatearUsd(saldo)} />
                    <View style={estilosComunes.separador} />
                    <Fila label="Por cobrar" valor={formatearUsd(saldo)} fuerte />
                </View>

                <View style={styles.estadoBloque}>
                    <View style={styles.filaEstado}>
                        <Text style={styles.estadoLabel}>Estado del trabajo</Text>
                        <BadgeEstado estado={trabajo.estado} />
                    </View>
                    <Text style={styles.ayuda}>
                        {saldo <= 0
                            ? 'El saldo llegó a cero; el trabajo puede figurar como cobrado.'
                            : 'El pago se registró, pero el trabajo sigue con saldo pendiente.'}
                    </Text>
                </View>

                <Pressable style={estilosComunes.botonSecundario} onPress={onVolverDetalle}>
                    <Ionicons name="arrow-back" size={21} color={colores.marca} />
                    <Text style={estilosComunes.textoBotonSecundario}>Volver al trabajo</Text>
                </Pressable>
            </ContenedorScroll>
        </View>
    );
}

function Fila({ label, valor, fuerte }) {
    return (
        <View style={estilosComunes.filaDato}>
            <Text style={[styles.filaLabel, fuerte && styles.fuerte]}>{label}</Text>
            <Text style={[styles.filaValor, fuerte && styles.fuerteValor]}>{valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    hero: { alignItems: 'center', gap: 12, paddingVertical: 12 },
    sello: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: colores.marca,
        alignItems: 'center',
        justifyContent: 'center',
    },
    importe: { fontSize: 32, fontWeight: '700', color: colores.texto },
    tipo: { fontSize: 14, color: colores.textoSuave },
    ref: { fontSize: 13, color: colores.textoSuave, marginBottom: 8 },
    estadoBloque: { gap: 8 },
    filaEstado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    estadoLabel: { fontSize: 14, color: colores.texto },
    ayuda: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    filaLabel: { flex: 1, fontSize: 15, color: colores.textoSuave },
    filaValor: { fontSize: 15, color: colores.texto },
    fuerte: { fontSize: 17, color: colores.texto },
    fuerteValor: { fontSize: 18, fontWeight: '700', color: colores.marca },
});
