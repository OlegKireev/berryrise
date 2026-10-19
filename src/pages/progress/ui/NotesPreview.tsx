import { View } from 'react-native';

import { Button, Text } from '@/shared/ui';

import { NoteCard } from './NoteCard';

import { useNotes } from '../model/useNotes';

import { t } from '../i18n';

// Последняя заметка на "Прогрессе". Нет заметок - нет блока
export function NotesPreview() {
  const feed = useNotes();
  const day = feed?.[0]?.data[0];

  if (!day) {
    return null;
  }

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          variant="heading"
          style={{ flex: 1 }}
        >
          {t('notes')}
        </Text>
        <Button
          variant="quiet"
          title={t('allNotes')}
          href="/notes"
        />
      </View>
      {/* самая новая запись ленты: итоги дня, если есть, иначе первый срыв дня */}
      <NoteCard
        day={{
          ...day,
          relapses: day.review ? [] : day.relapses.slice(0, 1),
        }}
        lines={3}
      />
    </View>
  );
}
