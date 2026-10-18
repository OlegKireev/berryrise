import { cutoffTime } from '@/entities/day-review';
import { cravings, hardships, helpers, moods } from '@/shared/config';
import { formatDay } from '@/shared/i18n';
import { Choices, Collapse, Input, Screen, Text } from '@/shared/ui';

import { useDayReview } from '../model/useDayReview';

import { t } from '../i18n';

import { SaveButton } from './SaveButton';
import { View } from 'react-native';

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
      <Collapse open={form.showHelpers}>
        <Choices
          title={t('option.titles.helper')}
          keys={helpers}
          label={(h) => t(`option.helper.${h}`)}
          isSelected={(h) => form.helpers.includes(h)}
          onPress={form.toggleHelper}
        />
      </Collapse>
      <Choices
        title={t('option.titles.hardship')}
        keys={hardships}
        label={(h) => t(`option.hardship.${h}`)}
        isSelected={(h) => form.hardships.includes(h)}
        onPress={form.toggleHardship}
      />

      <View>
        <Text
          variant="label"
          style={{ marginBottom: 6 }}
        >
          {t('note')}
        </Text>
        <Input
          value={form.note}
          onChangeText={form.setNote}
          placeholder={t('notePlaceholder')}
          multiline
        />
      </View>
    </Screen>
  );
}
