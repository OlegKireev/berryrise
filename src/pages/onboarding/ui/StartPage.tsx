import { Button } from 'react-native';

import { DateTimeField, Screen, Text } from '@/shared/ui';

import { useStart } from '../model/useStart';

import { t } from '../i18n';

export function StartPage() {
  const { startAt, setStartAt, saving, start } = useStart();

  return (
    <Screen>
      <Text variant="title">{t('startTitle')}</Text>
      <Text>{t('startHint')}</Text>
      <DateTimeField
        value={startAt ?? new Date()}
        onChange={setStartAt}
        max={new Date()}
      />
      <Button
        title={t('startButton')}
        disabled={saving}
        onPress={start}
      />
    </Screen>
  );
}
