import { SectionList, View } from 'react-native';

import { formatMonth } from '@/shared/i18n';
import { Text, useColors } from '@/shared/ui';

import { NoteCard } from './NoteCard';

import { useNotes } from '../model/useNotes';

// Лента заметок: дни новые сверху, заголовок месяца липнет, пока листаются его дни
export function NotesPage() {
  const colors = useColors();
  const feed = useNotes();

  if (!feed) {
    return null;
  }

  return (
    <SectionList
      sections={feed}
      keyExtractor={(day) => day.date}
      // на Android заголовки по умолчанию не липнут
      stickySectionHeadersEnabled
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      renderSectionHeader={({ section }) => {
        const [year = 0, month = 1] = section.month.split('-').map(Number);
        return (
          // фон экрана, чтобы записи не просвечивали под липким заголовком
          <View
            style={{
              backgroundColor: colors.background,
              paddingTop: 16,
              paddingBottom: 12,
            }}
          >
            <Text variant="heading">{formatMonth(year, month - 1)}</Text>
          </View>
        );
      }}
      renderItem={({ item }) => <NoteCard day={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}
