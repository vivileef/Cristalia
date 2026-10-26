/**
 * Sube google-services.json al entorno EAS (development y preview).
 * Requiere eas login. No imprime el contenido del archivo.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const file = path.join(root, 'google-services.json');

if (!fs.existsSync(file)) {
    console.error('Falta google-services.json en la raíz del proyecto.');
    process.exit(1);
}

const entornos = ['development', 'preview'];
let ok = true;

for (const environment of entornos) {
    const result = spawnSync(
        'npx',
        [
            'eas',
            'env:create',
            '--name',
            'GOOGLE_SERVICES_JSON',
            '--type',
            'file',
            '--value',
            './google-services.json',
            '--environment',
            environment,
            '--visibility',
            'secret',
            '--force',
            '--non-interactive',
        ],
        { cwd: root, stdio: 'inherit', shell: true },
    );
    if (result.status !== 0) {
        ok = false;
        console.error('Falló subida para entorno:', environment);
    } else {
        console.log('OK → entorno', environment);
    }
}

process.exit(ok ? 0 : 1);
