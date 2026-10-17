import { cutoffTime } from '@/entities/day-review';
import { ReasonList } from '@/entities/reason';
import { cravings, hardships, helpers, moods, places } from '@/shared/config';
import { formatDay } from '@/shared/i18n';
import { Choices, Input, Screen, Text } from '@/shared/ui';

import { useDayReview } from '../model/useDayReview';

import { t } from '../i18n';

import { SaveButton } from './SaveButton';

export function DayReviewPage() {
  const form = useDayReview();

  if (!form) {
    return null;
  }

  if (form.beforeStart) {
    return (
      <Screen>
        <Text>
          {t('review.later')} {cutoffTime}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <SaveButton
          disabled={!form.canSave}
          done={form.done}
          onPress={form.save}
        />
      }
    >
      <Text variant="title">
        {form.when === 'today'
          ? `${t('forToday')}, ${formatDay(form.day)}`
          : form.when === 'yesterday'
            ? `${t('forYesterday')}, ${formatDay(form.day)}`
            : `${t('forDay')} ${formatDay(form.day)}`}
      </Text>

      <ReasonList reasons={form.reasons} />

      <Choices
        title={t('option.titles.mood')}
        keys={moods}
        label={(m) => t(`option.mood.${m}`)}
        isSelected={(m) => form.mood === m}
        onPress={form.setMood}
      />
      <Choices
        title={t('option.titles.craving')}
        keys={cravings}
        label={(c) => t(`option.craving.${c}`)}
        isSelected={(c) => form.craving === c}
        onPress={form.setCraving}
      />
      <Choices
        title={t('option.titles.place')}
        keys={places}
        label={(p) => t(`option.place.${p}`)}
        isSelected={(p) => form.places.includes(p)}
        onPress={form.togglePlace}
      />
      <Choices
        title={t('option.titles.hardship')}
        keys={hardships}
        label={(h) => t(`option.hardship.${h}`)}
        isSelected={(h) => form.hardships.includes(h)}
        onPress={form.toggleHardship}
      />
      <Choices
        title={t('option.titles.helper')}
        keys={helpers}
        label={(h) => t(`option.helper.${h}`)}
        isSelected={(h) => form.helpers.includes(h)}
        onPress={form.toggleHelper}
      />

      <Input
        value={form.note}
        onChangeText={form.setNote}
        placeholder={t('note')}
        multiline
      />
    </Screen>
  );
}
