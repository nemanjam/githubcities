'use client';

import { startTransition, useActionState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

import { userUpdateAction } from '@/actions/user';
import { userUpdateSchema } from '@/schemas/forms';
import { isErrorApiResult, isSuccessApiResult } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/error';

import type { UserPublic } from '@/client/types.gen';
import type { UserUpdateFormValues } from '@/types/forms';
import type { FC, FormEvent } from 'react';

interface Props {
  user: UserPublic;
  onSuccess: () => void;
  onCancel: () => void;
}

const resolver = zodResolver(userUpdateSchema);

const FormUserUpdate: FC<Props> = ({ user, onSuccess, onCancel }) => {
  const initialState = { data: undefined };
  const [state, formAction, isPending] = useActionState(userUpdateAction, initialState);

  const defaultValues: UserUpdateFormValues = {
    user_id: user.id,
    email: user.email,
    full_name: user.full_name ?? '',
    is_superuser: user.is_superuser,
  } as const;

  const form = useForm<UserUpdateFormValues>({ resolver, defaultValues });

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

      startTransition(() => formAction(formData));
    })(event);
  };

  return (
    <Form {...form}>
      <form action={formAction} onSubmit={validateAndSubmit} className="space-y-6">
        <input type="hidden" {...form.register('user_id')} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
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
                <Input {...field} disabled={isPending} />
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
                  {/* Hidden input so FormData sees the value */}
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
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormUserUpdate;
