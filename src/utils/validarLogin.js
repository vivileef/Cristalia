import { CREDENCIALES_DEMO } from '../constants/credencialesDemo';

/**
 * Valida correo y contraseña contra credenciales simuladas.
 * @returns {{ valido: boolean, mensaje: string | null }}
 */
export function validarLogin(correo, clave) {
    const correoNorm = correo.trim().toLowerCase();
    const claveNorm = clave.trim();

    if (!correoNorm || !claveNorm) {
        return {
            valido: false,
            mensaje: 'Completa el correo y la contraseña para continuar.',
        };
    }

    const correoOk = correoNorm === CREDENCIALES_DEMO.correo.toLowerCase();
    const claveOk = claveNorm === CREDENCIALES_DEMO.clave;

    if (!correoOk || !claveOk) {
        return {
            valido: false,
            mensaje: 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.',
        };
    }

    return { valido: true, mensaje: null };
}
