import { materiales } from '../data/datosPractica';

/** Área en m² × precio ref. + 35% mano de obra (simulado). */
export function calcularTotalCotizacion(anchoMetros, altoMetros, materialId) {
    const ancho = parseFloat(String(anchoMetros).replace(',', '.'));
    const alto = parseFloat(String(altoMetros).replace(',', '.'));
    if (!ancho || !alto || ancho <= 0 || alto <= 0) {
        return null;
    }
    const material = materiales.find((m) => m.id === materialId);
    if (!material) return null;

    const area = ancho * alto;
    const costoMaterial = area * material.precioRef;
    const manoObra = costoMaterial * 0.35;
    const total = Math.round(costoMaterial + manoObra);
    return { total, area, material };
}
