import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import Boton from '../components/Boton';
import { mostrarAviso } from '../utils/feedback';
import {
    comprobarAcelerometroDisponible,
    esPlataformaWeb,
    mensajeAcelerometroWeb,
    obtenerEstadoPermisoAcelerometro,
    solicitarPermisoAcelerometro,
    suscribirAcelerometro,
} from '../utils/acelerometro';

const UMBRAL_MOVIMIENTO = 1.35;
const MAX_BARRA = 2;

function magnitud({ x, y, z }) {
    return Math.sqrt(x * x + y * y + z * z);
}

function formatearG(valor) {
    if (valor == null || !Number.isFinite(valor)) return '—';
    return `${valor.toFixed(2)} g`;
}

function etiquetaPermiso(permiso) {
    if (permiso === 'granted') return 'Autorizado';
    if (permiso === 'denied') return 'Sin acceso';
    return 'Pendiente';
}

export default function AcelerometroScreen({ onVolver }) {
    const [disponible, setDisponible] = useState(null);
    const [permiso, setPermiso] = useState('pendiente');
    const [leyendo, setLeyendo] = useState(false);
    const [datos, setDatos] = useState(null);
    const [sacudida, setSacudida] = useState(false);
    const [avisoWeb, setAvisoWeb] = useState('');
    const suscripcion = useRef(null);

    useEffect(() => {
        comprobarAcelerometroDisponible()
            .then(setDisponible)
            .catch(() => setDisponible(false));
        obtenerEstadoPermisoAcelerometro()
            .then(setPermiso)
            .catch(() => setPermiso('undetermined'));
        return () => {
            suscripcion.current?.remove();
        };
    }, []);

    const procesarMedicion = (medicion) => {
        if (medicion._avisoWeb === 'sin_sensor') {
            setAvisoWeb(mensajeAcelerometroWeb());
            return;
        }
        setAvisoWeb('');
        setDatos(medicion);
        setSacudida(magnitud(medicion) > UMBRAL_MOVIMIENTO);
    };

    const alternarLectura = async () => {
        if (leyendo) {
            suscripcion.current?.remove();
            suscripcion.current = null;
            setLeyendo(false);
            setSacudida(false);
            return;
        }

        const permisoOk = await solicitarPermisoAcelerometro();
        const estado = await obtenerEstadoPermisoAcelerometro();
        setPermiso(estado);
        if (!permisoOk) {
            mostrarAviso('Acelerómetro', esPlataformaWeb() ? mensajeAcelerometroWeb() : 'Activa el permiso del sensor en ajustes.');
            return;
        }

        if (!esPlataformaWeb()) {
            const ok = await comprobarAcelerometroDisponible();
            if (!ok) {
                mostrarAviso('Acelerómetro', 'Sensor no disponible en este dispositivo.');
                return;
            }
        }

        try {
            suscripcion.current = await suscribirAcelerometro(procesarMedicion);
            setLeyendo(true);
            setDatos(null);
            if (esPlataformaWeb()) {
                setAvisoWeb(mensajeAcelerometroWeb());
            }
        } catch {
            mostrarAviso('Acelerómetro', mensajeAcelerometroWeb());
        }
    };

    const magActual = datos ? magnitud(datos) : null;
    const sensorListo = disponible !== false;

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Acelerómetro"
                subtitulo="Monitoreo de movimiento al transportar o instalar vidrio."
                onVolver={onVolver}
            />
            <ContenedorScroll>
            <View style={styles.filaEstado}>
                <EstadoChip
                    etiqueta={leyendo ? 'Monitoreando' : 'En pausa'}
                    activo={leyendo}
                    tono="primario"
                />
                <EstadoChip
                    etiqueta={sensorListo ? 'Sensor listo' : 'Sin sensor'}
                    activo={sensorListo}
                    tono="neutro"
                />
                <EstadoChip etiqueta={etiquetaPermiso(permiso)} activo={permiso === 'granted'} tono="neutro" />
            </View>

            <View style={[estilosComunes.tarjeta, styles.panelPrincipal]}>
                <Text style={styles.etiquetaMagnitud}>Intensidad total</Text>
                <Text style={[styles.magnitudGrande, sacudida && styles.magnitudAlerta]}>
                    {formatearG(magActual)}
                </Text>
                {leyendo && sacudida ? (
                    <View style={styles.badgeSacudida}>
                        <Text style={styles.badgeSacudidaTexto}>Movimiento brusco</Text>
                    </View>
                ) : (
                    <Text style={styles.hintMagnitud}>
                        {leyendo ? 'Mantén el equipo estable para medir.' : 'Pulsa monitorear para iniciar.'}
                    </Text>
                )}
            </View>

            <View style={estilosComunes.tarjeta}>
                <Text style={styles.seccionTarjeta}>Ejes (X · Y · Z)</Text>
                <MedidorEje eje="X" valor={datos?.x} activo={leyendo} />
                <MedidorEje eje="Y" valor={datos?.y} activo={leyendo} />
                <MedidorEje eje="Z" valor={datos?.z} activo={leyendo} />
            </View>

            {avisoWeb && esPlataformaWeb() ? <Text style={styles.avisoWeb}>{avisoWeb}</Text> : null}

            <View style={styles.filaBotones}>
                <View style={styles.botonFlex}>
                    <Boton
                        texto={leyendo ? 'Detener' : 'Monitorear'}
                        onPress={alternarLectura}
                        variante={leyendo ? 'secundario' : 'primario'}
                    />
                </View>
            </View>
            </ContenedorScroll>
        </View>
    );
}

