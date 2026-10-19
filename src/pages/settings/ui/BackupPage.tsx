import { ExportButton, ImportButton } from '@/features/backup';
import { Screen, Text } from '@/shared/ui';

import { useBackup } from '../model/useBackup';

import { t } from '../i18n';

export function BackupPage() {
  const { onImported } = useBackup();
  return (
    <Screen>
      <Text variant="hint">{t('exportHint')}</Text>
      <ExportButton />
      <Text
        variant="hint"
        style={{ marginTop: 12 }}
      >
        {t('importHint')}
      </Text>
      <ImportButton
        confirm
        onImported={onImported}
      />
    </Screen>
  );
}
