# Estado EAS + Firebase (Cristalia)

## Completado automáticamente

| Paso | Estado |
|------|--------|
| Sesión Expo | Cuenta **velyevy** (`evelynfaubla@gmail.com`) |
| `eas init` | Proyecto [@velyevy/cristalia-solicitudes](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes) |
| `extra.eas.projectId` | `5547a1cb-1ce3-46fc-a3e6-54a71ba5f117` en `app.config.js` |
| Nombre en Expo | **Cristalia Equipo** (`slug`: `cristalia-solicitudes`) |
| `android.package` | `ec.edu.ejemplo.cristalia.equipo` (app Android **Cristalia Equipo ULEAM** en Firebase) |
| `google-services.json` | Raíz local, package `…equipo` (ignorado por Git) |
| Clave FCM V1 local | `fcm-v1-service-account.json` en raíz (ignorado por Git) |
| FCM V1 en EAS | Tras cambiar package, ejecutar `npm run fcm:upload` para el id `…equipo` |

Ver [FIREBASE-DOS-APPS.md](./FIREBASE-DOS-APPS.md) (individual vs grupal).

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
