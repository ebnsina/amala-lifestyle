// BMI with WHO Asian cut-offs (WHO Expert Consultation, Lancet 2004), which suit Bangladeshi adults
// better than the global 25/30 lines. It is a rough screen only, never a diagnosis.
export type BmiBand = 'under' | 'normal' | 'over' | 'obese';

export const bmi = (weightKg: number, heightCm: number) => weightKg / (heightCm / 100) ** 2;

export const BANDS: { id: BmiBand; from: number; bn: string }[] = [
  { id: 'under', from: 0, bn: 'ওজন কম' },
  { id: 'normal', from: 18.5, bn: 'স্বাভাবিক' },
  { id: 'over', from: 23, bn: 'ওজন বেশি' },
  { id: 'obese', from: 27.5, bn: 'অনেক বেশি' },
];

export const bmiBand = (value: number): BmiBand => [...BANDS].reverse().find((b) => value >= b.from)!.id;

// Weight range (kg) that falls in the "normal" band for this height.
export const healthyRange = (heightCm: number) => {
  const m2 = (heightCm / 100) ** 2;
  return { min: Math.ceil(18.5 * m2), max: Math.floor(22.9 * m2) };
};
