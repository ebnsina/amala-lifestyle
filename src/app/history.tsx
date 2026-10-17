import { View } from 'react-native';

import { Card, Empty, Plate, Ring, Screen, T } from '@/components/ui';
import { bn, dateLabel, parseDay } from '@/lib/format';
import { dailyTarget, kcalOf } from '@/lib/nutrition';
import { slotName, useStore } from '@/lib/store';
import { c, space } from '@/lib/theme';

export default function History() {
  const { history, profile } = useStore();
  const target = profile ? dailyTarget(profile) : 0;
  return (
    <Screen>
      {!history.length && <Empty emoji="📒" text="এখনো আগের কোনো দিনের হিসাব নেই।" />}
      {history.map((d, i) => {
        const total = Math.round(d.meals.reduce((s, m) => s + kcalOf(m.portions), 0));
        return (
          <Card key={d.date} enter={i} style={{ gap: space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
              <Ring value={target ? total / target : 0} size={64} stroke={7}
                color={total > target ? c.warm : c.accent}>
                <T size="xs" bold>{bn(Math.round((total / (target || 1)) * 100))}%</T>
              </Ring>
              <View style={{ flex: 1 }}>
                <T bold>{dateLabel(parseDay(d.date))}</T>
                <T size="sm" muted>{bn(total)} / {bn(target)} ক্যালরি</T>
              </View>
            </View>
            {d.meals.map((m) => (
              <View key={m.slot} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <Plate emoji={m.portions[0].food.emoji} size={36} />
                <View style={{ flex: 1 }}>
                  <T size="sm" bold>{slotName(m.slot)}</T>
                  <T size="xs" muted numberOfLines={1}>{m.portions.map((p) => p.food.bn).join(', ')}</T>
                </View>
                <T size="sm" muted>{bn(Math.round(kcalOf(m.portions)))}</T>
              </View>
            ))}
          </Card>
        );
      })}
    </Screen>
  );
}
