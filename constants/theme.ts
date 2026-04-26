/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#175CD3';
const tintColorDark = '#84CAFF';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#CBD5E1',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const GatePassColors = {
  ink: '#0F172A',
  muted: '#64748B',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  border: '#E2E8F0',
  primary: '#175CD3',
  primaryDark: '#123C69',
  success: '#067647',
  successSoft: '#DCFAE6',
  danger: '#B42318',
  dangerSoft: '#FEE4E2',
  warning: '#B54708',
  warningSoft: '#FEF0C7',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
