import { partyDict } from '@/entities/party';
import { replyDict } from '@/entities/reply';
import { createT } from '@/shared/i18n';

export const t = createT(
  {
    ru: {
      partyEnd: 'Примерно до',
      partyDrinkTitle: 'Что пью вместо алкоголя',
      partyDrinkCustom: 'Свой напиток',
      deleteDrinkTitle: 'Убрать напиток из списка?',
      deleteDrinkHint: 'Свой напиток можно убрать долгим нажатием.',
      repliesTitle: 'Если спросят, почему не пьешь',
      customReply: 'Свой ответ',
      leaveEarly:
        'Можно просто уйти, это нормально. Никто не обязан сидеть до конца.',
    },
    en: {
      partyEnd: 'Until about',
      partyDrinkTitle: "What I'm drinking instead",
      partyDrinkCustom: 'Other drink',
      deleteDrinkTitle: 'Remove this drink from the list?',
      deleteDrinkHint: 'Long-press your own drink to remove it.',
      repliesTitle: "If they ask why you're not drinking",
      customReply: 'Your own answer',
      leaveEarly:
        "You can just leave, that's okay. Nobody has to stay till the end.",
    },
  },
  { party: partyDict, reply: replyDict },
);
