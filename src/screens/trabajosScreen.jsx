import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { colores, estadoTrabajo } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd, saldoPendiente } from '../data/datosGrupo';

const FILTROS = [{ clave: 'todos', label: 'Todos los estados' }, ...Object.keys(estadoTrabajo).map((k) => ({
    clave: k,
    label: estadoTrabajo[k].etiqueta,
}))];

export default function TrabajosScreen({ trabajos, onAbrirTrabajo }) {
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const filtrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        return trabajos.filter((t) => {
            if (filtro !== 'todos' && t.estado !== filtro) return false;
            if (!q) return true;
            return (
                t.cliente.toLowerCase().includes(q) ||
                t.referencia.toLowerCase().includes(q) ||
                t.descripcion.toLowerCase().includes(q)
            );
        });
    }, [trabajos, busqueda, filtro]);

    const filtroLabel = FILTROS.find((f) => f.clave === filtro)?.label ?? 'Todos los estados';

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca titulo="Trabajos" subtitulo="Cada trabajo y lo que falta por cobrar." />
            <ContenedorScroll>
                <View style={styles.buscar}>
                    <Ionicons name="search" size={22} color={colores.textoSuave} />
                    <TextInput
                        style={styles.buscarInput}
                        placeholder="Buscar nombre o cotización"
                        placeholderTextColor={colores.textoSuave}
                        value={busqueda}
                        onChangeText={setBusqueda}
                    />
                </View>

                <View style={styles.filaFiltro}>
                    <Pressable style={styles.chipFiltro} onPress={() => setMostrarFiltros((v) => !v)}>
                        <Ionicons name="filter" size={17} color={colores.marca} />
                        <Text style={styles.chipTexto}>{filtroLabel}</Text>
                        <Ionicons name="chevron-down" size={16} color={colores.marca} />
                    </Pressable>
                    <Text style={styles.recuento}>{filtrados.length} trabajos</Text>
                </View>

                {mostrarFiltros ? (
                    <View style={styles.listaFiltros}>
                        {FILTROS.map((f) => (
                            <Pressable
                                key={f.clave}
                                style={[styles.opcionFiltro, filtro === f.clave && styles.opcionFiltroActiva]}
                                onPress={() => {
                                    setFiltro(f.clave);
                                    setMostrarFiltros(false);
                                }}
                            >
                                <Text style={styles.opcionFiltroTexto}>{f.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                ) : null}

                {filtrados.length === 0 ? (
                    <View style={[estilosComunes.tarjeta, styles.vacio]}>
                        <Text style={styles.vacioTitulo}>No hay trabajos todavía</Text>
                        <Text style={styles.vacioSub}>
                            Crea una cotización en Solicitudes o desde Inicio para verla aquí.
                        </Text>
                    </View>
                ) : null}

                {filtrados.map((t) => (
                    <Pressable key={t.id} style={estilosComunes.tarjeta} onPress={() => onAbrirTrabajo(t.id)}>
                        <View style={styles.filaRef}>
                            <Text style={styles.meta}>
                                {t.referencia} · {t.fechaLabel}
                            </Text>
                            <BadgeEstado estado={t.estado} />
                        </View>
                        <View style={styles.filaInfo}>
                            <View style={styles.info}>
                                <Text style={styles.cliente}>{t.cliente}</Text>
                                <Text style={styles.desc}>{t.descripcion}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colores.textoSuave} />
                        </View>
                        <View style={estilosComunes.filaDato}>
                            <Text style={styles.totalLabel}>Total {formatearUsd(t.total)}</Text>
                            <Text style={styles.saldo}>Saldo {formatearUsd(saldoPendiente(t)).replace('USD ', '')}</Text>
                        </View>
                    </Pressable>
                ))}

                <Text style={styles.nota}>
                    Un trabajo figura como cobrado solo cuando su saldo llega a USD 0,00.
                </Text>
            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    buscar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        paddingHorizontal: 16,
        minHeight: 52,
    },
    buscarInput: { flex: 1, fontSize: 15, color: colores.texto },
    filaFiltro: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    chipFiltro: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colores.filtro,
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 100,
    },
    chipTexto: { fontSize: 14, fontWeight: '600', color: colores.marca },
    recuento: { fontSize: 13, color: colores.textoSuave },
    listaFiltros: {
        backgroundColor: colores.tarjeta,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colores.borde,
        overflow: 'hidden',
    },
    opcionFiltro: { paddingVertical: 12, paddingHorizontal: 16 },
    opcionFiltroActiva: { backgroundColor: colores.primarioClaro },
    opcionFiltroTexto: { color: colores.texto, fontSize: 14 },
    filaRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    meta: { fontSize: 12, color: colores.textoSuave },
    filaInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    info: { flex: 1, gap: 3 },
    cliente: { fontSize: 16, fontWeight: '600', color: colores.texto },
    desc: { fontSize: 14, color: colores.textoSuave },
    totalLabel: { flex: 1, fontSize: 15, color: colores.textoSuave },
    saldo: { fontSize: 15, color: colores.texto },
    nota: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    vacio: { gap: 8 },
    vacioTitulo: { fontSize: 16, fontWeight: '600', color: colores.texto },
    vacioSub: { fontSize: 14, color: colores.textoSuave, lineHeight: 20 },
});
