'use server';

import { revalidatePath } from 'next/cache';

import { UsersService } from '@/client/sdk.gen';
import { ROUTES } from '@/constants/routes';

import type { UserCreate, UserUpdate } from '@/client/types.gen';
import type { ApiResult } from '@/types/api';

const { ADMIN } = ROUTES;

export const userDeleteAction = async (userId: string): Promise<ApiResult> => {
  const apiResponse = await UsersService.deleteUser({
    path: {
      user_id: userId,
    },
  });
  const { response: _, ...result } = apiResponse;

  revalidatePath(ADMIN);

  return result;
};

export const userUpdateAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const user_id = formData.get('user_id') as string;
  const bodyRaw = Object.fromEntries(formData) as Record<string, string>;

  const body = {
    ...bodyRaw,
    // convert 'on' = true, '' = false
    // must have <input type="hidden" ...> for Switch
    is_superuser: bodyRaw.is_superuser === 'on',
  } as UserUpdate;

  const apiResponse = await UsersService.updateUser({
    path: { user_id },
    body,
  });

  const { response: _, ...result } = apiResponse;

  revalidatePath(ADMIN);

  return result;
};

export const userCreateAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const bodyRaw = Object.fromEntries(formData) as Record<string, string>;

  const body = {
    ...bodyRaw,
    is_superuser: bodyRaw.is_superuser === 'on',
  } as UserCreate;

  const apiResponse = await UsersService.createUser({
    body,
  });

  const { response: _, ...result } = apiResponse;

  revalidatePath(ADMIN);

  return result;
};
