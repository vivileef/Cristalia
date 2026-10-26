# Práctica: notificaciones push (Cristalia)

## Qué ya está en el código

| Requisito | Ubicación |
|-----------|-----------|
| Pantalla `NotificacionesPush.jsx` | `src/screens/NotificacionesPush.jsx` |
| Handler en primer plano | `src/utils/notificaciones.js` → `configurarManejadorNotificaciones()` en `App.js` |
| Canal Android + permisos + token | `registrarDispositivo()` en la pantalla Push |
| Token enmascarado en UI | `enmascararToken()`; token completo solo en consola Metro |
| Notificación local al guardar solicitud | `notificarSolicitudRegistrada()` tras éxito en `solicitudScreen.jsx` |
| Menú **Push** (`notificaciones`) | `menuInferior.jsx` + `rutas.js` |
| Plugin y package Android | `app.config.js` |
| Perfil EAS development | `eas.json` |

## Pasos que debes ejecutar tú (no automatizables)

### 1. Dependencias y EAS CLI

```bash
cd ruta/al/proyecto
npx expo install expo-notifications expo-device expo-constants expo-dev-client
npm install -g eas-cli
eas login
eas whoami
eas init
```

Copia el **`projectId`** que asigne Expo en `app.config.js` → `expo.extra.eas.projectId` (reemplaza la cadena vacía).

### 2. Firebase + FCM V1 (Android push remota)

1. [Firebase Console](https://console.firebase.google.com) → proyecto → app Android con package **`ec.edu.uleam.cristalia.faubla`** (mismo que `app.config.js`).
2. Descarga **`google-services.json`** a la raíz del repo (está en `.gitignore`).
3. Cuenta de servicio FCM V1 (JSON privado) → **`eas credentials`** → Android → Push Notifications (FCM V1). **No subas ese JSON a Git.**

### 3. Build de desarrollo

```bash
eas build:configure   # si aún no existe eas.json
eas build --platform android --profile development
```

Instala la APK en un **Android físico**. Luego:

```bash
npx expo start --dev-client
```

### 4. Pruebas

- **Local:** pestaña Push → “Probar notificación local”; o guardar en **Solicitudes**.
- **Remota:** https://expo.dev/notifications con el Expo Push Token del dispositivo (desde consola, no capturas con token completo).

### 5. Script opcional (Node 18+)

Ver `scripts/enviar-push.ejemplo.js` (sustituir token de prueba).

## Registro de error (evidencia)

| Campo | Tu nota |
|-------|---------|
| Síntoma | |
| Causa | |
| Solución | |

Ejemplo: *No aparecía token → faltaba `projectId` tras `eas init` → fusioné ID en `app.config.js` y recompilé.*

## Comprobaciones antes de sustentar

- [ ] Abro **Push** desde el menú inferior.
- [ ] Explico `getPermissionsAsync`, `requestPermissionsAsync`, `getExpoPushTokenAsync`.
- [ ] Genero notificación local y digo cuándo se dispara (guardado exitoso en Solicitudes).
- [ ] Push remota en Android con dev build + FCM (si ya compilaste).
- [ ] Evidencias sin tokens completos ni claves Firebase.
