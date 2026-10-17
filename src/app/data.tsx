import { HugeiconsIcon } from '@hugeicons/react-native';
import { FileExportIcon, FileImportIcon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Note, Screen, T } from '@/components/ui';
import { backupFileName, parseBackup } from '@/lib/backup';
import { bn, dateLabel } from '@/lib/format';
import { pickText, saveText } from '@/lib/files';
import type { Backup } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

type Status = { tone: 'info' | 'warn'; text: string } | null;

export default function Data() {
  const { exportData, importData, history, today } = useStore();
  const [status, setStatus] = useState<Status>(null);
  const [pending, setPending] = useState<{ backup: Backup; skipped: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const daysLogged = history.length + (today.length ? 1 : 0);

  const doExport = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const name = backupFileName();
      const r = await saveText(name, JSON.stringify(exportData(), null, 2));
      if (r === 'saved') setStatus({ tone: 'info', text: `“${name}” নামে ফাইল সেভ হয়েছে।` });
    } catch {
      setStatus({ tone: 'warn', text: 'ফাইল সেভ করা যায়নি। অন্য কোনো ফোল্ডার বেছে আবার চেষ্টা করুন।' });
    } finally {
      setBusy(false);
    }
  };

  const doPick = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const text = await pickText();
      if (text === null) return;
      const r = parseBackup(text);
      if (!r.ok) {
        setStatus({ tone: 'warn', text: r.reason === 'json'
          ? 'এটা এই অ্যাপের ব্যাকআপ ফাইল নয়।'
          : 'ফাইলটা নষ্ট বা অন্য কোনো সংস্করণের। ঠিক ফাইলটা বেছে নিন।' });
        return;
      }
      setPending({ backup: r.backup, skipped: r.skipped });
    } catch {
      setStatus({ tone: 'warn', text: 'ফাইলটা খোলা যায়নি। আবার চেষ্টা করুন।' });
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = () => {
    if (!pending) return;
    try {
      importData(pending.backup);
      setStatus({ tone: 'info', text: 'সব তথ্য ফিরিয়ে আনা হয়েছে।' });
    } catch {
      setStatus({ tone: 'warn', text: 'তথ্য ফিরিয়ে আনা যায়নি। আগের তথ্য যেমন ছিল তেমনই আছে।' });
    }
    setPending(null);
  };

  return (
    <Screen>
      <T muted>আপনার সব তথ্য শুধু এই ফোনেই থাকে। ফোন বদলালে বা অ্যাপ মুছে ফেলার আগে একটা ব্যাকআপ ফাইল রেখে দিন।</T>

      <Card enter={0} style={{ gap: space.md }}>
        <Row icon={FileExportIcon} title="ব্যাকআপ ফাইল বানান"
          sub={`প্রোফাইল, প্রিয় খাবার আর ${bn(daysLogged)} দিনের খাবারের হিসাব একটি ফাইলে যাবে। ফোনের কোন ফোল্ডারে রাখবেন বেছে নিন।`} />
        <View style={{ flexDirection: 'row' }}>
          <Button label="ফাইলে সেভ করুন" onPress={doExport} disabled={busy} />
        </View>
      </Card>

      <Card enter={1} style={{ gap: space.md }}>
        <Row icon={FileImportIcon} title="ব্যাকআপ থেকে ফিরিয়ে আনুন"
          sub="আগে সেভ করা ফাইল বেছে নিন। এখনকার তথ্যের জায়গায় ফাইলের তথ্য বসবে।" />
        <View style={{ flexDirection: 'row' }}>
          <Button kind="secondary" label="ফাইল বেছে নিন" onPress={doPick} disabled={busy} />
        </View>
      </Card>

      {pending && (
        <Card enter={0} style={{ gap: space.md, borderWidth: 2, borderColor: c.warm }}>
          <T bold>এই ফাইল থেকে তথ্য বসাবেন?</T>
          <T size="sm" muted>
            ফাইলের তারিখ: {dateLabel(new Date(pending.backup.exportedAt))}{'\n'}
            খাবারের হিসাব: {bn(pending.backup.meals.length)}টি{'\n'}
            প্রিয় খাবার: {bn(pending.backup.favourites.length)}টি
            {pending.skipped > 0 && `\n${bn(pending.skipped)}টি অচেনা খাবার বাদ যাবে।`}
          </T>
          <Note tone="warn">এখন ফোনে যা আছে তা মুছে গিয়ে ফাইলের তথ্য বসবে।</Note>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button kind="secondary" label="বাতিল" onPress={() => setPending(null)} />
            <Button label="হ্যাঁ, বসান" onPress={confirmImport} />
          </View>
        </Card>
      )}

      {status && <Note tone={status.tone}>{status.text}</Note>}
    </Screen>
  );
}

function Row({ icon, title, sub }: { icon: typeof FileExportIcon; title: string; sub: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.md }}>
      <View style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: c.accentSoft,
        alignItems: 'center', justifyContent: 'center' }}>
        <HugeiconsIcon icon={icon} color={c.accent} size={24} />
      </View>
      <View style={{ flex: 1 }}>
        <T bold>{title}</T>
        <T size="sm" muted>{sub}</T>
      </View>
    </View>
  );
}
