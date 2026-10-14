import { Button, Row, Screen, Switch, Text } from '@/shared/ui';

import { questions, useScreening } from '../model/useScreening';

import { t } from '../i18n';

export function ScreeningPage() {
  const { answers, setAnswer, next } = useScreening();

  return (
    <Screen>
      <Text variant="title">{t('screeningTitle')}</Text>
      {questions.map((q, i) => (
        <Row
          key={q}
          label={t(q)}
        >
          <Switch
            value={answers[i]}
            onValueChange={(v) => setAnswer(i, v)}
          />
        </Row>
      ))}
      <Button
        variant="primary"
        title={t('next')}
        onPress={next}
      />
    </Screen>
  );
}
