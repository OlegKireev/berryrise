import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import { addReasons, type NewReason, type Reason } from '@/entities/reason';
import { toggle } from '@/shared/lib';

export function useReasonsStep() {
  const db = useSQLiteContext();

  // Готовые в порядке выбора
  const [keys, setKeys] = useState<Reason[]>([]);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);

  const text = custom.trim();

  const submit = async () => {
    setSaving(true);
    const items: NewReason[] = keys.map((key) => ({ key }));
    if (text) items.push({ customText: text });
    await addReasons(db, items);
    router.replace('/onboarding/notifications');
  };

  return {
    keys,
    toggleKey: (k: Reason) => setKeys(toggle(keys, k)),
    custom,
    setCustom,
    saving,
    canSubmit: !saving && (keys.length > 0 || text !== ''),
    submit,
  };
}
