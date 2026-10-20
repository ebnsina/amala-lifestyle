import { Pressable, View } from 'react-native';

import { Card, Check, Note, Screen, SectionTitle, T } from '@/components/ui';
import { bn, dayKey, lastDays, weekday } from '@/lib/format';
import { extra, fard, streak } from '@/lib/prayer';
import type { Prayer } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function PrayerTracker() {
  const { prayers: log, togglePrayer } = useStore();
  const today = dayKey();
  const done = log[today] ?? [];
  const fardDone = fard.filter((p) => done.includes(p.id)).length;
  const days = streak(log);

  const row = (p: { id: Prayer; bn: string; when: string }) => {
    const on = done.includes(p.id);
    return (
      <Pressable key={p.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
        accessibilityLabel={p.bn} onPress={() => togglePrayer(today, p.id)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.md,
          paddingVertical: space.sm + 2, borderRadius: radius.md, borderWidth: 1.5,
          borderColor: on ? c.accent : c.border, backgroundColor: on ? c.accentSoft : c.surface }}>
        <View style={{ flex: 1 }}>
          <T bold>{p.bn}</T>
          <T size="xs" muted>{p.when}</T>
        </View>
        <Check on={on} />
      </Pressable>
    );
  };

  return (
    <Screen>
      <Card style={{ flexDirection: 'row', paddingVertical: space.md }}>
        {[[`${bn(fardDone)} / ৫`, 'আজকের ফরজ'], [`${bn(days)} দিন`, 'টানা পাঁচ ওয়াক্ত']].map(([v, k], i) => (
          <View key={k} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderColor: c.border }}>
            <T size="lg" bold style={{ color: c.accent }}>{v}</T>
            <T size="xs" muted>{k}</T>
          </View>
        ))}
      </Card>
      {fardDone === 5 && <T muted style={{ textAlign: 'center' }}>আলহামদুলিল্লাহ, আজকের পাঁচ ওয়াক্ত পূর্ণ 🤲</T>}

      <SectionTitle title="ফরজ নামাজ" />
      <View style={{ gap: space.sm }}>{fard.map(row)}</View>

      <SectionTitle title="বিতর ও নফল" />
      <View style={{ gap: space.sm }}>{extra.map(row)}</View>

      <SectionTitle title="গত সাত দিন (ফরজ)" />
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {lastDays(7).map((d) => (
          <View key={d} style={{ alignItems: 'center', gap: 6 }}>
            <T size="xs" muted bold={d === today}>{weekday(d)}</T>
            {fard.map((p) => {
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
