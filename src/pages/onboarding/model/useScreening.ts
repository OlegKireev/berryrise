import { router } from 'expo-router';
import { useState } from 'react';

export const questions = [
  'screeningDaily',
  'screeningHeavy',
  'screeningWithdrawal',
] as const;

// Ответы нигде не сохраняются, только решают, показывать ли предупреждение
export function useScreening() {
  const [answers, setAnswers] = useState(questions.map(() => false));

  return {
    answers,
    setAnswer: (i: number, v: boolean) =>
      setAnswers(answers.map((a, j) => (j === i ? v : a))),
    next: () =>
      router.push(
        answers.some(Boolean) ? '/onboarding/warning' : '/onboarding/start',
      ),
  };
}
