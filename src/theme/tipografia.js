export const fuentes = {
    regular: 'Inter_400Regular',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
};

export function texto(base = {}) {
    return { fontFamily: fuentes.regular, ...base };
}

export function textoSemibold(base = {}) {
    return { fontFamily: fuentes.semibold, fontWeight: '600', ...base };
}

export function textoBold(base = {}) {
    return { fontFamily: fuentes.bold, fontWeight: '700', ...base };
}
