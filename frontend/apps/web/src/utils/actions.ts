import { cookies } from 'next/headers';

import setCookieParser from 'set-cookie-parser';

/**
 * Forwards all cookies from a backend Response object to the server action response.
 */
export const forwardCookiesFromResponse = async (response: Response): Promise<void> => {
  const rawCookies = response.headers.get('set-cookie');
  if (!rawCookies) return;

  const parsed = setCookieParser.parse(rawCookies);
  const cookieStore = await cookies();

  // Todo: set correct host for forwarded cookie, for CORS permissions

  for (const c of parsed) {
    cookieStore.set({
      name: c.name,
      value: c.value,
      httpOnly: c.httpOnly,
      secure: c.secure,
      path: c.path ?? '/',
      sameSite: c.sameSite as any,
      expires: c.expires,
    });
  }
};
