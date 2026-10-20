import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Badge, Card, Note, Plate, Screen, SectionTitle, T } from '@/components/ui';
import { setCount, workouts, type Workout } from '@/data/workouts';
import { bn, dayKey, lastDays } from '@/lib/format';
import { useStore } from '@/lib/store';
import { c, space } from '@/lib/theme';

export default function Fitness() {
  const { workouts: log, sets } = useStore();
  const today = log[dayKey()] ?? [];
  const activeDays = lastDays(7).filter((d) => log[d]?.length).length;

  const status = (w: Workout) => {
    if (today.includes(w.id)) return <Badge label="আজ শেষ ✓" />;
    const n = sets[dayKey()]?.[w.id]?.length ?? 0;
    return n ? <Badge tone="warm" label={`${bn(n)}/${bn(setCount(w))} সেট`} />
      : <HugeiconsIcon icon={ArrowRight01Icon} color={c.muted} size={18} />;
  };

  const row = (w: Workout, i: number) => (
    <Card key={w.id} enter={i} onPress={() => router.push({ pathname: '/workout/[id]', params: { id: w.id } })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
      <Plate emoji={w.emoji} size={44} />
      <View style={{ flex: 1 }}>
        <T bold>{w.bn}</T>
        <T size="sm" muted>{bn(w.minutes)} মিনিট · {w.sub}</T>
      </View>
      {status(w)}
    </Card>
  );

  return (
    <Screen>
      <Card style={{ alignItems: 'center', gap: 2 }}>
        <T size="xl" bold style={{ color: c.accent }}>{bn(activeDays)} / ৭ দিন</T>
        <T size="sm" muted>গত সাত দিনে ব্যায়াম করেছেন</T>
      </Card>

      <SectionTitle title="ঘরে" />
      {workouts.filter((w) => w.place === 'home').map(row)}
      <SectionTitle title="জিমে" />
      {workouts.filter((w) => w.place === 'gym').map((w, i) => row(w, i + 3))}

      <Note>
        সপ্তাহে অন্তত ১৫০ মিনিট হাঁটা বা হালকা ব্যায়াম ভালো। নতুন হলে হালকা দিয়ে শুরু করুন। বুকে ব্যথা, মাথা ঘোরা বা
        শ্বাসকষ্ট হলে থামুন। হার্ট, ডায়াবেটিস বা অন্য অসুখ থাকলে আগে ডাক্তারের পরামর্শ নিন।
      </Note>
    </Screen>
  );
}
