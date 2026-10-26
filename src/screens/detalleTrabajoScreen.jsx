import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd, saldoPendiente } from '../data/datosGrupo';

export default function DetalleTrabajoScreen({ trabajo, onVolver, onRegistrarPago, onMarcarInstalado }) {
    if (!trabajo) return null;
    const saldo = saldoPendiente(trabajo);
    const historial = trabajo.historial ?? [];
    const yaInstalado = trabajo.estado === 'instalado' || trabajo.estado === 'cobrado';

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Detalle del trabajo"
                subtitulo={`${trabajo.referencia} · Creado el ${trabajo.fechaLabel}`}
                onVolver={onVolver}
            />
            <ContenedorScroll>
                <View style={styles.bloque}>
                    <Text style={styles.seccion}>{trabajo.cliente}</Text>
                    <Text style={styles.desc}>{trabajo.descripcion}</Text>
                    <View style={styles.filaEstado}>
                        <BadgeEstado estado={trabajo.estado} />
                        {trabajo.estadoDesde ? (
                            <Text style={styles.desde}>Desde el {trabajo.estadoDesde}</Text>
                        ) : null}
                    </View>
                </View>

                <View style={estilosComunes.tarjeta}>
                    <Fila label="Total del trabajo" valor={formatearUsd(trabajo.total)} />
                    <Fila label="Pagado" valor={formatearUsd(trabajo.pagado)} />
                    <View style={estilosComunes.separador} />
                    <Fila label="Saldo por cobrar" valor={formatearUsd(saldo)} fuerte />
                </View>

                <View style={styles.bloque}>
                    <Pressable style={estilosComunes.botonPrimario} onPress={() => onRegistrarPago(trabajo.id)}>
                        <Ionicons name="cash-outline" size={21} color="#fff" />
                        <Text style={estilosComunes.textoBotonPrimario}>Registrar pago</Text>
                    </Pressable>
                    {yaInstalado ? (
                        <View style={[estilosComunes.botonSecundario, styles.botonInactivo]}>
                            <Ionicons name="checkmark-circle" size={21} color={colores.textoSuave} />
                            <Text style={[estilosComunes.textoBotonSecundario, styles.textoInactivo]}>
                                {trabajo.estado === 'cobrado' ? 'Trabajo cobrado' : 'Ya marcado como instalado'}
                            </Text>
                        </View>
                    ) : (
                        <Pressable
                            style={({ pressed }) => [
                                estilosComunes.botonSecundario,
                                pressed && styles.botonPulsado,
                            ]}
                            onPress={() => onMarcarInstalado?.(trabajo.id)}
                            accessibilityRole="button"
                        >
                            <Ionicons name="checkmark" size={21} color={colores.marca} />
                            <Text style={estilosComunes.textoBotonSecundario}>Marcar como instalado</Text>
                        </Pressable>
                    )}
                    <Text style={styles.ayuda}>
                        Instalado no significa cobrado. El saldo debe llegar a USD 0,00 para figurar como cobrado.
                    </Text>
                </View>

                {trabajo.medidas ? (
                    <View style={styles.bloque}>
                        <Text style={styles.seccion}>Lo que vas a entregar</Text>
                        <View style={estilosComunes.tarjeta}>
                            <Text style={styles.entregaTitulo}>
                                {trabajo.calculo?.descripcionMedidas ??
                                    `${trabajo.medidas.cantidad} ventanas`}
                            </Text>
                            <Text style={styles.meta}>{trabajo.vidrio}</Text>
                            <Text style={styles.meta}>Perfil de aluminio {trabajo.perfil?.toLowerCase()}</Text>
                        </View>
                    </View>
                ) : null}

                {historial.length > 0 ? (
                    <View style={styles.bloque}>
                        <Text style={styles.seccion}>Historia del trabajo</Text>
                        {historial.map((ev) => (
                            <View key={`${ev.fecha}-${ev.titulo}`} style={styles.evento}>
                                <View style={styles.punto} />
                                <View style={styles.eventoInfo}>
                                    <Text style={styles.eventoFecha}>{ev.fecha}</Text>
                                    <Text style={styles.eventoTitulo}>{ev.titulo}</Text>
                                    <Text style={styles.eventoDetalle}>{ev.detalle}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : null}
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
    bloque: { gap: 12 },
    seccion: { fontSize: 20, color: colores.texto },
    desc: { fontSize: 16, color: colores.texto },
    filaEstado: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    desde: { fontSize: 13, color: colores.textoSuave },
    ayuda: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    entregaTitulo: { fontSize: 16, fontWeight: '600', color: colores.texto },
    meta: { fontSize: 14, color: colores.textoSuave },
    evento: { flexDirection: 'row', gap: 14, paddingBottom: 8 },
    punto: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colores.marca,
        marginTop: 4,
    },
    eventoInfo: { flex: 1, gap: 4 },
    eventoFecha: { fontSize: 12, color: colores.textoSuave },
    eventoTitulo: { fontSize: 15, fontWeight: '600', color: colores.texto },
    eventoDetalle: { fontSize: 13, color: colores.textoSuave },
    filaLabel: { flex: 1, fontSize: 15, color: colores.textoSuave },
    filaValor: { fontSize: 15, color: colores.texto },
    fuerte: { fontSize: 17, color: colores.texto },
    fuerteValor: { fontSize: 18, fontWeight: '700', color: colores.marca },
    botonPulsado: { opacity: 0.85 },
    botonInactivo: { opacity: 0.65 },
    textoInactivo: { color: colores.textoSuave },
});
