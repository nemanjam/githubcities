'use client';

import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@workspace/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/ui/dialog';

import FormItemCreate from '@/components/dashboard/items/form-item-create';
import { EVENTS } from '@/constants/events';

import type { FC } from 'react';

const { DIALOG_ITEM_CREATE_OPEN } = EVENTS;

const DialogItemCreate: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener(DIALOG_ITEM_CREATE_OPEN, handleOpen as EventListener);

    return () => window.removeEventListener(DIALOG_ITEM_CREATE_OPEN, handleOpen as EventListener);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>
            Create a new item with a title and optional description.
          </DialogDescription>
        </DialogHeader>

        <FormItemCreate onSuccess={close} onCancel={close} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogItemCreate;

export const DialogItemCreateButton: FC = () => {
  const openDialogItemCreate = () => {
    const openEvent = new CustomEvent(DIALOG_ITEM_CREATE_OPEN);
    window.dispatchEvent(openEvent);
  };

  return (
    <Button onClick={openDialogItemCreate} className="flex items-center space-x-2">
      <Plus className="h-4 w-4" />
      <span>Create Item</span>
    </Button>
  );
};
