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

import { itemUpdateAction } from '@/actions/item';
import { itemUpdateSchema } from '@/schemas/forms';
import { isErrorApiResult, isSuccessApiResult } from '@/utils/api';
import { getApiErrorMessage } from '@/utils/error';

import type { ItemPublic } from '@/client/types.gen';
import type { ItemUpdateFormValues } from '@/types/forms';
import type { FC, FormEvent } from 'react';

interface Props {
  item: ItemPublic;
  onSuccess: () => void;
  onCancel: () => void;
}

const resolver = zodResolver(itemUpdateSchema);

const FormItemUpdate: FC<Props> = ({ item, onSuccess, onCancel }) => {
  const initialState = { data: undefined };
  const [state, formAction, isPending] = useActionState(itemUpdateAction, initialState);

  const defaultValues: ItemUpdateFormValues = {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
  } as const;

  const form = useForm<ItemUpdateFormValues>({ resolver, defaultValues });

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
        <input type="hidden" {...form.register('id')} />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
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
              'Update Item'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormItemUpdate;
