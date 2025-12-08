'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/ui/dialog';

import FormItemUpdate from '@/components/dashboard/items/form-item-update';
import { EVENTS } from '@/constants/events';

import type { ItemPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { DIALOG_ITEM_UPDATE_OPEN } = EVENTS;

const DialogItemUpdate: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<ItemPublic | null>(null);

  useEffect(() => {
    const handleOpen = (event: CustomEvent<ItemPublic>) => {
      setItem(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(DIALOG_ITEM_UPDATE_OPEN, handleOpen as EventListener);

    return () => window.removeEventListener(DIALOG_ITEM_UPDATE_OPEN, handleOpen as EventListener);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update the item&apos;s title and description.</DialogDescription>
        </DialogHeader>
        {item && <FormItemUpdate item={item} onSuccess={close} onCancel={close} />}
      </DialogContent>
    </Dialog>
  );
};

export default DialogItemUpdate;
