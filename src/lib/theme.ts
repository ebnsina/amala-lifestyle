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
  dangerSoft: '#F8E7E3',
  blue: '#3D7CB8',
  blueSoft: '#E6EFF8',
  plum: '#7A5AB8',
  plumSoft: '#EFEAF8',
  protein: '#F2B233',
  fat: '#EF7B3A',
  carbs: '#6CBF47',
};

export const font = { xs: 12, sm: 13, md: 15, lg: 17, xl: 22, xxl: 32 };
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { md: 16, lg: 24, pill: 999 };
// Android's minimum recommended touch target is 48dp.
export const touch = 50;

export const shadow = {
  shadowColor: '#1F3A2A',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 1,
};

// Hind Siliguri, bundled with the app (loaded in the root layout) so Bangla renders the same on every phone.
export const family = 'HindSiliguri';
