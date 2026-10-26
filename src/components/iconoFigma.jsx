import { Image, StyleSheet } from 'react-native';

export function IconoFigma({ source, size = 19, style }) {
    return (
        <Image
            source={source}
            style={[styles.icono, { width: size, height: size }, style]}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
        />
    );
}

const styles = StyleSheet.create({
    icono: {},
});
