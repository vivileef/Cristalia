export const taller = {
    nombre: 'CRISTALIA',
    ciudad: 'Manta',
};

/** Sin datos precargados: las cotizaciones se agregan desde Solicitudes o Crear cotización. */
export const trabajosIniciales = [];

export function saldoPendiente(trabajo) {
    const total = Number(trabajo?.total) || 0;
    const pagado = Number(trabajo?.pagado) || 0;
    return Math.max(0, Math.round((total - pagado) * 100) / 100);
}

export function formatearUsd(valor) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return 'USD 0,00';
    return `USD ${n.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function siguienteReferencia(trabajos) {
    const nums = trabajos
        .map((t) => parseInt(String(t.referencia).replace(/\D/g, ''), 10))
        .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `COT-${String(next).padStart(3, '0')}`;
}
