import { useMemo, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';

import LoginScreen from './src/screens/loginScreen';
import InicioScreen from './src/screens/inicioScreen';
import TrabajosScreen from './src/screens/trabajosScreen';
import ReportesScreen from './src/screens/reportesScreen';
import SolicitudScreen from './src/screens/solicitudScreen';
import AvisosScreen from './src/screens/avisosScreen';
import PerfilScreen from './src/screens/perfilScreen';
import UbicacionScreen from './src/screens/ubicacionScreen';
import AcelerometroScreen from './src/screens/acelerometroScreen';
import NotificacionesPush from './src/screens/NotificacionesPush';
import CrearCotizacionScreen from './src/screens/crearCotizacionScreen';
import CotizacionGuardadaScreen from './src/screens/cotizacionGuardadaScreen';
import DetalleTrabajoScreen from './src/screens/detalleTrabajoScreen';
import RegistrarPagoScreen from './src/screens/registrarPagoScreen';
import PagoGuardadoScreen from './src/screens/pagoGuardadoScreen';
import MenuInferior from './src/components/menuInferior';
import PantallaGrupal from './src/components/pantallaGrupal';
import { RUTAS, RUTAS_CON_MENU_INFERIOR } from './src/navigation/rutas';
import { colores } from './src/theme/colores';
import {
    formatearUsd,
    saldoPendiente,
    siguienteReferencia,
    trabajosIniciales,
} from './src/data/datosGrupo';
import { avisosIniciales } from './src/data/datosUsuario';
import {
    calcularResumenTrabajos,
    formatearRangoPeriodo,
    periodoReportePorDefecto,
} from './src/utils/resumenFinanciero';
import { configurarManejadorNotificaciones } from './src/utils/notificaciones';
import { mostrarAviso } from './src/utils/feedback';
import { ANCHO_MARCO_APP } from './src/theme/useLayout';

configurarManejadorNotificaciones();

function fechaLabelHoy() {
    return new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [pantallaActual, setPantallaActual] = useState(RUTAS.INICIO);
    const [trabajos, setTrabajos] = useState(trabajosIniciales);
    const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(null);
    const [ultimoPago, setUltimoPago] = useState(null);
    const [retornoTrabajos, setRetornoTrabajos] = useState(RUTAS.TRABAJOS);
    const [retornoPractica, setRetornoPractica] = useState(RUTAS.PERFIL);

    const periodoInicio = useMemo(() => periodoReportePorDefecto(), []);
    const resumenInicio = useMemo(
        () => calcularResumenTrabajos(trabajos, periodoInicio.desde, periodoInicio.hasta),
        [trabajos, periodoInicio],
    );
    const periodoInicioLabel = formatearRangoPeriodo(periodoInicio.desde, periodoInicio.hasta);

    const trabajoSeleccionado = useMemo(
        () => trabajos.find((t) => t.id === trabajoSeleccionadoId) ?? null,
        [trabajos, trabajoSeleccionadoId],
    );

    const actualizarTrabajo = (id, cambios) => {
        setTrabajos((prev) => prev.map((t) => (t.id === id ? { ...t, ...cambios } : t)));
    };

    const abrirTrabajo = (id, retorno = RUTAS.TRABAJOS) => {
        setTrabajoSeleccionadoId(id);
        setRetornoTrabajos(retorno);
        setPantallaActual(RUTAS.DETALLE_TRABAJO);
    };

    const abrirPractica = (pantalla, desde = pantallaActual) => {
        setRetornoPractica(desde);
        setPantallaActual(pantalla);
    };

    const cerrarSesion = () => {
        setUsuarioAutenticado(false);
        setPantallaActual(RUTAS.INICIO);
        setTrabajoSeleccionadoId(null);
        setUltimoPago(null);
    };

    const guardarCotizacion = (borrador) => {
        const referencia = siguienteReferencia(trabajos);
        const id = referencia.toLowerCase();
        const nuevo = {
            id,
            referencia,
            fecha: new Date().toISOString().slice(0, 10),
            fechaLabel: fechaLabelHoy(),
            historial: [
                {
                    fecha: fechaLabelHoy(),
                    titulo: 'Cotización creada',
                    detalle: `${referencia} · ${borrador.total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}`,
                },
            ],
            ...borrador,
        };
        setTrabajos((prev) => [nuevo, ...prev]);
        setTrabajoSeleccionadoId(id);
        setPantallaActual(RUTAS.COTIZACION_GUARDADA);
    };

    const agregarTrabajoDesdeSolicitud = (trabajoSimple) => {
        const referencia = siguienteReferencia(trabajos);
        const id = referencia.toLowerCase();
        const nuevo = {
            id,
            referencia,
            cliente: trabajoSimple.cliente,
            descripcion: trabajoSimple.descripcion,
            material: trabajoSimple.material,
            total: trabajoSimple.total,
            pagado: trabajoSimple.pagado ?? 0,
            estado: trabajoSimple.estado || 'cotizado',
            fecha: trabajoSimple.fecha || new Date().toISOString().slice(0, 10),
            fechaLabel: fechaLabelHoy(),
            ...(trabajoSimple.fotoReferencia ? { fotoReferencia: trabajoSimple.fotoReferencia } : {}),
            ...(trabajoSimple.ubicacion ? { ubicacion: trabajoSimple.ubicacion } : {}),
            historial: [
                {
                    fecha: fechaLabelHoy(),
                    titulo: 'Cotización creada',
                    detalle: `${referencia} · ${formatearUsd(trabajoSimple.total)}`,
                },
            ],
        };
        setTrabajos((prev) => [nuevo, ...prev]);
    };

    const marcarComoInstalado = (id) => {
        const t = trabajos.find((x) => x.id === id);
        if (!t) return;
        if (t.estado === 'instalado') {
            mostrarAviso('Instalado', 'Este trabajo ya está marcado como instalado.');
            return;
        }
        if (t.estado === 'cobrado') {
            mostrarAviso('Cobrado', 'No aplica: el trabajo ya está cobrado por completo.');
            return;
        }
        const fecha = fechaLabelHoy();
        const evento = {
            fecha,
            titulo: 'Instalación completada',
            detalle: 'Se registró la instalación en sitio.',
        };
        actualizarTrabajo(id, {
            estado: 'instalado',
            estadoDesde: fecha,
            historial: [evento, ...(t.historial ?? [])],
        });
        mostrarAviso('Instalado', `${t.referencia ?? 'Trabajo'} marcado como instalado.`);
    };

    const registrarPago = ({ monto, metodo }) => {
        const t = trabajoSeleccionado;
        if (!t) return;
        const pagado = Math.round((Number(t.pagado) + monto) * 100) / 100;
        const saldo = saldoPendiente({ ...t, pagado });
        const refPago = `PAG-${t.referencia.replace('COT-', '')}-${String(Math.floor(Math.random() * 90) + 1).padStart(2, '0')}`;
        const evento = {
            fecha: fechaLabelHoy(),
            titulo: `Anticipo recibido · ${formatearUsd(monto)}`,
            detalle: `${metodo} · ${refPago}`,
        };
        const historial = [evento, ...(t.historial ?? [])];
        let estado = t.estado;
        if (saldo <= 0) estado = 'cobrado';
        else if (estado === 'cotizado') estado = 'aprobado';

        actualizarTrabajo(t.id, { pagado, historial, estado });
        setUltimoPago({
            monto,
            metodo,
            referenciaPago: refPago,
            fechaLabel: fechaLabelHoy(),
        });
        setPantallaActual(RUTAS.PAGO_GUARDADO);
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.cargando}>
                <ActivityIndicator color={colores.marca} />
            </View>
        );
    }

    if (!usuarioAutenticado) {
        return (
            <SafeAreaProvider>
                <View style={styles.app}>
                    <StatusBar barStyle="dark-content" backgroundColor={colores.fondoExterior} />
                    <SafeAreaView style={styles.areaContenido} edges={['top', 'left', 'right', 'bottom']}>
                        <View style={styles.marcoMovil}>
                            <LoginScreen onLogin={() => setUsuarioAutenticado(true)} />
                        </View>
                    </SafeAreaView>
                </View>
            </SafeAreaProvider>
        );
    }

    let pantalla;
    switch (pantallaActual) {
        case RUTAS.SOLICITUDES:
            pantalla = (
                <SolicitudScreen
                    trabajos={trabajos}
                    onAgregarTrabajo={agregarTrabajoDesdeSolicitud}
                    onActualizarTrabajo={actualizarTrabajo}
                    onAbrirPractica={() => abrirPractica(RUTAS.ACELEROMETRO, RUTAS.SOLICITUDES)}
                />
            );
            break;
        case RUTAS.AVISOS:
            pantalla = (
                <AvisosScreen
                    avisosIniciales={avisosIniciales}
                    onAbrirNotificacionesPush={() => setPantallaActual(RUTAS.NOTIFICACIONES)}
                />
            );
            break;
        case RUTAS.PERFIL:
            pantalla = (
                <PerfilScreen
                    trabajos={trabajos}
                    onCerrarSesion={cerrarSesion}
                    onAbrirPractica={(p) => {
                        const map = {
                            ubicacion: RUTAS.UBICACION,
                            acelerometro: RUTAS.ACELEROMETRO,
                            notificacionesPush: RUTAS.NOTIFICACIONES,
                        };
                        abrirPractica(map[p] ?? RUTAS.PERFIL, RUTAS.PERFIL);
                    }}
                />
            );
            break;
        case RUTAS.UBICACION:
            pantalla = <UbicacionScreen onVolver={() => setPantallaActual(retornoPractica)} />;
            break;
        case RUTAS.ACELEROMETRO:
            pantalla = <AcelerometroScreen onVolver={() => setPantallaActual(retornoPractica)} />;
            break;
        case RUTAS.NOTIFICACIONES:
            pantalla = <NotificacionesPush enMenu onVolver={() => setPantallaActual(retornoPractica)} />;
            break;
        case RUTAS.TRABAJOS:
            pantalla = <TrabajosScreen trabajos={trabajos} onAbrirTrabajo={(id) => abrirTrabajo(id, RUTAS.TRABAJOS)} />;
            break;
        case RUTAS.REPORTES:
            pantalla = <ReportesScreen trabajos={trabajos} />;
            break;
        case RUTAS.CREAR_COTIZACION:
            pantalla = (
                <CrearCotizacionScreen
                    onVolver={() => setPantallaActual(RUTAS.INICIO)}
                    onGuardar={guardarCotizacion}
                />
            );
            break;
        case RUTAS.COTIZACION_GUARDADA:
            pantalla = (
                <CotizacionGuardadaScreen
                    trabajo={trabajoSeleccionado}
                    onVolver={() => setPantallaActual(RUTAS.TRABAJOS)}
                    onAprobar={(id) => {
                        actualizarTrabajo(id, { estado: 'aprobado' });
                        abrirTrabajo(id, RUTAS.TRABAJOS);
                    }}
                    onEditar={() => setPantallaActual(RUTAS.CREAR_COTIZACION)}
                />
            );
            break;
        case RUTAS.DETALLE_TRABAJO:
            pantalla = (
                <DetalleTrabajoScreen
                    trabajo={trabajoSeleccionado}
                    onVolver={() => setPantallaActual(retornoTrabajos)}
                    onRegistrarPago={() => setPantallaActual(RUTAS.REGISTRAR_PAGO)}
                    onMarcarInstalado={marcarComoInstalado}
                />
            );
            break;
        case RUTAS.REGISTRAR_PAGO:
            pantalla = (
                <RegistrarPagoScreen
                    trabajo={trabajoSeleccionado}
                    onVolver={() => setPantallaActual(RUTAS.DETALLE_TRABAJO)}
                    onConfirmar={registrarPago}
                />
            );
            break;
        case RUTAS.PAGO_GUARDADO:
            pantalla = (
                <PagoGuardadoScreen
                    trabajo={trabajoSeleccionado}
                    pago={ultimoPago}
                    onVolverDetalle={() => setPantallaActual(RUTAS.DETALLE_TRABAJO)}
                />
            );
            break;
        default:
            pantalla = (
                <InicioScreen
                    trabajos={trabajos}
                    resumen={resumenInicio}
                    periodoLabel={periodoInicioLabel}
                    onIrSolicitudes={() => setPantallaActual(RUTAS.SOLICITUDES)}
                    onIrTrabajos={() => setPantallaActual(RUTAS.TRABAJOS)}
                    onIrReportes={() => setPantallaActual(RUTAS.REPORTES)}
                    onVerTrabajo={(id) => abrirTrabajo(id, RUTAS.INICIO)}
                    onCerrarSesion={cerrarSesion}
                />
            );
    }

    const mostrarMenu = RUTAS_CON_MENU_INFERIOR.includes(pantallaActual);

    return (
        <SafeAreaProvider>
            <View style={styles.app}>
                <StatusBar barStyle="dark-content" backgroundColor={colores.fondoExterior} />
                <SafeAreaView style={styles.areaContenido} edges={['top', 'left', 'right']}>
                    <View style={styles.marcoMovil}>
                        <PantallaGrupal>{pantalla}</PantallaGrupal>
                        {mostrarMenu ? (
                            <MenuInferior pantallaActual={pantallaActual} cambiarPantalla={setPantallaActual} />
                        ) : null}
                    </View>
                </SafeAreaView>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: colores.fondoExterior,
        alignItems: 'center',
    },
    areaContenido: {
        flex: 1,
        width: '100%',
        maxWidth: ANCHO_MARCO_APP,
    },
    marcoMovil: {
        flex: 1,
        width: '100%',
        maxWidth: ANCHO_MARCO_APP,
        backgroundColor: colores.tarjeta,
        overflow: 'hidden',
    },
    cargando: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colores.fondo,
    },
});
