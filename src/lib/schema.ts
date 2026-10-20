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

const Day = v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/));
const Id = v.pipe(v.string(), v.minLength(1), v.maxLength(40));

export const PrayerSchema = v.picklist([
  'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr', 'tahajjud', 'ishraq', 'duha', 'awwabin',
]);
// day → what was done that day
export const PrayersSchema = v.record(Day, v.array(PrayerSchema));
export const WorkoutsSchema = v.record(Day, v.array(Id));
// day → workout → ticked sets, as "exercise-set" indexes
export const SetsSchema = v.record(Day, v.record(Id, v.array(v.pipe(v.string(), v.regex(/^\d+-\d+$/)))));

export const BookSchema = v.object({
  id: Id,
  title: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(120)),
  pages: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5000)),
  read: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(5000)),
});

export const TaskSchema = v.object({
  id: Id,
  text: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200)),
  done: v.boolean(),
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
  // Added after v1 shipped; optional so older backup files still import.
  prayers: v.optional(PrayersSchema, {}),
  workouts: v.optional(WorkoutsSchema, {}),
  sets: v.optional(SetsSchema, {}),
  books: v.optional(v.array(BookSchema), []),
  tasks: v.optional(v.array(TaskSchema), []),
});

export type Profile = v.InferOutput<typeof ProfileSchema>;
export type Slot = v.InferOutput<typeof SlotSchema>;
export type MealItem = v.InferOutput<typeof MealItemSchema>;
export type Backup = v.InferOutput<typeof BackupSchema>;
export type Prayer = v.InferOutput<typeof PrayerSchema>;
export type Book = v.InferOutput<typeof BookSchema>;
export type Task = v.InferOutput<typeof TaskSchema>;
