import Constants from 'expo-constants';
import { EAS_PROJECT_ID } from '../constants/easProject';

/** Resuelve el projectId de EAS en Expo Go, dev client o web. */
export function obtenerEasProjectId() {
    const manifest = Constants.manifest ?? Constants.__unsafeNoWarnManifest;
    return (
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId ??
        manifest?.extra?.eas?.projectId ??
        EAS_PROJECT_ID
    );
}
