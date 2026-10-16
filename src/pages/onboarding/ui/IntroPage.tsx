import { Animated, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImportButton } from '@/features/backup';
import { Button, Row, Screen, Text } from '@/shared/ui';

import { useIntroEntrance } from '../model/useIntroEntrance';
import { useRestore } from '../model/useRestore';

import { t } from '../i18n';

const icon = require('../../../../assets/splash-icon.png');

const points = [
  { icon: 'calendarCheck', label: 'introDays' },
  { icon: 'moon', label: 'introEvenings' },
  { icon: 'lock', label: 'introPrivate' },
] as const;

export function IntroPage() {
  const { onImported } = useRestore();
  const insets = useSafeAreaInsets();
  // название, слоган и пункты появляются по очереди
  const entrance = useIntroEntrance(2 + points.length);

  return (
    <Screen
      footer={
        <>
          <Button
            variant="primary"
            title={t('introStart')}
            href="/onboarding/screening"
          />
          <ImportButton
            variant="quiet"
            title={t('restoreFromFile')}
            confirm={false}
            onImported={onImported}
          />
          <Text
            variant="hint"
            style={{ fontSize: 13, textAlign: 'center' }}
          >
            {t('disclaimer')}
          </Text>
        </>
      }
    >
      <Animated.View
        onLayout={entrance.onIconLayout}
        style={[
          { alignSelf: 'center', marginTop: insets.top },
          entrance.iconStyle,
        ]}
      >
        <Image
          source={icon}
          style={{ width: 200, height: 200 }}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      <Animated.View style={entrance.rowStyle(0)}>
        <Text
          variant="title"
          style={{ textAlign: 'center' }}
        >
          {t('introTitle')}
        </Text>
      </Animated.View>
      <Animated.View style={[{ marginBottom: 16 }, entrance.rowStyle(1)]}>
        <Text
          variant="hint"
          style={{ textAlign: 'center' }}
        >
          {t('introSlogan')}
        </Text>
      </Animated.View>
      {points.map((p, i) => (
        <Animated.View
          key={p.label}
          style={entrance.rowStyle(2 + i)}
        >
          <Row
            icon={p.icon}
            label={t(p.label)}
            style={{ paddingVertical: 4 }}
          />
        </Animated.View>
      ))}
    </Screen>
  );
}
