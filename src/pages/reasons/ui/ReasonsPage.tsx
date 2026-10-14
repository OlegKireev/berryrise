import { Button } from 'react-native';

import { reasonLabel } from '@/entities/reason';
import { AddField, Choices, Row, Screen, Text } from '@/shared/ui';

import { useReasons } from '../model/useReasons';

import { t } from '../i18n';

export function ReasonsPage() {
  const reasons = useReasons();

  if (!reasons) {
    return null;
  }

  return (
    <Screen>
      {reasons.list.length === 0 && <Text>{t('noReasons')}</Text>}
      {reasons.list.map((item) => (
        <Row
          key={item.id}
          label={reasonLabel(item)}
        >
          <Button
            title={t('delete')}
            onPress={() => reasons.remove(item.id)}
          />
        </Row>
      ))}

      <Text
        variant="heading"
        style={{ marginTop: 8 }}
      >
        {t('addReasonTitle')}
      </Text>
      <Choices
        keys={reasons.presets}
        label={(k) => t(`reason.labels.${k}`)}
        isSelected={() => false}
        onPress={reasons.addPreset}
      />
      <AddField
        value={reasons.custom}
        onChangeText={reasons.setCustom}
        placeholder={t('reason.customReason')}
        canAdd={reasons.canAddCustom}
        onAdd={reasons.addCustom}
      />
    </Screen>
  );
}
