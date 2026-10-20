import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  BodyWeightIcon, Book02Icon, CheckListIcon, Dumbbell01Icon, Mosque01Icon, SpoonAndForkIcon,
} from '@hugeicons/core-free-icons';
import { router, type Href } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Card, enterAt, Press, Screen, SectionTitle, T } from '@/components/ui';
import { bn, dateLabel, dayKey } from '@/lib/format';
import { dailyTarget, kcalOf } from '@/lib/nutrition';
import { fard } from '@/lib/prayer';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const greeting = (h = new Date().getHours()) =>
  h < 12 ? 'শুভ সকাল' : h < 17 ? 'শুভ দুপুর' : h < 20 ? 'শুভ সন্ধ্যা' : 'শুভ রাত্রি';

// Every tool in the app. A new feature = one entry here plus its screen.
const tools: { href: Href; icon: typeof Book02Icon; title: string; sub: string; tint: string; ink: string }[] = [
  { href: '/food', icon: SpoonAndForkIcon, title: 'খাবারের হিসাব', sub: 'কী আর কতটুকু খাবেন', tint: c.accentSoft, ink: c.accent },
  { href: '/prayer', icon: Mosque01Icon, title: 'নামাজ', sub: 'পাঁচ ওয়াক্তের হিসাব', tint: c.blueSoft, ink: c.blue },
  { href: '/fitness', icon: Dumbbell01Icon, title: 'ফিটনেস', sub: 'ঘরে ও জিমে ব্যায়াম', tint: c.warmSoft, ink: c.warm },
  { href: '/books', icon: Book02Icon, title: 'বই পড়া', sub: 'কত পৃষ্ঠা পড়লেন', tint: c.plumSoft, ink: c.plum },
  { href: '/tasks', icon: CheckListIcon, title: 'আজকের কাজ', sub: 'ছোট্ট কাজের তালিকা', tint: c.plumSoft, ink: c.plum },
  { href: '/bmi', icon: BodyWeightIcon, title: 'BMI', sub: 'ওজন ঠিক আছে কিনা', tint: c.warmSoft, ink: c.warm },
];

export default function Hub() {
  const { profile, today, prayers, tasks } = useStore();
  if (!profile) return null;

  const left = dailyTarget(profile) - Math.round(today.reduce((s, m) => s + kcalOf(m.portions), 0));
  const stats: [string, string, Href][] = [
    [bn(Math.max(0, left)), 'ক্যালরি বাকি', '/food'],
    [`${bn(fard.filter((p) => prayers[dayKey()]?.includes(p.id)).length)}/৫`, 'নামাজ', '/prayer'],
    [`${bn(tasks.filter((t) => t.done).length)}/${bn(tasks.length)}`, 'কাজ শেষ', '/tasks'],
  ];

  return (
    <Screen top tabs>
      <View style={{ paddingTop: space.sm }}>
        <T size="sm" muted>{dateLabel(new Date())}</T>
        <T size="xl" bold>{greeting()}</T>
      </View>

      <Card enter={0} style={{ flexDirection: 'row', paddingVertical: space.md }}>
        {stats.map(([value, label, href], i) => (
          <Press key={label} accessibilityRole="button" accessibilityLabel={label} onPress={() => router.push(href)}
            style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderColor: c.border }}>
            <T size="lg" bold style={{ color: c.accent }}>{value}</T>
            <T size="xs" muted>{label}</T>
          </Press>
        ))}
      </Card>

      <SectionTitle title="সেবাসমূহ" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {tools.map((t, i) => (
          <Animated.View key={t.title} entering={enterAt(i + 1)} style={{ width: '48%', flexGrow: 1 }}>
            <Press accessibilityRole="button" accessibilityLabel={t.title} onPress={() => router.push(t.href)}
              style={{ backgroundColor: c.surface, borderRadius: radius.lg, padding: space.md, gap: space.sm,
                borderWidth: 1, borderColor: c.border }}>
              <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: t.tint,
                alignItems: 'center', justifyContent: 'center' }}>
                <HugeiconsIcon icon={t.icon} color={t.ink} size={22} />
              </View>
              <View>
                <T bold>{t.title}</T>
                <T size="xs" muted>{t.sub}</T>
              </View>
            </Press>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}
