import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import * as v from 'valibot';

import { Button, Check, Empty, Input, Screen, SectionTitle, T } from '@/components/ui';
import { bn } from '@/lib/format';
import { TaskSchema, type Task } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function Tasks() {
  const { tasks, setTasks } = useStore();
  const [text, setText] = useState('');
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const add = () => {
    const parsed = v.safeParse(TaskSchema, { id: Date.now().toString(36), text, done: false });
    if (!parsed.success) return;
    setTasks([...tasks, parsed.output]);
    setText('');
  };
  const toggle = (id: string) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const row = (t: Task) => (
    <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: c.surface,
      borderRadius: radius.md, borderWidth: 1, borderColor: c.border, paddingLeft: space.md }}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: t.done }} accessibilityLabel={t.text}
        onPress={() => toggle(t.id)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 52 }}>
        <Check on={t.done} size={24} />
        <T muted={t.done} style={[{ flex: 1 }, t.done && { textDecorationLine: 'line-through' }]}>{t.text}</T>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${t.text} মুছুন`} onPress={() => remove(t.id)}
        style={{ width: 44, height: 52, alignItems: 'center', justifyContent: 'center' }}>
        <HugeiconsIcon icon={Cancel01Icon} color={c.muted} size={18} />
      </Pressable>
    </View>
  );

  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Input value={text} onChangeText={setText} placeholder="নতুন কাজ লিখুন" returnKeyType="done"
            onSubmitEditing={add} submitBehavior="submit" />
        </View>
        <Button small label="যোগ" icon={Add01Icon} onPress={add} disabled={!text.trim()} />
      </View>

      {!tasks.length && <Empty emoji="📝" text="আজ যা যা করবেন লিখে ফেলুন। শেষ হলে টিক দিন।" />}
      {open.map(row)}

      {done.length > 0 && (
        <>
          <SectionTitle title={`শেষ হয়েছে (${bn(done.length)})`} action="সব মুছুন"
            onAction={() => setTasks(open)} />
          {done.map(row)}
        </>
      )}
    </Screen>
  );
}
