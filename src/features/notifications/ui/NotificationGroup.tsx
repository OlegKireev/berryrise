import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card, Collapse, Switch, Text } from '@/shared/ui';

type Props = {
  title: string;
  hint: string;
  on: boolean;
  onToggle: (on: boolean) => void;
  // настройки вида, раскрываются при включении
  children?: ReactNode;
};

// Карточка одного вида напоминаний: заголовок с переключателем, описание, настройки.
// Отступы свои, а не gap карточки: иначе свернутый блок оставлял бы лишний зазор
export function NotificationGroup({
  title,
  hint,
  on,
  onToggle,
  children,
}: Props) {
  return (
    <Card style={{ gap: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          weight="semibold"
          style={{ flex: 1 }}
        >
          {title}
        </Text>
        <Switch
          value={on}
          onValueChange={onToggle}
          accessibilityLabel={title}
        />
      </View>
      <Text
        variant="hint"
        style={{ marginTop: 4 }}
      >
        {hint}
      </Text>
      {children !== undefined && (
        <Collapse open={on}>
          <View style={{ paddingTop: 12, gap: 8 }}>{children}</View>
        </Collapse>
      )}
    </Card>
  );
}
