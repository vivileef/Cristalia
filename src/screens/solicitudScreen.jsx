import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { colores, estadoTrabajo } from '../theme/colores';
import { materiales, formatearMoneda, siguienteEstado } from '../data/datosPractica';
import { saldoPendiente } from '../data/datosGrupo';
import { estilosComunes } from '../theme/estilosComunes';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { BannerCotizacion } from '../components/bannerCotizacion';
import { fuentes } from '../theme/tipografia';
import { calcularTotalCotizacion } from '../utils/cotizacion';
import Boton from '../components/Boton';
import { abrirCamara, abrirGaleria } from '../utils/imagenes';
import { formatearCoordenadas, formatearPrecision, obtenerUbicacionActual } from '../utils/ubicacion';
import { notificarSolicitudRegistrada } from '../utils/notificaciones';
import { claveCliente } from '../utils/clientes';
import { fechaIsoLocal } from '../utils/resumenFinanciero';

const FILTROS = [
    { clave: 'todos', label: 'Todos' },
    { clave: 'cotizado', label: 'Cotizado' },
    { clave: 'en_proceso', label: 'En proceso' },
];

export default function SolicitudScreen({
    trabajos,
    clientesGuardados = [],
    onAgregarTrabajo,
    onActualizarTrabajo,
    onAbrirPractica,
}) {
    const [filtro, setFiltro] = useState('todos');
    const [cliente, setCliente] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ancho, setAncho] = useState('');
    const [alto, setAlto] = useState('');
    const [materialId, setMaterialId] = useState(materiales[0].id);
    const [totalMostrado, setTotalMostrado] = useState(null);
    const [aviso, setAviso] = useState('');
    const [fotoReferencia, setFotoReferencia] = useState(null);
    const [ubicacionSitio, setUbicacionSitio] = useState(null);
    const [leyendoUbicacion, setLeyendoUbicacion] = useState(false);

    const lista = useMemo(() => {
        if (filtro === 'todos') return trabajos;
        return trabajos.filter((t) => t.estado === filtro);
    }, [filtro, trabajos]);

    const onCalcular = () => {
        const r = calcularTotalCotizacion(ancho, alto, materialId);
        if (!r) {
            setTotalMostrado(null);
            setAviso('Ingresa ancho y alto válidos (metros).');
            return;
        }
        setTotalMostrado(r.total);
        setAviso(`Total calculado: ${formatearMoneda(r.total)}`);
    };

    const onGuardar = async () => {
        if (!cliente.trim()) {
            setAviso('Escribe el nombre del cliente.');
            return;
        }
        const r = calcularTotalCotizacion(ancho, alto, materialId);
        if (!r) {
            setAviso('Ingresa medidas válidas y pulsa Calcular.');
            return;
        }

        const nombreCliente = cliente.trim();

        try {
            onAgregarTrabajo({
                id: String(Date.now()),
                cliente: nombreCliente,
                descripcion: descripcion.trim() || 'Trabajo de vidriería',
                material: r.material.nombre,
                total: r.total,
                pagado: 0,
                estado: 'cotizado',
                fecha: fechaIsoLocal(),
                ...(fotoReferencia ? { fotoReferencia } : {}),
                ...(ubicacionSitio ? { ubicacion: ubicacionSitio } : {}),
            });

            // Solo tras guardado exitoso (integración grupal — guía §12)
            await notificarSolicitudRegistrada(nombreCliente);

            setCliente('');
            setDescripcion('');
            setAncho('');
            setAlto('');
            setFotoReferencia(null);
            setUbicacionSitio(null);
            setTotalMostrado(null);
            setFiltro('cotizado');
            setAviso(`Guardado: cotización de ${formatearMoneda(r.total)} para ${nombreCliente}.`);
        } catch {
            setAviso('No se pudo completar el guardado o la notificación.');
        }
    };

    const avanzarEstado = (trabajo) => {
        const nuevo = siguienteEstado(trabajo.estado);
        if (nuevo === trabajo.estado) return;
        onActualizarTrabajo(trabajo.id, { estado: nuevo });
    };

    const registrarPago = (trabajo) => {
        const pendiente = saldoPendiente(trabajo);
        if (pendiente <= 0) {
            setAviso('Este trabajo ya está pagado.');
            return;
        }
        const anticipo = Math.round(pendiente / 2);
        const pagado = trabajo.pagado + anticipo;
        onActualizarTrabajo(trabajo.id, {
            pagado,
            estado: pagado >= trabajo.total ? 'cobrado' : trabajo.estado,
        });
        setAviso(`Pago registrado: ${formatearMoneda(anticipo)}`);
    };

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca titulo="Solicitudes" subtitulo="Cotiza y revisa tus trabajos." />
            <ContenedorScroll>
                <View style={styles.cotizacionUnificada}>
                    <BannerCotizacion variante="encabezado" />
                    <View style={styles.formularioCuerpo}>
                        <Text style={styles.formTitulo}>Nueva cotización</Text>
                <Text style={estilosComunes.etiquetaInput}>Cliente</Text>
                <TextInput style={estilosComunes.input} value={cliente} onChangeText={setCliente} placeholder="Nombre" />
                {clientesGuardados.length > 0 ? (
                    <View style={styles.clientesGuardados}>
                        <Text style={styles.clientesGuardadosTitulo}>Clientes guardados</Text>
                        <View style={styles.filaClientes}>
                            {clientesGuardados.map((nombre) => (
                                <TouchableOpacity
                                    key={claveCliente(nombre)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.chipCliente,
                                        claveCliente(cliente) === claveCliente(nombre) && styles.chipClienteActivo,
                                    ]}
                                    onPress={() => setCliente(nombre)}
                                >
                                    <Text
                                        style={[
                                            styles.chipClienteTexto,
                                            claveCliente(cliente) === claveCliente(nombre) && styles.chipClienteTextoActivo,
                                        ]}
                                    >
                                        {nombre}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : null}

                <Text style={estilosComunes.etiquetaInput}>Descripción (opcional)</Text>
                <TextInput style={estilosComunes.input} value={descripcion} onChangeText={setDescripcion} placeholder="Ej. Ventana" />

                <Text style={estilosComunes.etiquetaInput}>Foto y sensores (opcional)</Text>
                {fotoReferencia ? (
                    <View style={styles.contenedorFoto}>
                        <Image source={{ uri: fotoReferencia }} style={styles.vistaPrevia} accessibilityLabel="Vista previa de la foto" />
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setFotoReferencia(null)}>
                            <Text style={styles.quitarFoto}>Quitar foto</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                {ubicacionSitio ? (
                    <View style={styles.cajaUbicacion}>
                        <Text style={styles.textoUbicacion}>{formatearCoordenadas(ubicacionSitio)}</Text>
                        <Text style={styles.subUbicacion}>{formatearPrecision(ubicacionSitio)}</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setUbicacionSitio(null)}>
                            <Text style={styles.quitarFoto}>Quitar ubicación</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <View style={styles.filaBotonesFoto}>
                    <View style={styles.colBoton}>
                        <Boton
                            texto="Galería"
                            variante="secundario"
                            onPress={async () => {
                                const uri = await abrirGaleria();
                                if (uri) setFotoReferencia(uri);
                            }}
                        />
                    </View>
                    <View style={styles.colBoton}>
                        <Boton
                            texto="Cámara"
                            variante="secundario"
                            onPress={async () => {
                                const uri = await abrirCamara();
                                if (uri) setFotoReferencia(uri);
                            }}
                        />
                    </View>
                </View>
                <View style={styles.filaBotonesFoto}>
                    <View style={styles.colBoton}>
                        <Boton
                            texto={leyendoUbicacion ? 'GPS…' : 'GPS'}
                            variante="secundario"
                            deshabilitado={leyendoUbicacion}
                            onPress={async () => {
                                setLeyendoUbicacion(true);
                                const punto = await obtenerUbicacionActual();
                                setLeyendoUbicacion(false);
                                if (punto) {
                                    setUbicacionSitio(punto);
                                    setAviso(`Ubicación registrada: ${formatearCoordenadas(punto)}`);
                                }
                            }}
                        />
                    </View>
                    <View style={styles.colBoton}>
                        <Boton
                            texto="Acelerómetro"
                            variante="secundario"
                            onPress={() => onAbrirPractica?.('acelerometro')}
                        />
                    </View>
                </View>

                <View style={styles.fila}>
                    <View style={styles.mitad}>
                        <Text style={estilosComunes.etiquetaInput}>Ancho (m)</Text>
                        <TextInput style={estilosComunes.input} value={ancho} onChangeText={setAncho} keyboardType="decimal-pad" placeholder="2.0" />
                    </View>
                    <View style={styles.mitad}>
                        <Text style={estilosComunes.etiquetaInput}>Alto (m)</Text>
                        <TextInput style={estilosComunes.input} value={alto} onChangeText={setAlto} keyboardType="decimal-pad" placeholder="1.2" />
                    </View>
                </View>

                <Text style={estilosComunes.etiquetaInput}>Material</Text>
                <View style={styles.filaMateriales}>
                    {materiales.map((m) => (
                        <TouchableOpacity
                            key={m.id}
                            activeOpacity={0.7}
                            style={[styles.opcionMaterial, materialId === m.id && styles.opcionMaterialActiva]}
                            onPress={() => {
                                setMaterialId(m.id);
                                setTotalMostrado(null);
                            }}
                        >
                            <Text style={styles.opcionTexto}>{m.nombre}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {totalMostrado != null ? (
                    <Text style={styles.totalCalc}>Total: {formatearMoneda(totalMostrado)}</Text>
                ) : null}

                {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

                <View style={styles.filaBotones}>
                    <View style={styles.colBoton}>
                        <Boton texto="Calcular" variante="secundario" onPress={onCalcular} />
                    </View>
                    <View style={styles.colBoton}>
                        <Boton texto="Guardar" onPress={onGuardar} />
                    </View>
                </View>
                    </View>
                </View>

            <View style={styles.filaFiltros}>
                {FILTROS.map(({ clave, label }) => (
                    <TouchableOpacity
                        key={clave}
                        activeOpacity={0.7}
                        style={[styles.chip, filtro === clave && styles.chipActivo]}
                        onPress={() => setFiltro(clave)}
                    >
                        <Text style={[styles.chipTexto, filtro === clave && styles.chipTextoActivo]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {lista.map((t) => (
                <TarjetaTrabajo key={t.id} trabajo={t} onAvanzar={() => avanzarEstado(t)} onPago={() => registrarPago(t)} />
            ))}
            </ContenedorScroll>
        </View>
    );
}

function TarjetaTrabajo({ trabajo: t, onAvanzar, onPago }) {
    const est = estadoTrabajo[t.estado];
    const pendiente = saldoPendiente(t);
    const puedeAvanzar = t.estado !== 'cobrado';
    const sig = puedeAvanzar ? estadoTrabajo[siguienteEstado(t.estado)] : null;

    return (
        <View style={estilosComunes.tarjeta}>
            <Text style={styles.cliente}>{t.cliente}</Text>
            <Text style={styles.desc}>{t.descripcion}</Text>
            <Text style={styles.material}>{t.material || t.vidrio || 'Material por definir'}</Text>
            {t.fotoReferencia ? (
                <Image source={{ uri: t.fotoReferencia }} style={styles.fotoTrabajo} accessibilityLabel="Foto del trabajo" />
            ) : null}
            {t.ubicacion ? (
                <Text style={styles.ubicacionTrabajo}>Sitio: {formatearCoordenadas(t.ubicacion)}</Text>
            ) : null}
            <View style={[styles.badge, { backgroundColor: est.fondo, alignSelf: 'flex-start' }]}>
                <Text style={[styles.badgeTexto, { color: est.color }]}>{est.etiqueta}</Text>
            </View>
            <Text style={styles.montos}>
                Total {formatearMoneda(t.total)} · Saldo {formatearMoneda(pendiente)}
            </Text>

            <View style={styles.filaBotones}>
                {puedeAvanzar && sig ? (
                    <View style={styles.colBoton}>
                        <Boton texto={`→ ${sig.etiqueta}`} variante="secundario" onPress={onAvanzar} />
                    </View>
                ) : null}
                {pendiente > 0 ? (
                    <View style={styles.colBoton}>
                        <Boton texto="Registrar pago" onPress={onPago} />
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    cotizacionUnificada: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colores.borde,
        overflow: 'hidden',
        backgroundColor: colores.tarjeta,
    },
    formularioCuerpo: {
        padding: 18,
        backgroundColor: colores.tarjeta,
    },
    formTitulo: {
        fontFamily: fuentes.bold,
        fontSize: 16,
        marginBottom: 8,
        color: colores.texto,
    },
    fila: {
        flexDirection: 'row',
        width: '100%',
    },
    mitad: {
        flex: 1,
        marginRight: 8,
    },
    filaMateriales: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    opcionMaterial: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colores.borde,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: colores.fondo,
    },
    opcionMaterialActiva: {
        borderColor: colores.primario,
        backgroundColor: colores.primarioClaro,
    },
    opcionTexto: {
        fontSize: 13,
        color: colores.texto,
    },
    totalCalc: {
        fontSize: 16,
        fontWeight: '700',
        color: colores.exito,
        marginBottom: 8,
    },
    aviso: {
        fontSize: 14,
        color: colores.primarioOscuro,
        backgroundColor: colores.primarioClaro,
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    filaBotones: {
        flexDirection: 'row',
        marginTop: 4,
    },
    colBoton: {
        flex: 1,
        marginHorizontal: 4,
        minWidth: 120,
    },
    filaFiltros: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        marginRight: 8,
        marginBottom: 8,
    },
    chipActivo: {
        backgroundColor: colores.primarioClaro,
        borderColor: colores.primario,
    },
    chipTexto: {
        fontSize: 13,
        color: colores.textoSuave,
    },
    chipTextoActivo: {
        color: colores.primarioOscuro,
        fontWeight: '700',
    },
    clientesGuardados: {
        marginBottom: 12,
    },
    clientesGuardadosTitulo: {
        fontSize: 12,
        fontWeight: '600',
        color: colores.textoSuave,
        marginBottom: 6,
    },
    filaClientes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chipCliente: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: colores.fondo,
        borderWidth: 1,
        borderColor: colores.borde,
        marginRight: 8,
        marginBottom: 8,
    },
    chipClienteActivo: {
        backgroundColor: colores.primarioClaro,
        borderColor: colores.primario,
    },
    chipClienteTexto: {
        fontSize: 13,
        color: colores.texto,
    },
    chipClienteTextoActivo: {
        color: colores.primarioOscuro,
        fontWeight: '700',
    },
    cliente: {
        fontSize: 16,
        fontWeight: '700',
        color: colores.texto,
    },
    desc: {
        fontSize: 14,
        color: colores.textoSuave,
        marginTop: 4,
    },
    material: {
        fontSize: 13,
        color: colores.primarioOscuro,
        marginTop: 4,
    },
    contenedorFoto: {
        marginBottom: 8,
    },
    vistaPrevia: {
        width: '100%',
        height: 160,
        borderRadius: 10,
        backgroundColor: colores.borde,
    },
    quitarFoto: {
        fontSize: 14,
        color: colores.advertencia,
        marginTop: 6,
        fontWeight: '600',
    },
    filaBotonesFoto: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    cajaUbicacion: {
        backgroundColor: colores.fondo,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: colores.borde,
        marginBottom: 8,
    },
    textoUbicacion: {
        fontSize: 14,
        fontWeight: '600',
        color: colores.texto,
        fontVariant: ['tabular-nums'],
    },
    subUbicacion: {
        fontSize: 12,
        color: colores.textoSuave,
        marginTop: 4,
    },
    ubicacionTrabajo: {
        fontSize: 12,
        color: colores.textoSuave,
        marginTop: 6,
        fontVariant: ['tabular-nums'],
    },
    fotoTrabajo: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginTop: 8,
        backgroundColor: colores.borde,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    badgeTexto: {
        fontSize: 11,
        fontWeight: '700',
    },
    montos: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        color: colores.texto,
    },
});
