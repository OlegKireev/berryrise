import type { Relapse } from '@/entities/relapse';
import { DeleteRelapseButton } from '@/features/delete-relapse';
import { formatDateTime } from '@/shared/i18n';
import { Row, Text } from '@/shared/ui';

import { t } from '../i18n';

type Props = {
  relapses: Pick<Relapse, 'id' | 'at'>[];
  onDeleted: () => void;
};

export function Relapses({ relapses, onDeleted }: Props) {
  return (
    <>
      <Text variant="heading">{t('relapses')}</Text>
      {relapses.length === 0 && <Text variant="hint">{t('noRelapses')}</Text>}
      {relapses.map((r) => (
        <Row
          key={r.id}
          label={formatDateTime(r.at)}
        >
          <DeleteRelapseButton
            id={r.id}
            onDeleted={onDeleted}
          />
        </Row>
      ))}
    </>
  );
}
