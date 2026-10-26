import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraVolver } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { calcularCotizacionVentana } from '../utils/cotizacionGrupal';
import { formatearUsd } from '../data/datosGrupo';
import { claveCliente } from '../utils/clientes';

export default function CrearCotizacionScreen({ clientesGuardados = [], onVolver, onGuardar }) {
    const [cliente, setCliente] = useState('María Zambrano');
    const [nombreTrabajo, setNombreTrabajo] = useState('Ventanas de aluminio');
    const [ancho, setAncho] = useState('1,20');
    const [alto, setAlto] = useState('1,50');
    const [cantidad, setCantidad] = useState('2');
    const [vidrio, setVidrio] = useState('Vidrio claro de 6 mm');
    const [perfil, setPerfil] = useState('Natural');
    const [manoObra, setManoObra] = useState('45,00');

    const calculo = useMemo(
        () =>
            calcularCotizacionVentana({
                anchoMetros: ancho,
                altoMetros: alto,
                cantidadVentanas: cantidad,
                manoObraUsd: manoObra,
            }),
        [ancho, alto, cantidad, manoObra],
    );

    const guardar = () => {
        if (!cliente.trim() || !nombreTrabajo.trim()) {
            Alert.alert('Datos incompletos', 'Indica cliente y nombre del trabajo.');
            return;
        }
        if (!calculo) {
            Alert.alert('Medidas inválidas', 'Revisa ancho, alto y cantidad.');
            return;
        }
        onGuardar({
            cliente: cliente.trim(),
            descripcion: nombreTrabajo.trim(),
            total: calculo.total,
            pagado: 0,
            estado: 'cotizado',
            medidas: {
                ancho: parseFloat(ancho.replace(',', '.')),
                alto: parseFloat(alto.replace(',', '.')),
                cantidad: calculo.cantidad,
            },
            vidrio,
            perfil,
            manoObra: calculo.manoObra,
            calculo,
        });
    };

    return (
        <View style={styles.pantalla}>
            <CabeceraVolver
                titulo="Crear cotización"
                subtitulo="Ingresa las medidas. Nosotros hacemos las cuentas."
                onVolver={onVolver}
            />
            <ContenedorScroll>
                <Seccion titulo="¿Para quién es?">
                    <Campo label="Nombre del cliente" value={cliente} onChangeText={setCliente} />
                    {clientesGuardados.length > 0 ? (
                        <View style={styles.clientesGuardados}>
                            <Text style={styles.clientesGuardadosTitulo}>Clientes guardados</Text>
                            <View style={styles.filaClientes}>
                                {clientesGuardados.map((nombre) => (
                                    <TouchableOpacity
                                        key={claveCliente(nombre)}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.chipCliente,
                                            claveCliente(cliente) === claveCliente(nombre) && styles.chipClienteActivo,
                                        ]}
                                        onPress={() => setCliente(nombre)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipClienteTexto,
                                                claveCliente(cliente) === claveCliente(nombre) &&
                                                    styles.chipClienteTextoActivo,
                                            ]}
                                        >
                                            {nombre}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : null}
                    <Text style={styles.ayuda}>Elige un cliente guardado o escribe uno nuevo.</Text>
                    <Campo label="Nombre del trabajo" value={nombreTrabajo} onChangeText={setNombreTrabajo} />
                </Seccion>

                <Seccion titulo="Medidas de cada ventana">
                    <View style={styles.fila}>
                        <Campo label="Ancho (m)" value={ancho} onChangeText={setAncho} flex />
                        <Campo label="Alto (m)" value={alto} onChangeText={setAlto} flex />
                    </View>
                    <Campo label="Cantidad de ventanas" value={cantidad} onChangeText={setCantidad} keyboardType="number-pad" />
                </Seccion>

                <Text style={styles.seccion}>¿Qué vas a usar?</Text>
                <Campo label="Vidrio" value={vidrio} onChangeText={setVidrio} />
                {calculo ? (
                    <Campo label="Costo vidrio (por ventana)" value={String(calculo.vidrio).replace('.', ',')} editable={false} />
                ) : null}
                <Campo label="Perfil de aluminio" value={perfil} onChangeText={setPerfil} />
                {calculo ? (
                    <Campo label="Costo perfil (por ventana)" value={String(calculo.perfil).replace('.', ',')} editable={false} />
                ) : null}
                <Campo
                    label="Mano de obra por ventana (USD)"
                    value={manoObra}
                    onChangeText={setManoObra}
                    keyboardType="decimal-pad"
                />

                {calculo ? (
                    <Seccion titulo="Así se calcula">
                        <View style={estilosComunes.tarjeta}>
                            <Text style={styles.miniTitulo}>POR CADA VENTANA</Text>
                            <FilaCalculo
                                concepto={`Vidrio · ${calculo.area.toLocaleString('es-EC', { minimumFractionDigits: 2 })} m² × USD 35`}
                                valor={calculo.vidrio.toFixed(2).replace('.', ',')}
                            />
                            <FilaCalculo
                                concepto={`Perfil · ${calculo.perimetro.toLocaleString('es-EC', { minimumFractionDigits: 2 })} m × USD 12`}
                                valor={calculo.perfil.toFixed(2).replace('.', ',')}
                            />
                            <FilaCalculo concepto="Mano de obra" valor={calculo.manoObra.toFixed(2).replace('.', ',')} />
                            <View style={estilosComunes.separador} />
                            <FilaCalculo concepto="Por ventana" valor={formatearUsd(calculo.porVentana).replace('USD ', 'USD ')} fuerte />
                        </View>
                        <View style={styles.totalCard}>
                            <FilaCalculo
                                concepto={`Total · ${calculo.cantidad} ventanas`}
                                valor={formatearUsd(calculo.total)}
                                fuerte
                            />
                            <Text style={styles.ayuda}>Precios de referencia, sin impuestos ni recargos.</Text>
                        </View>
                    </Seccion>
                ) : null}

                <Pressable style={estilosComunes.botonPrimario} onPress={guardar}>
                    <Ionicons name="checkmark" size={21} color="#fff" />
                    <Text style={estilosComunes.textoBotonPrimario}>Guardar cotización</Text>
                </Pressable>
            </ContenedorScroll>
        </View>
    );
}

function Seccion({ titulo, children }) {
    return (
        <View style={styles.bloque}>
            <Text style={styles.seccion}>{titulo}</Text>
            {children}
        </View>
    );
}

function Campo({ label, flex, editable = true, ...props }) {
    return (
        <View style={[styles.campo, flex && styles.flex]}>
            <Text style={styles.etiqueta}>{label}</Text>
            <TextInput
                style={styles.entrada}
                editable={editable}
                placeholderTextColor={colores.textoSuave}
                {...props}
            />
        </View>
    );
}

function FilaCalculo({ concepto, valor, fuerte }) {
    return (
        <View style={estilosComunes.filaDato}>
            <Text style={[styles.concepto, fuerte && styles.fuerte]}>{concepto}</Text>
            <Text style={[styles.valor, fuerte && styles.fuerteValor]}>{valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    bloque: { gap: 16 },
    seccion: { fontSize: 20, color: colores.texto },
    fila: { flexDirection: 'row', gap: 12 },
    campo: { gap: 8 },
    flex: { flex: 1 },
    etiqueta: { fontSize: 14, fontWeight: '600', color: colores.texto },
    entrada: {
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        padding: 14,
        minHeight: 54,
        fontSize: 16,
        color: colores.texto,
    },
    ayuda: { fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    clientesGuardados: { gap: 6 },
    clientesGuardadosTitulo: { fontSize: 13, fontWeight: '600', color: colores.textoSuave },
    filaClientes: { flexDirection: 'row', flexWrap: 'wrap' },
    chipCliente: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: colores.fondo,
        borderWidth: 1,
        borderColor: colores.borde,
        marginRight: 8,
        marginBottom: 8,
    },
    chipClienteActivo: {
        backgroundColor: colores.primarioClaro,
        borderColor: colores.primario,
    },
    chipClienteTexto: { fontSize: 13, color: colores.texto },
    chipClienteTextoActivo: { color: colores.primarioOscuro, fontWeight: '700' },
    miniTitulo: { fontSize: 13, fontWeight: '600', color: colores.textoSuave, letterSpacing: 0.3 },
    concepto: { flex: 1, fontSize: 15, color: colores.textoSuave },
    valor: { fontSize: 15, color: colores.texto },
    fuerte: { fontSize: 17, color: colores.texto },
    fuerteValor: { fontSize: 18, fontWeight: '700', color: colores.marca },
    totalCard: {
        backgroundColor: colores.filtro,
        borderWidth: 1,
        borderColor: colores.primarioClaro,
        borderRadius: 18,
        padding: 18,
        gap: 14,
    },
});
