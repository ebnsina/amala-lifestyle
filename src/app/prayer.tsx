import { Pressable, View } from 'react-native';

import { Card, Check, Note, Screen, SectionTitle, T } from '@/components/ui';
import { bn, dayKey, lastDays, weekday } from '@/lib/format';
import type { Prayer } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const prayers: { id: Prayer; bn: string; when: string }[] = [
  { id: 'fajr', bn: 'ফজর', when: 'ভোর' },
  { id: 'dhuhr', bn: 'যোহর', when: 'দুপুর' },
  { id: 'asr', bn: 'আসর', when: 'বিকেল' },
  { id: 'maghrib', bn: 'মাগরিব', when: 'সন্ধ্যা' },
  { id: 'isha', bn: 'ইশা', when: 'রাত' },
];

export default function PrayerTracker() {
  const { prayers: log, togglePrayer } = useStore();
  const today = dayKey();
  const done = log[today] ?? [];
  const week = lastDays(7);

  return (
    <Screen>
      <T muted style={{ textAlign: 'center' }}>
        আজ <T bold style={{ color: c.accent }}>{bn(done.length)} / ৫</T> ওয়াক্ত
        {done.length === 5 ? ' — আলহামদুলিল্লাহ 🤲' : ''}
      </T>

      <View style={{ gap: space.sm }}>
        {prayers.map((p) => {
          const on = done.includes(p.id);
          return (
            <Pressable key={p.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
              accessibilityLabel={p.bn} onPress={() => togglePrayer(today, p.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md,
                borderRadius: radius.md, borderWidth: 1.5, borderColor: on ? c.accent : c.border,
                backgroundColor: on ? c.accentSoft : c.surface }}>
              <View style={{ flex: 1 }}>
                <T bold>{p.bn}</T>
                <T size="xs" muted>{p.when}</T>
              </View>
              <Check on={on} />
            </Pressable>
          );
        })}
      </View>

      <SectionTitle title="গত সাত দিন" />
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {week.map((d) => (
          <View key={d} style={{ alignItems: 'center', gap: 6 }}>
            <T size="xs" muted bold={d === today}>{weekday(d)}</T>
            {prayers.map((p) => {
              const on = (log[d] ?? []).includes(p.id);
              return (
                <Pressable key={p.id} hitSlop={4} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
                  accessibilityLabel={`${weekday(d)} ${p.bn}`} onPress={() => togglePrayer(d, p.id)}
                  style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: on ? c.accent : c.border }} />
              );
            })}
          </View>
        ))}
      </Card>
      <T size="xs" muted style={{ textAlign: 'center' }}>আগের দিনে চিহ্ন দিতে ভুলে গেলে ওপরের ঘরে চাপ দিন।</T>

      <Note>নামাজের সময় আপনার এলাকার মসজিদ বা ইসলামিক ফাউন্ডেশনের সময়সূচি দেখে নিন।</Note>
    </Screen>
  );
}
