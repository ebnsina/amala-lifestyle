import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, ArrowRight01Icon, Calendar03Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Badge, Button, Card, Note, Plate, Ring, Screen, SectionTitle, T } from '@/components/ui';
import { bn, dateLabel, qty } from '@/lib/format';
import { dailyTarget, kcalOf } from '@/lib/nutrition';
import { nextSlot, slotName, slots, useStore, type Slot } from '@/lib/store';
import { c, shadow, space } from '@/lib/theme';

export default function FoodHome() {
  const { profile, today, setCooked, setSlot } = useStore();
  if (!profile) return null;

  const target = dailyTarget(profile);
  const eaten = Math.round(today.reduce((s, m) => s + kcalOf(m.portions), 0));
  const left = target - eaten;
  // The meal that fits the time of day, or the first one still empty.
  const open = slots.map((s) => s.id).filter((id) => !today.some((m) => m.slot === id));
  const suggested = open.includes(nextSlot()) ? nextSlot() : open[0];

  // Editing a logged meal starts from what was saved; a new one starts empty.
  const openSlot = (slot: Slot) => {
    setSlot(slot);
    setCooked(today.find((m) => m.slot === slot)?.portions.map((p) => p.food.id) ?? []);
    router.push('/cook');
  };

  return (
    <Screen top tabs>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <View style={{ flex: 1 }}>
          <T size="sm" muted>{dateLabel(new Date())}</T>
          <T size="xl" bold>আজকের খাবার</T>
        </View>
        <IconBtn label="প্রিয় খাবার" icon={FavouriteIcon} onPress={() => router.push('/favourites')} />
        <IconBtn label="আগের দিনগুলো" icon={Calendar03Icon} onPress={() => router.push('/history')} />
      </View>

      <Card enter={0} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Ring value={eaten / target} size={88} stroke={9} color={left < 0 ? c.warm : c.accent}>
          <T bold>{bn(Math.round(Math.min(1, eaten / target) * 100))}%</T>
        </Ring>
        <View style={{ flex: 1 }}>
          <T size="sm" muted>{left < 0 ? 'আজকের লক্ষ্যের চেয়ে বেশি' : 'আজ আরও খেতে পারবেন প্রায়'}</T>
          <T size="xl" bold style={{ color: left < 0 ? c.warm : c.accent }}>
            {bn(Math.abs(left))} <T muted size="sm">ক্যালরি</T>
          </T>
          <T size="xs" muted>খেয়েছেন {bn(eaten)} · লক্ষ্য {bn(target)}</T>
        </View>
      </Card>

      {suggested
        ? <Button label={`${slotName(suggested)} লিখুন`} icon={Add01Icon} onPress={() => openSlot(suggested)} />
        : <Note>আজকের সব বেলা লেখা হয়ে গেছে। কোনো বেলা বদলাতে নিচে চাপুন।</Note>}

      <SectionTitle title="চার বেলা" />
      {slots.map(({ id, bn: name }, i) => {
        const meal = today.find((m) => m.slot === id);
        return (
          <Card key={id} enter={i + 1} onPress={() => openSlot(id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm + 4 }}>
            <Plate emoji={meal ? meal.portions[0].food.emoji : '🍽️'} size={44} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <T bold>{name}</T>
                {!meal && id === suggested && <Badge label="এখন" tone="warm" />}
              </View>
              <T size="sm" muted numberOfLines={1}>
                {meal ? meal.portions.map((p) => `${p.food.bn} ${qty(p.units, p.food.unit)}`).join(' · ') : 'চাপ দিয়ে লিখুন'}
              </T>
            </View>
            {meal
              ? <T size="sm" bold style={{ color: c.accent }}>{bn(Math.round(kcalOf(meal.portions)))}</T>
              : <HugeiconsIcon icon={ArrowRight01Icon} color={c.muted} size={18} />}
          </Card>
        );
      })}

      <T size="xs" muted style={{ textAlign: 'center' }}>সব হিসাব আনুমানিক। তেল আর রেসিপিভেদে কমবেশি হয়।</T>
    </Screen>
  );
}

function IconBtn({ label, icon, onPress }: { label: string; icon: typeof FavouriteIcon; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={4}
      style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface,
        alignItems: 'center', justifyContent: 'center', ...shadow }}>
      <HugeiconsIcon icon={icon} color={c.text} size={20} />
    </Pressable>
  );
}
