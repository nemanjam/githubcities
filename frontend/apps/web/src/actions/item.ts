'use server';

import { revalidatePath } from 'next/cache';

import { ItemsService } from '@/client/sdk.gen';
import { ROUTES } from '@/constants/routes';

import type { ItemCreate, ItemUpdate } from '@/client/types.gen';
import type { ApiResult } from '@/types/api';

const { ITEMS } = ROUTES;

export const itemDeleteAction = async (itemId: string): Promise<ApiResult> => {
  const apiResponse = await ItemsService.deleteItem({
    path: {
      id: itemId,
    },
  });
  const { response: _, ...result } = apiResponse;

  revalidatePath(ITEMS);

  return result;
};

export const itemUpdateAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const id = formData.get('id') as string;
  const body = Object.fromEntries(formData) as ItemUpdate;

  const apiResponse = await ItemsService.updateItem({
    path: { id },
    body,
  });

  const { response: _, ...result } = apiResponse;

  revalidatePath(ITEMS);

  return result;
};

export const itemCreateAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const body = Object.fromEntries(formData) as ItemCreate;

  const apiResponse = await ItemsService.createItem({ body });

  const { response: _, ...result } = apiResponse;

  revalidatePath(ITEMS);

  return result;
};
