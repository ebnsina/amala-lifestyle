import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, MinusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type TextProps, type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing, FadeInDown, ZoomIn, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { bn } from '@/lib/format';
import { c, family, font, radius, shadow, space, touch } from '@/lib/theme';

export function T({ size = 'md', muted, bold, style, ...rest }: TextProps & {
  size?: keyof typeof font; muted?: boolean; bold?: boolean;
}) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: family, fontSize: font[size], lineHeight: font[size] * 1.5,
        color: muted ? c.muted : c.text, fontWeight: bold ? '700' : '400' }, style]}
    />
  );
}

export function Screen({ children, footer, top, pad = true, tabs }: {
  children: ReactNode; footer?: ReactNode; top?: boolean; pad?: boolean; tabs?: boolean;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={top ? ['top'] : []}>
      <ScrollView keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: pad ? space.md : 0, gap: space.md, paddingBottom: tabs ? 120 : space.xl }}>
        {children}
      </ScrollView>
      {footer && (
        <SafeAreaView edges={['bottom']} style={s.footer}>
          <View style={{ flexDirection: 'row', gap: space.sm }}>{footer}</View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Springs down slightly while held, so taps feel physical.
export function Press({ style, onPressIn, onPressOut, ...rest }: React.ComponentProps<typeof Pressable> & {
  style?: ViewStyle | ViewStyle[];
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable {...rest} style={[style, anim]}
      onPressIn={(e) => { scale.set(withSpring(0.97, { duration: 150 })); onPressIn?.(e); }}
      onPressOut={(e) => { scale.set(withSpring(1, { duration: 250 })); onPressOut?.(e); }} />
  );
}

// `enter` = position in a list; cards fade up one after another.
export const enterAt = (i = 0) => FadeInDown.delay(Math.min(i, 8) * 60).duration(380);

export function Card({ children, style, onPress, enter }: {
  children: ReactNode; style?: ViewStyle; onPress?: () => void; enter?: number;
}) {
  const entering = enter === undefined ? undefined : enterAt(enter);
  if (!onPress) return <Animated.View entering={entering} style={[s.card, style]}>{children}</Animated.View>;
  // Sizing goes on the animated wrapper, looks on the pressable, so grid widths still work.
  const { width, flex, flexGrow, ...look } = style ?? {};
  return (
    <Animated.View entering={entering} style={{ width, flex, flexGrow }}>
      <Press accessibilityRole="button" onPress={onPress} style={[s.card, look]}>{children}</Press>
    </Animated.View>
  );
}

// primary = the one main action; secondary = another real choice; ghost = low-key; danger = removes something.
const buttonLook = {
  primary: { bg: c.accent, ink: c.onAccent, border: c.accent },
  secondary: { bg: c.accentSoft, ink: c.accent, border: c.accentSoft },
  ghost: { bg: 'transparent', ink: c.text, border: c.border },
  danger: { bg: 'transparent', ink: c.danger, border: c.dangerSoft },
};

export function Button({ label, onPress, kind = 'primary', disabled, icon, small }: {
  label: string; onPress: () => void; kind?: keyof typeof buttonLook; disabled?: boolean;
  icon?: Parameters<typeof HugeiconsIcon>[0]['icon']; small?: boolean;
}) {
  const look = buttonLook[kind];
  return (
    <Press accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
      style={[s.button, { backgroundColor: look.bg, borderColor: look.border, opacity: disabled ? 0.45 : 1,
        ...(small ? s.buttonSmall : { flex: 1 }) }]}>
      {icon && <HugeiconsIcon icon={icon} color={look.ink} size={small ? 16 : 20} />}
      <T bold size={small ? 'sm' : 'md'} style={{ color: look.ink, textAlign: 'center' }}>{label}</T>
    </Press>
  );
}

export function Check({ on, size = 26 }: { on: boolean; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2,
      borderColor: on ? c.accent : c.border, backgroundColor: on ? c.accent : 'transparent',
      alignItems: 'center', justifyContent: 'center' }}>
      {on && <HugeiconsIcon icon={Tick02Icon} color={c.onAccent} size={size * 0.6} strokeWidth={2.5} />}
    </View>
  );
}

export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={onPress}
      style={[s.chip, on && { backgroundColor: c.accent, borderColor: c.accent }]}>
      <T size="sm" bold={on} style={{ color: on ? c.onAccent : c.text }}>{label}</T>
    </Pressable>
  );
}

export function Badge({ label, tone = 'green' }: { label: string; tone?: 'green' | 'warm' }) {
  const warm = tone === 'warm';
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill,
      backgroundColor: warm ? c.warmSoft : c.accentSoft }}>
      <T size="xs" bold style={{ color: warm ? c.warm : c.accent }}>{label}</T>
    </View>
  );
}

