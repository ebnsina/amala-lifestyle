import { HugeiconsIcon } from '@hugeicons/react-native';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, Card, Chip, Note, Plate, Screen, Stepper, T } from '@/components/ui';
import { foodById } from '@/data/foods';
import { bn, qty } from '@/lib/format';
import { compareToBudget, dailyTarget, kcalOf, macrosOf, recommend } from '@/lib/nutrition';
import { nextSlot, slots, useStore, type Slot } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function Plan() {
  const [slot, setSlot] = useState<Slot>(nextSlot());
  return <PlanFor key={slot} slot={slot} setSlot={setSlot} />;
}

function PlanFor({ slot, setSlot }: { slot: Slot; setSlot: (s: Slot) => void }) {
  const { profile, today, cooked, setCooked, saveMeal } = useStore();
  const others = today.filter((m) => m.slot !== slot);
  const target = profile ? dailyTarget(profile) : 0;
  const remaining = target - others.reduce((s, m) => s + kcalOf(m.portions), 0);
  const mealsLeft = (profile?.mealsPerDay ?? 3) - others.filter((m) => m.slot !== 'snack').length;
  const rec = recommend(cooked.map((id) => foodById[id]), remaining, mealsLeft, slot === 'snack');

  const [units, setUnits] = useState(() => Object.fromEntries(rec.portions.map((p) => [p.food.id, p.units])));
  const portions = rec.portions.map((p) => ({ food: p.food, units: units[p.food.id] ?? 0 }))
    .filter((p) => cooked.includes(p.food.id));
  const total = Math.round(kcalOf(portions));
  const m = macrosOf(portions);

  if (!profile) return null;
  if (!portions.length) {
    return (
      <Screen>
        <T muted style={{ textAlign: 'center', padding: space.lg }}>কোনো খাবার বাছাই করা নেই।</T>
        <Button label="খাবার বেছে নিন" kind="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const save = () => {
    saveMeal({ slot, portions: portions.filter((p) => p.units > 0) });
    setCooked([]);
    router.dismissTo('/food');
  };

  return (
    <Screen footer={<Button label="খেয়েছি, লিখে রাখুন" onPress={save} disabled={total === 0} />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.md }}
        contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.md }}>
        {slots.map((s) => <Chip key={s.id} label={s.bn} on={s.id === slot} onPress={() => setSlot(s.id)} />)}
      </ScrollView>

      {rec.lowBudget ? (
        <Note tone="warn">আজকের হিসাব প্রায় শেষ। তবু না খেয়ে থাকবেন না — নিচে হালকা কিন্তু পুষ্টিকর পরিমাণ দেওয়া হলো।</Note>
      ) : (
        <T muted>এই বেলায় প্রায় <T bold>{bn(rec.budget)} ক্যালরি</T> খেলে দিনের হিসাব ঠিক থাকবে।</T>
      )}

      {portions.map(({ food, units: u }) => (
        <Card key={food.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <Plate emoji={food.emoji} size={48} />
          <View style={{ flex: 1 }}>
            <T bold>{food.bn}</T>
            <T muted>{qty(u, food.unit)} · {bn(Math.round(food.kcal * u))} ক্যালরি</T>
          </View>
          <Stepper label={food.bn} value={u} step={food.step}
            onChange={(v) => setUnits((x) => ({ ...x, [food.id]: v }))} />
          <Pressable accessibilityRole="button" accessibilityLabel={`${food.bn} বাদ দিন`}
            onPress={() => setCooked(cooked.filter((id) => id !== food.id))}
            style={{ width: 32, height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <HugeiconsIcon icon={Delete02Icon} color={c.muted} size={22} />
          </Pressable>
        </Card>
      ))}

      <Summary total={total} budget={rec.budget} dayLeft={Math.round(remaining - total)} snack={slot === 'snack'} />
      <T size="sm" muted style={{ textAlign: 'center' }}>
        আমিষ {bn(Math.round(m.protein))} গ্রাম · শর্করা {bn(Math.round(m.carbs))} গ্রাম · চর্বি {bn(Math.round(m.fat))} গ্রাম
      </T>

      <Note>এটা আনুমানিক হিসাব। তেল-মসলা ও রান্নার ধরনে কমবেশি হয়। ক্ষুধা থাকলে সবজি বা ডাল একটু বেশি নিন।</Note>
    </Screen>
  );
}

const look = {
  near: { color: c.accent, soft: c.accentSoft },
  over: { color: c.warm, soft: c.warmSoft },
  under: { color: '#3D7CB8', soft: '#E6EFF8' },
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
