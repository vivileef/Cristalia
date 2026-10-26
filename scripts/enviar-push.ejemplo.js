/**
 * Envío de prueba a Expo Push Service (Node.js 18+).
 * Uso: node scripts/enviar-push.ejemplo.js
 * NO ejecutar en el cliente móvil. NO commitear tokens reales.
 */
const token = 'ExponentPushToken[REEMPLAZAR_TOKEN]';

async function enviar() {
    const respuesta = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: token,
            title: 'Solicitud actualizada',
            body: 'El estado de tu solicitud cambió.',
            sound: 'default',
            data: { tipo: 'cambio_estado', id: 1 },
        }),
    });
    const resultado = await respuesta.json();
    console.log('HTTP:', respuesta.status, resultado);
}

enviar().catch(console.error);
