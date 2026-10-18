import { View } from 'react-native';

import { Text } from '@/shared/ui';

import { Bar } from './Bar';

import type { Top } from '../model/insights';

import { t } from '../i18n';

type Props<K> = {
  title: string;
  items: Top<K>;
  total: number; // от чего доля полоски: итоги дня или срывы
  label: (key: K) => string;
  sub?: boolean; // подзаголовок внутри блока: мельче заголовка блока
  empty?: string; // текст пустого топа вместо "ничего не отмечено"
};

// Топ вариантов: подпись, полоска доли и число
export function TopList<K extends string>({
  title,
  items,
  total,
  label,
  sub,
  empty,
}: Props<K>) {
  return (
    <View style={{ gap: 12 }}>
      {sub ? (
        <Text
          weight="semibold"
          style={{ fontSize: 14 }}
        >
          {title}
        </Text>
      ) : (
        <Text weight="semibold">{title}</Text>
      )}
      {items.length ? (
        items.map(({ key, count }) => (
          <View
            key={key}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Text style={{ width: '45%' }}>{label(key)}</Text>
            <Bar share={count / total} />
            <Text
              variant="hint"
              style={{ minWidth: 20, textAlign: 'right' }}
            >
              {count}
            </Text>
          </View>
        ))
      ) : (
        <Text variant="hint">{empty ?? t('nothingMarked')}</Text>
      )}
    </View>
  );
}
