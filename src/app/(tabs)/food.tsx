import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon, ChefHatIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { Badge, Button, Card, Note, Plate, Ring, Screen, SectionTitle, T } from '@/components/ui';
import { categories, foodById } from '@/data/foods';
import { bn, dateLabel, qty } from '@/lib/format';
import { dailyTarget, kcalOf } from '@/lib/nutrition';
import { nextSlot, slots, useStore } from '@/lib/store';
import { c, radius, shadow, space } from '@/lib/theme';

export default function FoodHome() {
  const { profile, today, favourites } = useStore();
  if (!profile) return null;

  const target = dailyTarget(profile);
  const eaten = Math.round(today.reduce((s, m) => s + kcalOf(m.portions), 0));
  const left = target - eaten;
  const favs = favourites.map((id) => foodById[id]).filter(Boolean);

  return (
    <Screen top tabs>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.sm }}>
        <View style={{ flex: 1 }}>
          <T size="sm" muted>{dateLabel(new Date())}</T>
          <T size="xl" bold>আজ কী <T size="xl" bold style={{ color: c.accent }}>খাবেন?</T></T>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="আগের দিনগুলো" onPress={() => router.push('/history')}
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.surface,
            alignItems: 'center', justifyContent: 'center', ...shadow }}>
          <HugeiconsIcon icon={Calendar03Icon} color={c.text} size={22} />
        </Pressable>
      </View>

      <Pressable accessibilityRole="search" onPress={() => router.push('/cook')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: c.surface,
          borderRadius: radius.pill, paddingHorizontal: space.md, minHeight: 56, ...shadow }}>
        <HugeiconsIcon icon={Search01Icon} color={c.muted} size={22} />
        <T muted>খাবার খুঁজুন... (যেমন: ডাল)</T>
      </Pressable>

      <Card enter={0} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Ring value={eaten / target} size={104} color={left < 0 ? c.warm : c.accent}>
          <T bold size="lg">{bn(Math.round(Math.min(1, eaten / target) * 100))}%</T>
        </Ring>
        <View style={{ flex: 1, gap: 2 }}>
          <T size="sm" muted>আজ আরও খেতে পারবেন প্রায়</T>
          <T size="xl" bold style={{ color: left < 0 ? c.warm : c.accent }}>
            {bn(Math.max(0, left))} <T muted size="sm">ক্যালরি</T>
          </T>
          <T size="sm" muted>খেয়েছেন {bn(eaten)} · লক্ষ্য {bn(target)}</T>
        </View>
      </Card>

      <Button label="আজ বাসায় কী রান্না হয়েছে?" onPress={() => router.push('/cook')}
        icon={<HugeiconsIcon icon={ChefHatIcon} color={c.onAccent} size={22} />} />

      <SectionTitle title="ধরন অনুযায়ী" action="সব দেখুন" onAction={() => router.push('/cook')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.md }}
        contentContainerStyle={{ gap: space.md, paddingHorizontal: space.md, paddingVertical: space.xs }}>
        {categories.filter((k) => k.id !== 'all').map((k) => (
          <Pressable key={k.id} accessibilityRole="button" accessibilityLabel={k.bn}
            onPress={() => router.push({ pathname: '/cook', params: { cat: k.id } })}
            style={{ alignItems: 'center', gap: 6, width: 72 }}>
            <View style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: c.surface,
              alignItems: 'center', justifyContent: 'center', ...shadow }}>
              <T size="xl">{k.emoji}</T>
            </View>
            <T size="xs" style={{ textAlign: 'center' }}>{k.bn}</T>
          </Pressable>
        ))}
      </ScrollView>

      {favs.length > 0 && <SectionTitle title="আপনার প্রিয় খাবার" action="সব দেখুন" onAction={() => router.push('/favourites')} />}
      {favs.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.md }}
        contentContainerStyle={{ gap: space.md, paddingHorizontal: space.md, paddingVertical: space.sm }}>
        {favs.map((f, i) => (
          <Card key={f.id} enter={i} onPress={() => router.push({ pathname: '/food/[id]', params: { id: f.id } })}
            style={{ width: 160, alignItems: 'flex-start' }}>
            <View style={{ alignSelf: 'center' }}><Plate emoji={f.emoji} size={88} /></View>
            <Badge label={f.protein >= 10 ? 'আমিষ বেশি' : 'হালকা খাবার'} tone={f.protein >= 10 ? 'green' : 'warm'} />
            <T bold numberOfLines={1}>{f.bn}</T>
            <T size="sm" muted>{qty(1, f.unit)} · {bn(f.kcal)} ক্যালরি</T>
          </Card>
        ))}
      </ScrollView>}

      <SectionTitle title="আজ যা খেয়েছেন" />
      {slots.map(({ id, bn: name }, i) => {
        const meal = today.find((m) => m.slot === id);
        const isNext = !meal && id === nextSlot();
        return (
          <Card key={id} enter={i + 1} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}
            onPress={meal ? undefined : () => router.push('/cook')}>
            <Plate emoji={meal ? meal.portions[0].food.emoji : '🍽️'} size={52} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <T bold>{name}</T>
                {meal ? <T size="sm" bold style={{ color: c.accent }}>{bn(Math.round(kcalOf(meal.portions)))} ক্যালরি</T>
                  : isNext && <Badge label="এখন" tone="warm" />}
              </View>
              <T size="sm" muted numberOfLines={2}>
                {meal ? meal.portions.map((p) => `${p.food.bn} ${qty(p.units, p.food.unit)}`).join(' · ')
                  : 'এখনো লেখা হয়নি'}
              </T>
            </View>
          </Card>
        );
      })}

      <Note>সব হিসাব আনুমানিক। রান্নার তেল আর রেসিপিভেদে কমবেশি হতে পারে।</Note>
    </Screen>
  );
}

