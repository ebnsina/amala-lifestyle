import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, ArrowLeft01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Empty, Note, Ring, T } from '@/components/ui';
import { categories, foodById } from '@/data/foods';
import { bn, qty } from '@/lib/format';
import { dailyTarget } from '@/lib/nutrition';
import { useStore } from '@/lib/store';
import { c, radius, shadow, space } from '@/lib/theme';

export default function FoodDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, favourites, toggleFavourite, cooked, setCooked } = useStore();
  const f = foodById[id];
  if (!f) return <SafeAreaView style={{ flex: 1 }}><Empty emoji="🤔" text="এই খাবারটি খুঁজে পাওয়া যায়নি।" /></SafeAreaView>;

  const fav = favourites.includes(f.id);
  const energy = f.protein * 4 + f.carbs * 4 + f.fat * 9 || 1;
  const macros = [
    { bn: 'আমিষ', g: f.protein, share: (f.protein * 4) / energy, color: c.protein },
    { bn: 'চর্বি', g: f.fat, share: (f.fat * 9) / energy, color: c.fat },
    { bn: 'শর্করা', g: f.carbs, share: (f.carbs * 4) / energy, color: c.carbs },
  ];
  const target = profile ? dailyTarget(profile) : 2000;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ height: 240, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 110 }}>{f.emoji}</Text>
          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0,
            flexDirection: 'row', justifyContent: 'space-between', padding: space.md }}>
            <RoundBtn label="ফিরে যান" onPress={() => router.back()}>
              <HugeiconsIcon icon={ArrowLeft01Icon} color={c.text} size={22} />
            </RoundBtn>
            <RoundBtn label={fav ? 'প্রিয় থেকে সরান' : 'প্রিয়তে রাখুন'} onPress={() => toggleFavourite(f.id)}>
              <HugeiconsIcon icon={FavouriteIcon} color={fav ? c.warm : c.text} fill={fav ? c.warm : 'none'} size={22} />
            </RoundBtn>
          </SafeAreaView>
        </View>

        <View style={{ marginTop: -radius.lg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
          backgroundColor: c.bg, padding: space.md, gap: space.md }}>
          <View style={{ gap: space.xs }}>
            <Badge label={categories.find((k) => k.id === f.category)!.bn} />
            <T size="xl" bold>{f.bn}</T>
            <T muted>{qty(1, f.unit)} (প্রায় {bn(f.grams)} গ্রাম)</T>
          </View>

          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <T muted>প্রতি {qty(1, f.unit)}</T>
              <T size="xl" bold>{bn(f.kcal)} <T muted>ক্যালরি</T></T>
              <T size="sm" muted>দিনের লক্ষ্যের {bn(Math.round((f.kcal / target) * 100))}%</T>
            </View>
            <Ring value={f.kcal / target} size={80} stroke={8} color={c.warm}><Text style={{ fontSize: 24 }}>🔥</Text></Ring>
          </Card>

          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {macros.map((m) => (
              <Card key={m.bn} style={{ flex: 1, alignItems: 'center', gap: space.xs }}>
                <Ring value={m.share} size={60} stroke={6} color={m.color}>
                  <T bold size="sm">{bn(Math.round(m.share * 100))}%</T>
                </Ring>
                <T bold size="sm">{m.bn}</T>
                <T size="xs" muted>{bn(Math.round(m.g))} গ্রাম</T>
              </Card>
            ))}
          </View>

          <Note>নমুনা তথ্য। রান্নার তেল ও রেসিপিভেদে আসল মান কমবেশি হবে।</Note>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
        flexDirection: 'row', gap: space.sm, padding: space.md, backgroundColor: c.bg }}>
        <Button label="খাবারে যোগ করুন" icon={Add01Icon}
          onPress={() => {
            if (!cooked.includes(f.id)) setCooked([...cooked, f.id]);
            router.push('/cook');
          }} />
      </SafeAreaView>
    </View>
  );
}

function RoundBtn({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.surface,
        alignItems: 'center', justifyContent: 'center', ...shadow }}>
      {children}
    </Pressable>
  );
}
