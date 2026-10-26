import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd } from '../data/datosGrupo';

export default function CotizacionGuardadaScreen({ trabajo, onVolver, onAprobar, onEditar }) {
    if (!trabajo) return null;
    const c = trabajo.calculo;

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Cotización guardada"
                subtitulo={`${trabajo.referencia} · ${trabajo.fechaLabel ?? 'Hoy'}`}
                onVolver={onVolver}
            />
            <ContenedorScroll>
                <View style={styles.confirmacion}>
                    <Ionicons name="checkmark-circle" size={22} color={colores.marca} />
                    <Text style={styles.confirmacionTexto}>La cotización quedó registrada en tu taller.</Text>
                </View>

                <View style={estilosComunes.tarjeta}>
                    <View style={styles.filaRef}>
                        <Text style={styles.cliente}>{trabajo.cliente}</Text>
                        <BadgeEstado estado={trabajo.estado} />
                    </View>
                    <Text style={styles.tituloTrabajo}>{trabajo.descripcion}</Text>
                    <Text style={styles.meta}>{c?.descripcionMedidas ?? trabajo.descripcion}</Text>
                    <Text style={styles.meta}>{trabajo.vidrio}</Text>
                    <Text style={styles.meta}>Perfil de aluminio {trabajo.perfil?.toLowerCase()}</Text>
                </View>

                <View style={styles.bloque}>
                    <Text style={styles.seccion}>Detalle del precio</Text>
                    {c ? (
                        <View style={estilosComunes.tarjeta}>
                            <Fila label="Vidrio (por ventana)" valor={formatearUsd(c.vidrio)} />
                            <Fila label="Perfil (por ventana)" valor={formatearUsd(c.perfil)} />
                            <Fila label="Mano de obra" valor={formatearUsd(c.manoObra)} />
                            <View style={estilosComunes.separador} />
                            <Fila label="Total" valor={formatearUsd(trabajo.total)} fuerte />
                        </View>
                    ) : null}
                    <Text style={styles.ayuda}>Precios de referencia, sin impuestos ni recargos.</Text>
                </View>

                <View style={estilosComunes.tarjeta}>
                    <Fila label="Saldo inicial" valor={formatearUsd(trabajo.total)} />
                    <View style={estilosComunes.separador} />
                    <Fila label="Por cobrar" valor={formatearUsd(trabajo.total)} fuerte />
                </View>

                <Pressable style={estilosComunes.botonPrimario} onPress={() => onAprobar(trabajo.id)}>
                    <Ionicons name="checkmark" size={21} color="#fff" />
                    <Text style={estilosComunes.textoBotonPrimario}>Aprobar trabajo</Text>
                </Pressable>
                <Text style={styles.ayuda}>Al aprobar, el trabajo pasa a la lista con estado Aprobado.</Text>
                <Pressable style={estilosComunes.botonSecundario} onPress={onEditar}>
                    <Ionicons name="pencil" size={21} color={colores.marca} />
                    <Text style={estilosComunes.textoBotonSecundario}>Editar cotización</Text>
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
    confirmacion: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    confirmacionTexto: { flex: 1, fontSize: 14, color: colores.texto },
    bloque: { gap: 14 },
    seccion: { fontSize: 20, color: colores.texto },
    filaRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cliente: { fontSize: 16, fontWeight: '600', color: colores.texto },
    tituloTrabajo: { fontSize: 20, color: colores.texto, marginTop: 8 },
    meta: { fontSize: 14, color: colores.textoSuave },
    ayuda: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    filaLabel: { flex: 1, fontSize: 15, color: colores.textoSuave },
    filaValor: { fontSize: 15, color: colores.texto },
    fuerte: { fontSize: 17, color: colores.texto },
    fuerteValor: { fontSize: 18, fontWeight: '700', color: colores.marca },
});
