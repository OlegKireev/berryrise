import { hardships, moods, places } from '@/shared/config';
import {
  Button,
  Choices,
  DateTimeField,
  Input,
  Screen,
  Text,
} from '@/shared/ui';

import { useRelapse } from '../model/useRelapse';

import { t } from '../i18n';

export function RelapsePage() {
  const form = useRelapse();

  if (!form) {
    return null;
  }

  return (
    <Screen>
      <Text>{t('relapseSupport')}</Text>

      <Text variant="label">{t('relapseWhen')}</Text>
      <DateTimeField
        value={form.at ?? new Date()}
        onChange={form.setAt}
        min={new Date(form.startAt)}
        max={new Date()}
      />

      <Text
        variant="heading"
        style={{ marginTop: 8 }}
      >
        {t('relapseReview')}
      </Text>
      <Choices
        title={t('option.titles.mood')}
        keys={moods}
        label={(m) => t(`option.mood.${m}`)}
        isSelected={(m) => form.mood === m}
        onPress={form.toggleMood}
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

      <Input
        value={form.note}
        onChangeText={form.setNote}
        placeholder={t('note')}
        multiline
      />

      <Button
        variant="primary"
        title={t('save')}
        disabled={form.saving}
        onPress={form.save}
      />
    </Screen>
  );
}
