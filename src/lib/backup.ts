import * as v from 'valibot';

import { foodById } from '@/data/foods';
import { dayKey } from '@/lib/format';
import { BackupSchema, type Backup } from '@/lib/schema';

export const backupFileName = (d = new Date()) => `amala-backup-${dayKey(d)}.json`;

export type ParseResult = { ok: true; backup: Backup; skipped: number } | { ok: false; reason: 'json' | 'format' };

// Validates an imported file; meals for foods this app version doesn't know are dropped and counted.
export function parseBackup(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'json' };
  }
  const parsed = v.safeParse(BackupSchema, raw);
  if (!parsed.success) return { ok: false, reason: 'format' };
  const meals = parsed.output.meals.filter((m) => foodById[m.foodId]);
  return { ok: true, backup: { ...parsed.output, meals }, skipped: parsed.output.meals.length - meals.length };
}
