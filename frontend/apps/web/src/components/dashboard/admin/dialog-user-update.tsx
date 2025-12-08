'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/ui/dialog';

import FormUserUpdate from '@/components/dashboard/admin/form-user-update';
import { EVENTS } from '@/constants/events';

import type { UserPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { DIALOG_USER_UPDATE_OPEN } = EVENTS;

const DialogUserUpdate: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserPublic | null>(null);

  useEffect(() => {
    const handleOpen = (event: CustomEvent<UserPublic>) => {
      setUser(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(DIALOG_USER_UPDATE_OPEN, handleOpen as EventListener);

    return () => window.removeEventListener(DIALOG_USER_UPDATE_OPEN, handleOpen as EventListener);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the user&apos;s information and permissions.</DialogDescription>
        </DialogHeader>
        {user && <FormUserUpdate user={user} onSuccess={close} onCancel={close} />}
      </DialogContent>
    </Dialog>
  );
};

export default DialogUserUpdate;
