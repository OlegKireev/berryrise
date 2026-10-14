import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import {
  addReply,
  deleteReply,
  listReplies,
  type ReplyRow,
} from '@/entities/reply';

// Свои ответы на "почему не пьешь"
export function useReplies() {
  const db = useSQLiteContext();

  const [list, setList] = useState<ReplyRow[]>([]);
  const [text, setText] = useState('');

  const load = useCallback(() => {
    listReplies(db).then(setList);
  }, [db]);

  useEffect(load, [load]);

  return {
    list,
    text,
    setText,
    canAdd: text.trim() !== '',
    add: async () => {
      await addReply(db, text.trim());
      setText('');
      load();
    },
    remove: (id: string) => deleteReply(db, id).then(load),
  };
}
