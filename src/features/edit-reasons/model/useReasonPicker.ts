import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';

import {
  addReason,
  deleteReason,
  listCustomReasons,
  listReasons,
  saveCustomReasons,
  type NewReason,
  type Reason,
} from '@/entities/reason';
import { logError, toggle } from '@/shared/lib';

type State = {
  // Выбранные готовые и свои
  keys: Reason[];
  customs: string[];
  // Все свои формулировки, в том числе невыбранные
  library: string[];
};

// Выбор причин. Экран меняется сразу, записи в базу идут по очереди. null - еще грузим
export function useReasonPicker() {
  const db = useSQLiteContext();
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const [state, setState] = useState<State | null>(null);
  const [text, setText] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [rows, saved] = await Promise.all([
          listReasons(db),
          listCustomReasons(db),
        ]);
        const customs = rows.flatMap((r) => r.customText ?? []);
        setState({
          keys: rows.flatMap((r) => r.key ?? []),
          customs,
          // Свои, введенные до списка в settings, тоже показываем
          library: [...saved, ...customs.filter((c) => !saved.includes(c))],
        });
      })();
    }, [db]),
  );

  if (!state) {
    return null;
  }

  const write = (...ops: (() => Promise<unknown>)[]) => {
    for (const op of ops) {
      queue.current = queue.current
        .then(op)
        .catch((e: unknown) => logError('reasons', e));
    }
  };

  // Включает или выключает причину, выбранная встает в конец
  const select = (item: NewReason, on: boolean) =>
    on ? () => addReason(db, item) : () => deleteReason(db, item);

  const toggleKey = (k: Reason) => {
    const on = !state.keys.includes(k);
    setState({ ...state, keys: toggle(state.keys, k) });
    write(select({ key: k }, on));
  };

  const toggleCustom = (c: string) => {
    const on = !state.customs.includes(c);
    setState({ ...state, customs: toggle(state.customs, c) });
    write(select({ customText: c }, on));
  };

  const trimmed = text.trim();

  return {
    ...state,
    count: state.keys.length + state.customs.length,
    toggleKey,
    toggleCustom,
    text,
    setText,
    canAdd: trimmed !== '',
    // Такая своя уже есть - просто выбираем ее
    add: () => {
      const library = toggle(state.library, trimmed, true);
      const on = !state.customs.includes(trimmed);
      setState({
        ...state,
        library,
        customs: toggle(state.customs, trimmed, true),
      });
      write(
        () => saveCustomReasons(db, library),
        ...(on ? [select({ customText: trimmed }, true)] : []),
      );
      setText('');
    },
    // Снимает весь выбор, свои формулировки остаются в списке
    clear: () => {
      setState({ ...state, keys: [], customs: [] });
      write(
        ...state.keys.map((k) => select({ key: k }, false)),
        ...state.customs.map((c) => select({ customText: c }, false)),
      );
    },
    // Убирает свою совсем, вместе с выбором
    forget: (c: string) => {
      const library = state.library.filter((x) => x !== c);
      setState({
        ...state,
        library,
        customs: state.customs.filter((x) => x !== c),
      });
      write(
        () => saveCustomReasons(db, library),
        select({ customText: c }, false),
      );
    },
  };
}

export type ReasonPickerState = NonNullable<ReturnType<typeof useReasonPicker>>;
