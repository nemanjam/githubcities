import { z } from 'zod';

import {
  itemCreateSchema,
  itemUpdateSchema,
  loginFormSchema,
  profilePasswordUpdateSchema,
  profileUpdateSchema,
  registerFormSchema,
  userCreateSchema,
  userUpdateSchema,
} from '@/schemas/forms';

// login
export type LoginFormValues = z.output<typeof loginFormSchema>;
export type LoginFormKeys = keyof LoginFormValues;

// register
export type RegisterFormValues = z.output<typeof registerFormSchema>;
export type RegisterFormKeys = keyof RegisterFormValues;

// user
export type UserUpdateFormValues = z.output<typeof userUpdateSchema>;
export type UserUpdateFormKeys = keyof UserUpdateFormValues;

export type UserCreateFormValues = z.output<typeof userCreateSchema>;
export type UserCreateFormKeys = keyof UserCreateFormValues;

// profile
export type ProfileUpdateFormValues = z.output<typeof profileUpdateSchema>;
export type ProfileUpdateFormKeys = keyof ProfileUpdateFormValues;

export type ProfilePasswordUpdateFormValues = z.output<typeof profilePasswordUpdateSchema>;
export type ProfilePasswordUpdateFormKeys = keyof ProfilePasswordUpdateFormValues;

// item
export type ItemUpdateFormValues = z.output<typeof itemUpdateSchema>;
export type ItemUpdateFormKeys = keyof ItemUpdateFormValues;

export type ItemCreateFormValues = z.output<typeof itemCreateSchema>;
export type ItemCreateFormKeys = keyof ItemCreateFormValues;
