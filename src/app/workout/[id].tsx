import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick02Icon, TickDouble02Icon, Timer02Icon } from '@hugeicons/core-free-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Check, Chip, Empty, Note, Plate, Screen, T } from '@/components/ui';
import { setCount, workoutById } from '@/data/workouts';
import { bn, clock, dayKey } from '@/lib/format';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, toggleWorkout, sets, setSets } = useStore();
  // Bumped on each ticked set so the rest timer restarts from full.
  const [rest, setRest] = useState(0);
  const w = workoutById[id];
  if (!w) return <Screen><Empty emoji="🤔" text="এই ব্যায়ামটি খুঁজে পাওয়া যায়নি।" /></Screen>;

  const finished = (workouts[dayKey()] ?? []).includes(w.id);
  const done = sets[dayKey()]?.[w.id] ?? [];
  const total = setCount(w);
  const all = w.exercises.flatMap((e, i) => Array.from({ length: e.sets }, (_, j) => `${i}-${j}`));

  const tick = (key: string) => {
    const on = done.includes(key);
    const next = on ? done.filter((k) => k !== key) : [...done, key];
    setSets(w.id, next);
    if (!on && w.rest && next.length < total) setRest((n) => n + 1);
  };
  const finish = () => { if (!finished) toggleWorkout(w.id); router.back(); };

  const footer = rest ? (
    <RestTimer key={rest} seconds={w.rest} onEnd={() => setRest(0)} />
  ) : finished ? (
    <Button kind="ghost" label="শেষ হয়নি — আবার চালু করুন" onPress={() => toggleWorkout(w.id)} />
  ) : (
    <>
      {done.length < total && <Button kind="secondary" label="সব টিক দিন" icon={TickDouble02Icon}
        onPress={() => setSets(w.id, all)} />}
      <Button label="শেষ করুন"
        icon={Tick02Icon} disabled={!done.length} onPress={finish} />
    </>
  );

  return (
    <Screen footer={footer}>
      <View style={{ alignItems: 'center', gap: space.xs }}>
        <Plate emoji={w.emoji} size={64} />
        <T size="xl" bold>{w.bn}</T>
        <T size="sm" muted>প্রায় {bn(w.minutes)} মিনিট{w.rest ? ` · সেটের মাঝে ${bn(w.rest)} সেকেন্ড বিশ্রাম` : ''}</T>
      </View>

      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T size="sm" bold>{finished ? 'আজ শেষ করেছেন ✓' : done.length ? 'চলছে' : 'যেটা করবেন, টিক দিন'}</T>
          <T size="sm" muted>{bn(done.length)} / {bn(total)} সেট</T>
        </View>
        <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.accentSoft, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${(done.length / total) * 100}%`, backgroundColor: c.accent }} />
        </View>
      </View>

      {w.exercises.map((e, i) => {
        const keys = Array.from({ length: e.sets }, (_, j) => `${i}-${j}`);
        const complete = keys.every((k) => done.includes(k));
        return (
          <Card key={i} enter={i} style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
              {complete ? <Check on size={28} /> : (
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.accentSoft,
                  alignItems: 'center', justifyContent: 'center' }}>
                  <T size="sm" bold style={{ color: c.accent }}>{bn(i + 1)}</T>
                </View>
              )}
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
                  <T bold style={{ flexShrink: 1 }}>{e.bn}</T>
                  <T size="sm" bold style={{ color: c.accent }}>
                    {e.sets > 1 ? `${bn(e.sets)} সেট × ${e.reps}` : e.reps}
                  </T>
                </View>
                <T size="sm" muted>{e.tip}</T>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, paddingLeft: 28 + space.md }}>
              {keys.map((k, j) => (
                <Chip key={k} on={done.includes(k)} onPress={() => tick(k)}
                  label={`${done.includes(k) ? '✓ ' : ''}${e.sets > 1 ? `সেট ${bn(j + 1)}` : 'করেছি'}`} />
              ))}
            </View>
          </Card>
        );
      })}

      <Note>ওজনের চেয়ে সঠিক ভঙ্গি বেশি জরুরি। সব সেট না পারলে যতটুকু পেরেছেন ততটুকুই শেষ করুন — সেটাও গোনা হবে।</Note>
    </Screen>
  );
}

function RestTimer({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [until, setUntil] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  useEffect(() => { if (left === 0) onEnd(); }, [left, onEnd]);

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: c.blueSoft,
      borderRadius: radius.pill, paddingLeft: space.md, padding: 5 }}>
      <HugeiconsIcon icon={Timer02Icon} color={c.blue} size={20} />
      <View style={{ flex: 1 }}>
        <T size="xs" muted>বিশ্রাম</T>
        <T bold style={{ color: c.blue }}>{clock(left)}</T>
      </View>
      <Button kind="ghost" small label="+১৫ সে." onPress={() => setUntil((u) => u + 15000)} />
      <Button kind="secondary" small label="বাদ দিন" onPress={onEnd} />
    </View>
  );
}
