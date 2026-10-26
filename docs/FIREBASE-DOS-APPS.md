# Firebase: proyecto compartido, dos apps Android

El **mismo proyecto Firebase** (`affirmations-5f860f35`) puede alojar varias apps. Lo que no debe repetirse es el **`android.package`**: cada APK distinto necesita su propia app Android en Firebase.

| App | Expo (`name` / slug) | `android.package` | EAS `projectId` |
|-----|----------------------|-------------------|-----------------|
| **Individual** (práctica Evelyn) | Cristalia · `cristalia-manta` | `ec.edu.ejemplo.cristalia.solicitudes` | `1ee7ec49-f8b1-42df-87e7-03e27c63e44e` |
| **Grupal ULEAM** (este repo) | Cristalia Equipo · `cristalia-solicitudes` | `ec.edu.ejemplo.cristalia.equipo` | `5547a1cb-1ce3-46fc-a3e6-54a71ba5f117` |

## Por qué parecía “el mismo archivo”

Antes ambas usaban el mismo `package` y el mismo `google-services.json` (solo la app `…solicitudes`). En consola Firebase, si descargas el config del proyecto, a veces vienen **varios** bloques `client` en un solo JSON; es normal. En este repo dejamos en local un JSON acotado al package **`ec.edu.ejemplo.cristalia.equipo`**.

## Qué hacer en cada repo

- **Este repo (grupal):** `google-services.json` con package `…equipo` (raíz, gitignored). Tras cambiar package, vuelve a asignar FCM V1: `npm run fcm:upload`.
- **Individual:** mantener su propio `google-services.json` con package `…solicitudes` en la carpeta de la práctica Evelyn; no mezclar archivos entre repos.

Push remota (FCM) usa la **cuenta de servicio** del proyecto Firebase; es la misma para ambas apps Android dentro del proyecto, pero EAS asocia la clave al **applicationId** de cada build.
