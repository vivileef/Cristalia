# Push en Android (Cristalia Equipo)

Guía única para **notificaciones**, **arranque en el teléfono** y **APK**.

## Si en el celular «no aparece» o «no corre»

| Síntoma | Qué hacer |
|--------|-----------|
| No hay icono **Cristalia Equipo** | Instala un APK desde [Builds en Expo](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds). **Preview** = abre solo; **Development** = push + Metro. |
| Solo tienes **Expo Go** (morada) | Con `npm start` escanea el QR **dentro de Expo Go**. No verás el icono «Cristalia Equipo» hasta instalar el APK. |
| Icono sí está pero pantalla en blanco / «Looking for dev server» | En la PC: `npm run start:apk` (túnel) o `npm run start:apk:lan` (misma Wi‑Fi). Luego abre **Cristalia Equipo** otra vez. |
| Confusión con otra app | Desinstala APKs viejos cuyo package no sea `ec.edu.ejemplo.cristalia.equipo`. |
| Metro raro | `npm run reset:metro`. **No pulses `s`** en la terminal (cambia Go ↔ dev build). |

## Dos formas de usar la app

| Objetivo | Comando PC | En el teléfono |
|----------|------------|----------------|
| Probar UI rápido | `npm start` | **Expo Go** → escanear QR |
| App con icono propio (sin PC) | (solo build) | APK perfil **preview** |
| Push remota FCM + desarrollo | `npm run start:apk` | APK perfil **development** + abrir **Cristalia Equipo** |

## Compilar APK (EAS)

Requisitos: `eas login`, `google-services.json` en la raíz (gitignored) y **`GOOGLE_SERVICES_JSON`** en EAS (`npm run google-services:upload`). Tras cambiar Firebase, vuelve a compilar el APK **development**.

```powershell
# Dev client (Metro + push)
npm run build:android

# Standalone: abre sin tener Metro encendido
npm run build:android:preview
```

Descarga e instala desde [expo.dev → cristalia-solicitudes → Builds](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds).

FCM V1 (si cambias la cuenta de servicio):

```powershell
npm run fcm:upload
```

## Código relacionado

| Función | Dónde |
|--------|--------|
| Pantalla Push | `src/screens/NotificacionesPush.jsx` |
| Handler en primer plano | `src/utils/notificaciones.js` |
| Project EAS | `app.config.js` + `src/constants/easProject.js` |

## Probar push (development APK)

1. `npm run start:apk` en la PC.
2. Abre **Cristalia Equipo** (no Expo Go).
3. Login demo: `danna@live.uleam.edu.ec` / `paulina`.
4. Menú **Push** → **Registrar dispositivo**.
5. Push remota: [expo.dev/notifications](https://expo.dev/notifications) con el token (app en segundo plano).
6. Local: guardar una cotización en **Solicitudes**.

No subas a Git: `google-services.json`, JSON de cuenta FCM ni tokens en capturas.
