import { dayKey } from '@/lib/format';
import type { Prayer } from '@/lib/schema';

export const fard: { id: Prayer; bn: string; when: string }[] = [
  { id: 'fajr', bn: 'ফজর', when: 'ভোর' },
  { id: 'dhuhr', bn: 'যোহর', when: 'দুপুর' },
  { id: 'asr', bn: 'আসর', when: 'বিকেল' },
  { id: 'maghrib', bn: 'মাগরিব', when: 'সন্ধ্যা' },
  { id: 'isha', bn: 'ইশা', when: 'রাত' },
];

export const extra: { id: Prayer; bn: string; when: string }[] = [
  { id: 'tahajjud', bn: 'তাহাজ্জুদ', when: 'শেষ রাতে, ফজরের আগে' },
  { id: 'ishraq', bn: 'ইশরাক', when: 'সূর্য ওঠার একটু পরে' },
  { id: 'duha', bn: 'চাশত (দুহা)', when: 'সকাল থেকে দুপুরের আগে' },
  { id: 'awwabin', bn: 'আওয়াবীন', when: 'মাগরিবের পরে' },
  { id: 'witr', bn: 'বিতর', when: 'ইশার পরে' },
];

const allFard = (done: Prayer[] = []) => fard.every((p) => done.includes(p.id));

// Days in a row with all five fard prayers; today still counts as "in progress" until it's over.
export function streak(log: Record<string, Prayer[]>, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (!allFard(log[dayKey(d)])) d.setDate(d.getDate() - 1);
  let n = 0;
  while (allFard(log[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
