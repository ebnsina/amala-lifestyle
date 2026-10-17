// Fresh near-white base, leaf-green accent, warm orange for highlights.
export const c = {
  bg: '#F5F8F4',
  surface: '#FFFFFF',
  text: '#18211C',
  muted: '#7A857F',
  border: '#E6ECE6',
  accent: '#2E7D4F',
  accentSoft: '#E7F2EA',
  onAccent: '#FFFFFF',
  warm: '#E8742A',
  warmSoft: '#FDEEE3',
  danger: '#B4442F',
  protein: '#F2B233',
  fat: '#EF7B3A',
  carbs: '#6CBF47',
};

export const font = { xs: 13, sm: 15, md: 17, lg: 20, xl: 28, xxl: 40 };
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { md: 16, lg: 24, pill: 999 };
// Android's minimum recommended touch target is 48dp; we go a bit larger.
export const touch = 56;

export const shadow = {
  shadowColor: '#1F3A2A',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

// Hind Siliguri, bundled with the app (loaded in the root layout) so Bangla renders the same on every phone.
export const family = 'HindSiliguri';
