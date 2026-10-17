import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  FadeIn, FadeInLeft, FadeInRight, useAnimatedStyle, withTiming, ZoomIn,
} from 'react-native-reanimated';

import { Button, Chip, Choice, enterAt, Input, Note, Screen, T } from '@/components/ui';
import { bn, parseNum } from '@/lib/format';
import { activityOptions, avoidOptions, goalOptions, sexOptions } from '@/lib/labels';
import { dailyTarget, type Profile } from '@/lib/nutrition';
import { dummyProfile, useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

const steps = [
  { title: 'আপনার সম্পর্কে', sub: 'দিনে কতটুকু খাওয়া দরকার, তা আন্দাজ করতে লাগবে।' },
  { title: 'চলাফেরা ও লক্ষ্য', sub: 'সারাদিন কেমন কাটে আর কী চান?' },
  { title: 'খাওয়ার অভ্যাস', sub: 'প্রায় শেষ!' },
];

export default function Onboarding() {
  const { profile, setProfile } = useStore();
  // ponytail: prefilled with dummy values while we review the UI; start blank once data is real.
  const p = profile ?? dummyProfile;
  const inches = Math.round(p.heightCm / 2.54);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // slide direction: forward or back
  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
  const [age, setAge] = useState(bn(p.age));
  const [ft, setFt] = useState(bn(Math.floor(inches / 12)));
  const [inch, setInch] = useState(bn(inches % 12));
  const [kg, setKg] = useState(bn(p.weightKg));
  const [sex, setSex] = useState(p.sex);
  const [activity, setActivity] = useState(p.activity);
  const [goal, setGoal] = useState(p.goal);
  const [meals, setMeals] = useState(p.mealsPerDay);
  const [avoid, setAvoid] = useState(p.avoid);
  const [tried, setTried] = useState(false);

  const nAge = parseNum(age), nFt = parseNum(ft), nIn = parseNum(inch || '0'), nKg = parseNum(kg);
  const errors = {
    age: !(nAge >= 18 && nAge <= 90) && 'বয়স ১৮ থেকে ৯০ বছরের মধ্যে লিখুন',
    height: !(nFt >= 4 && nFt <= 7 && nIn >= 0 && nIn < 12) && 'উচ্চতা ঠিকমতো লিখুন (যেমন ৫ ফুট ৪ ইঞ্চি)',
    weight: !(nKg >= 30 && nKg <= 250) && 'ওজন ৩০ থেকে ২৫০ কেজির মধ্যে লিখুন',
  };
  const next: Profile = { age: nAge, heightCm: Math.round((nFt * 12 + nIn) * 2.54), weightKg: nKg, sex, activity,
    goal, mealsPerDay: meals, avoid };

  const onNext = () => {
    setTried(true);
    if (step === 0 && (errors.age || errors.height || errors.weight)) return;
    if (step < steps.length - 1) return go(step + 1);
    const first = !profile;
    setProfile(next);
    if (first) router.replace('/');
    else router.back();
  };

  return (
    <Screen
      footer={
        <>
          {step > 0 && <Button kind="secondary" label="আগে" onPress={() => go(step - 1)} />}
          <Button label={step < steps.length - 1 ? 'পরের ধাপ' : 'সেভ করুন'} onPress={onNext} />
        </>
      }>
      <View style={{ flexDirection: 'row', gap: space.xs }}>
        {steps.map((_, i) => (
          <Segment key={i} on={i <= step} />
        ))}
      </View>
      <Animated.View key={step} entering={(dir > 0 ? FadeInRight : FadeInLeft).duration(320)} style={{ gap: space.md }}>
      <View>
        <T size="sm" muted>ধাপ {bn(step + 1)} / {bn(steps.length)}</T>
        <T size="xl" bold>{steps[step].title}</T>
        <T muted>{steps[step].sub}</T>
      </View>

      {step === 0 && (
        <>
          <Field i={0} label="আপনি"><Choice options={sexOptions} value={sex} onChange={setSex} /></Field>
          <Field i={1} label="বয়স" error={tried && errors.age}>
            <Input value={age} onChangeText={setAge} placeholder="যেমন ৩৫" suffix="বছর" keyboardType="numeric" />
          </Field>
          <Field i={2} label="উচ্চতা" error={tried && errors.height}>
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <View style={{ flex: 1 }}><Input value={ft} onChangeText={setFt} placeholder="ফুট" suffix="ফুট" keyboardType="numeric" /></View>
              <View style={{ flex: 1 }}><Input value={inch} onChangeText={setInch} placeholder="ইঞ্চি" suffix="ইঞ্চি" keyboardType="numeric" /></View>
            </View>
          </Field>
          <Field i={3} label="ওজন" error={tried && errors.weight}>
            <Input value={kg} onChangeText={setKg} placeholder="যেমন ৬৫" suffix="কেজি" keyboardType="numeric" />
          </Field>
        </>
      )}

      {step === 1 && (
        <>
          <Field i={0} label="সারাদিন কেমন চলাফেরা করেন?">
            <Choice options={activityOptions} value={activity} onChange={setActivity} />
          </Field>
          <Field i={1} label="আপনার লক্ষ্য"><Choice options={goalOptions} value={goal} onChange={setGoal} /></Field>
        </>
      )}

      {step === 2 && (
        <>
          <Field i={0} label="দিনে কয়বার ভরপেট খান?">
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              {([2, 3, 4, 5] as const).map((n) => (
                <View key={n} style={{ flex: 1 }}>
                  <Chip label={`${bn(n)} বার`} on={meals === n} onPress={() => setMeals(n)} />
                </View>
              ))}
            </View>
          </Field>
          <Field i={1} label="কিছু খান না? (না থাকলে বাদ দিন)">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
              {avoidOptions.map((o) => (
                <Chip key={o.id} label={o.bn} on={avoid.includes(o.id)}
                  onPress={() => setAvoid(avoid.includes(o.id) ? avoid.filter((x) => x !== o.id) : [...avoid, o.id])} />
              ))}
            </View>
          </Field>
          <Animated.View entering={ZoomIn.springify().damping(14).delay(250)}
            style={{ backgroundColor: c.accent, borderRadius: radius.lg, padding: space.lg, alignItems: 'center' }}>
            <T style={{ color: c.onAccent }}>আপনার দিনের আনুমানিক লক্ষ্য</T>
            <T size="xxl" bold style={{ color: c.onAccent }}>{bn(dailyTarget(next))}</T>
            <T style={{ color: c.onAccent }}>ক্যালরি</T>
          </Animated.View>
          <Note>গর্ভবতী বা বুকের দুধ খাওয়ালে, কিংবা ডায়াবেটিস বা কিডনির সমস্যা থাকলে ডাক্তারের পরামর্শ মেনে চলুন।</Note>
        </>
      )}
      </Animated.View>
    </Screen>
  );
}

function Field({ i, label, error, children }: { i: number; label: string; error?: string | false; children: ReactNode }) {
  return (
    <Animated.View entering={enterAt(i + 1)} style={{ gap: space.sm }}>
      <T bold>{label}</T>
      {children}
      {error ? <Animated.View entering={FadeIn}><T size="sm" style={{ color: c.danger }}>{error}</T></Animated.View> : null}
    </Animated.View>
  );
}

function Segment({ on }: { on: boolean }) {
  const fill = useAnimatedStyle(() => ({ width: withTiming(on ? '100%' : '0%', { duration: 400 }) }));
  return (
    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c.border, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: c.accent }, fill]} />
    </View>
  );
}
