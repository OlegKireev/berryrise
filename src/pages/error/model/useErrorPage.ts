import { useEffect } from 'react';

import { logError } from '@/shared/lib';

// Ошибка рендера - в журнал, один раз на каждую новую ошибку
export function useErrorPage(error: Error) {
  useEffect(() => {
    logError('render', error);
  }, [error]);
}
