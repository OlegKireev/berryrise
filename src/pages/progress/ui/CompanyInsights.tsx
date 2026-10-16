import { View } from 'react-native';

import { evenings } from '@/shared/i18n';
import { Text } from '@/shared/ui';

import type { Insights } from '../model/insights';

import { t } from '../i18n';

// Вечера в компании с ответом: всего и сколько без алкоголя
export function CompanyInsights({
  total,
  sober,
}: NonNullable<Insights['company']>) {
  return (
    <View style={{ gap: 4 }}>
      <Text weight="semibold">{t('companyEvenings')}</Text>
      <Text>
        {evenings(total)}, {sober} {t('companySober')}
      </Text>
    </View>
  );
}
