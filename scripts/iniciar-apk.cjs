const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('\nModo development build (APK Cristalia Equipo).');
console.log('1) Instala el APK «development» desde expo.dev (icono Cristalia Equipo).');
console.log('2) Abre ESA app en el teléfono (no Expo Go).');
console.log('3) Si queda en blanco: misma Wi‑Fi que la PC o usa npm run start:apk:tunnel');
console.log('No pulses s en Metro. Guía: docs/PUSH-ANDROID.md\n');

const extra = process.argv.slice(2);
const tieneTunnel = extra.some((a) => a === '--tunnel' || a === '--t');
const args = ['expo', 'start', '--dev-client', ...(tieneTunnel ? [] : ['--lan']), ...extra];
const result = spawnSync('npx', args, {
    stdio: 'inherit',
    cwd: root,
    shell: true,
    env: { ...process.env, EXPO_USE_DEV_CLIENT: '1' },
});

process.exit(result.status ?? 1);