export function Choice<V extends string | number>({ options, value, onChange }: {
  options: { id: V; bn: string; hint?: string; emoji?: string }[]; value: V; onChange: (v: V) => void;
}) {
  return (
    <View style={{ gap: space.sm }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable key={o.id} accessibilityRole="radio" accessibilityState={{ checked: on }}
            onPress={() => onChange(o.id)}
            style={[s.choice, on && { borderColor: c.accent, backgroundColor: c.accentSoft }]}>
            {o.emoji && <T size="xl">{o.emoji}</T>}
            <View style={{ flex: 1 }}>
              <T bold={on}>{o.bn}</T>
              {o.hint && <T size="sm" muted>{o.hint}</T>}
            </View>
            <View style={[s.radio, on && { borderColor: c.accent }]}>{on && <Animated.View entering={ZoomIn.springify()} style={s.radioDot} />}</View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Stepper({ value, step, onChange, label }: {
  value: number; step: number; onChange: (v: number) => void; label: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
      <Pressable accessibilityLabel={`${label} কমান`} onPress={() => onChange(Math.max(0, value - step))}
        style={s.stepBtn} disabled={value <= 0}>
        <HugeiconsIcon icon={MinusSignIcon} color={c.accent} size={20} />
      </Pressable>
      <T bold size="lg" style={{ minWidth: 40, textAlign: 'center' }}>{bn(value)}</T>
      <Pressable accessibilityLabel={`${label} বাড়ান`} onPress={() => onChange(value + step)}
        style={[s.stepBtn, { backgroundColor: c.accent }]}>
        <HugeiconsIcon icon={Add01Icon} color={c.onAccent} size={20} />
      </Pressable>
    </View>
  );
}

export function Ring({ value, size = 120, stroke = 12, color = c.accent, children }: {
  value: number; size?: number; stroke?: number; color?: string; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const progress = useSharedValue(0);
  const target = Math.max(0, Math.min(1, value));
  useEffect(() => {
    progress.set(withTiming(target, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [progress, target]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - progress.get()) }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" />
        <AnimatedCircle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${len}`} animatedProps={animatedProps} />
      </Svg>
      {children}
    </View>
  );
}

// ponytail: emoji on a tinted plate stands in for food photography.
export function Plate({ emoji, size = 64 }: { emoji: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.accentSoft,
      alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}

// One text field for the whole app: our own focus ring instead of the browser/OS default.
export function Input({ suffix, icon, pill, style, onFocus, onBlur, ...rest }: TextInputProps & {
  suffix?: string; icon?: Parameters<typeof HugeiconsIcon>[0]['icon']; pill?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.input, pill && { borderRadius: radius.pill }, focused && s.inputFocused]}>
      {icon && <HugeiconsIcon icon={icon} color={focused ? c.accent : c.muted} size={22} />}
      <TextInput placeholderTextColor={c.muted} accessibilityLabel={rest.placeholder} {...rest}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        style={[{ flex: 1, minWidth: 0, minHeight: touch, fontFamily: family, fontSize: font.md, color: c.text },
          webNoOutline, style]} />
      {suffix && <T muted>{suffix}</T>}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.sm }}>
      <T bold>{title}</T>
      {action && (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
          <T size="sm" bold style={{ color: c.accent }}>{action}</T>
        </Pressable>
      )}
    </View>
  );
}

export function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return (
    <View style={[s.note, tone === 'warn' && { backgroundColor: c.warmSoft }]}>
      <T size="sm" style={{ color: tone === 'warn' ? c.warm : c.muted }}>{children}</T>
    </View>
  );
}

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={{ alignItems: 'center', gap: space.sm, padding: space.xl }}>
      <Plate emoji={emoji} size={72} />
      <T muted style={{ textAlign: 'center' }}>{text}</T>
    </View>
  );
}

// Browsers draw their own focus outline; the container's green ring replaces it. Native has none.
const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null;

const s = StyleSheet.create({
  footer: { paddingHorizontal: space.md, paddingTop: space.sm, paddingBottom: space.sm, backgroundColor: c.bg },
  card: { backgroundColor: c.surface, borderRadius: radius.lg, padding: space.md, gap: space.sm, ...shadow },
  button: { minHeight: touch, borderRadius: radius.pill, paddingHorizontal: space.lg, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  buttonSmall: { minHeight: 40, paddingHorizontal: space.md, gap: 6 },
  chip: { minHeight: 40, paddingHorizontal: space.md, borderRadius: radius.pill, borderWidth: 1,
    borderColor: c.border, backgroundColor: c.surface, justifyContent: 'center' },
  choice: { minHeight: touch + 8, flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: c.border, backgroundColor: c.surface },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: c.border,
    alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.accent },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.accentSoft,
    alignItems: 'center', justifyContent: 'center' },
  input: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: c.surface,
    borderRadius: radius.md, paddingHorizontal: space.md, borderWidth: 1.5, borderColor: c.border },
  inputFocused: { borderColor: c.accent, boxShadow: `0 0 0 4px ${c.accentSoft}` },
  note: { backgroundColor: c.accentSoft, borderRadius: radius.md, padding: space.md },
});
