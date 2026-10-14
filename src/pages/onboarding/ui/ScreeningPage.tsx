import { Button, Switch, View } from 'react-native';

import { Screen, Text } from '@/shared/ui';

import { questions, useScreening } from '../model/useScreening';

import { t } from '../i18n';

export function ScreeningPage() {
  const { answers, setAnswer, next } = useScreening();

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>
        {t('screeningTitle')}
      </Text>
      {questions.map((q, i) => (
        <View
          key={q}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <Text style={{ flex: 1 }}>{t(q)}</Text>
          <Switch
            value={answers[i]}
            onValueChange={(v) => setAnswer(i, v)}
          />
        </View>
      ))}
      <Button
        title={t('next')}
        onPress={next}
      />
    </Screen>
  );
}
