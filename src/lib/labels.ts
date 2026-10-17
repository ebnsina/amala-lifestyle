import type { Activity, Goal, Sex } from '@/lib/nutrition';

export const sexOptions: { id: Sex; bn: string }[] = [
  { id: 'female', bn: 'নারী' },
  { id: 'male', bn: 'পুরুষ' },
];

export const activityOptions: { id: Activity; bn: string; hint: string; emoji: string }[] = [
  { id: 'low', bn: 'বেশিরভাগ সময় বসে থাকি', hint: 'অফিস, পড়াশোনা, ঘরে বিশ্রাম', emoji: '🪑' },
  { id: 'medium', bn: 'মাঝামাঝি চলাফেরা', hint: 'ঘরের কাজ, হাঁটাহাঁটি, বাজার করা', emoji: '🚶' },
  { id: 'high', bn: 'অনেক পরিশ্রম করি', hint: 'শারীরিক কাজ, নিয়মিত ব্যায়াম', emoji: '🏋️' },
];

export const goalOptions: { id: Goal; bn: string; emoji: string }[] = [
  { id: 'lose', bn: 'ওজন কমাতে চাই', emoji: '📉' },
  { id: 'keep', bn: 'ওজন ঠিক রাখতে চাই', emoji: '⚖️' },
  { id: 'gain', bn: 'ওজন বাড়াতে চাই', emoji: '📈' },
];

export const avoidOptions = [
  { id: 'beef', bn: 'গরুর মাংস খাই না' },
  { id: 'fish', bn: 'মাছ খাই না' },
  { id: 'milk', bn: 'দুধে সমস্যা হয়' },
  { id: 'egg', bn: 'ডিম খাই না' },
];
