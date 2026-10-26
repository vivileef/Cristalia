# Push en Android (Cristalia Equipo)

## APK oficial (1.0.1 · versionCode 2)

| | Enlace |
|---|--------|
| **Página del build** | https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/d286ec26-8039-461d-bf41-4a11ccf165d3 |
| **Descarga directa APK** | https://expo.dev/artifacts/eas/UAPnMntdjoVMi0NvIEhA66e06szuQcEvXhcBZW9Qq84.apk |

Package: `ec.edu.ejemplo.cristalia.equipo`. Icono: **Cristalia Equipo**.

## Firebase (`google-services.json`)

**No subas este archivo a Git.** GitHub lo detecta como secreto.

1. Firebase Console → proyecto del equipo → **Configuración** → app Android `ec.edu.ejemplo.cristalia.equipo` → descarga **google-services.json**.
2. Copia a la **raíz** del repo (junto a `app.config.js`). Plantilla de forma: `google-services.json.example`.
3. Builds en la nube: con sesión `eas login`, ejecuta `npm run google-services:upload` (variable **GOOGLE_SERVICES_JSON** en entornos `development` y `preview`).
4. Luego `npm run build:android` si necesitas un APK nuevo.

### Si GitHub alertó por una clave expuesta

1. [Google Cloud Console](https://console.cloud.google.com/) → mismo proyecto → **APIs y servicios** → **Credenciales**.
2. Localiza la **API key** de Android vinculada a Firebase; **Restringe** o **Regenera** según la política del curso.
3. Vuelve a descargar **google-services.json** desde Firebase.
4. Sustituye el archivo local y ejecuta `npm run google-services:upload`.
5. Genera un APK nuevo si hace falta. Marca la alerta como resuelta en GitHub cuando el historial ya no contenga el archivo.

## Si el APK «no se instala» (Android)

1. **Solo Android** — el `.apk` no sirve en iPhone.
2. **Desinstala** *Cristalia Equipo* (Ajustes → Aplicaciones). Reinicia si hace falta.
3. **Origen desconocido** para **Chrome** o **Archivos**.
4. El APK debe pesar **~80–120 MB**. Descarga desde la **página del build**.
5. **Recomendado:** descarga en PC → USB/Drive → Instalar desde Archivos.

## Arrancar con Metro (dev client)

1. Instala el APK oficial.
2. Misma Wi‑Fi → `npm run start:apk` · otra red → `npm run start:apk:tunnel`
3. Abre **Cristalia Equipo** (no Expo Go). No pulses **`s`** en Metro.

Expo Go: `npm start`.

## Probar push (FCM)

1. `npm run start:apk` en la PC.
2. Login demo: `danna@live.uleam.edu.ec` / `paulina`.
3. **Push** → **Registrar dispositivo**.
4. Remota: [expo.dev/notifications](https://expo.dev/notifications).
5. Local: guardar cotización en **Solicitudes**.

## Nuevo build

```powershell
npm run google-services:upload
npm run build:android
```

No subas a Git: `google-services.json`, JSON de cuenta FCM ni tokens en capturas.
