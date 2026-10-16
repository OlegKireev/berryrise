import { Button } from '@/shared/ui';

import { useExport } from '../model/useExport';
import { useImport } from '../model/useImport';

import { t } from '../i18n';

export function ExportButton() {
  const run = useExport();
  return (
    <Button
      title={t('exportData')}
      onPress={run}
    />
  );
}

type ImportProps = Parameters<typeof useImport>[0] & {
  title?: string;
  variant?: 'secondary' | 'quiet';
};

// Импорт с заменой всех данных; после него страница сама перепланирует уведомления и уводит дальше
export function ImportButton({ title, variant, ...options }: ImportProps) {
  const run = useImport(options);
  return (
    <Button
      variant={variant}
      title={title ?? t('importData')}
      onPress={run}
    />
  );
}
