'use client';

import { useTransition } from 'react';

import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@workspace/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/ui/dropdown-menu';

import { userDeleteAction } from '@/actions/user';
import { EVENTS } from '@/constants/events';

import type { UserPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { DIALOG_USER_UPDATE_OPEN } = EVENTS;

interface Props {
  currentUser: UserPublic | undefined;
  user: UserPublic;
}

const DropdownUser: FC<Props> = ({ currentUser, user }) => {
  const [isPending, startTransition] = useTransition();

  const openDialogUserUpdate = (user: UserPublic) => {
    const openEvent = new CustomEvent(DIALOG_USER_UPDATE_OPEN, { detail: user });
    window.dispatchEvent(openEvent);
  };

  const handleDeleteUser = (userId: string) => {
    startTransition(() => {
      userDeleteAction(userId);
    });
  };

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openDialogUserUpdate(user)} disabled={isPending}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteUser(user.id)}
          disabled={isPending || isCurrentUser}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUser;
