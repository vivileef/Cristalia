/** Clave estable para comparar nombres (sin duplicar por mayúsculas o espacios). */
export function claveCliente(nombre) {
    return String(nombre ?? '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
}

/** Lista única de clientes a partir de los trabajos guardados. */
export function clientesUnicosDesdeTrabajos(trabajos) {
    const vistos = new Map();
    for (const t of trabajos ?? []) {
        const nombre = String(t?.cliente ?? '').trim();
        if (!nombre) continue;
        const key = claveCliente(nombre);
        if (!vistos.has(key)) vistos.set(key, nombre);
    }
    return Array.from(vistos.values()).sort((a, b) => a.localeCompare(b, 'es'));
}

/** Añade un nombre solo si aún no está en la lista (comparación normalizada). */
export function agregarClienteSinDuplicar(lista, nombre) {
    const limpio = String(nombre ?? '').trim();
    if (!limpio) return lista ?? [];
    const key = claveCliente(limpio);
    const base = lista ?? [];
    if (base.some((c) => claveCliente(c) === key)) return base;
    return [...base, limpio];
}
