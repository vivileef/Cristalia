import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { colores } from '../theme/colores';
import Boton from '../components/Boton';
import { estilosComunes } from '../theme/estilosComunes';
import { fuentes } from '../theme/tipografia';

export default function AvisosScreen({ avisosIniciales, onAbrirNotificacionesPush }) {
    const [avisos, setAvisos] = useState(avisosIniciales);

    const marcarLeido = (id) => {
        setAvisos((prev) => prev.map((a) => (a.id === id ? { ...a, leido: true } : a)));
    };

    const noLeidos = avisos.filter((a) => !a.leido).length;

    const subtitulo =
        (noLeidos > 0 ? `${noLeidos} sin leer · ` : '') + 'Recordatorios y novedades del taller.';

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca titulo="Avisos" subtitulo={subtitulo} />
            <ContenedorScroll>
            {avisos.length === 0 ? (
                <View style={[estilosComunes.tarjeta, styles.vacio]}>
                    <Text style={styles.vacioTitulo}>Sin avisos por ahora</Text>
                    <Text style={styles.vacioSub}>
                        Cuando registres solicitudes o pagos, aquí aparecerán recordatorios.
                    </Text>
                </View>
            ) : null}
            {avisos.map((aviso) => (
                <Pressable
                    key={aviso.id}
                    onPress={() => marcarLeido(aviso.id)}
                    style={[estilosComunes.tarjeta, styles.tarjetaAviso, !aviso.leido && styles.tarjetaNueva]}
                >
                    <View style={styles.filaTitulo}>
                        <Text style={styles.tituloAviso}>{aviso.titulo}</Text>
                        {!aviso.leido ? <View style={styles.punto} /> : null}
                    </View>
                    <Text style={styles.cuerpo}>{aviso.cuerpo}</Text>
                    <Text style={styles.fecha}>{aviso.fecha}</Text>
                </Pressable>
            ))}

            <View style={styles.zonaPush}>
                <Boton texto="Configurar notificaciones push" variante="secundario" onPress={onAbrirNotificacionesPush} />
            </View>
            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    tarjetaAviso: {
        marginBottom: 12,
    },
    tarjetaNueva: {
        borderColor: colores.marca,
        backgroundColor: colores.primarioClaro,
    },
    filaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    tituloAviso: {
        fontFamily: fuentes.semibold,
        fontSize: 16,
        color: colores.texto,
        flex: 1,
    },
    punto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colores.marca,
        marginLeft: 8,
    },
    cuerpo: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        lineHeight: 20,
    },
    fecha: {
        fontFamily: fuentes.regular,
        fontSize: 12,
        color: colores.textoSuave,
        marginTop: 10,
    },
    zonaPush: {
        width: '100%',
        marginTop: 8,
    },
    vacio: { gap: 8 },
    vacioTitulo: {
        fontFamily: fuentes.semibold,
        fontSize: 16,
        color: colores.texto,
    },
    vacioSub: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        lineHeight: 20,
    },
});
