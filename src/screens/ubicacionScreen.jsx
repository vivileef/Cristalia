import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import Boton from '../components/Boton';
import {
    abrirEnMapa,
    formatearCoordenadas,
    formatearPrecision,
    obtenerUbicacionActual,
    solicitarPermisoUbicacion,
} from '../utils/ubicacion';

export default function UbicacionScreen({ onVolver }) {
    const [ubicacion, setUbicacion] = useState(null);
    const [estadoPermiso, setEstadoPermiso] = useState('pendiente');
    const [siguiendo, setSiguiendo] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const suscripcion = useRef(null);

    useEffect(() => {
        Location.getForegroundPermissionsAsync().then(({ status }) => {
            setEstadoPermiso(status === 'granted' ? 'concedido' : status === 'denied' ? 'denegado' : 'sin_solicitar');
        });
        return () => {
            suscripcion.current?.remove();
        };
    }, []);

    const leerUnaVez = async () => {
        setMensaje('Leyendo GPS…');
        const punto = await obtenerUbicacionActual();
        if (punto) {
            setUbicacion(punto);
            setEstadoPermiso('concedido');
            setMensaje('Posición actualizada.');
        } else {
            setMensaje('No se obtuvo ubicación.');
        }
    };

    const alternarSeguimiento = async () => {
        if (siguiendo) {
            suscripcion.current?.remove();
            suscripcion.current = null;
            setSiguiendo(false);
            setMensaje('Seguimiento detenido.');
            return;
        }

        if (!(await solicitarPermisoUbicacion())) {
            setEstadoPermiso('denegado');
            return;
        }

        suscripcion.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 5,
                timeInterval: 2000,
            },
            (pos) => {
                setUbicacion({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy ?? null,
                    altitude: pos.coords.altitude ?? null,
                    timestamp: pos.timestamp,
                });
            }
        );
        setSiguiendo(true);
        setEstadoPermiso('concedido');
        setMensaje('Actualizando cada ~2 s o 5 m de movimiento.');
    };

    const textoPermiso =
        estadoPermiso === 'concedido'
            ? 'Permiso: concedido'
            : estadoPermiso === 'denegado'
              ? 'Permiso: denegado (revisa ajustes)'
              : 'Permiso: aún no solicitado';

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Ubicación GPS"
                subtitulo="Registra el sitio de medición o instalación y abre la ruta en mapas."
                onVolver={onVolver}
            />
            <ContenedorScroll>
            <View style={estilosComunes.tarjeta}>
                <Text style={styles.etiquetaEstado}>{textoPermiso}</Text>
                {ubicacion ? (
                    <>
                        <Text style={styles.valorGrande}>{formatearCoordenadas(ubicacion)}</Text>
                        <Text style={styles.detalle}>{formatearPrecision(ubicacion)}</Text>
                        {ubicacion.altitude != null ? (
                            <Text style={styles.detalle}>Altitud: {Math.round(ubicacion.altitude)} m</Text>
                        ) : null}
                        <Text style={styles.detalle}>
                            Hora: {new Date(ubicacion.timestamp).toLocaleString('es-EC')}
                        </Text>
                    </>
                ) : (
                    <Text style={styles.detalle}>Pulsa «Leer ubicación» para capturar coordenadas.</Text>
                )}
                {mensaje ? <Text style={styles.aviso}>{mensaje}</Text> : null}

                <View style={styles.filaBotones}>
                    <View style={styles.col}>
                        <Boton texto="Leer ubicación" onPress={leerUnaVez} />
                    </View>
                    <View style={styles.col}>
                        <Boton
                            texto={siguiendo ? 'Detener seguimiento' : 'Seguimiento'}
                            variante="secundario"
                            onPress={alternarSeguimiento}
                        />
                    </View>
                </View>
                {ubicacion ? (
                    <View style={styles.colSola}>
                        <Boton texto="Abrir en mapa" variante="secundario" onPress={() => abrirEnMapa(ubicacion)} />
                    </View>
                ) : null}
            </View>

            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    etiquetaEstado: {
        fontSize: 13,
        fontWeight: '600',
        color: colores.primarioOscuro,
        marginBottom: 8,
    },
    valorGrande: {
        fontSize: 18,
        fontWeight: '700',
        color: colores.texto,
        fontVariant: ['tabular-nums'],
    },
    detalle: {
        fontSize: 14,
        color: colores.textoSuave,
        marginTop: 6,
    },
    aviso: {
        fontSize: 14,
        color: colores.primarioOscuro,
        backgroundColor: colores.primarioClaro,
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    filaBotones: {
        flexDirection: 'row',
        marginTop: 12,
    },
    col: {
        flex: 1,
        marginHorizontal: 4,
    },
    colSola: {
        width: '100%',
        marginTop: 12,
    },
});
