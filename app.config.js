const fs = require('fs');
const path = require('path');

/** Proyecto EAS: @velyevy/cristalia-solicitudes */
const projectId = '5547a1cb-1ce3-46fc-a3e6-54a71ba5f117';

const googleServices = path.join(__dirname, 'google-services.json');
const tieneGoogleServices = fs.existsSync(googleServices);

module.exports = {
    expo: {
        name: 'Cristalia Solicitudes',
        slug: 'cristalia-solicitudes',
        owner: 'velyevy',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        ios: {
            supportsTablet: true,
        },
        android: {
            package: 'ec.edu.ejemplo.cristalia.solicitudes',
            adaptiveIcon: {
                backgroundColor: '#E6F4FE',
                foregroundImage: './assets/android-icon-foreground.png',
                backgroundImage: './assets/android-icon-background.png',
                monochromeImage: './assets/android-icon-monochrome.png',
            },
            ...(tieneGoogleServices ? { googleServicesFile: './google-services.json' } : {}),
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            'expo-dev-client',
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
