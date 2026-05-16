// Design tokens mirroring the web app's globals.css CSS custom properties.
// All OKLCH values are pre-converted to hex for React Native compatibility.

export const colors = {
  // Brand accent — teal (oklch(0.55 0.09 195) → #2B7A78)
  accent: '#2B7A78',
  accentDark: '#1F5C5A',
  accentSoft: '#E6F4F4',

  // Backgrounds
  bg: '#FAF9F8',
  bgSubtle: '#F2F0EE',
  surface: '#FFFFFF',
  surface2: '#F7F6F5',

  // Text
  ink: '#27272A',
  ink2: '#3F3F46',
  ink3: '#52525B',
  inkMuted: '#71717A',

  // Borders
  border: '#D4D4D8',
  borderStrong: '#A1A1AA',

  // Semantic
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warn: '#CA8A04',
  warnSoft: '#FEF9C3',

  // Dark mode equivalents
  dark: {
    bg: '#171717',
    bgSubtle: '#1C1C1C',
    surface: '#242424',
    surface2: '#2A2A2A',
    ink: '#FAFAFA',
    ink2: '#E4E4E7',
    ink3: '#D4D4D8',
    inkMuted: '#A1A1AA',
    border: '#3F3F46',
    borderStrong: '#52525B',
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 48,
  12: 56,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  pop: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const typography = {
  displayFont: 'Fraunces_700Bold',
  bodyFont: 'InterTight_400Regular',
  bodyMedium: 'InterTight_500Medium',
  bodyBold: 'InterTight_700Bold',

  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
} as const;
