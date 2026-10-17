// Bangla → Latin, so "misti kumra" finds মিষ্টি কুমড়া without hand-written aliases.
const map: Record<string, string> = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': '', 'ঁ': '',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng', 'চ': 'ch', 'ছ': 'ch', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n', 'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm', 'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's',
  'হ': 'h', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h',
};

const latin = (s: string) =>
  [...s.normalize('NFC').toLowerCase().replace(/[ডঢ]\u09BC/g, 'r').replace(/য\u09BC/g, 'y')].map((ch) => map[ch] ?? ch).join('')
    .replace(/([kgcjtdpb])h/g, '$1').replace(/sh/g, 's').replace(/ph|f/g, 'p')
    .replace(/z/g, 'j').replace(/v|w/g, 'b').replace(/q/g, 'k');

// Spelling-tolerant form: vowels dropped except at word start, repeats collapsed ("kumro" ≈ "kumra").
const skeleton = (s: string) =>
  latin(s).split(/\s+/).map((w) => w[0] + w.slice(1).replace(/[aeiouy]/g, '')).join('')
    .replace(/(.)\1+/g, '$1');

// 0 = name starts with query, 1 = contains it, 2 = loose spelling match, -1 = no match.
export function matchScore(query: string, names: string[]) {
  const q = latin(query.trim());
  if (!q) return 0;
  const ls = names.map(latin);
  if (ls.some((n) => n.startsWith(q))) return 0;
  if (ls.some((n) => n.includes(q))) return 1;
  const sq = skeleton(query.trim());
  return names.some((n) => skeleton(n).includes(sq)) ? 2 : -1;
}
