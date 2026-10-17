import { HugeiconsIcon } from '@hugeicons/react-native';
import { Home01Icon, SpoonAndForkIcon, UserIcon } from '@hugeicons/core-free-icons';
import { Redirect, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/components/ui';
import { useStore } from '@/lib/store';
import { c, radius, shadow, space } from '@/lib/theme';

const icons = { index: Home01Icon, food: SpoonAndForkIcon, profile: UserIcon };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
type BarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export default function TabLayout() {
  const { profile } = useStore();
  if (!profile) return <Redirect href="/welcome" />;
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <PillBar {...p} />}>
      <Tabs.Screen name="index" options={{ title: 'হোম' }} />
      <Tabs.Screen name="food" options={{ title: 'খাবার' }} />
      <Tabs.Screen name="profile" options={{ title: 'প্রোফাইল' }} />
    </Tabs>
  );
}

function PillBar({ state, descriptors, navigateToTab }: BarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', left: space.md, right: space.md, bottom: insets.bottom + space.sm,
      flexDirection: 'row', backgroundColor: c.surface, borderRadius: radius.pill, padding: 6, ...shadow }}>
      {state.routes.map((route, i) => {
        const on = state.index === i;
        const title = descriptors[route.key].options.title ?? route.name;
        return (
          <AnimatedPressable key={route.key} layout={LinearTransition.springify().damping(18)} accessibilityRole="tab" accessibilityState={{ selected: on }}
            accessibilityLabel={title} onPress={() => !on && navigateToTab(route.key)}
            style={{ flex: on ? 1.4 : 1, minHeight: 52, borderRadius: radius.pill, alignItems: 'center',
              justifyContent: 'center', flexDirection: on ? 'row' : 'column', gap: on ? 6 : 2,
              backgroundColor: on ? c.accent : 'transparent' }}>
            <HugeiconsIcon icon={icons[route.name as keyof typeof icons]} size={22}
              color={on ? c.onAccent : c.muted} />
            <T size="xs" bold={on} style={{ color: on ? c.onAccent : c.muted }}>{title}</T>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}
