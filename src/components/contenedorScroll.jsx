import { View, ScrollView, StyleSheet } from 'react-native';
import { colores } from '../theme/colores';
import { useLayout } from '../theme/useLayout';

export function ContenedorScroll({ children, style, contentStyle }) {
    const { padding } = useLayout();

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
                styles.contenido,
                { paddingHorizontal: padding, paddingBottom: 100 },
                contentStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.cuerpo, style]}>{children}</View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        width: '100%',
        backgroundColor: colores.fondo,
    },
    contenido: {
        flexGrow: 1,
        paddingTop: 0,
        gap: 24,
    },
    cuerpo: {
        width: '100%',
        gap: 24,
    },
});
