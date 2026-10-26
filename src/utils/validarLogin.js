import { CREDENCIALES_DEMO } from '../constants/credencialesDemo';

/** Quita espacios, comillas tipográficas y caracteres invisibles al pegar desde el README. */
function normalizarEntrada(texto) {
    return String(texto ?? '')
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[«»"'‘’“”]/g, '')
        .trim();
}

/**
 * Valida correo y contraseña contra credenciales simuladas.
 * @returns {{ valido: boolean, mensaje: string | null }}
 */
export function validarLogin(correo, clave) {
    const correoNorm = normalizarEntrada(correo).toLowerCase().replace(/\s/g, '');
    const claveNorm = normalizarEntrada(clave);

    if (!correoNorm || !claveNorm) {
        return {
            valido: false,
            mensaje: 'Completa el correo y la contraseña para continuar.',
        };
    }

    const correoEsperado = CREDENCIALES_DEMO.correo.toLowerCase();
    const claveEsperada = CREDENCIALES_DEMO.clave.toLowerCase();

    const correoOk = correoNorm === correoEsperado;
    const claveOk = claveNorm.toLowerCase() === claveEsperada;

    if (!correoOk || !claveOk) {
        return {
            valido: false,
            mensaje: 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.',
        };
    }

    return { valido: true, mensaje: null };
}
