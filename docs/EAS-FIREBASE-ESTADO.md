# Estado EAS + Firebase (Cristalia)

## Completado automáticamente

| Paso | Estado |
|------|--------|
| Sesión Expo | Cuenta **velyevy** (`evelynfaubla@gmail.com`) |
| `eas init` | Proyecto [@velyevy/cristalia-solicitudes](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes) |
| `extra.eas.projectId` | `5547a1cb-1ce3-46fc-a3e6-54a71ba5f117` en `app.config.js` |
| `android.package` | `ec.edu.ejemplo.cristalia.solicitudes` (igual que Firebase) |
| `google-services.json` | Copiado en la **raíz local** (ignorado por Git) |
| Clave FCM V1 local | `fcm-v1-service-account.json` en raíz (ignorado por Git) |
| FCM V1 en EAS | Subida y asignada a `ec.edu.ejemplo.cristalia.solicitudes` (`firebase-adminsdk-fbsvc@affirmations-5f860f35.iam.gserviceaccount.com`) |

## Volver a subir FCM V1 (solo si cambias la clave)

CLI interactivo:

```powershell
npx eas-cli credentials -p android
```

O script (usa la sesión de `eas login`):

```powershell
npm run fcm:upload
```

Alternativa web: [Credenciales del proyecto](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/credentials) → Android → **FCM V1 service account key**.

## Build de prueba

```powershell
npx eas-cli build --platform android --profile development
npx expo start --dev-client
```

No subas `fcm-v1-service-account.json` ni claves privadas a GitHub.
