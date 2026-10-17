import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon, BodyWeightIcon, SpoonAndForkIcon, UserIcon } from '@hugeicons/core-free-icons';
import { router, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Card, enterAt, Press, Ring, Screen, SectionTitle, T } from '@/components/ui';
import { BANDS, bmi, bmiBand } from '@/lib/bmi';
import { bn, dateLabel } from '@/lib/format';
import { dailyTarget, kcalOf } from '@/lib/nutrition';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const greeting = (h = new Date().getHours()) =>
  h < 12 ? 'শুভ সকাল' : h < 17 ? 'শুভ দুপুর' : h < 20 ? 'শুভ সন্ধ্যা' : 'শুভ রাত্রি';

// Every tool in the app. A new feature = one entry here plus its screen.
const tools: { href: Href; icon: typeof UserIcon; title: string; sub: string; tint: string; ink: string }[] = [
  { href: '/food', icon: SpoonAndForkIcon, title: 'খাবারের হিসাব', sub: 'আজ কী খাবেন, কতটুকু', tint: c.accentSoft, ink: c.accent },
  { href: '/bmi', icon: BodyWeightIcon, title: 'BMI মাপুন', sub: 'ওজন ঠিক আছে কিনা', tint: c.warmSoft, ink: c.warm },
];

export default function Hub() {
  const { profile, today } = useStore();
  if (!profile) return null;

  const target = dailyTarget(profile);
  const eaten = Math.round(today.reduce((s, m) => s + kcalOf(m.portions), 0));
  const b = bmi(profile.weightKg, profile.heightCm);
  const band = BANDS.find((x) => x.id === bmiBand(b))!;

  return (
    <Screen top tabs>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Pressable accessibilityLabel="প্রোফাইল" onPress={() => router.push('/profile')}
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.accentSoft,
            alignItems: 'center', justifyContent: 'center' }}>
          <HugeiconsIcon icon={UserIcon} color={c.accent} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <T bold>{greeting()} 👋</T>
          <T size="sm" muted>{dateLabel(new Date())}</T>
        </View>
      </View>

      <Animated.View entering={enterAt(0)}>
        <T size="xl" bold>প্রতিদিন <T size="xl" bold style={{ color: c.accent }}>ভালো থাকুন।</T></T>
      </Animated.View>

      <SectionTitle title="আজকের সারাংশ" />
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Card enter={1} onPress={() => router.push('/food')} style={{ flex: 1, alignItems: 'center' }}>
          <Ring value={eaten / target} size={84} stroke={9}>
            <T bold size="sm">{bn(Math.round(Math.min(1, eaten / target) * 100))}%</T>
          </Ring>
          <T bold>{bn(Math.max(0, target - eaten))}</T>
          <T size="xs" muted>ক্যালরি বাকি</T>
        </Card>
        <Card enter={2} onPress={() => router.push('/bmi')} style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: c.warmSoft,
            alignItems: 'center', justifyContent: 'center' }}>
            <T size="lg" bold style={{ color: c.warm }}>{bn(Math.round(b * 10) / 10)}</T>
          </View>
          <T bold>{band.bn}</T>
          <T size="xs" muted>BMI</T>
        </Card>
      </View>

      <SectionTitle title="সেবাসমূহ" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {tools.map((t, i) => (
          <Animated.View key={t.title} entering={enterAt(i + 3)} style={{ width: '48%', flexGrow: 1 }}>
            <Press accessibilityRole="button" accessibilityLabel={t.title} onPress={() => router.push(t.href)}
              style={{ backgroundColor: t.tint, borderRadius: radius.lg, padding: space.md, gap: space.md, minHeight: 150 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.surface,
                  alignItems: 'center', justifyContent: 'center' }}>
                  <HugeiconsIcon icon={t.icon} color={t.ink} size={24} />
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} color={t.ink} size={20} />
              </View>
              <View>
                <T bold size="lg">{t.title}</T>
                <T size="sm" muted>{t.sub}</T>
              </View>
            </Press>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}
