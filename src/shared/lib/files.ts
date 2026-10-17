// Отдать файл наружу: "Сохранить как" на телефон или системное "Поделиться".
// Тосты и алерты у вызывающих: тексты лежат в их словарях
import {
  errorCodes,
  isErrorWithCode,
  saveDocuments,
} from '@react-native-documents/picker';
import * as Sharing from 'expo-sharing';

type FileToSave = { uri: string; name: string; mime: string };

// Системный диалог "Сохранить как": в нем можно выбрать и Download, и корень памяти
// (выбор папки туда не пускает). В отличие от "Поделиться", результат известен точно.
// Имя сохраненного файла, null - диалог закрыли; ошибка записи бросается
export async function saveFile({ uri, name, mime }: FileToSave) {
  try {
    const [res] = await saveDocuments({
      sourceUris: [uri],
      mimeType: mime,
      fileName: name,
    });

    if (res.error) {
      throw new Error(res.error);
    }

    return res.name ?? name;
  } catch (e) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
      return null;
    }

    throw e;
  }
}

// Закрыть меню - не ошибка: на Android shareAsync завершается одинаково, отправили файл или нет
export async function shareFile(uri: string, mime: string) {
  await Sharing.shareAsync(uri, { mimeType: mime });
}
