import firebaseIcon from '../assets/svgs/firebase.svg';

export const isVideoFile = (url: string) => {
    return url.split('?')[0].toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('/videos/');
};

export const getStackIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('firebase')) return firebaseIcon;
    return null;
};

export const getTechColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('flutter')) return '#02569b';
    if (lower.includes('dart')) return '#0175c2';
    if (lower.includes('react')) return '#61dafb';
    if (lower.includes('bloc') || lower.includes('cubit')) return '#2563eb';
    if (lower.includes('provider') || lower.includes('riverpod')) return '#0ea5e9';
    if (lower.includes('clean architecture')) return '#16a34a';
    if (lower.includes('solid')) return '#14b8a6';
    if (lower.includes('html')) return '#e34f26';
    if (lower.includes('css')) return '#1572b6';
    if (lower.includes('js') || lower.includes('javascript')) return '#f7df1e';
    if (lower.includes('node')) return '#339933';
    if (lower.includes('firebase')) return '#ffca28';
    if (lower.includes('rest')) return '#f97316';
    if (lower.includes('websocket') || lower.includes('realtime')) return '#ec4899';
    if (lower.includes('maps') || lower.includes('location')) return '#34a853';
    if (lower.includes('storage') || lower.includes('sqflite') || lower.includes('hive')) return '#0f766e';
    if (lower.includes('ci/cd') || lower.includes('release') || lower.includes('github actions') || lower.includes('bitrise') || lower.includes('fastlane')) return '#111827';
    if (lower.includes('swift')) return '#f05138';
    if (lower.includes('kotlin')) return '#7f52ff';
    if (lower.includes('typescript') || lower.includes('ts')) return '#3178c6';
    if (lower.includes('tailwind')) return '#06b6d4';
    if (lower.includes('transport')) return '#0ea5e9';
    if (lower.includes('education')) return '#8b5cf6';
    if (lower.includes('social')) return '#ec4899';
    if (lower.includes('e-commerce') || lower.includes('retail') || lower.includes('shopping')) return '#f59e0b';
    if (lower.includes('android')) return '#3ddc84';
    if (lower.includes('ios')) return '#94a3b8';
    return '#60a5fa';
};
