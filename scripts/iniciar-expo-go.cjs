const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('\nModo Expo Go: escanea el QR con la app Expo Go (morada).');
console.log('Push remota y icono propio: instala APK + npm run start:apk\n');

const extra = process.argv.slice(2);
const result = spawnSync('npx', ['expo', 'start', '--go', ...extra], {
    stdio: 'inherit',
    cwd: root,
    shell: true,
    env: { ...process.env, EXPO_USE_DEV_CLIENT: '0' },
});

process.exit(result.status ?? 1);
