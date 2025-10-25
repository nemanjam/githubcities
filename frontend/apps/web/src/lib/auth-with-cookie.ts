/**
 * Authentication utility functions
 */

import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import ApiClient from '@/lib/api-client';
import { AUTH_COOKIE } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';

import type { Session } from '@/types/auth';

const { LOGIN } = ROUTES;

// Todo: implement for refreshing session
// export const updateSession = async (): Promise<void> => {};

export const verifySession = async (): Promise<Session | null> => {
  const requestCookies = await cookies();
  const authCookie = requestCookies.get(AUTH_COOKIE)?.value;

  try {
    // Todo: regenerate client to use cookie
    // Must not decrypt JWT, but reuse python endpoint
    const response = await ApiClient.usersReadUserMe({
      authCookie, // forward cookie from request
    });

    // Don't redirect here
    if (!response.data) return null;

    const me = response.data;

    return { isAuth: true, id: me.id, email: me.email };
  } catch (error) {
    // Todo: use proper logger
    console.error('Fetch me error:', error);
    return null;
  }
};

export const deleteSession = async (): Promise<void> => {
  const requestCookies = await cookies();
  requestCookies.delete(AUTH_COOKIE);
  redirect(LOGIN);
};
