
import { Platform } from 'react-native';

const tintColorLight = '#FFD700'; // Gold for a touch of magic
const tintColorDark = '#E6E6FA'; // Lavender for a mystical feel

export const Colors = {
  light: {
    text: '#333333', // Dark gray for readability
    background: '#F0F8FF', // Alice blue, a very light, almost white blue
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E0E0E0',
  },
  dark: {
    text: '#EAEAEA', // Light gray for readability on dark backgrounds
    background: '#0c0c2c', // Deep, dark blue, like the night sky
    tint: tintColorDark,
    icon: '#BEBEBE',
    tabIconDefault: '#555555',
    tabIconSelected: tintColorDark,
    card: '#1a1a3a', // A slightly lighter shade of the background
    border: '#2a2a4a', // A border color that blends well
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-light',
    mono: 'monospace',
  },
  web: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
