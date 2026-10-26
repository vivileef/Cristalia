const fs = require('fs');
const path = require('path');

/** Proyecto EAS: @velyevy/cristalia-solicitudes */
const projectId = '5547a1cb-1ce3-46fc-a3e6-54a71ba5f117';

const googleServices = path.join(__dirname, 'google-services.json');
/** Local: archivo en raíz. EAS: lo inyecta GOOGLE_SERVICES_JSON en el builder. */
const usaGoogleServices =
    fs.existsSync(googleServices) || process.env.EAS_BUILD === 'true';

/**
 * development → APK con dev client (Metro + push remota).
 * preview → APK standalone (abre sin PC).
 * Metro: EXPO_USE_DEV_CLIENT=1 solo con npm run start:apk*.
 */
const appVariant = process.env.APP_VARIANT || '';
const useDevClientNative =
    appVariant === 'development' ||
    process.env.EXPO_USE_DEV_CLIENT === '1' ||
    (process.env.EAS_BUILD === 'true' && appVariant !== 'preview');

module.exports = {
    expo: {
        name: 'Cristalia Equipo',
        slug: 'cristalia-solicitudes',
        scheme: 'cristalia-solicitudes',
        owner: 'velyevy',
        version: '1.0.1',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        ios: {
            supportsTablet: true,
        },
        android: {
            package: 'ec.edu.ejemplo.cristalia.equipo',
            versionCode: 2,
            permissions: [
                'android.permission.POST_NOTIFICATIONS',
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.ACCESS_FINE_LOCATION',
            ],
            adaptiveIcon: {
                backgroundColor: '#E6F4FE',
                foregroundImage: './assets/android-icon-foreground.png',
                backgroundImage: './assets/android-icon-background.png',
                monochromeImage: './assets/android-icon-monochrome.png',
            },
            ...(usaGoogleServices ? { googleServicesFile: './google-services.json' } : {}),
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            ...(useDevClientNative ? ['expo-dev-client'] : []),
            'expo-font',
            [
                'expo-notifications',
                {
                    icon: './assets/icon.png',
                    color: '#121366',
                },
            ],
        ],
        extra: {
            eas: {
                projectId,
            },
        },
    },
};
