/** Claves de pantalla usadas en App.js para navegar entre vistas. */
export const RUTAS = {
    INICIO: 'inicio',
    SOLICITUDES: 'solicitudes',
    TRABAJOS: 'trabajos',
    REPORTES: 'reportes',
    AVISOS: 'avisos',
    /** Pantalla de práctica push (nombre exigido en guía). */
    NOTIFICACIONES: 'notificaciones',
    PERFIL: 'perfil',
    UBICACION: 'ubicacion',
    ACELEROMETRO: 'acelerometro',
    /** @deprecated Usar NOTIFICACIONES */
    NOTIFICACIONES_PUSH: 'notificaciones',
    CREAR_COTIZACION: 'crearCotizacion',
    COTIZACION_GUARDADA: 'cotizacionGuardada',
    DETALLE_TRABAJO: 'detalleTrabajo',
    REGISTRAR_PAGO: 'registrarPago',
    PAGO_GUARDADO: 'pagoGuardado',
};

export const RUTAS_CON_MENU_INFERIOR = [
    RUTAS.INICIO,
    RUTAS.SOLICITUDES,
    RUTAS.TRABAJOS,
    RUTAS.REPORTES,
    RUTAS.AVISOS,
    RUTAS.NOTIFICACIONES,
    RUTAS.PERFIL,
];

export const RUTAS_SIN_MENU_INFERIOR = [
    RUTAS.UBICACION,
    RUTAS.ACELEROMETRO,
    RUTAS.NOTIFICACIONES,
    RUTAS.CREAR_COTIZACION,
    RUTAS.COTIZACION_GUARDADA,
    RUTAS.DETALLE_TRABAJO,
    RUTAS.REGISTRAR_PAGO,
    RUTAS.PAGO_GUARDADO,
];
