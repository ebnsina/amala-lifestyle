import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Card, Input, Note, Screen, T } from '@/components/ui';
import { BANDS, bmi, bmiBand, healthyRange, type BmiBand } from '@/lib/bmi';
import { bn, parseNum } from '@/lib/format';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const bandColor: Record<BmiBand, string> = { under: '#5B9BD5', normal: c.carbs, over: c.protein, obese: c.fat };
const LO = 15, HI = 35; // visible span of the scale
const at = (x: number) => (Math.min(HI, Math.max(LO, x)) - LO) / (HI - LO);

export default function Bmi() {
  const { profile } = useStore();
  const inches = profile ? Math.round(profile.heightCm / 2.54) : 0;
  const [ft, setFt] = useState(profile ? bn(Math.floor(inches / 12)) : '');
  const [inch, setInch] = useState(profile ? bn(inches % 12) : '');
  const [kg, setKg] = useState(profile ? bn(profile.weightKg) : '');

  const nFt = parseNum(ft), nIn = parseNum(inch || '0'), nKg = parseNum(kg);
  const heightCm = (nFt * 12 + nIn) * 2.54;
  const valid = nFt >= 4 && nFt <= 7 && nIn >= 0 && nIn < 12 && nKg >= 30 && nKg <= 250;
  const value = valid ? bmi(nKg, heightCm) : null;
  const band = value === null ? null : BANDS.find((b) => b.id === bmiBand(value))!;
  const range = valid ? healthyRange(heightCm) : null;

  const pos = useSharedValue(0);
  useEffect(() => { if (value !== null) pos.set(withSpring(at(value), { damping: 16 })); }, [pos, value]);
  const marker = useAnimatedStyle(() => ({ left: `${pos.get() * 100}%` }));

  return (
    <Screen>
      <T muted>উচ্চতা আর ওজন দিন। আপনার প্রোফাইল থেকে আগেই বসানো আছে, চাইলে অন্য কারও জন্যও মাপতে পারেন।</T>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <View style={{ flex: 1 }}><Input value={ft} onChangeText={setFt} placeholder="ফুট" suffix="ফুট" keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Input value={inch} onChangeText={setInch} placeholder="ইঞ্চি" suffix="ইঞ্চি" keyboardType="numeric" /></View>
      </View>
      <Input value={kg} onChangeText={setKg} placeholder="ওজন" suffix="কেজি" keyboardType="numeric" />

      {value === null || !band || !range ? (
        <Note tone="warn">উচ্চতা (৪–৭ ফুট) আর ওজন (৩০–২৫০ কেজি) ঠিকমতো লিখলে ফলাফল দেখাবে।</Note>
      ) : (
        <Card enter={0} style={{ gap: space.md }}>
          <View style={{ alignItems: 'center' }}>
            <T muted>আপনার BMI</T>
            <T size="xxl" bold style={{ color: bandColor[band.id], fontSize: 52, lineHeight: 68 }}>
              {bn(Math.round(value * 10) / 10)}
            </T>
            <View style={{ backgroundColor: bandColor[band.id], paddingHorizontal: space.md, paddingVertical: 4,
              borderRadius: radius.pill }}>
              <T bold style={{ color: c.onAccent }}>{band.bn}</T>
            </View>
          </View>

          <View style={{ paddingTop: 14 }}>
            <View style={{ flexDirection: 'row', height: 12, borderRadius: radius.pill, overflow: 'hidden' }}>
              {BANDS.map((b, i) => {
                const from = Math.max(LO, b.from), to = BANDS[i + 1]?.from ?? HI;
                return <View key={b.id} style={{ flex: to - from, backgroundColor: bandColor[b.id] }} />;
              })}
            </View>
            <Animated.View style={[{ position: 'absolute', top: 0, marginLeft: -9, width: 18, height: 40,
              alignItems: 'center' }, marker]}>
              <View style={{ width: 0, height: 0, borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 12,
                borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: c.text }} />
            </Animated.View>
            <View style={{ flexDirection: 'row', marginTop: space.sm }}>
              {BANDS.map((b, i) => {
                const from = Math.max(LO, b.from), to = BANDS[i + 1]?.from ?? HI;
                return <T key={b.id} size="xs" muted style={{ flex: to - from, textAlign: 'center' }}>{b.bn}</T>;
              })}
            </View>
          </View>

          <View style={{ backgroundColor: c.accentSoft, borderRadius: radius.md, padding: space.md }}>
            <T size="sm" muted>এই উচ্চতায় স্বাভাবিক ওজন</T>
            <T bold size="lg" style={{ color: c.accent }}>{bn(range.min)} – {bn(range.max)} কেজি</T>
          </View>
        </Card>
      )}

      <Note>
        BMI শুধু একটা মোটামুটি ধারণা — পেশি, বয়স বা শরীরের গঠন এতে ধরা পড়ে না। এখানে বাংলাদেশিদের জন্য উপযোগী এশীয় মাপকাঠি
        ব্যবহার করা হয়েছে। শিশু, গর্ভবতী বা অসুস্থ হলে ডাক্তারের পরামর্শ নিন।
      </Note>
    </Screen>
  );
}
