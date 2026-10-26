const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('\nModo development build (APK Cristalia Equipo).');
console.log('Abre la app desde el teléfono; no uses Expo Go. No pulses s en Metro.');
console.log('Guía: docs/PUSH-ANDROID.md\n');

const extra = process.argv.slice(2);
const result = spawnSync('npx', ['expo', 'start', '--dev-client', ...extra], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
    env: { ...process.env, EXPO_USE_DEV_CLIENT: '1' },
});

process.exit(result.status ?? 1);
