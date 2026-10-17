import { Text } from '@/shared/ui';

type Props = { title: string; value: string | null };

// Ответ разбора одной строкой: "Настроение: Хорошо". Пустой не показываем
export function Answer({ title, value }: Props) {
  if (!value) {
    return null;
  }

  return (
    <Text>
      <Text variant="hint">{title}: </Text>
      {value}
    </Text>
  );
}
