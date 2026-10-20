import { Add01Icon, Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { View } from 'react-native';
import * as v from 'valibot';

import { Badge, Button, Card, Empty, Input, Screen, SectionTitle, Stepper, T } from '@/components/ui';
import { bn, parseNum } from '@/lib/format';
import { BookSchema, type Book } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { c, radius, space } from '@/lib/theme';

export default function Books() {
  const { books, setBooks } = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState('');
  const [error, setError] = useState(false);

  const reading = books.filter((b) => b.read < b.pages);
  const finished = books.filter((b) => b.read >= b.pages);
  const update = (id: string, read: number) => setBooks(books.map((b) => (b.id === id ? { ...b, read } : b)));

  const add = () => {
    const parsed = v.safeParse(BookSchema, { id: Date.now().toString(36), title, pages: parseNum(pages), read: 0 });
    if (!parsed.success) return setError(true);
    setBooks([parsed.output, ...books]);
    setTitle(''); setPages(''); setError(false); setAdding(false);
  };

  return (
    <Screen>
      {adding ? (
        <Card style={{ gap: space.sm }}>
          <T bold>নতুন বই</T>
          <Input value={title} onChangeText={setTitle} placeholder="বইয়ের নাম" autoFocus />
          <Input value={pages} onChangeText={setPages} placeholder="মোট পৃষ্ঠা" suffix="পৃষ্ঠা" keyboardType="numeric" />
          {error && <T size="sm" style={{ color: c.danger }}>বইয়ের নাম আর মোট পৃষ্ঠা (১–৫০০০) লিখুন।</T>}
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button kind="ghost" label="বাতিল" onPress={() => { setAdding(false); setError(false); }} />
            <Button label="যোগ করুন" onPress={add} />
          </View>
        </Card>
      ) : (
        <Button kind="secondary" label="বই যোগ করুন" icon={Add01Icon} onPress={() => setAdding(true)} />
      )}

      {!books.length && !adding && <Empty emoji="📚" text="যে বইটি পড়ছেন সেটি যোগ করুন, প্রতিদিন কত পৃষ্ঠা পড়লেন লিখে রাখুন।" />}

      {reading.length > 0 && <SectionTitle title="পড়ছি" />}
      {reading.map((b, i) => <BookCard key={b.id} book={b} enter={i} onRead={(r) => update(b.id, r)}
        onRemove={() => setBooks(books.filter((x) => x.id !== b.id))} />)}

      {finished.length > 0 && <SectionTitle title={`পড়া শেষ (${bn(finished.length)})`} />}
      {finished.map((b, i) => <BookCard key={b.id} book={b} enter={i} onRead={(r) => update(b.id, r)}
        onRemove={() => setBooks(books.filter((x) => x.id !== b.id))} />)}
    </Screen>
  );
}

function BookCard({ book, enter, onRead, onRemove }: {
  book: Book; enter: number; onRead: (read: number) => void; onRemove: () => void;
}) {
  const [typing, setTyping] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const done = book.read >= book.pages;
  const share = book.read / book.pages;
  const page = typing === null ? NaN : parseNum(typing);
  const pageOk = Number.isInteger(page) && page >= 0 && page <= book.pages;

  return (
    <Card enter={enter} style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <T bold style={{ flex: 1 }} numberOfLines={2}>{book.title}</T>
        {done ? <Badge label="শেষ 🎉" /> : <T size="sm" muted>{bn(Math.round(share * 100))}%</T>}
      </View>
      <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.accentSoft, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${Math.min(100, share * 100)}%`, backgroundColor: c.accent }} />
      </View>

      {typing !== null ? (
        <View style={{ gap: space.sm }}>
          <Input value={typing} onChangeText={setTyping} placeholder="এখন কোন পৃষ্ঠায়" keyboardType="numeric"
            suffix={`/ ${bn(book.pages)}`} autoFocus onSubmitEditing={() => pageOk && (onRead(page), setTyping(null))} />
          {!pageOk && typing !== '' && <T size="sm" style={{ color: c.danger }}>০ থেকে {bn(book.pages)}-এর মধ্যে লিখুন।</T>}
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button kind="ghost" label="বাতিল" onPress={() => setTyping(null)} />
            <Button label="সেভ করুন" disabled={!pageOk} onPress={() => { onRead(page); setTyping(null); }} />
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T size="sm" muted>{bn(book.read)} / {bn(book.pages)} পৃষ্ঠা</T>
          <Stepper label="পৃষ্ঠা" value={book.read} step={5} onChange={(r) => onRead(Math.min(book.pages, r))} />
        </View>
      )}

      {typing === null && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
          <Button kind="secondary" small label="পৃষ্ঠা নম্বর লিখুন" icon={PencilEdit02Icon} onPress={() => setTyping(bn(book.read))} />
          {confirm ? (
            <View style={{ flexDirection: 'row', gap: space.xs }}>
              <Button kind="ghost" small label="না" onPress={() => setConfirm(false)} />
              <Button kind="danger" small label="হ্যাঁ, মুছুন" onPress={onRemove} />
            </View>
          ) : <Button kind="danger" small label="মুছুন" icon={Delete02Icon} onPress={() => setConfirm(true)} />}
        </View>
      )}
    </Card>
  );
}
