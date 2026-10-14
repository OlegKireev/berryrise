import { Button } from 'react-native';

import { replies } from '@/entities/reply';
import { AddField, Row, Text } from '@/shared/ui';

import { useReplies } from '../model/useReplies';

import { t } from '../i18n';

// Что ответить, если спросят: готовые ответы и свои
export function RepliesSection() {
  const my = useReplies();

  return (
    <>
      <Text variant="label">{t('repliesTitle')}</Text>
      {replies.map((k) => (
        <Text key={k}>• {t(`reply.${k}`)}</Text>
      ))}
      {my.list.map((r) => (
        <Row
          key={r.id}
          label={`• ${r.customText ?? ''}`}
        >
          <Button
            title={t('delete')}
            onPress={() => my.remove(r.id)}
          />
        </Row>
      ))}
      <AddField
        value={my.text}
        onChangeText={my.setText}
        placeholder={t('customReply')}
        canAdd={my.canAdd}
        onAdd={my.add}
      />
    </>
  );
}
