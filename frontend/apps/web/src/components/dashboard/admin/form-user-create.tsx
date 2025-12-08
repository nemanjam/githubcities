'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert';
import { Button } from '@workspace/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/ui/form';
import { Input } from '@workspace/ui/components/ui/input';
import { Label } from '@workspace/ui/components/ui/label';
import { Switch } from '@workspace/ui/components/ui/switch';

import { userCreateAction } from '@/actions/user';
import { userCreateSchema } from '@/schemas/forms';
import { isErrorApiResult, isSuccessApiResult } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/error';

import type { UserCreateFormValues } from '@/types/forms';
import type { FC, FormEvent } from 'react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultValues: UserCreateFormValues = {
  email: '',
  full_name: '',
  password: '',
  is_superuser: false,
} as const;

const resolver = zodResolver(userCreateSchema);

const FormUserCreate: FC<Props> = ({ onSuccess, onCancel }) => {
  const initialState = { data: undefined };
  const [state, formAction, isPending] = useActionState(userCreateAction, initialState);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserCreateFormValues>({ resolver, defaultValues });

  const isSuccess = isSuccessApiResult(state);

  useEffect(() => {
    if (isSuccess) onSuccess?.();
  }, [isSuccess, onSuccess]);

  const isError = isErrorApiResult(state);

  const validateAndSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.handleSubmit(() => {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      startTransition(() => {
        formAction(formData);
        form.reset();
      });
    })(event);
  };

  return (
    <Form {...form}>
      <form action={formAction} onSubmit={validateAndSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter user email..." disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter user full name..." disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter user password..."
                    disabled={isPending}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_superuser"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                  <input type="hidden" name={field.name} value={field.value ? 'on' : ''} />
                </div>
              </FormControl>
              <Label>Administrator privileges</Label>
            </FormItem>
          )}
        />

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>{getApiErrorMessage(state.error)}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormUserCreate;
