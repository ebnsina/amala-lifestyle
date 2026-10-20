import Constants from 'expo-constants';
import { Text, View } from 'react-native';

import { Card, Screen, T } from '@/components/ui';
import { bn } from '@/lib/format';
import { c, space } from '@/lib/theme';

const version = Constants.expoConfig?.version ?? '';

const sections = [
  { title: 'অ্যাপটি কী', body: 'প্রতিদিন ভালো থাকার একটি সহজ সঙ্গী। ঘরে যা রান্না হয়, তা থেকেই কতটুকু খাবেন জানা, BMI মাপা — সব এক জায়গায়।' },
  { title: 'আপনার তথ্য', body: 'কোনো অ্যাকাউন্ট লাগে না, ইন্টারনেট লাগে না। আপনার সব তথ্য শুধু এই ফোনেই থাকে — কোথাও পাঠানো হয় না, কোনো বিজ্ঞাপন বা নজরদারি নেই।' },
  { title: 'মনে রাখবেন', body: 'সব হিসাব আনুমানিক। এটি চিকিৎসার পরামর্শ নয় — অসুখ থাকলে বা সন্দেহ হলে ডাক্তার বা পুষ্টিবিদের সাথে কথা বলুন।' },
];

export default function About() {
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: space.xs, paddingVertical: space.md }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.accentSoft,
          alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48 }}>🍛</Text>
        </View>
        <T size="xl" bold>Amala Lifestyle</T>
        <T size="sm" muted>সংস্করণ {version.replace(/\d/g, (d) => bn(Number(d)))}</T>
      </View>

      {sections.map((s, i) => (
        <Card key={s.title} enter={i}>
          <T bold>{s.title}</T>
          <T muted>{s.body}</T>
        </Card>
      ))}

      <T size="xs" muted style={{ textAlign: 'center', marginTop: space.sm }}>made by Ebn Sina</T>
    </Screen>
  );
}
