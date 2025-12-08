import { isErrorApiResult } from '@/utils/api';
import { API_ERROR_MESSAGE } from '@/constants/error';

import type { ApiResult } from '@/types/api';

export const getApiErrorMessage = (error: unknown): string => {
  // Default error message
  let errorMessage: string = API_ERROR_MESSAGE._500;

  const detail = (error as any)?.detail;

  // detail is array
  if (Array.isArray(detail) && detail.length > 0 && typeof detail[0].msg === 'string')
    errorMessage = detail[0].msg;

  // detail is string
  if (typeof detail === 'string') errorMessage = detail;

  return errorMessage;
};

export const throwIfApiError = (result: ApiResult): void => {
  const isError = isErrorApiResult(result);
  if (isError) throw new Error(getApiErrorMessage(result.error));
};
