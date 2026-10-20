import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, Delete02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { ZoomIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, Card, Check, Chip, Empty, Note, Plate, Screen, Stepper, T } from '@/components/ui';
import { foodById } from '@/data/foods';
import { bn, qty } from '@/lib/format';
import { compareToBudget, dailyTarget, kcalOf, macrosOf, recommend } from '@/lib/nutrition';
import { slotName, slots, useStore, type Slot } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function Plan() {
  const { slot, setSlot, today, setCooked } = useStore();
  const [done, setDone] = useState<Slot | null>(null);
  if (!done) return <PlanFor key={slot} slot={slot} setSlot={setSlot} onSaved={() => { setDone(slot); setCooked([]); }} />;

  const meal = today.find((m) => m.slot === done);
  const next = slots.find((s) => !today.some((m) => m.slot === s.id));
  return (
    <Screen footer={next ? (
      <>
        <Button kind="ghost" label="এখন না" onPress={() => router.dismissTo('/food')} />
        <Button label={next.bn} icon={Add01Icon}
          onPress={() => { setSlot(next.id); router.back(); }} />
      </>
    ) : <Button label="ঠিক আছে" onPress={() => router.dismissTo('/food')} />}>
      <Animated.View entering={ZoomIn.springify()} style={{ alignItems: 'center', gap: space.sm, paddingTop: space.xl }}>
        <Check on size={72} />
        <T size="lg" bold>{slotName(done)} লেখা হয়েছে</T>
        {meal && <T muted>{bn(Math.round(kcalOf(meal.portions)))} ক্যালরি</T>}
      </Animated.View>
      <T muted style={{ textAlign: 'center' }}>
        {next ? 'আরেক বেলার খাবার এখনই লিখে রাখতে পারেন।' : 'আজকের চার বেলাই লেখা হয়ে গেছে।'}
      </T>
    </Screen>
  );
}

