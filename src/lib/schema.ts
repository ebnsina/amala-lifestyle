import * as v from 'valibot';

// Shared by database reads and backup import, so bad data is rejected the same way everywhere.
export const ProfileSchema = v.object({
  age: v.pipe(v.number(), v.minValue(18), v.maxValue(90)),
  heightCm: v.pipe(v.number(), v.minValue(120), v.maxValue(230)),
  weightKg: v.pipe(v.number(), v.minValue(30), v.maxValue(250)),
  sex: v.picklist(['male', 'female']),
  activity: v.picklist(['low', 'medium', 'high']),
  goal: v.picklist(['lose', 'keep', 'gain']),
  mealsPerDay: v.picklist([2, 3, 4, 5]),
  avoid: v.array(v.string()),
});

export const SlotSchema = v.picklist(['breakfast', 'lunch', 'snack', 'dinner']);

export const MealItemSchema = v.object({
  day: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
  slot: SlotSchema,
  foodId: v.string(),
  units: v.pipe(v.number(), v.minValue(0.1), v.maxValue(50)),
});

export const BACKUP_APP = 'amala-lifestyle';

export const BackupSchema = v.object({
  app: v.literal(BACKUP_APP),
  version: v.literal(1),
  exportedAt: v.string(),
  profile: v.nullable(ProfileSchema),
  favourites: v.array(v.string()),
  recent: v.array(v.string()),
  meals: v.array(MealItemSchema),
});

export type Profile = v.InferOutput<typeof ProfileSchema>;
export type Slot = v.InferOutput<typeof SlotSchema>;
export type MealItem = v.InferOutput<typeof MealItemSchema>;
export type Backup = v.InferOutput<typeof BackupSchema>;
