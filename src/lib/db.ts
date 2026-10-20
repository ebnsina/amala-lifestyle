import type { SQLiteDatabase } from 'expo-sqlite';
import * as v from 'valibot';

import {
  BookSchema, MealItemSchema, PrayersSchema, ProfileSchema, SetsSchema, TaskSchema, WorkoutsSchema, type Backup,
  type MealItem, type Profile, type Slot,
} from '@/lib/schema';

const VERSION = 1;

// Bump VERSION and add a step below for every schema change; never edit a shipped step.
export async function migrate(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current > VERSION) throw new Error(`Database v${current} is newer than this app (v${VERSION})`);
  if (current === VERSION) return;
  await db.withTransactionAsync(async () => {
    if (current < 1) {
      await db.execAsync(`
        CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
        CREATE TABLE meal_items (
          id INTEGER PRIMARY KEY NOT NULL,
          day TEXT NOT NULL,
          slot TEXT NOT NULL CHECK (slot IN ('breakfast', 'lunch', 'snack', 'dinner')),
          food_id TEXT NOT NULL,
          units REAL NOT NULL CHECK (units > 0)
        );
        CREATE INDEX meal_items_day ON meal_items (day);
      `);
    }
    await db.execAsync(`PRAGMA user_version = ${VERSION}`);
  });
}

function getSetting<T>(db: SQLiteDatabase, key: string, schema: v.GenericSchema<unknown, T>): T | null {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  if (!row) return null;
  try {
    const parsed = v.safeParse(schema, JSON.parse(row.value));
    return parsed.success ? parsed.output : null;
  } catch {
    return null; // corrupt JSON: treat as unset rather than crash on launch
  }
}

export const setSetting = (db: SQLiteDatabase, key: string, value: unknown) =>
  db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, JSON.stringify(value));

const ids = v.array(v.string());

export const loadAll = (db: SQLiteDatabase) => ({
  profile: getSetting(db, 'profile', ProfileSchema),
  favourites: getSetting(db, 'favourites', ids),
  recent: getSetting(db, 'recent', ids),
  prayers: getSetting(db, 'prayers', PrayersSchema),
  workouts: getSetting(db, 'workouts', WorkoutsSchema),
  sets: getSetting(db, 'sets', SetsSchema),
  books: getSetting(db, 'books', v.array(BookSchema)),
  tasks: getSetting(db, 'tasks', v.array(TaskSchema)),
  items: db.getAllSync<{ day: string; slot: string; food_id: string; units: number }>(
    'SELECT day, slot, food_id, units FROM meal_items ORDER BY day DESC, id',
  ).flatMap((r) => {
    const parsed = v.safeParse(MealItemSchema, { day: r.day, slot: r.slot, foodId: r.food_id, units: r.units });
    return parsed.success ? [parsed.output] : [];
  }),
});

export const saveProfile = (db: SQLiteDatabase, p: Profile) => setSetting(db, 'profile', p);
export const saveFavourites = (db: SQLiteDatabase, f: string[]) => setSetting(db, 'favourites', f);
export const saveRecent = (db: SQLiteDatabase, r: string[]) => setSetting(db, 'recent', r);

// Replaces whatever was logged for that meal, so re-saving a meal edits it instead of duplicating.
export function replaceMeal(db: SQLiteDatabase, day: string, slot: Slot, items: Omit<MealItem, 'day' | 'slot'>[]) {
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM meal_items WHERE day = ? AND slot = ?', day, slot);
    for (const i of items) {
      db.runSync('INSERT INTO meal_items (day, slot, food_id, units) VALUES (?, ?, ?, ?)', day, slot, i.foodId, i.units);
    }
  });
}

export function replaceAll(db: SQLiteDatabase, b: Backup) {
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM meal_items');
    db.runSync('DELETE FROM settings');
    if (b.profile) saveProfile(db, b.profile);
    saveFavourites(db, b.favourites);
    saveRecent(db, b.recent);
    for (const k of ['prayers', 'workouts', 'sets', 'books', 'tasks'] as const) setSetting(db, k, b[k]);
    for (const m of b.meals) {
      db.runSync('INSERT INTO meal_items (day, slot, food_id, units) VALUES (?, ?, ?, ?)', m.day, m.slot, m.foodId, m.units);
    }
  });
}
