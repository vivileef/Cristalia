# Push en Android (Cristalia Equipo)

## APK oficial (1.0.1 · Firebase · versionCode 2)

| | Enlace |
|---|--------|
| **Página del build** | https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/d286ec26-8039-461d-bf41-4a11ccf165d3 |
| **Descarga directa APK** | https://expo.dev/artifacts/eas/UAPnMntdjoVMi0NvIEhA66e06szuQcEvXhcBZW9Qq84.apk |

Package: `ec.edu.ejemplo.cristalia.equipo`. Icono: **Cristalia Equipo**.

## Si el APK «no se instala» (Android)

1. **Solo Android** — el `.apk` no sirve en iPhone.
2. **Desinstala** *Cristalia Equipo* (Ajustes → Aplicaciones). Si quedó un intento fallido, reinicia el teléfono.
3. **Permite origen desconocido** para **Chrome** o **Archivos** (donde abras el APK).
4. El archivo debe pesar **~80–120 MB**. Si pesa pocos KB, la descarga falló; vuelve a bajar desde la **página del build** arriba.
5. **Recomendado:** en la PC abre el enlace del APK → guarda → pasa al celular por **USB** o **Drive** → Instalar desde Archivos.

## Arrancar con Metro (dev client)

1. Instala el APK oficial.
2. Misma Wi‑Fi → `npm run start:apk` · otra red → `npm run start:apk:tunnel`
3. Abre **Cristalia Equipo** (no Expo Go). No pulses **`s`** en Metro.

Expo Go: `npm start`.

## Probar push (FCM)

1. `npm run start:apk` en la PC.
2. Login: `danna@live.uleam.edu.ec` / `paulina`.
3. **Push** → **Registrar dispositivo**.
4. Remota: [expo.dev/notifications](https://expo.dev/notifications).
5. Local: guardar cotización en **Solicitudes**.

## Nuevo build

```powershell
npm run build:android
```

No subas a Git: JSON de cuenta FCM ni tokens en capturas.
