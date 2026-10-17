import { router } from 'expo-router';
import { View } from 'react-native';

import { Badge, Card, Empty, Plate, Screen, T } from '@/components/ui';
import { foodById } from '@/data/foods';
import { bn, qty } from '@/lib/format';
import { useStore } from '@/lib/store';
import { space } from '@/lib/theme';

export default function Favourites() {
  const { favourites } = useStore();
  return (
    <Screen>
      {!favourites.length && <Empty emoji="🤍" text="খাবারের পাশে ♡ চাপলে এখানে জমা থাকবে।" />}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
        {favourites.map((id) => foodById[id]).filter(Boolean).map((f, i) => (
          <Card key={f.id} enter={i} onPress={() => router.push({ pathname: '/food/[id]', params: { id: f.id } })}
            style={{ width: '47%', flexGrow: 1 }}>
            <View style={{ alignSelf: 'center' }}><Plate emoji={f.emoji} size={80} /></View>
            <Badge label={f.protein >= 10 ? 'আমিষ বেশি' : 'হালকা খাবার'} tone={f.protein >= 10 ? 'green' : 'warm'} />
            <T bold numberOfLines={1}>{f.bn}</T>
            <T size="sm" muted>{qty(1, f.unit)} · {bn(f.kcal)} ক্যালরি</T>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
