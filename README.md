# Cristalia Equipo (ULEAM)

App móvil grupal para talleres de vidriería y aluminio: cotizaciones, trabajos, reportes y notificaciones. Stack: **Expo SDK 57** y **React Native**. En el dispositivo se muestra como **Cristalia Equipo** (distinta de la práctica individual **Cristalia**).

## Inicio rápido

```bash
git clone https://github.com/vivileef/Cristalia.git
cd Cristalia
npm install
# Copia google-services.json desde Firebase (ver docs/PUSH-ANDROID.md); no va en Git.
npm start          # Expo Go
npm run start:apk  # APK EAS + push remota
```

| Comando | Uso |
|---------|-----|
| `npm start` | Desarrollo con **Expo Go** |
| `npm run start:apk` | **Cristalia Equipo** instalada (push FCM) |
| `npm run build:android` | Generar APK con EAS (`development`) |
| `npm run google-services:upload` | Subir `google-services.json` a EAS (secret) |
| `npm run web` | Navegador |

**APK oficial (1.0.1):** [d286ec26 en Expo](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/d286ec26-8039-461d-bf41-4a11ccf165d3)

**Seguridad:** nunca hagas commit de `google-services.json`. Si una clave se filtró, restríngela o regénérala en Google Cloud y vuelve a subir el archivo a EAS (detalle en [docs/PUSH-ANDROID.md](docs/PUSH-ANDROID.md)).

**Demo:** correo `danna@live.uleam.edu.ec`, clave `paulina`.

## Push y Android

Toda la configuración (EAS, Firebase, FCM, pruebas) está en **[docs/PUSH-ANDROID.md](docs/PUSH-ANDROID.md)**.

## Estructura

```
App.js
app.config.js
src/screens/     # Inicio, Solicitudes, Push, …
src/components/
src/utils/
docs/PUSH-ANDROID.md
```

## Autoría

Proyecto académico — Cristalia, Manta (Ecuador).
