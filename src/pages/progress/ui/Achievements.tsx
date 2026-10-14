import { achievementKeys, type AchievementKey } from '@/entities/habit';
import { formatDay } from '@/shared/i18n';
import { Row, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  got: Record<AchievementKey, string | null>;
  gotCount: number;
};

// Все ачивки, неполученные бледные
export function Achievements({ got, gotCount }: Props) {
  return (
    <>
      <Text variant="heading">{t('achievementsTitle')}</Text>
      <Text variant="hint">
        {t('achievementsGot')} {gotCount} {t('of')} {achievementKeys.length}
      </Text>
      {achievementKeys.map((k) => (
        <Row
          key={k}
          label={t(`habit.achievements.${k}`)}
          style={{ opacity: got[k] ? 1 : 0.35 }}
        >
          {got[k] && <Text>{formatDay(got[k])}</Text>}
        </Row>
      ))}
    </>
  );
}
