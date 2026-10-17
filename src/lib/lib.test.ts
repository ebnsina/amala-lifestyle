import { describe, expect, it } from '@jest/globals';

import { foodById } from '@/data/foods';
import { parseBackup } from '@/lib/backup';
import { bmi, bmiBand, healthyRange } from '@/lib/bmi';
import { dayKey, parseNum, qty } from '@/lib/format';
import { compareToBudget, dailyTarget, recommend } from '@/lib/nutrition';
import type { Backup, Profile } from '@/lib/schema';
import { matchScore } from '@/lib/search';

const woman: Profile = {
  age: 34, heightCm: 163, weightKg: 68, sex: 'female', activity: 'medium', goal: 'lose', mealsPerDay: 3, avoid: [],
};

describe('dailyTarget (Mifflin-St Jeor)', () => {
  it('matches a hand-worked example', () => {
    // 10*68 + 6.25*163 - 5*34 - 161 = 1367.75; *1.375 = 1880.7; -400 = 1480.7 → 1480
    expect(dailyTarget(woman)).toBe(1480);
  });
  it('never goes below the safe floor', () => {
    expect(dailyTarget({ ...woman, weightKg: 35, heightCm: 140, age: 80, activity: 'low' })).toBe(1200);
    expect(dailyTarget({ ...woman, sex: 'male', weightKg: 40, heightCm: 145, age: 85, activity: 'low' })).toBe(1500);
  });
});

describe('recommend', () => {
  const plate = [foodById['rice-white'], foodById['dal-masoor'], foodById.rui];
  it('keeps a real meal even when the day budget is spent', () => {
    const r = recommend(plate, 100, 1);
    expect(r.lowBudget).toBe(true);
    expect(r.budget).toBe(350);
    for (const p of r.portions) expect(p.units).toBeGreaterThanOrEqual(p.food.step);
  });
  it('caps snacks and never flags them as low budget', () => {
    const r = recommend(plate, 1000, 2, true);
    expect(r.budget).toBe(250);
    expect(r.lowBudget).toBe(false);
  });
  it('rounds every portion to the food step', () => {
    for (const p of recommend(plate, 900, 2).portions) expect(p.units / p.food.step % 1).toBe(0);
  });
});

describe('compareToBudget', () => {
  it('calls small differences near, larger ones over or under', () => {
    expect(compareToBudget(270, 250)).toEqual({ diff: 20, state: 'near' });
    expect(compareToBudget(330, 250)).toEqual({ diff: 80, state: 'over' });
    expect(compareToBudget(150, 250)).toEqual({ diff: -100, state: 'under' });
    expect(compareToBudget(660, 600)).toEqual({ diff: 60, state: 'near' }); // 10% of 600
  });
});

describe('bmi (Asian cut-offs)', () => {
  it('computes and bands', () => {
    expect(bmi(68, 163)).toBeCloseTo(25.59, 2);
    expect(bmiBand(18.4)).toBe('under');
    expect(bmiBand(18.5)).toBe('normal');
    expect(bmiBand(22.9)).toBe('normal');
    expect(bmiBand(23)).toBe('over');
    expect(bmiBand(27.5)).toBe('obese');
  });
  it('gives the normal weight range for a height', () => {
    expect(healthyRange(163)).toEqual({ min: 50, max: 60 });
  });
});

describe('format', () => {
  it('speaks portions the everyday way', () => {
    expect(qty(1.5, 'কাপ')).toBe('দেড় কাপ');
    expect(qty(0.5, 'বাটি')).toBe('আধা বাটি');
    expect(qty(2, 'টি')).toBe('২টি');
  });
  it('parses Bangla and English digits', () => {
    expect(parseNum('৩৫')).toBe(35);
    expect(parseNum('5.5')).toBe(5.5);
    expect(parseNum('')).toBeNaN();
  });
  it('uses the local calendar day, not UTC', () => {
    expect(dayKey(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05');
  });
});

describe('search', () => {
  it.each([
    ['misti kumra', 'মিষ্টি কুমড়া'], ['mishti kumro', 'মিষ্টি কুমড়া'], ['kichuri', 'খিচুড়ি'],
    ['vorta', 'বেগুন ভর্তা'], ['masoor', 'মসুর ডাল'], ['ডাল', 'মসুর ডাল'],
  ])('%s finds %s', (q, name) => expect(matchScore(q, [name])).toBeGreaterThanOrEqual(0));
  it('rejects unrelated words', () => expect(matchScore('fish', ['মসুর ডাল'])).toBe(-1));
});

describe('parseBackup', () => {
  const good: Backup = {
    app: 'amala-lifestyle', version: 1, exportedAt: '2026-10-17T10:00:00.000Z', profile: woman,
    favourites: ['rui'], recent: [],
    meals: [{ day: '2026-10-17', slot: 'lunch', foodId: 'rui', units: 1 }],
  };
  it('accepts its own export', () => {
    const r = parseBackup(JSON.stringify(good));
    expect(r.ok && r.backup).toEqual(good);
  });
  it('drops meals for unknown foods and counts them', () => {
    const r = parseBackup(JSON.stringify({ ...good, meals: [...good.meals, { ...good.meals[0], foodId: 'pizza' }] }));
    expect(r.ok && r.skipped).toBe(1);
  });
  it('rejects junk and foreign files', () => {
    expect(parseBackup('not json')).toEqual({ ok: false, reason: 'json' });
    expect(parseBackup(JSON.stringify({ app: 'other' }))).toEqual({ ok: false, reason: 'format' });
    expect(parseBackup(JSON.stringify({ ...good, meals: [{ ...good.meals[0], units: -1 }] })).ok).toBe(false);
  });
});
