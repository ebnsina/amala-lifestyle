import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowRight01Icon, Database01Icon, FavouriteIcon, InformationCircleIcon, PencilEdit02Icon, UserIcon,
} from '@hugeicons/core-free-icons';
import { router, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button, Card, Note, Screen, T } from '@/components/ui';
import { bn } from '@/lib/format';
import { activityOptions, goalOptions } from '@/lib/labels';
import { dailyTarget } from '@/lib/nutrition';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const menu: { href: Href; icon: typeof UserIcon; title: string; sub: string }[] = [
  { href: '/favourites', icon: FavouriteIcon, title: 'প্রিয় খাবার', sub: 'যেগুলোতে ♡ দিয়েছেন' },
  { href: '/data', icon: Database01Icon, title: 'ব্যাকআপ ও ফিরিয়ে আনা', sub: 'ফোনে ফাইল হিসেবে সেভ করুন' },
  { href: '/about', icon: InformationCircleIcon, title: 'অ্যাপ সম্পর্কে', sub: 'গোপনীয়তা ও নির্মাতা' },
];

export default function Profile() {
  const { profile } = useStore();
  if (!profile) return null;
  const ft = Math.floor(profile.heightCm / 30.48);
  const inch = Math.round((profile.heightCm / 2.54) % 12);
  const goal = goalOptions.find((g) => g.id === profile.goal)!;
  const activity = activityOptions.find((a) => a.id === profile.activity)!;
  const stats: [string, string][] = [
    ['বয়স', `${bn(profile.age)} বছর`],
    ['উচ্চতা', `${bn(ft)}' ${bn(inch)}"`],
    ['ওজন', `${bn(profile.weightKg)} কেজি`],
  ];
  return (
    <Screen top tabs>
      <View style={{ alignItems: 'center', gap: space.sm, paddingTop: space.md }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.accentSoft,
          alignItems: 'center', justifyContent: 'center' }}>
          <HugeiconsIcon icon={UserIcon} color={c.accent} size={32} />
        </View>
        <T size="lg" bold>{goal.emoji} {goal.bn}</T>
      </View>

      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {stats.map(([k, v]) => (
          <Card key={k} style={{ flex: 1, alignItems: 'center', gap: 0 }}>
            <T bold>{v}</T>
            <T size="sm" muted>{k}</T>
          </Card>
        ))}
      </View>

      <View style={{ backgroundColor: c.accent, borderRadius: radius.lg, padding: space.lg, alignItems: 'center' }}>
        <T size="sm" style={{ color: c.onAccent }}>আপনার দিনের আনুমানিক লক্ষ্য</T>
        <T size="xxl" bold style={{ color: c.onAccent }}>{bn(dailyTarget(profile))} <T style={{ color: c.onAccent }}>ক্যালরি</T></T>
      </View>

      <Card style={{ gap: 0, paddingVertical: space.xs }}>
        {[
          ['কাজকর্ম', `${activity.emoji} ${activity.bn}`],
          ['দিনে খান', `${bn(profile.mealsPerDay)} বার`],
        ].map(([k, v], i) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.md,
            borderTopWidth: i ? 1 : 0, borderColor: c.border, gap: space.md }}>
            <T muted>{k}</T>
            <T bold style={{ flexShrink: 1, textAlign: 'right' }}>{v}</T>
          </View>
        ))}
      </Card>

      <View style={{ flexDirection: 'row' }}>
        <Button label="তথ্য বদলান" kind="secondary" icon={PencilEdit02Icon} onPress={() => router.push('/onboarding')} />
      </View>
      <Card style={{ gap: 0, paddingVertical: space.xs }}>
        {menu.map((m, i) => (
          <Pressable key={m.title} accessibilityRole="button" onPress={() => router.push(m.href)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 64,
              borderTopWidth: i ? 1 : 0, borderColor: c.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.accentSoft,
              alignItems: 'center', justifyContent: 'center' }}>
              <HugeiconsIcon icon={m.icon} color={c.accent} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <T bold>{m.title}</T>
              <T size="sm" muted>{m.sub}</T>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} color={c.muted} size={20} />
          </Pressable>
        ))}
      </Card>

      <Note>
        এই হিসাব একটি প্রচলিত সূত্র থেকে আন্দাজ করা। গর্ভাবস্থা, ডায়াবেটিস, কিডনি বা অন্য কোনো অসুখ থাকলে ডাক্তার বা পুষ্টিবিদের পরামর্শ নিন।
      </Note>
    </Screen>
  );
}
