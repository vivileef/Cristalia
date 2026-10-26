# Push en Android (Cristalia Equipo)

## APK oficial (EAS development)

Build del proyecto para instalar en el teléfono y entregar en la práctica:

| | Enlace |
|---|--------|
| **Página del build** | https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/93f7a997-749a-4269-bec3-927016dd7375 |
| **Descarga directa APK** | https://expo.dev/artifacts/eas/V7DsWANn3WjLNEfSqgqhXtjbXqXXFsdIvLQdH8qbcDg.apk |

Package: `ec.edu.ejemplo.cristalia.equipo`. Icono: **Cristalia Equipo**.

## Arrancar con Metro (dev client)

1. Instala el APK de arriba.
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

## Push (FCM)

Ese build **93f7a997** se generó **sin** `google-services.json` embebido; **Registrar dispositivo** puede fallar con error de Firebase.

Para practicar push remota, instala un build **development** más nuevo (mismo package) desde [Builds](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds) — por ejemplo el que incluye Firebase — y usa el mismo `npm run start:apk`. El enlace de **entrega** sigue siendo el build `93f7a997`.

1. `npm run start:apk`
2. Login: `danna@live.uleam.edu.ec` / `paulina`
3. **Push** → **Registrar dispositivo**
4. Prueba remota: [expo.dev/notifications](https://expo.dev/notifications)

## Nuevo build (opcional)

```powershell
npm run build:android
```

Requisitos: `eas login` y `google-services.json` en la raíz.

No subas a Git: JSON de cuenta de servicio FCM ni tokens en capturas.
