import { formatMoney } from '@/shared/i18n';
import { Group, Row, Screen, Text, useColors } from '@/shared/ui';
import Constants from 'expo-constants';

import { DevResetButton } from './DevResetButton';
import { StartRow } from './StartRow';

import { useSettings } from '../model/useSettings';

import { t } from '../i18n';

const KINDS = 3;

// Хаб: новый раздел - новая строка в своей группе
export function SettingsPage() {
  const settings = useSettings();
  const colors = useColors();

  if (!settings) {
    return null;
  }

  const { spending, reasonCount, notifications } = settings;

  return (
    <Screen>
      <Group label={t('groupQuit')}>
        <StartRow
          startAt={settings.habit.startAt}
          maxStart={settings.maxStart}
          checkStart={settings.checkStart}
          changeStart={settings.changeStart}
        />
        <Row
          icon="wallet"
          label={t('spending')}
          href="/settings/spending"
        >
          <Text variant="hint">
            {spending
              ? `${formatMoney(spending.amount, spending.currency)} ${t('perWeek')}`
              : t('notSet')}
          </Text>
        </Row>
        <Row
          icon="heart"
          label={t('reasons')}
          href="/settings/reasons"
        >
          <Text variant="hint">
            {reasonCount > 0 ? String(reasonCount) : t('noneChosen')}
          </Text>
        </Row>
      </Group>
      <Group label={t('groupApp')}>
        <Row
          icon="bell"
          label={t('notifications')}
          href="/settings/notifications"
        >
          {notifications === 'denied' ? (
            <Text
              variant="hint"
              // длинное значение переносится само, а не ломает подпись слева
              style={{
                color: colors.relapse,
                maxWidth: '40%',
                textAlign: 'right',
              }}
            >
              {t('offInSystem')}
            </Text>
          ) : (
            <Text variant="hint">
              {notifications > 0
                ? `${String(notifications)} ${t('of')} ${String(KINDS)}`
                : t('off')}
            </Text>
          )}
        </Row>
        <Row
          icon="archive"
          label={t('backup')}
          href="/settings/backup"
        />
        <Row
          icon="info"
          label={t('about')}
          href="/settings/about"
        >
          <Text variant="hint">{Constants.expoConfig?.version}</Text>
        </Row>
      </Group>
      {__DEV__ && <DevResetButton />}
    </Screen>
  );
}
