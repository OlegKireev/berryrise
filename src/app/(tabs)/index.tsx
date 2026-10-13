import { Placeholder } from '../../components/Placeholder';
import { t } from '../../i18n';

export default function Today() {
  return (
    <Placeholder
      title={t('today')}
      links={[
        { href: '/company', label: t('company') },
        { href: '/checkin', label: t('checkin') },
        { href: '/relapse', label: t('relapse') },
      ]}
    />
  );
}
