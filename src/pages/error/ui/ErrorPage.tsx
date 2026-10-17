import type { ErrorBoundaryProps } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen, Text, useColors } from '@/shared/ui';

import { useErrorPage } from '../model/useErrorPage';

import { t } from '../i18n';

// Вместо белого экрана, когда экран упал при отрисовке (ErrorBoundary корневого layout).
// Граница вне стека и навигации: отступ под статус-бар и фон темы сами
export function ErrorPage({ error, retry }: ErrorBoundaryProps) {
  useErrorPage(error);
  const colors = useColors();
  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Screen
        footer={
          <Button
            variant="primary"
            title={t('retry')}
            onPress={retry}
          />
        }
      >
        <Text variant="title">{t('errorTitle')}</Text>
        <Text>{t('errorText')}</Text>
      </Screen>
    </SafeAreaView>
  );
}
