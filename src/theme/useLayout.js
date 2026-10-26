import { useWindowDimensions } from 'react-native';

/** Ancho máximo del “marco” de app (móvil en web y tablet). */
export const ANCHO_MARCO_APP = 430;

export function useLayout() {
    const { width, height } = useWindowDimensions();
    const anchoMarco = Math.min(width, ANCHO_MARCO_APP);
    const compacto = anchoMarco < 360;
    const padding = compacto ? 16 : anchoMarco >= 400 ? 24 : 20;
    const anchoContenido = anchoMarco - padding * 2;

    return { width, height, compacto, padding, anchoMarco, anchoContenido };
}
