export const isServer = (): boolean => typeof window === 'undefined';

export const isClient = (): boolean => !isServer();
