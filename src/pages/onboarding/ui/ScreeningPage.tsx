import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Switch, View } from 'react-native';

import { Screen, Text } from '@/shared/ui';

import { t } from '../i18n';

const questions = [
  'screeningDaily',
  'screeningHeavy',
  'screeningWithdrawal',
] as const;

// Ответы нигде не сохраняются, только решают, показывать ли предупреждение
export function ScreeningPage() {
  const [answers, setAnswers] = useState([false, false, false]);
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
            onValueChange={(v) =>
              setAnswers(answers.map((a, j) => (j === i ? v : a)))
            }
          />
        </View>
      ))}
      <Button
        title={t('next')}
        onPress={() =>
          router.push(
            answers.some(Boolean) ? '/onboarding/warning' : '/onboarding/start',
          )
        }
      />
    </Screen>
  );
}
