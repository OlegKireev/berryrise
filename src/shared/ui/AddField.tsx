import { t } from '@/shared/i18n';

import { Button } from './Button';
import { Input } from './Input';

type Props = {
  value: string;
  onChangeText: (s: string) => void;
  placeholder: string;
  canAdd: boolean;
  onAdd: () => void;
};

// Поле и кнопка "Добавить"
export function AddField({
  value,
  onChangeText,
  placeholder,
  canAdd,
  onAdd,
}: Props) {
  return (
    <>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
      <Button
        title={t('add')}
        disabled={!canAdd}
        onPress={onAdd}
      />
    </>
  );
}
