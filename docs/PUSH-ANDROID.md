# Push en Android (Cristalia Equipo)

Guía única para **notificaciones locales**, **push remota (FCM)** y **arranque** de la app.

## Qué hay en el código

| Función | Dónde |
|--------|--------|
| Pantalla Push | `src/screens/NotificacionesPush.jsx` |
| Handler en primer plano | `src/utils/notificaciones.js` |
| Notificación al guardar solicitud | `solicitudScreen.jsx` |
| Project EAS | `app.config.js` → `extra.eas.projectId` y respaldo en `src/constants/easProject.js` |

## Dos formas de ejecutar la app

| Objetivo | Comando | App en el teléfono |
|----------|---------|---------------------|
| Probar UI rápido | `npm start` | **Expo Go** (app morada) |
| Push remota FCM | `npm run start:apk` | **Cristalia Equipo** (APK de EAS) |

Con `npm run start:apk` la terminal debe indicar **Using development build**. Abre **Cristalia Equipo** desde el launcher; no uses Expo Go. **No pulses `s`** en Metro (cambia el modo y confunde el QR).

Si Metro falla por caché: `npm run reset:metro`.

## Compilar el APK (EAS)

Requisitos: cuenta Expo (`eas login`), `google-services.json` en la raíz (gitignored) y secreto **`GOOGLE_SERVICES_JSON`** en el entorno *development* de EAS (ya configurado si seguiste la práctica).

```powershell
npm run build:android
```

Descarga el APK en [expo.dev → cristalia-solicitudes → Builds](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds) e instálalo.

Credenciales FCM V1 (solo si cambias la clave de cuenta de servicio):

```powershell
npm run fcm:upload
```

## Firebase (grupal vs individual)

Un mismo **proyecto Firebase** puede tener varias apps Android; cada una lleva un **`android.package`** distinto.

| App | Package | Proyecto EAS |
|-----|---------|--------------|
| **Cristalia Equipo** (este repo) | `ec.edu.ejemplo.cristalia.equipo` | `5547a1cb-1ce3-46fc-a3e6-54a71ba5f117` |
| **Cristalia** (práctica individual) | `ec.edu.ejemplo.cristalia.solicitudes` | otro `projectId` en su repo |

No mezcles `google-services.json` entre repos.

## Probar push

1. `npm run start:apk` → abre **Cristalia Equipo** en el teléfono (misma Wi‑Fi; `--tunnel` si hace falta).
2. Login demo: `danna@live.uleam.edu.ec` / `paulina`.
3. Menú **Push** → **Registrar dispositivo** (permisos).
4. Token completo en la consola de Metro; en pantalla va enmascarado.
5. Push remota: [expo.dev/notifications](https://expo.dev/notifications) con ese token (app en segundo plano o cerrada).
6. Local: guardar una cotización en **Solicitudes**.

No subas a Git: `google-services.json`, JSON de cuenta de servicio FCM ni tokens completos en capturas.
