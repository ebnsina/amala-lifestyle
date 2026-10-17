import type { Food } from '@/data/foods';

import type { Profile } from '@/lib/schema';

export type { Profile };
export type Sex = Profile['sex'];
export type Activity = Profile['activity'];
export type Goal = Profile['goal'];

const activityFactor: Record<Activity, number> = { low: 1.2, medium: 1.375, high: 1.55 };
const goalDelta: Record<Goal, number> = { lose: -400, keep: 0, gain: 300 };

// Mifflin-St Jeor resting energy, times activity, adjusted gently for goal.
export function dailyTarget(p: Profile) {
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
  const floor = p.sex === 'male' ? 1500 : 1200;
  return Math.round(Math.max(floor, bmr * activityFactor[p.activity] + goalDelta[p.goal]) / 10) * 10;
}

export type Portion = { food: Food; units: number };
export const kcalOf = (ps: Portion[]) => ps.reduce((s, p) => s + p.food.kcal * p.units, 0);
export const macrosOf = (ps: Portion[]) => ({
  protein: ps.reduce((s, p) => s + p.food.protein * p.units, 0),
  carbs: ps.reduce((s, p) => s + p.food.carbs * p.units, 0),
  fat: ps.reduce((s, p) => s + p.food.fat * p.units, 0),
});

const MEAL_FLOOR = 350; // never recommend a main meal below this, even if the day's budget is spent
const SNACK_MAX = 250;

// ponytail: scales typical portions to the meal budget; replace with per-food-group rules once real data lands.
export function recommend(selected: Food[], remaining: number, mealsLeft: number, snack = false) {
  const budget = snack
    ? Math.max(100, Math.min(SNACK_MAX, remaining))
    : Math.max(MEAL_FLOOR, remaining / Math.max(1, mealsLeft));
  const typical = selected.reduce((s, f) => s + f.kcal * f.typical, 0) || 1;
  const scale = Math.min(1.5, Math.max(0.5, budget / typical));
  const portions = selected.map((food) => ({
    food,
    units: Math.max(food.step, Math.round((food.typical * scale) / food.step) * food.step),
  }));
  return { portions, budget: Math.round(budget), lowBudget: !snack && remaining < MEAL_FLOOR };
}

// Within 10% (min 30 kcal) of the suggestion counts as "on target"; portions can't be cut finer than that.
export function compareToBudget(total: number, budget: number) {
  const diff = Math.round(total - budget);
  const slack = Math.max(30, budget * 0.1);
  return { diff, state: Math.abs(diff) <= slack ? 'near' : diff > 0 ? 'over' : 'under' } as const;
}
