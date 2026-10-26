import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { usuario } from '../data/datosUsuario';
import { formatearMoneda } from '../data/datosPractica';
import { saldoPendiente } from '../data/datosGrupo';
import Boton from '../components/Boton';
import { confirmarAccion } from '../utils/feedback';
import { abrirCamara, abrirGaleria } from '../utils/imagenes';
import { fuentes } from '../theme/tipografia';

export default function PerfilScreen({ trabajos = [], onCerrarSesion, onAbrirPractica }) {
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const pendiente = trabajos.reduce((acc, t) => acc + saldoPendiente(t), 0);

    const cerrarSesion = () => {
        confirmarAccion('Cerrar sesión', '¿Salir de Cristalia?', () => {
            onCerrarSesion?.();
        });
    };

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca titulo="Perfil" subtitulo="Tu cuenta y herramientas del taller." />
            <ContenedorScroll>
            <View style={styles.avatar}>
                {fotoPerfil ? (
                    <Image source={{ uri: fotoPerfil }} style={styles.avatarImagen} accessibilityLabel="Foto de perfil" />
                ) : (
                    <Text style={styles.avatarTexto}>{usuario.iniciales}</Text>
                )}
            </View>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.rol}>
                {usuario.rol} · {usuario.empresa}
            </Text>

            <Text style={estilosComunes.etiquetaInput}>Teléfono</Text>
            <Text style={styles.dato}>{usuario.telefono}</Text>

            <Text style={estilosComunes.etiquetaInput}>Correo</Text>
            <Text style={styles.dato}>{usuario.correo}</Text>

            <Text style={styles.resumen}>
                {trabajos.length} trabajos · Por cobrar {formatearMoneda(pendiente)}
            </Text>

            <Text style={styles.seccionAcciones}>Foto y sensores</Text>
            <View style={styles.filaAcciones}>
                <View style={styles.botonAccion}>
                    <Boton
                        texto="Galería"
                        variante="secundario"
                        onPress={async () => {
                            const uri = await abrirGaleria();
                            if (uri) setFotoPerfil(uri);
                        }}
                    />
                </View>
                <View style={styles.botonAccion}>
                    <Boton
                        texto="Cámara"
                        variante="secundario"
                        onPress={async () => {
                            const uri = await abrirCamara();
                            if (uri) setFotoPerfil(uri);
                        }}
                    />
                </View>
            </View>
            <View style={styles.filaAcciones}>
                <View style={styles.botonAccion}>
                    <Boton texto="GPS" variante="secundario" onPress={() => onAbrirPractica?.('ubicacion')} />
                </View>
                <View style={styles.botonAccion}>
                    <Boton
                        texto="Acelerómetro"
                        variante="secundario"
                        onPress={() => onAbrirPractica?.('acelerometro')}
                    />
                </View>
            </View>
            <View style={styles.filaAcciones}>
                <View style={styles.botonAccion}>
                    <Boton
                        texto="Notificaciones push"
                        variante="secundario"
                        onPress={() => onAbrirPractica?.('notificacionesPush')}
                    />
                </View>
            </View>

            <View style={styles.zonaBoton}>
                <Boton texto="Cerrar sesión" onPress={cerrarSesion} />
            </View>
            </ContenedorScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colores.marca,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'hidden',
    },
    avatarImagen: {
        width: 64,
        height: 64,
    },
    seccionAcciones: {
        fontFamily: fuentes.semibold,
        fontSize: 14,
        color: colores.textoSuave,
        width: '100%',
        marginTop: 4,
        marginBottom: 6,
    },
    filaAcciones: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 8,
    },
    botonAccion: {
        flex: 1,
        marginHorizontal: 4,
    },
    avatarTexto: {
        color: '#fff',
        fontFamily: fuentes.bold,
        fontSize: 22,
    },
    nombre: {
        fontFamily: fuentes.bold,
        fontSize: 22,
        color: colores.texto,
    },
    rol: {
        fontFamily: fuentes.regular,
        fontSize: 14,
        color: colores.textoSuave,
        marginBottom: 20,
    },
    dato: {
        fontFamily: fuentes.regular,
        fontSize: 16,
        color: colores.texto,
        marginBottom: 14,
    },
    resumen: {
        fontFamily: fuentes.semibold,
        fontSize: 15,
        color: colores.primarioOscuro,
        marginVertical: 16,
        padding: 12,
        backgroundColor: colores.primarioClaro,
        borderRadius: 10,
        width: '100%',
        textAlign: 'center',
    },
    zonaBoton: {
        width: '100%',
        marginTop: 8,
        marginBottom: 24,
        zIndex: 10,
    },
});
