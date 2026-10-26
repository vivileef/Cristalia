import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CabeceraMarca } from '../components/cabecera';
import { ContenedorScroll } from '../components/contenedorScroll';
import BadgeEstado from '../components/badgeEstado';
import { iconosNav } from '../constants/iconosFigma';
import { colores } from '../theme/colores';
import { estilosComunes } from '../theme/estilosComunes';
import { fuentes } from '../theme/tipografia';
import { formatearUsd } from '../data/datosGrupo';
import {
    PERIODO_DEMO,
    calcularResumenTrabajos,
    formatearFechaCorta,
    formatearRangoPeriodo,
} from '../utils/resumenFinanciero';

export default function ReportesScreen({ trabajos }) {
    const [desdeIso, setDesdeIso] = useState(PERIODO_DEMO.desde);
    const [hastaIso, setHastaIso] = useState(PERIODO_DEMO.hasta);
    const resumen = useMemo(
        () => calcularResumenTrabajos(trabajos, desdeIso, hastaIso),
        [trabajos, desdeIso, hastaIso],
    );

    const exportar = () => {
        Alert.alert(
            'Reporte',
            `Período ${formatearRangoPeriodo(desdeIso, hastaIso)} · ${resumen.filas.length} cotizaciones.`,
        );
    };

    const consultar = () => {
        if (!desdeIso || !hastaIso || desdeIso > hastaIso) {
            Alert.alert('Período inválido', 'Revisa las fechas desde / hasta (formato AAAA-MM-DD).');
            return;
        }
    };

    return (
        <View style={styles.pantalla}>
            <CabeceraMarca titulo="Reportes" subtitulo="Consulta cotizado, cobrado y pendiente por período." />
            <ContenedorScroll>
                <View style={styles.bloque}>
                    <Text style={styles.seccion}>Consulta del período</Text>
                    <View style={styles.fechas}>
                        <CampoFecha label="Desde" value={desdeIso} onChangeText={setDesdeIso} />
                        <CampoFecha label="Hasta" value={hastaIso} onChangeText={setHastaIso} />
                    </View>
                    <Text style={styles.hint}>Formato AAAA-MM-DD · demo: {PERIODO_DEMO.desde} — {PERIODO_DEMO.hasta}</Text>
                    <Pressable style={estilosComunes.botonSecundario} onPress={consultar}>
                        <Ionicons name={iconosNav.buscar} size={21} color={colores.marca} />
                        <Text style={estilosComunes.textoBotonSecundario}>Consultar período</Text>
                    </Pressable>
                </View>

                <View style={styles.bloque}>
                    <Text style={styles.seccion}>Resumen del reporte</Text>
                    <Text style={styles.sub}>
                        {formatearRangoPeriodo(desdeIso, hastaIso)} · Valores en USD
                    </Text>
                    <View style={estilosComunes.tarjeta}>
                        <Fila label="Cotizado" valor={formatearUsd(resumen.cotizado)} />
                        <Fila label="Cobrado" valor={formatearUsd(resumen.cobrado)} />
                        <View style={estilosComunes.separador} />
                        <Fila label="Pendiente" valor={formatearUsd(resumen.pendiente)} fuerte />
                    </View>
                    <Pressable style={estilosComunes.botonSecundario} onPress={exportar}>
                        <Ionicons name={iconosNav.descargar} size={21} color={colores.marca} />
                        <Text style={estilosComunes.textoBotonSecundario}>Descargar reporte</Text>
                    </Pressable>
                    <Text style={styles.sub}>
                        El detalle incluye cada cotización con su estado y saldo al cierre del período.
                    </Text>
                </View>

                <View style={styles.bloque}>
                    <Text style={styles.seccion}>Detalle por cotización</Text>
                    <Text style={styles.sub}>
                        {resumen.filas.length === 0
                            ? 'Sin trabajos en el rango seleccionado.'
                            : `${resumen.filas.length} trabajos en el período.`}
                    </Text>
                    {resumen.filas.map((f) => (
                        <View key={f.ref} style={estilosComunes.tarjeta}>
                            <View style={styles.filaRef}>
                                <Text style={styles.ref}>{f.ref}</Text>
                                <BadgeEstado estado={f.estado} />
                            </View>
                            <Text style={styles.cliente}>{f.cliente}</Text>
                            <Fila label="Total" valor={formatearUsd(f.total)} />
                            <Fila label="Saldo" valor={formatearUsd(f.saldo)} fuerte />
                        </View>
                    ))}
                </View>
            </ContenedorScroll>
        </View>
    );
}

function CampoFecha({ label, value, onChangeText }) {
    return (
        <View style={styles.campoFecha}>
            <Text style={styles.etiqueta}>{label}</Text>
            <TextInput
                style={styles.entrada}
                value={value}
                onChangeText={onChangeText}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={colores.textoSuave}
                autoCapitalize="none"
            />
            <Text style={styles.legible}>{formatearFechaCorta(value)}</Text>
        </View>
    );
}

function Fila({ label, valor, fuerte }) {
    return (
        <View style={estilosComunes.filaDato}>
            <Text style={[styles.filaLabel, fuerte && styles.fuerte]}>{label}</Text>
            <Text style={[styles.filaValor, fuerte && styles.fuerteValor]}>{valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: colores.fondo },
    bloque: { gap: 14 },
    seccion: { fontFamily: fuentes.regular, fontSize: 20, color: colores.texto },
    sub: { fontFamily: fuentes.regular, fontSize: 13, color: colores.textoSuave, lineHeight: 19 },
    hint: { fontFamily: fuentes.regular, fontSize: 12, color: colores.textoSuave },
    fechas: { flexDirection: 'row', gap: 12 },
    campoFecha: { flex: 1, gap: 6 },
    etiqueta: { fontFamily: fuentes.semibold, fontSize: 14, color: colores.texto },
    entrada: {
        fontFamily: fuentes.regular,
        backgroundColor: colores.tarjeta,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: colores.texto,
    },
    legible: { fontFamily: fuentes.regular, fontSize: 12, color: colores.textoSuave },
    filaRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ref: { fontFamily: fuentes.regular, fontSize: 13, color: colores.textoSuave },
    cliente: { fontFamily: fuentes.semibold, fontSize: 16, color: colores.texto, marginBottom: 4 },
    filaLabel: { flex: 1, fontFamily: fuentes.regular, fontSize: 15, color: colores.textoSuave },
    filaValor: { fontFamily: fuentes.regular, fontSize: 15, color: colores.texto },
    fuerte: { fontFamily: fuentes.regular, fontSize: 17, color: colores.texto },
    fuerteValor: { fontFamily: fuentes.bold, fontSize: 18, color: colores.marca },
});
