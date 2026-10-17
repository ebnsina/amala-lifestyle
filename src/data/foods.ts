// DUMMY DATA for UI review only. Values are rough placeholders, not verified nutrition facts.
export type Category = 'rice' | 'dal' | 'fish' | 'meat' | 'veg' | 'dairy' | 'snack';

export type Food = {
  id: string;
  bn: string;
  en: string;
  aliases: string[];
  category: Category;
  unit: string; // household measure, e.g. কাপ, বাটি, টুকরা
  grams: number; // grams in one unit
  kcal: number; // per one unit
  protein: number;
  carbs: number;
  fat: number;
  typical: number; // usual units per meal
  step: number;
  emoji: string; // ponytail: stand-in for food photos until we have licensed images
};

export const categories: { id: Category | 'all'; bn: string; emoji: string }[] = [
  { id: 'all', bn: 'সব', emoji: '🍽️' },
  { id: 'rice', bn: 'ভাত-রুটি', emoji: '🍚' },
  { id: 'dal', bn: 'ডাল', emoji: '🥣' },
  { id: 'fish', bn: 'মাছ', emoji: '🐟' },
  { id: 'meat', bn: 'মাংস-ডিম', emoji: '🍗' },
  { id: 'veg', bn: 'সবজি-ভর্তা', emoji: '🥬' },
  { id: 'dairy', bn: 'দুধ-ফল', emoji: '🍌' },
  { id: 'snack', bn: 'নাস্তা', emoji: '☕' },
];

const emojis: Record<string, string> = {
  ruti: '🫓', paratha: '🫓', beef: '🥩', egg: '🥚', 'egg-fry': '🍳', kumra: '🎃', 'alu-bhorta': '🥔',
  'begun-bhorta': '🍆', milk: '🥛', doi: '🥛', guava: '🍐', singara: '🥟', muri: '🍿', khichuri: '🍛', polao: '🍛',
  'fish-jhol': '🍲', chicken: '🍗',
};

const f = (
  id: string, bn: string, en: string, category: Category, unit: string, grams: number,
  kcal: number, protein: number, carbs: number, fat: number, typical = 1, step = 0.5, aliases: string[] = [],
): Food => ({
  id, bn, en, aliases, category, unit, grams, kcal, protein, carbs, fat, typical, step,
  emoji: emojis[id] ?? categories.find((x) => x.id === category)!.emoji,
});

export const foods: Food[] = [
  f('rice-white', 'সাদা ভাত', 'White rice', 'rice', 'কাপ', 150, 195, 4, 43, 0.4, 1.5, 0.5, ['bhat', 'rice']),
  f('rice-red', 'লাল চালের ভাত', 'Red rice', 'rice', 'কাপ', 150, 180, 4, 38, 1.2, 1.5),
  f('khichuri', 'খিচুড়ি', 'Khichuri', 'rice', 'কাপ', 180, 290, 9, 42, 9, 1),
  f('polao', 'পোলাও', 'Polao', 'rice', 'কাপ', 150, 300, 5, 45, 11, 1),
  f('ruti', 'রুটি', 'Ruti', 'rice', 'টি', 40, 110, 3.5, 22, 1, 2, 1, ['roti', 'chapati']),
  f('paratha', 'পরোটা', 'Paratha', 'rice', 'টি', 70, 260, 5, 32, 12, 1, 1, ['porota']),
  f('dal-masoor', 'মসুর ডাল', 'Masoor dal', 'dal', 'বাটি', 150, 130, 8, 18, 3, 1, 0.5, ['dal']),
  f('dal-mug', 'মুগ ডাল', 'Mung dal', 'dal', 'বাটি', 150, 140, 9, 19, 3.5, 1),
  f('rui', 'রুই মাছ', 'Rui fish curry', 'fish', 'মাঝারি টুকরা', 80, 150, 15, 3, 8, 1, 1, ['rohu']),
  f('katla', 'কাতলা মাছ', 'Katla fish curry', 'fish', 'মাঝারি টুকরা', 80, 155, 15, 3, 9, 1, 1),
  f('ilish', 'ইলিশ মাছ', 'Hilsa', 'fish', 'মাঝারি টুকরা', 70, 220, 15, 1, 17, 1, 1, ['hilsa']),
  f('fish-jhol', 'মাছের ঝোল', 'Fish jhol', 'fish', 'বাটি', 200, 180, 16, 8, 9, 1),
  f('chicken', 'মুরগির ঝোল', 'Chicken curry', 'meat', 'টুকরা', 60, 140, 14, 3, 8, 2, 1, ['murgi']),
  f('beef', 'গরুর মাংস', 'Beef curry', 'meat', 'টুকরা', 40, 120, 10, 2, 8, 2, 1, ['goru']),
  f('egg', 'ডিম সেদ্ধ', 'Boiled egg', 'meat', 'টি', 50, 75, 6, 0.5, 5, 1, 1, ['dim']),
  f('egg-fry', 'ডিম ভাজি', 'Fried egg', 'meat', 'টি', 50, 110, 6, 0.5, 9, 1, 1, ['omelette']),
  f('veg-mixed', 'মিশ্র সবজি', 'Mixed vegetables', 'veg', 'বাটি', 150, 110, 3, 14, 5, 1),
  f('kumra', 'মিষ্টি কুমড়া', 'Pumpkin curry', 'veg', 'বাটি', 150, 90, 2, 14, 3.5, 1),
  f('lau', 'লাউ', 'Bottle gourd curry', 'veg', 'বাটি', 150, 70, 1.5, 7, 4, 1),
  f('shak', 'শাক ভাজি', 'Leafy greens', 'veg', 'বাটি', 100, 80, 3, 6, 5, 1, 0.5, ['shak']),
  f('alu-bhorta', 'আলু ভর্তা', 'Mashed potato', 'veg', 'চামচ', 40, 55, 1, 8, 2.5, 2, 1),
  f('begun-bhorta', 'বেগুন ভর্তা', 'Eggplant bhorta', 'veg', 'চামচ', 40, 35, 0.5, 3, 2.5, 2, 1),
  f('dal-bhorta', 'ডাল ভর্তা', 'Dal bhorta', 'veg', 'চামচ', 40, 60, 3, 7, 2, 2, 1),
  f('doi', 'টক দই', 'Yogurt', 'dairy', 'বাটি', 100, 65, 3.5, 5, 3.5, 1),
  f('milk', 'দুধ', 'Milk', 'dairy', 'গ্লাস', 200, 130, 6.5, 10, 7, 1, 0.5, ['dudh']),
  f('banana', 'কলা', 'Banana', 'dairy', 'টি', 100, 90, 1, 23, 0.3, 1, 1, ['kola']),
  f('guava', 'পেয়ারা', 'Guava', 'dairy', 'টি', 100, 68, 2.5, 14, 1, 1, 1),
  f('muri', 'মুড়ি', 'Puffed rice', 'snack', 'কাপ', 15, 60, 1, 13, 0.2, 1),
  f('singara', 'সিঙ্গারা', 'Singara', 'snack', 'টি', 60, 200, 3, 22, 11, 1, 1),
  f('cha', 'দুধ চা', 'Milk tea', 'snack', 'কাপ', 150, 70, 2, 10, 2.5, 1, 1, ['tea']),
];

export const foodById = Object.fromEntries(foods.map((x) => [x.id, x]));
