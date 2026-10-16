import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { Bar } from './Bar';

import { REVIEWS_NEEDED } from '../model/insights';

import { t } from '../i18n';

// Вместо графиков, пока в периоде меньше 7 итогов дня
export function CollectingData({ count }: { count: number }) {
  return (
    <View style={{ gap: 8 }}>
      <Text weight="semibold">{t('collecting')}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Bar share={count / REVIEWS_NEEDED} />
        <Text variant="hint">
          {count} {t('of')} {REVIEWS_NEEDED}
        </Text>
      </View>
      <Text variant="hint">{t('collectingHint')}</Text>
    </View>
  );
}
