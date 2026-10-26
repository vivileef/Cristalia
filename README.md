# Cristalia Equipo (ULEAM)

Aplicación móvil grupal para talleres de vidriería y aluminio: cotizaciones, seguimiento de trabajos, reportes financieros y notificaciones. Desarrollada con **Expo** y **React Native**. En el teléfono aparece como **Cristalia Equipo** (distinta de la práctica individual **Cristalia** / `cristalia-manta`).

## Características

- **Inicio** — Resumen del taller, accesos rápidos y banner unificado hacia cotización.
- **Solicitudes** — Nueva cotización (medidas, materiales, foto, GPS, acelerómetro) y listado de trabajos; notificación local al guardar.
- **Trabajos** — Búsqueda, filtros por estado, detalle, pagos e instalación.
- **Reportes** — Resumen por período (cotizado, cobrado, pendiente).
- **Avisos** — Bandeja de recordatorios del taller.
- **Push** — Permisos, token Expo (enmascarado en UI) y prueba de notificación local; push remota vía EAS + FCM (Android).
- **Perfil** — Datos de administradora, sensores y cierre de sesión.

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | React Native 0.86, Expo SDK 57 |
| UI | Inter (`@expo-google-fonts/inter`), `@expo/vector-icons` |
| Sensores / media | `expo-location`, `expo-sensors`, `expo-image-picker` |
| Notificaciones | `expo-notifications`, `expo-device`, `expo-constants` |
| Build Android | EAS Build, `expo-dev-client`, Firebase FCM V1 (push remota) |

## Requisitos

- Node.js 18+ y npm
- [Expo Go](https://expo.dev/go) (desarrollo rápido) o **development build** (push remota en Android)
- Cuenta [Expo](https://expo.dev) para `eas init` / builds

## Instalación y ejecución

```bash
git clone https://github.com/vivileef/Cristalia.git
cd Cristalia
npm install
```

| Comando | Uso |
|---------|-----|
| `npm start` | Metro (Expo Go o emulador) |
| `npm run web` | Vista web en navegador |
| `npm run android` | Abrir en Android |
| `npm run start:dev-client` | Tras instalar APK de EAS (dev client) |

### Acceso demo (prototipo sin backend)

| Campo | Valor |
|-------|--------|
| Correo | `danna@live.uleam.edu.ec` |
| Clave | `paulina` |

Los trabajos inician vacíos; las cotizaciones se crean desde **Solicitudes** o el flujo grupal **Crear cotización**.

## Notificaciones push

La integración grupal dispara una **notificación local** solo después de un guardado exitoso en Solicitudes. La pantalla **Push** (menú inferior) cubre permisos, token y prueba local.

Para push **remota** en Android (no disponible en Expo Go):

1. Configurar `projectId` en `app.config.js` (`eas init`).
2. Añadir `google-services.json` (Firebase, package `ec.edu.ejemplo.cristalia.equipo`).
3. Credenciales FCM V1 en `eas credentials`.
4. `eas build --platform android --profile development`

Guía detallada: [docs/PUSH-NOTIFICACIONES.md](docs/PUSH-NOTIFICACIONES.md).

## Estructura del proyecto

```
App.js                 # Navegación y estado global
app.config.js          # Expo (plugins, Android, EAS)
src/
  navigation/rutas.js  # Claves de pantalla
  screens/             # Vistas (grupal + práctica)
  components/          # UI reutilizable
  data/                # Datos demo y perfil
  utils/               # Cotización, notificaciones, sensores
docs/                  # Documentación de push
```

## Licencia

Este repositorio incluye componentes bajo licencias de terceros (p. ej. plantilla Expo). Consulta [LICENSE](LICENSE) cuando aplique.

## Autoría

Proyecto académico — **Cristalia** (Manta, Ecuador).
