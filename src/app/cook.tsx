import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, Chip, Empty, Input, Plate, Screen, SectionTitle, T } from '@/components/ui';
import { categories, foodById, foods, type Category, type Food } from '@/data/foods';
import { bn, qty } from '@/lib/format';
import { matchScore } from '@/lib/search';
import { useStore } from '@/lib/store';
import { c, radius, shadow, space } from '@/lib/theme';

export default function Cook() {
  const params = useLocalSearchParams<{ cat?: Category }>();
  const { cooked, setCooked, favourites, toggleFavourite, recent } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>(params.cat ?? 'all');

  const query = q.trim();
  const list = foods
    .filter((f) => cat === 'all' || f.category === cat)
    .map((f) => ({ f, score: matchScore(query, [f.bn, f.en, ...f.aliases]) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.f);
  const quick = [...new Set([...favourites, ...recent])].map((id) => foodById[id]).filter(Boolean);
  const toggle = (id: string) => setCooked(cooked.includes(id) ? cooked.filter((x) => x !== id) : [...cooked, id]);

  const row = (f: Food) => (
    <FoodRow key={f.id} food={f} on={cooked.includes(f.id)} fav={favourites.includes(f.id)}
      onPress={() => toggle(f.id)} onFav={() => toggleFavourite(f.id)} />
  );

  return (
    <Screen
      footer={
        <Button label={cooked.length ? `কতটুকু খাবেন দেখুন (${bn(cooked.length)}টি)` : 'যা রান্না হয়েছে বেছে নিন'}
          disabled={!cooked.length} onPress={() => router.push('/plan')} />
      }>
      <Input pill icon={Search01Icon} value={q} onChangeText={setQ} placeholder="খাবার খুঁজুন (যেমন: ডাল, misti kumra)" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.md }}
        contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.md }}>
        {categories.map((k) => (
          <Chip key={k.id} label={`${k.emoji} ${k.bn}`} on={cat === k.id} onPress={() => setCat(k.id)} />
        ))}
      </ScrollView>

      {!query && cat === 'all' && (
        <>
          <SectionTitle title="প্রিয় ও সম্প্রতি খাওয়া" />
          {quick.map(row)}
          <SectionTitle title="সব খাবার" />
        </>
      )}
      {list.length ? list.map(row) : <Empty emoji="🔍" text={`“${q}” নামে কিছু পাওয়া যায়নি। অন্য নামে খুঁজে দেখুন।`} />}
    </Screen>
  );
}

function FoodRow({ food, on, fav, onPress, onFav }: {
  food: Food; on: boolean; fav: boolean; onPress: () => void; onFav: () => void;
}) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={food.bn}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingRight: space.md,
        backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: 2, borderColor: on ? c.accent : 'transparent',
        ...shadow }}>
      <Plate emoji={food.emoji} size={56} />
      <View style={{ flex: 1 }}>
        <T bold>{food.bn}</T>
        <T size="sm" muted>{qty(1, food.unit)} · {bn(food.kcal)} ক্যালরি</T>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={fav ? 'প্রিয় থেকে সরান' : 'প্রিয়তে রাখুন'}
        onPress={onFav} hitSlop={8} style={{ padding: space.xs }}>
        <HugeiconsIcon icon={FavouriteIcon} size={22} color={fav ? c.warm : c.border} fill={fav ? c.warm : 'none'} />
      </Pressable>
      <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: on ? c.accent : c.border,
        backgroundColor: on ? c.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {on && <HugeiconsIcon icon={Tick02Icon} color={c.onAccent} size={18} strokeWidth={2.5} />}
      </View>
    </Pressable>
  );
}
