/**
 * Sube la clave FCM V1 (cuenta de servicio) a Expo/EAS usando la sesión de `eas login`.
 * No imprime secretos. Uso: node scripts/upload-fcm-v1-eas.cjs
 */
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const keyPath = path.join(projectDir, 'fcm-v1-service-account.json');
const packageName = 'ec.edu.ejemplo.cristalia.solicitudes';
const projectFullName = '@velyevy/cristalia-solicitudes';

const SessionManager = require('eas-cli/build/user/SessionManager').default;
const { createGraphqlClient } = require('eas-cli/build/commandUtils/context/contextUtils/createGraphqlClient');
const { readAndValidateServiceAccountKey } = require('eas-cli/build/credentials/android/utils/googleServiceAccountKey');
const { AppQuery } = require('eas-cli/build/graphql/queries/AppQuery');
const { AndroidAppCredentialsQuery } = require('eas-cli/build/credentials/android/api/graphql/queries/AndroidAppCredentialsQuery');
const { GoogleServiceAccountKeyMutation } = require('eas-cli/build/credentials/android/api/graphql/mutations/GoogleServiceAccountKeyMutation');
const { AndroidAppCredentialsMutation } = require('eas-cli/build/credentials/android/api/graphql/mutations/AndroidAppCredentialsMutation');
const { formatProjectFullName } = require('eas-cli/build/credentials/android/api/GraphqlClient');

async function main() {
    if (!fs.existsSync(keyPath)) {
        console.error('No se encontró fcm-v1-service-account.json en la raíz del proyecto.');
        process.exit(1);
    }

    const sessionManager = new SessionManager({ setActor: () => {} });
    const { authenticationInfo } = await sessionManager.ensureLoggedInAsync({ nonInteractive: true });
    const graphqlClient = createGraphqlClient(authenticationInfo);

    const app = await AppQuery.byFullNameAsync(graphqlClient, projectFullName);
    if (!app) {
        console.error(`App no encontrada: ${projectFullName}`);
        process.exit(1);
    }

    const account = app.ownerAccount;
    if (!account?.id) {
        console.error('No se pudo resolver la cuenta del proyecto.');
        process.exit(1);
    }

    let appCredentials = await AndroidAppCredentialsQuery.withCommonFieldsByApplicationIdentifierAsync(
        graphqlClient,
        projectFullName,
        { androidApplicationIdentifier: packageName, legacyOnly: false },
    );

    if (appCredentials?.googleServiceAccountKeyForFcmV1?.clientEmail) {
        console.log(
            'FCM V1 ya configurado en EAS para',
            packageName,
            '→',
            appCredentials.googleServiceAccountKeyForFcmV1.clientEmail,
        );
        return;
    }

    const jsonKey = readAndValidateServiceAccountKey(keyPath);
    const gsaKey = await GoogleServiceAccountKeyMutation.createGoogleServiceAccountKeyAsync(
        graphqlClient,
        { jsonKey },
        account.id,
    );

    if (!appCredentials) {
        appCredentials = await AndroidAppCredentialsMutation.createAndroidAppCredentialsAsync(
            graphqlClient,
            {},
            app.id,
            packageName,
        );
    }

    await AndroidAppCredentialsMutation.setGoogleServiceAccountKeyForFcmV1Async(
        graphqlClient,
        appCredentials.id,
        gsaKey.id,
    );

    console.log('FCM V1 subido y asignado correctamente.');
    console.log('Cuenta de servicio:', gsaKey.clientEmail || jsonKey.client_email);
    console.log('Proyecto Expo:', formatProjectFullName({ account: { name: account.name }, projectName: app.slug }));
}

main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});
