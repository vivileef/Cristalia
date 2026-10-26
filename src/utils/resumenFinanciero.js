import { saldoPendiente } from '../data/datosGrupo';

/** Fecha local en formato ISO (AAAA-MM-DD) para filtros y reportes. */
export function fechaIsoLocal(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Mes en curso hasta hoy: incluye cotizaciones recién guardadas. */
export function periodoReportePorDefecto(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    return {
        desde: `${y}-${m}-01`,
        hasta: fechaIsoLocal(fecha),
    };
}

function parseIso(fechaIso) {
    if (!fechaIso) return null;
    const d = new Date(`${fechaIso}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
}

export function formatearFechaCorta(fechaIso) {
    const d = parseIso(fechaIso);
    if (!d) return '';
    return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatearFechaLarga(fecha = new Date()) {
    return fecha.toLocaleDateString('es-EC', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatearRangoPeriodo(desdeIso, hastaIso) {
    const d1 = parseIso(desdeIso);
    const d2 = parseIso(hastaIso);
    if (!d1 || !d2) return '';
    const ini = d1.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });
    const fin = d2.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${ini}–${fin}`;
}

export function calcularResumenTrabajos(trabajos, desdeIso, hastaIso) {
    const desde = parseIso(desdeIso);
    const hasta = parseIso(hastaIso);
    if (!desde || !hasta) {
        return { cotizado: 0, cobrado: 0, pendiente: 0, filas: [] };
    }

    let cotizado = 0;
    let cobrado = 0;
    const filas = [];

    for (const t of trabajos) {
        const f = parseIso(t.fecha);
        if (!f || f < desde || f > hasta) continue;
        cotizado += Number(t.total) || 0;
        cobrado += Number(t.pagado) || 0;
        filas.push({
            ref: t.referencia,
            cliente: t.cliente,
            estado: t.estado,
            total: t.total,
            saldo: saldoPendiente(t),
        });
    }

    cotizado = Math.round(cotizado * 100) / 100;
    cobrado = Math.round(cobrado * 100) / 100;
    const pendiente = Math.round((cotizado - cobrado) * 100) / 100;

    return { cotizado, cobrado, pendiente, filas };
}

export function horaEstiloIos(date = new Date()) {
    return date.toLocaleTimeString('es-EC', { hour: 'numeric', minute: '2-digit', hour12: false });
}
