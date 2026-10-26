const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('\nDevelopment build (Cristalia Equipo). Abre esa app, no Expo Go.');
console.log('Misma Wi‑Fi: npm run start:apk:lan | Red distinta: npm run start:apk:tunnel');
console.log('APK actual (Firebase): docs/PUSH-ANDROID.md\n');

const extra = process.argv.slice(2);
const tieneTunnel = extra.some((a) => a === '--tunnel' || a === '--t');
const filtered = extra.filter((a) => a !== '--lan');
const args = [
    'expo',
    'start',
    '--dev-client',
    ...(tieneTunnel ? ['--tunnel'] : ['--lan']),
    ...filtered.filter((a) => a !== '--tunnel' && a !== '--t'),
];
const result = spawnSync('npx', args, {
    stdio: 'inherit',
    cwd: root,
    shell: true,
    env: { ...process.env, EXPO_USE_DEV_CLIENT: '1' },
});

process.exit(result.status ?? 1);
