import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { TopList } from './TopList';

import type { Insights } from '../model/insights';

import { t } from '../i18n';

// Срывы периода: число в заголовке, под ним трудности и места из разборов.
// Доли в топах - от срывов с разбором, пустой топ не показываем
export function RelapseInsights({
  count,
  analyzed,
  hardships,
  places,
}: NonNullable<Insights['relapses']>) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text
          weight="semibold"
          style={{ flex: 1 }}
        >
          {t('relapses')}
        </Text>
        <Text weight="semibold">{count}</Text>
      </View>
      {analyzed === 0 ? (
        <Text variant="hint">{t('noAnalysis')}</Text>
      ) : (
        analyzed < count && (
          <Text variant="hint">
            {t('analyzedOf')} {analyzed} {t('of')} {count}
          </Text>
        )
      )}
      {hardships.length > 0 && (
        <TopList
          sub
          title={t('option.titles.hardship')}
          items={hardships}
          total={analyzed}
          label={(k) => t(`option.hardship.${k}`)}
        />
      )}
      {places.length > 0 && (
        <TopList
          sub
          title={t('option.titles.place')}
          items={places}
          total={analyzed}
          label={(k) => t(`option.place.${k}`)}
        />
      )}
    </View>
  );
}
