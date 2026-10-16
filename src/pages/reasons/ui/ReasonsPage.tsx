import { ReasonPicker, useReasonPicker } from '@/features/edit-reasons';
import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

export function ReasonsPage() {
  const picker = useReasonPicker();

  if (!picker) {
    return null;
  }

  return (
    <Screen>
      {picker.count === 0 && <Text>{t('noReasons')}</Text>}
      <ReasonPicker picker={picker} />
    </Screen>
  );
}
