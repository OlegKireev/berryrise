import { formatMonth } from '@/shared/i18n';
import { Card, Screen } from '@/shared/ui';

import { CollectingData } from './CollectingData';
import { CompanyInsights } from './CompanyInsights';
import { CravingChart } from './CravingChart';
import { MoodChart } from './MoodChart';
import { PeriodNav } from './PeriodNav';
import { RelapseInsights } from './RelapseInsights';
import { TopList } from './TopList';

import { useInsights } from '../model/useInsights';

import { t } from '../i18n';

// Статистика за период: блоки из итогов дня после 7 итогов, срывы и компания - если были
export function InsightsPage() {
  const data = useInsights();

  if (!data) {
    return null;
  }

  const { period } = data;

  return (
    <Screen>
      <PeriodNav
        label={
          period.kind === 'last30'
            ? t('last30')
            : formatMonth(period.year, period.month)
        }
        prevLabel={t('prevPeriod')}
        nextLabel={t('nextPeriod')}
        canPrev={data.canPrev}
        canNext={data.canNext}
        prev={data.prev}
        next={data.next}
      />
      {data.enough ? (
        <>
          <Card>
            <CravingChart values={data.cravingByWeekday} />
          </Card>
          <Card>
            <MoodChart counts={data.moodCounts} />
          </Card>
          <Card>
            <TopList
              title={t('option.titles.hardship')}
              items={data.hardships}
              total={data.reviewCount}
              label={(k) => t(`option.hardship.${k}`)}
            />
          </Card>
          <Card>
            <TopList
              title={t('option.titles.helper')}
              items={data.helpers}
              total={data.reviewCount}
              label={(k) => t(`option.helper.${k}`)}
            />
          </Card>
        </>
      ) : (
        <Card>
          <CollectingData count={data.reviewCount} />
        </Card>
      )}
      {data.relapses && (
        <Card>
          <RelapseInsights {...data.relapses} />
        </Card>
      )}
      {data.company && (
        <Card>
          <CompanyInsights {...data.company} />
        </Card>
      )}
    </Screen>
  );
}