function EstadoChip({ etiqueta, activo, tono }) {
    const esPrimario = tono === 'primario';
    return (
        <View
            style={[
                styles.chip,
                esPrimario && activo && styles.chipPrimarioActivo,
                esPrimario && !activo && styles.chipPrimarioInactivo,
                !esPrimario && styles.chipNeutro,
            ]}
        >
            <Text
                style={[
                    styles.chipTexto,
                    esPrimario && activo && styles.chipTextoActivo,
                ]}
            >
                {etiqueta}
            </Text>
        </View>
    );
}

function MedidorEje({ eje, valor, activo }) {
    const num = typeof valor === 'number' ? valor : 0;
    const ancho = activo && typeof valor === 'number' ? Math.min(Math.abs(num) / MAX_BARRA, 1) : 0;
    const negativo = num < 0;

    return (
        <View style={styles.medidor}>
            <View style={styles.medidorCabecera}>
                <Text style={styles.medidorEje}>{eje}</Text>
                <Text style={styles.medidorValor}>{formatearG(valor)}</Text>
            </View>
            <View style={styles.barraFondo}>
                <View
                    style={[
                        styles.barraRelleno,
                        { width: `${ancho * 100}%` },
                        negativo && styles.barraNegativa,
                        !activo && styles.barraInactiva,
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    filaEstado: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    chipPrimarioActivo: {
        backgroundColor: colores.primarioClaro,
        borderColor: colores.primario,
    },
    chipPrimarioInactivo: {
        backgroundColor: colores.fondo,
        borderColor: colores.borde,
    },
    chipNeutro: {
        backgroundColor: colores.tarjeta,
        borderColor: colores.borde,
    },
    chipTexto: {
        fontSize: 12,
        fontWeight: '600',
        color: colores.textoSuave,
    },
    chipTextoActivo: {
        color: colores.primarioOscuro,
    },
    panelPrincipal: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 12,
    },
    etiquetaMagnitud: {
        fontSize: 13,
        fontWeight: '600',
        color: colores.textoSuave,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 6,
    },
    magnitudGrande: {
        fontSize: 40,
        fontWeight: '800',
        color: colores.primarioOscuro,
        fontVariant: ['tabular-nums'],
    },
    magnitudAlerta: {
        color: colores.advertencia,
    },
    hintMagnitud: {
        fontSize: 13,
        color: colores.textoSuave,
        marginTop: 8,
        textAlign: 'center',
    },
    badgeSacudida: {
        marginTop: 10,
        backgroundColor: colores.advertenciaClaro,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeSacudidaTexto: {
        fontSize: 13,
        fontWeight: '700',
        color: colores.advertencia,
    },
    seccionTarjeta: {
        fontSize: 15,
        fontWeight: '700',
        color: colores.texto,
        marginBottom: 12,
    },
    medidor: {
        marginBottom: 14,
    },
    medidorCabecera: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    medidorEje: {
        fontSize: 15,
        fontWeight: '700',
        color: colores.texto,
    },
    medidorValor: {
        fontSize: 15,
        fontWeight: '600',
        color: colores.texto,
        fontVariant: ['tabular-nums'],
    },
    barraFondo: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colores.fondo,
        overflow: 'hidden',
    },
    barraRelleno: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: colores.primario,
    },
    barraNegativa: {
        backgroundColor: colores.primarioOscuro,
    },
    barraInactiva: {
        backgroundColor: colores.borde,
    },
    avisoWeb: {
        fontSize: 13,
        color: colores.textoSuave,
        lineHeight: 18,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    filaBotones: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 24,
    },
    botonFlex: {
        flex: 1,
        marginHorizontal: 4,
    },
});
