export const materiales = [
    { id: 'v1', tipo: 'Vidrio', nombre: 'Templado 8 mm', precioRef: 28 },
    { id: 'a1', tipo: 'Aluminio', nombre: 'Perfil ventana 140', precioRef: 18 },
];

export const ordenEstados = ['cotizado', 'aprobado', 'en_proceso', 'instalado', 'cobrado'];

export function siguienteEstado(estadoActual) {
    const i = ordenEstados.indexOf(estadoActual);
    if (i < 0 || i >= ordenEstados.length - 1) return estadoActual;
    return ordenEstados[i + 1];
}

export function formatearMoneda(valor) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return '$0';
    return `$${n.toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
