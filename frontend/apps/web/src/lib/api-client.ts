import { createClient, createConfig } from '@/client/client';
import * as sdk from '@/client/sdk.gen';
import { PROCESS_ENV } from '@/config/process-env';

import type { ClientOptions } from '@/client/types.gen';

export default class ApiClient {
  // Note: Used this just to set API_URL
  private static client = createClient(
    createConfig<ClientOptions>({ baseURL: PROCESS_ENV.NEXT_PUBLIC_API_URL })
  );

  // --- Auth ---
  static loginLoginAccessToken<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.loginLoginAccessToken<ThrowOnError>>[0]
  ) {
    return sdk.loginLoginAccessToken({ ...options, client: this.client });
  }

  // --- Users ---
  static usersReadUsers<ThrowOnError extends boolean = false>(
    options?: Parameters<typeof sdk.usersReadUsers<ThrowOnError>>[0]
  ) {
    return sdk.usersReadUsers({ ...options, client: this.client });
  }

  static usersReadUserMe<ThrowOnError extends boolean = false>(
    options?: Parameters<typeof sdk.usersReadUserMe<ThrowOnError>>[0]
  ) {
    return sdk.usersReadUserMe({ ...options, client: this.client });
  }

  static usersCreateUser<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersCreateUser<ThrowOnError>>[0]
  ) {
    return sdk.usersCreateUser({ ...options, client: this.client });
  }

  static usersUpdateUser<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersUpdateUser<ThrowOnError>>[0]
  ) {
    return sdk.usersUpdateUser({ ...options, client: this.client });
  }

  static usersDeleteUser<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersDeleteUser<ThrowOnError>>[0]
  ) {
    return sdk.usersDeleteUser({ ...options, client: this.client });
  }

  static usersReadUserById<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersReadUserById<ThrowOnError>>[0]
  ) {
    return sdk.usersReadUserById({ ...options, client: this.client });
  }

  static usersUpdateUserMe<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersUpdateUserMe<ThrowOnError>>[0]
  ) {
    return sdk.usersUpdateUserMe({ ...options, client: this.client });
  }

  static usersUpdatePasswordMe<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.usersUpdatePasswordMe<ThrowOnError>>[0]
  ) {
    return sdk.usersUpdatePasswordMe({ ...options, client: this.client });
  }

  static usersDeleteUserMe<ThrowOnError extends boolean = false>(
    options?: Parameters<typeof sdk.usersDeleteUserMe<ThrowOnError>>[0]
  ) {
    return sdk.usersDeleteUserMe({ ...options, client: this.client });
  }

  // --- Items ---
  static itemsReadItems<ThrowOnError extends boolean = false>(
    options?: Parameters<typeof sdk.itemsReadItems<ThrowOnError>>[0]
  ) {
    return sdk.itemsReadItems({ ...options, client: this.client });
  }

  static itemsCreateItem<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.itemsCreateItem<ThrowOnError>>[0]
  ) {
    return sdk.itemsCreateItem({ ...options, client: this.client });
  }

  static itemsUpdateItem<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.itemsUpdateItem<ThrowOnError>>[0]
  ) {
    return sdk.itemsUpdateItem({ ...options, client: this.client });
  }

  static itemsDeleteItem<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.itemsDeleteItem<ThrowOnError>>[0]
  ) {
    return sdk.itemsDeleteItem({ ...options, client: this.client });
  }

  static itemsReadItem<ThrowOnError extends boolean = false>(
    options: Parameters<typeof sdk.itemsReadItem<ThrowOnError>>[0]
  ) {
    return sdk.itemsReadItem({ ...options, client: this.client });
  }

  // --- Utils ---
  static utilsHealthCheck<ThrowOnError extends boolean = false>(
    options?: Parameters<typeof sdk.utilsHealthCheck<ThrowOnError>>[0]
  ) {
    return sdk.utilsHealthCheck({ ...options, client: this.client });
  }
}

// Re-export types
export * from '@/client/types.gen';
