const PRECIO_VIDRIO_M2 = 35;
const PRECIO_PERFIL_M = 12;

export function calcularCotizacionVentana({
    anchoMetros,
    altoMetros,
    cantidadVentanas,
    manoObraUsd,
    precioVidrioM2 = PRECIO_VIDRIO_M2,
    precioPerfilM = PRECIO_PERFIL_M,
}) {
    const ancho = parseFloat(String(anchoMetros).replace(',', '.'));
    const alto = parseFloat(String(altoMetros).replace(',', '.'));
    const cantidad = parseInt(String(cantidadVentanas), 10) || 1;
    const manoObra = parseFloat(String(manoObraUsd).replace(',', '.')) || 0;

    if (!ancho || !alto || ancho <= 0 || alto <= 0 || cantidad <= 0) {
        return null;
    }

    const area = ancho * alto;
    const perimetro = 2 * (ancho + alto);
    const vidrio = Math.round(area * precioVidrioM2 * 100) / 100;
    const perfil = Math.round(perimetro * precioPerfilM * 100) / 100;
    const porVentana = Math.round((vidrio + perfil + manoObra) * 100) / 100;
    const total = Math.round(porVentana * cantidad * 100) / 100;

    return {
        area,
        perimetro,
        vidrio,
        perfil,
        manoObra,
        porVentana,
        total,
        cantidad,
        descripcionMedidas: `${cantidad} ventana${cantidad > 1 ? 's' : ''} de ${ancho.toLocaleString('es-EC', { minimumFractionDigits: 2 })} × ${alto.toLocaleString('es-EC', { minimumFractionDigits: 2 })} m`,
    };
}
