import { Tick02Icon } from '@hugeicons/core-free-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, Empty, Note, Plate, Screen, T } from '@/components/ui';
import { workoutById } from '@/data/workouts';
import { bn, dayKey } from '@/lib/format';
import { useStore } from '@/lib/store';
import { c, space } from '@/lib/theme';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, toggleWorkout } = useStore();
  const w = workoutById[id];
  if (!w) return <Screen><Empty emoji="🤔" text="এই ব্যায়ামটি খুঁজে পাওয়া যায়নি।" /></Screen>;
  const done = (workouts[dayKey()] ?? []).includes(w.id);

  return (
    <Screen footer={done
      ? <Button kind="ghost" label="আজ করা হয়নি — বাতিল" onPress={() => toggleWorkout(w.id)} />
      : <Button label="আজ করেছি" icon={Tick02Icon} onPress={() => { toggleWorkout(w.id); router.back(); }} />}>
      <View style={{ alignItems: 'center', gap: space.xs }}>
        <Plate emoji={w.emoji} size={72} />
        <T size="xl" bold>{w.bn}</T>
        <T size="sm" muted>প্রায় {bn(w.minutes)} মিনিট · {w.sub}</T>
      </View>

      {w.exercises.map((e, i) => (
        <Card key={i} enter={i} style={{ flexDirection: 'row', gap: space.md }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.accentSoft,
            alignItems: 'center', justifyContent: 'center' }}>
            <T size="sm" bold style={{ color: c.accent }}>{bn(i + 1)}</T>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
              <T bold style={{ flexShrink: 1 }}>{e.bn}</T>
              <T size="sm" bold style={{ color: c.accent }}>{e.dose}</T>
            </View>
            <T size="sm" muted>{e.tip}</T>
          </View>
        </Card>
      ))}

      <Note>প্রতি সেটের মাঝে ১ মিনিট বিশ্রাম নিন। ওজনের চেয়ে সঠিক ভঙ্গি বেশি জরুরি।</Note>
    </Screen>
  );
}
