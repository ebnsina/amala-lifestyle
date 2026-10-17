import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Plate, T } from '@/components/ui';
import { c, radius, shadow, space } from '@/lib/theme';

export default function Welcome() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View entering={ZoomIn.springify().damping(12)}
          style={{ width: 260, height: 260, borderRadius: 130, backgroundColor: c.accentSoft,
            alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 130 }}>🍛</Text>
        </Animated.View>
        <Floating delay={300} style={{ top: '18%', right: '10%' }}><Plate emoji="🐟" size={64} /></Floating>
        <Floating delay={450} style={{ bottom: '18%', left: '10%' }}><Plate emoji="🥬" size={56} /></Floating>
        <Floating delay={600} style={{ top: '22%', left: '8%' }}><Tag text="ভাত-মাছ" /></Floating>
        <Floating delay={750} style={{ bottom: '14%', right: '8%' }}><Tag text="মসুর ডাল" /></Floating>
      </View>

      <View style={{ padding: space.lg, gap: space.md }}>
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <T size="xl" bold style={{ fontSize: 34, lineHeight: 46 }}>ঘরের খাবারেই</T>
          <T size="xl" bold style={{ fontSize: 34, lineHeight: 46, color: c.accent }}>সুস্থ থাকুন।</T>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(350).duration(450)}>
          <T muted size="lg">বাসায় যা রান্না হয়েছে, তা থেকেই জেনে নিন কতটুকু খাবেন।</T>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(500).duration(450)} style={{ flexDirection: 'row', marginTop: space.sm }}>
          <Button label="শুরু করি" onPress={() => router.push('/onboarding')} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Fades in, then bobs gently forever; each item gets its own rhythm from its delay.
function Floating({ style, delay, children }: { style: ViewStyle; delay: number; children: ReactNode }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.set(withRepeat(withTiming(-8, { duration: 1600 + delay, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [y, delay]);
  const bob = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return (
    <Animated.View entering={FadeIn.delay(delay).duration(500)} style={[{ position: 'absolute' }, style]}>
      <Animated.View style={bob}>{children}</Animated.View>
    </Animated.View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={{ backgroundColor: c.surface, paddingHorizontal: space.md, paddingVertical: space.sm,
      borderRadius: radius.pill, ...shadow }}>
      <T size="sm" bold>{text}</T>
    </View>
  );
}
