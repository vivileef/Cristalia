# Cristalia Equipo (ULEAM)

App móvil grupal para talleres de vidriería y aluminio: cotizaciones, trabajos, reportes y notificaciones. Stack: **Expo SDK 57** y **React Native**. En el dispositivo se muestra como **Cristalia Equipo** (distinta de la práctica individual **Cristalia**).

## Inicio rápido

```bash
git clone https://github.com/vivileef/Cristalia.git
cd Cristalia
npm install
npm start          # Expo Go
npm run start:apk  # APK EAS + push remota
```

| Comando | Uso |
|---------|-----|
| `npm start` | Desarrollo con **Expo Go** |
| `npm run start:apk` | **Cristalia Equipo** instalada (push FCM) |
| `npm run build:android` | Generar APK con EAS (`development`) |

**APK oficial (1.0.1):** [d286ec26 en Expo](https://expo.dev/accounts/velyevy/projects/cristalia-solicitudes/builds/d286ec26-8039-461d-bf41-4a11ccf165d3)
| `npm run web` | Navegador |

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
