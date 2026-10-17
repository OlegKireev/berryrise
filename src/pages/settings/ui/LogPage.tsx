import { Alert } from 'react-native';

import { Button, Screen, Text } from '@/shared/ui';

import { useLog } from '../model/useLog';
import { LogEntryRow } from './LogEntryRow';

import { t } from '../i18n';

export function LogPage() {
  const log = useLog();

  if (!log) {
    return null;
  }

  const { entries, empty, isOpen, toggleOpen, save, share, clear } = log;
  const confirmClear = () =>
    Alert.alert(t('clearLogTitle'), t('clearLogText'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('clear'), style: 'destructive', onPress: clear },
    ]);

  return (
    <Screen>
      <Button
        title={t('saveToPhone')}
        disabled={empty}
        onPress={save}
      />
      <Button
        title={t('send')}
        disabled={empty}
        onPress={share}
      />
      {empty ? <Text variant="hint">{t('logEmpty')}</Text> : null}
      {entries.map((entry, i) => (
        <LogEntryRow
          key={`${String(entry.at)}-${String(i)}`}
          entry={entry}
          open={isOpen(i)}
          onToggle={() => toggleOpen(i)}
        />
      ))}
      {empty ? null : (
        <Button
          variant="quiet"
          title={t('clear')}
          onPress={confirmClear}
        />
      )}
    </Screen>
  );
}
