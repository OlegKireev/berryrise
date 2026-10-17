import { View } from 'react-native';

import { DeleteRelapseButton } from '@/features/delete-relapse';
import type { Hardship, Mood, Place } from '@/shared/config';
import { formatTime } from '@/shared/i18n';
import { minutesOfDay } from '@/shared/lib';
import { Text } from '@/shared/ui';

import { Answer } from './Answer';

import { t } from '../i18n';

type Props = {
  relapse: {
    id: string;
    at: number;
    mood: Mood | null;
    places: Place[];
    hardships: Hardship[];
    note: string | null;
  };
  onDeleted: () => void;
};

// Срыв в карточке дня: время, непустой разбор и удаление
export function DayRelapse({ relapse: r, onDeleted }: Props) {
  const at = new Date(r.at);
  return (
    <View style={{ gap: 4 }}>
      <Text weight="semibold">
        {t('relapseAt')} {formatTime(minutesOfDay(at))}
      </Text>
      <Answer
        title={t('option.titles.mood')}
        value={r.mood && t(`option.mood.${r.mood}`)}
      />
      <Answer
        title={t('option.titles.place')}
        value={r.places.map((p) => t(`option.place.${p}`)).join(', ')}
      />
      <Answer
        title={t('option.titles.hardship')}
        value={r.hardships.map((h) => t(`option.hardship.${h}`)).join(', ')}
      />
      {r.note && <Text>{r.note}</Text>}
      <DeleteRelapseButton
        id={r.id}
        onDeleted={onDeleted}
      />
    </View>
  );
}
