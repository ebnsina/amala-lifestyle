const num = new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 });

export const bn = (n: number) => num.format(n);

// Users may type Bangla digits; normalise to ASCII before parsing.
export const parseNum = (s: string) =>
  Number(s.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d))).trim() || NaN);

export const dateLabel = (d: Date) =>
  new Intl.DateTimeFormat('bn-BD', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

const spoken: Record<number, string> = { 0.5: 'আধা', 1.5: 'দেড়', 2.5: 'আড়াই' };

// "দেড় কাপ", "২টি" — how people actually say portions.
export const qty = (units: number, unit: string) =>
  `${spoken[units] ?? bn(units)}${unit === 'টি' ? '' : ' '}${unit}`;

// Local calendar day as YYYY-MM-DD; toISOString() would use UTC and roll over at 6am in Bangladesh.
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseDay = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// The last n calendar days as day keys, oldest first, ending today.
export const lastDays = (n: number, from = new Date()) =>
  Array.from({ length: n }, (_, i) => dayKey(new Date(from.getFullYear(), from.getMonth(), from.getDate() - (n - 1 - i))));

export const weekday = (key: string) => new Intl.DateTimeFormat('bn-BD', { weekday: 'short' }).format(parseDay(key));
