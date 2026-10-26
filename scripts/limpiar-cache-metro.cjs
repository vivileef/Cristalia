/**
 * Borra cachés de Metro/Expo (error "Unable to deserialize cloned data").
 * Uso: npm run reset:metro
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function rm(dir) {
    if (!fs.existsSync(dir)) return;
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Eliminado:', path.relative(root, dir));
}

rm(path.join(root, 'node_modules', '.cache'));
rm(path.join(root, '.expo', 'metro'));
rm(path.join(root, '.expo', 'web', 'cache'));

console.log('Listo. Arranca con: npm start  (Expo Go)  o  npm run start:apk  (APK EAS)');
