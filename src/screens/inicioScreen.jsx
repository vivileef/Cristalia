import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { formatearUsd, saldoPendiente, taller } from '../data/datosGrupo';
import { iconosNav } from '../constants/iconosFigma';
import { fuentes } from '../theme/tipografia';
import { formatearFechaLarga } from '../utils/resumenFinanciero';
import { BannerCotizacion } from '../components/bannerCotizacion';

export default function InicioScreen({
    trabajos,
    resumen,
    periodoLabel,
    onIrSolicitudes,
    onIrTrabajos,
    onIrReportes,
    onVerTrabajo,
    onCerrarSesion,
}) {
    const destacado =
        trabajos.find((t) => t.estado === 'en_proceso') ??
        trabajos.find((t) => saldoPendiente(t) > 0) ??
        trabajos[0];

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca
                titulo="Tu taller, al día"
                subtitulo={`${taller.ciudad} · ${formatearFechaLarga()}`}
            />
            <ContenedorScroll>
                <BannerCotizacion onAccion={onIrSolicitudes} />

                <View style={styles.bloque}>
                    <Text style={styles.seccion}>Así va tu taller</Text>
                    <Text style={styles.seccionSub}>
                        {periodoLabel} · Valores en USD
                    </Text>
                    <View style={estilosComunes.tarjeta}>
                        <FilaResumen label="Cotizado" valor={formatearUsd(resumen.cotizado)} />
                        <FilaResumen label="Cobrado" valor={formatearUsd(resumen.cobrado)} />
                        <View style={estilosComunes.separador} />
                        <FilaResumen label="Pendiente" valor={formatearUsd(resumen.pendiente)} destacado />
                    </View>
                </View>

                <View style={styles.bloque}>
                    <Text style={styles.seccion}>¿Qué necesitas hacer?</Text>
                    <View style={styles.accesos}>
                        <AccesoRapido
                            icono={iconosNav.solicitudes.outline}
                            label="Solicitudes"
                            onPress={onIrSolicitudes}
                        />
                        <AccesoRapido icono={iconosNav.trabajos.outline} label="Trabajos" onPress={onIrTrabajos} />
                        <AccesoRapido icono={iconosNav.reportes.outline} label="Reportes" onPress={onIrReportes} />
                    </View>
                </View>

                {destacado ? (
                    <View style={styles.bloque}>
                        <Text style={styles.seccion}>Un trabajo en marcha</Text>
                        <View style={estilosComunes.tarjeta}>
                            <View style={styles.filaRef}>
                                <Text style={styles.ref}>{destacado.referencia}</Text>
                                <BadgeEstado estado={destacado.estado} />
                            </View>
                            <Text style={styles.cliente}>{destacado.cliente}</Text>
                            <Text style={styles.desc}>{destacado.descripcion}</Text>
                            <View style={[estilosComunes.filaDato, styles.filaSaldo]}>
                                <Text style={styles.saldoLabel}>Saldo por cobrar</Text>
                                <Text style={styles.saldoValor}>{formatearUsd(saldoPendiente(destacado))}</Text>
                            </View>
                            <Pressable style={styles.verTrabajo} onPress={() => onVerTrabajo(destacado.id)}>
                                <Text style={styles.verTrabajoTexto}>Ver trabajo</Text>
                                <Ionicons name={iconosNav.flecha} size={17} color={colores.marca} />
                            </Pressable>
                        </View>
                    </View>
                ) : null}

                {onCerrarSesion ? (
                    <Pressable style={styles.cerrarSesion} onPress={onCerrarSesion}>
                        <Text style={styles.cerrarSesionTexto}>Cerrar sesión</Text>
                    </Pressable>
                ) : null}
            </ContenedorScroll>
        </View>
    );
}

function FilaResumen({ label, valor, destacado }) {
    return (
        <View style={[estilosComunes.filaDato, styles.filaResumen]}>
            <Text style={[styles.resumenLabel, destacado && styles.resumenLabelFuerte]}>{label}</Text>
            <Text style={[styles.resumenValor, destacado && styles.resumenValorFuerte]}>{valor}</Text>
        </View>
    );
}

function AccesoRapido({ icono, label, onPress }) {
    return (
        <Pressable style={styles.acceso} onPress={onPress}>
            <Ionicons name={icono} size={24} color={colores.texto} />
            <Text style={styles.accesoLabel}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    bloque: { gap: 14 },
    seccion: { fontFamily: fuentes.regular, fontSize: 20, color: colores.texto, lineHeight: 26 },
    seccionSub: { fontFamily: fuentes.regular, fontSize: 13, color: colores.textoSuave, marginTop: -8 },
    filaResumen: { paddingVertical: 2 },
    resumenLabel: { flex: 1, fontSize: 15, color: colores.textoSuave },
    resumenValor: { fontSize: 15, color: colores.texto },
    resumenLabelFuerte: { fontSize: 17, color: colores.texto },
    resumenValorFuerte: { fontSize: 18, fontWeight: '700', color: colores.marca },
    accesos: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    acceso: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 10,
    },
    accesoLabel: { fontSize: 13, fontWeight: '600', color: colores.texto },
    filaRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ref: { fontSize: 13, color: colores.textoSuave },
    cliente: { fontSize: 16, fontWeight: '600', color: colores.texto },
    desc: { fontSize: 14, color: colores.textoSuave },
    filaSaldo: { marginTop: 4 },
    saldoLabel: { flex: 1, fontSize: 17, color: colores.texto },
    saldoValor: { fontSize: 18, fontWeight: '700', color: colores.marca },
    verTrabajo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    verTrabajoTexto: { color: colores.marca, fontSize: 14 },
    cerrarSesion: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    cerrarSesionTexto: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        textDecorationLine: 'underline',
    },
});
