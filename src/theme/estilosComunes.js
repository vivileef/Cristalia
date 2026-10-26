import { StyleSheet } from 'react-native';
import { colores } from './colores';
import { fuentes } from './tipografia';

export const estilosComunes = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        padding: 12,
        backgroundColor: colores.tarjeta,
        fontFamily: fuentes.regular,
        fontSize: 15,
        color: colores.texto,
        marginBottom: 10,
        width: '100%',
    },
    etiquetaInput: {
        fontFamily: fuentes.semibold,
        fontSize: 13,
        color: colores.texto,
        marginBottom: 6,
    },
    tarjeta: {
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 18,
        padding: 18,
    },
    separador: {
        height: 1,
        backgroundColor: colores.separador,
        width: '100%',
    },
    filaDato: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    botonPrimario: {
        backgroundColor: colores.primario,
        borderRadius: 12,
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 16,
    },
    botonSecundario: {
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 16,
    },
    textoBotonPrimario: {
        fontFamily: fuentes.regular,
        color: '#ffffff',
        fontSize: 16,
    },
    textoBotonSecundario: {
        fontFamily: fuentes.regular,
        color: colores.marca,
        fontSize: 16,
    },
});
