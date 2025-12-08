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

import FormUserCreate from '@/components/dashboard/admin/form-user-create';
import { EVENTS } from '@/constants/events';

import type { FC } from 'react';

const { DIALOG_USER_CREATE_OPEN } = EVENTS;

const DialogUserCreate: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener(DIALOG_USER_CREATE_OPEN, handleOpen as EventListener);

    return () => window.removeEventListener(DIALOG_USER_CREATE_OPEN, handleOpen as EventListener);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account with email, name, and permissions.
          </DialogDescription>
        </DialogHeader>

        <FormUserCreate onSuccess={close} onCancel={close} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogUserCreate;

export const DialogUserCreateButton: FC = () => {
  const openDialogUserCreate = () => {
    const openEvent = new CustomEvent(DIALOG_USER_CREATE_OPEN);
    window.dispatchEvent(openEvent);
  };

  return (
    <Button onClick={openDialogUserCreate} className="flex items-center space-x-2">
      <Plus className="h-4 w-4" />
      <span>Create User</span>
    </Button>
  );
};
