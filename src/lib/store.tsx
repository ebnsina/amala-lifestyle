import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useState, type ReactNode } from 'react';

import { foodById } from '@/data/foods';
import * as db from '@/lib/db';
import { dayKey } from '@/lib/format';
import type { Portion } from '@/lib/nutrition';
import {
  BACKUP_APP, type Backup, type Book, type MealItem, type Prayer, type Profile, type Slot, type Task,
} from '@/lib/schema';

export type { Slot };
export const slots: { id: Slot; bn: string }[] = [
  { id: 'breakfast', bn: 'সকালের নাস্তা' },
  { id: 'lunch', bn: 'দুপুরের খাবার' },
  { id: 'snack', bn: 'বিকেলের নাস্তা' },
  { id: 'dinner', bn: 'রাতের খাবার' },
];
export const slotName = (s: Slot) => slots.find((x) => x.id === s)!.bn;

export function nextSlot(h = new Date().getHours()): Slot {
  if (h < 11) return 'breakfast';
  if (h < 16) return 'lunch';
  if (h < 19) return 'snack';
  return 'dinner';
}

export type Meal = { slot: Slot; portions: Portion[] };
export type Day = { date: string; meals: Meal[] };

// Foods removed from a later food list are skipped instead of crashing old logs.
const toMeals = (items: MealItem[]): Meal[] =>
  slots.flatMap(({ id }) => {
    const portions = items.filter((i) => i.slot === id && foodById[i.foodId])
      .map((i) => ({ food: foodById[i.foodId], units: i.units }));
    return portions.length ? [{ slot: id, portions }] : [];
  });

// ponytail: prefills setup during UI review; start blank before release.
export const dummyProfile: Profile = {
  age: 34, heightCm: 163, weightKg: 68, sex: 'female', activity: 'medium', goal: 'lose', mealsPerDay: 3, avoid: [],
};

type State = {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  today: Meal[];
  history: Day[];
  saveMeal: (m: Meal) => void;
  // The meal being written right now: which meal, and the foods ticked for it.
  slot: Slot;
  setSlot: (s: Slot) => void;
  cooked: string[];
  setCooked: (ids: string[]) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  recent: string[];
  prayers: Record<string, Prayer[]>;
  togglePrayer: (day: string, p: Prayer) => void;
  workouts: Record<string, string[]>;
  toggleWorkout: (id: string) => void;
  books: Book[];
  setBooks: (b: Book[]) => void;
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  exportData: () => Backup;
  importData: (b: Backup) => void;
};

const Ctx = createContext<State | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const sql = useSQLiteContext();
  const [data, setData] = useState(() => db.loadAll(sql));
  const [cooked, setCooked] = useState<string[]>([]);
  const [slot, setSlot] = useState<Slot>(nextSlot());
  const reload = () => setData(db.loadAll(sql));

  const todayKey = dayKey();
  const days = [...new Set(data.items.map((i) => i.day))].filter((d) => d !== todayKey);
  const favourites = data.favourites ?? [];
  const recent = data.recent ?? [];
  const prayers = data.prayers ?? {};
  const workouts = data.workouts ?? {};
  const books = data.books ?? [];
  const tasks = data.tasks ?? [];
  const save = (key: string, value: unknown) => { db.setSetting(sql, key, value); reload(); };
  const flip = <T,>(xs: T[] = [], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);

  const value: State = {
    profile: data.profile,
    setProfile: (p) => { db.saveProfile(sql, p); reload(); },
    today: toMeals(data.items.filter((i) => i.day === todayKey)),
    history: days.map((d) => ({ date: d, meals: toMeals(data.items.filter((i) => i.day === d)) })),
    saveMeal: (m) => {
      db.replaceMeal(sql, todayKey, m.slot, m.portions.map((p) => ({ foodId: p.food.id, units: p.units })));
      db.saveRecent(sql, [...new Set([...m.portions.map((p) => p.food.id), ...recent])].slice(0, 8));
      reload();
    },
    slot, setSlot, cooked, setCooked, favourites, recent,
    toggleFavourite: (id) => save('favourites', flip(favourites, id)),
    prayers, togglePrayer: (day, p) => save('prayers', { ...prayers, [day]: flip(prayers[day], p) }),
    workouts, toggleWorkout: (id) => save('workouts', { ...workouts, [todayKey]: flip(workouts[todayKey], id) }),
    books, setBooks: (b) => save('books', b),
    tasks, setTasks: (t) => save('tasks', t),
    exportData: () => ({
      app: BACKUP_APP, version: 1, exportedAt: new Date().toISOString(),
      profile: data.profile, favourites, recent, meals: data.items, prayers, workouts, books, tasks,
    }),
    importData: (b) => { db.replaceAll(sql, b); setCooked([]); reload(); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}
