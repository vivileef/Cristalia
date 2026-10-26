# Push en Android (Cristalia Equipo)

## APK oficial (EAS development + Firebase)

| | Enlace |
|---|--------|
| **Página del build** | https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/b048ac88-d0cc-432d-a36f-fbc70f30f818 |
| **Descarga directa APK** | https://expo.dev/artifacts/eas/FVY0auCjUzC9iYo884vMGhnBeSY9y7KoroxxcbaJ42Y.apk |

Package: `ec.edu.ejemplo.cristalia.equipo`. Icono: **Cristalia Equipo**. Incluye `google-services.json` (FCM).

## Arrancar con Metro (dev client)

1. Instala el APK de arriba (desinstala versiones anteriores si hace falta).
2. PC y celular en la **misma Wi‑Fi** → `npm run start:apk`  
   Red distinta → `npm run start:apk:tunnel`
3. Abre **Cristalia Equipo** (no Expo Go). No pulses **`s`** en Metro.

Expo Go solo para pruebas rápidas: `npm start`.

## Si no corre en el celular

| Problema | Solución |
|----------|----------|
| Pantalla en blanco / busca servidor | Metro encendido con `npm run start:apk` |
| Puerto 8081 ocupado | `npx kill-port 8081 8082` y vuelve a arrancar |
| Caché Metro | `npm run reset:metro` |

## Probar push (FCM)

1. `npm run start:apk` en la PC.
2. Login: `danna@live.uleam.edu.ec` / `paulina`.
3. **Push** → **Registrar dispositivo** (acepta permisos).
4. Push remota: [expo.dev/notifications](https://expo.dev/notifications) con el token (app en segundo plano).
5. Local: guardar una cotización en **Solicitudes**.

## Nuevo build (opcional)

```powershell
npm run build:android
```

Requisitos: `eas login` y `google-services.json` en la raíz.

No subas a Git: JSON de cuenta de servicio FCM ni tokens en capturas.
