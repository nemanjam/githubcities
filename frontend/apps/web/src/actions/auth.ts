'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginService, UsersService } from '@/client/sdk.gen';
import { forwardCookiesFromResponse } from '@/utils/actions';
import { AUTH_COOKIE } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';

import type { BodyLoginLoginAccessToken, UserRegister } from '@/client/types.gen';
import type { ApiResult } from '@/types/api';

const { LOGIN } = ROUTES;

/**
 * Reuses FastApi types from client. Just forwards, doesn't validate.
 */
export const loginAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const body = Object.fromEntries(formData) as BodyLoginLoginAccessToken;
  const apiResponse = await LoginService.loginAccessToken({ body });

  const { response, ...result } = apiResponse;
  await forwardCookiesFromResponse(response);

  return result;
};

export const registerAction = async (
  _prevState: ApiResult,
  formData: FormData
): Promise<ApiResult> => {
  const body = Object.fromEntries(formData) as UserRegister;

  const apiResponse = await UsersService.registerUser({ body });

  const { response: _, ...result } = apiResponse;

  return result;
};

export const logoutAction = async (): Promise<void> => {
  const cookiesList = await cookies();
  cookiesList.delete(AUTH_COOKIE);

  redirect(LOGIN);
};