function PlanFor({ slot, setSlot, onSaved }: { slot: Slot; setSlot: (s: Slot) => void; onSaved: () => void }) {
  const { profile, today, cooked, setCooked, saveMeal } = useStore();
  const saved = today.find((m) => m.slot === slot);
  const others = today.filter((m) => m.slot !== slot);
  const target = profile ? dailyTarget(profile) : 0;
  const remaining = target - others.reduce((s, m) => s + kcalOf(m.portions), 0);
  const mealsLeft = (profile?.mealsPerDay ?? 3) - others.filter((m) => m.slot !== 'snack').length;
  const rec = recommend(cooked.map((id) => foodById[id]), remaining, mealsLeft, slot === 'snack');

  // Editing a saved meal keeps what was saved; new foods get the suggested amount.
  const [units, setUnits] = useState(() => Object.fromEntries(rec.portions.map((p) =>
    [p.food.id, saved?.portions.find((x) => x.food.id === p.food.id)?.units ?? p.units])));
  const portions = rec.portions.map((p) => ({ food: p.food, units: units[p.food.id] ?? 0 }))
    .filter((p) => cooked.includes(p.food.id));
  const total = Math.round(kcalOf(portions));
  const m = macrosOf(portions);

  if (!profile) return null;
  if (!portions.length) {
    return (
      <Screen>
        <Empty emoji="🍽️" text="কোনো খাবার বাছাই করা নেই।" />
        <View style={{ flexDirection: 'row' }}>
          <Button label="খাবার বেছে নিন" kind="secondary" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const save = () => {
    saveMeal({ slot, portions: portions.filter((p) => p.units > 0) });
    onSaved();
  };
  const remove = () => {
    saveMeal({ slot, portions: [] });
    setCooked([]);
    router.dismissTo('/food');
  };

  return (
    <Screen footer={<Button label={saved ? 'বদলগুলো সেভ করুন' : 'খেয়েছি, লিখে রাখুন'} icon={Tick02Icon}
      onPress={save} disabled={total === 0} />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.md }}
        contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.md }}>
        {slots.map((s) => <Chip key={s.id} label={s.bn} on={s.id === slot} onPress={() => setSlot(s.id)} />)}
      </ScrollView>

      {rec.lowBudget ? (
        <Note tone="warn">আজকের হিসাব প্রায় শেষ। তবু না খেয়ে থাকবেন না — নিচে হালকা কিন্তু পুষ্টিকর পরিমাণ দেওয়া হলো।</Note>
      ) : (
        <T muted>এই বেলায় প্রায় <T bold>{bn(rec.budget)} ক্যালরি</T> খেলে দিনের হিসাব ঠিক থাকবে। দরকার হলে +/− দিয়ে বদলান।</T>
      )}

      {portions.map(({ food, units: u }) => (
        <Card key={food.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <Plate emoji={food.emoji} size={40} />
          <View style={{ flex: 1 }}>
            <T bold>{food.bn}</T>
            <T size="sm" muted>{qty(u, food.unit)} · {bn(Math.round(food.kcal * u))} ক্যালরি</T>
          </View>
          <Stepper label={food.bn} value={u} step={food.step}
            onChange={(v) => setUnits((x) => ({ ...x, [food.id]: v }))} />
          <Pressable accessibilityRole="button" accessibilityLabel={`${food.bn} বাদ দিন`}
            onPress={() => setCooked(cooked.filter((id) => id !== food.id))}
            style={{ width: 32, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <HugeiconsIcon icon={Delete02Icon} color={c.muted} size={20} />
          </Pressable>
        </Card>
      ))}

      <View style={{ flexDirection: 'row' }}>
        <Button kind="secondary" small label="আরও খাবার যোগ করুন" icon={Add01Icon} onPress={() => router.back()} />
      </View>

      <Summary total={total} budget={rec.budget} dayLeft={Math.round(remaining - total)} snack={slot === 'snack'} />
      <T size="sm" muted style={{ textAlign: 'center' }}>
        আমিষ {bn(Math.round(m.protein))} গ্রাম · শর্করা {bn(Math.round(m.carbs))} গ্রাম · চর্বি {bn(Math.round(m.fat))} গ্রাম
      </T>

      {saved && (
        <View style={{ flexDirection: 'row' }}>
          <Button kind="danger" small label="এই বেলার হিসাব মুছুন" icon={Delete02Icon} onPress={remove} />
        </View>
      )}
    </Screen>
  );
}

const look = {
  near: { color: c.accent, soft: c.accentSoft },
  over: { color: c.warm, soft: c.warmSoft },
  under: { color: c.blue, soft: c.blueSoft },
};

// Suggested vs picked, the difference in words, and what it leaves for the rest of the day.
function Summary({ total, budget, dayLeft, snack }: { total: number; budget: number; dayLeft: number; snack: boolean }) {
  const { diff, state } = compareToBudget(total, budget);
  const { color, soft } = look[state];
  const fill = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(100, (total / Math.max(budget, total, 1)) * 100)}%`, { duration: 300 }),
    backgroundColor: withTiming(color, { duration: 300 }),
  }));
  const label = state === 'near' ? 'পরামর্শের কাছাকাছি ✓'
    : state === 'over' ? `পরামর্শের চেয়ে ${bn(diff)} ক্যালরি বেশি` : `পরামর্শের চেয়ে ${bn(-diff)} ক্যালরি কম`;
  const tip = state === 'over' ? 'চাইলে কোনো খাবারের পরিমাণ একটু কমিয়ে দেখুন।'
    : state === 'under' && !snack ? 'ক্ষুধা থাকলে ডাল বা সবজি একটু বাড়াতে পারেন।' : null;

  return (
    <Card style={{ gap: space.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <T bold>এই বেলায় মোট</T>
        <T size="xl" bold style={{ color }}>{bn(total)} <T muted>ক্যালরি</T></T>
      </View>

      <View style={{ height: 10, borderRadius: radius.pill, backgroundColor: soft, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', borderRadius: radius.pill }, fill]} />
      </View>

      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {[['পরামর্শ', budget], ['বেছেছেন', total], ['পার্থক্য', diff]].map(([k, v]) => (
          <View key={k} style={{ flex: 1, alignItems: 'center', backgroundColor: c.bg, borderRadius: radius.md, padding: space.sm }}>
            <T size="xs" muted>{k}</T>
            <T bold style={k === 'পার্থক্য' ? { color } : undefined}>
              {k === 'পার্থক্য' && Number(v) > 0 ? '+' : ''}{bn(Number(v))}
            </T>
          </View>
        ))}
      </View>

      <View style={{ alignSelf: 'flex-start', backgroundColor: soft, borderRadius: radius.pill,
        paddingHorizontal: space.md, paddingVertical: 4 }}>
        <T size="sm" bold style={{ color }}>{label}</T>
      </View>

      <T size="sm" muted>
        {dayLeft >= 0
          ? `এটা খেলে আজ আরও প্রায় ${bn(dayLeft)} ক্যালরি বাকি থাকবে।`
          : `এটা খেলে আজকের লক্ষ্যের চেয়ে প্রায় ${bn(-dayLeft)} ক্যালরি বেশি হবে।`}
        {tip ? ` ${tip}` : ''}
      </T>
    </Card>
  );
}
