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

import { itemDeleteAction } from '@/actions/item';
import { EVENTS } from '@/constants/events';

import type { ItemPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { DIALOG_ITEM_UPDATE_OPEN } = EVENTS;

interface Props {
  item: ItemPublic;
}

const DropdownItem: FC<Props> = ({ item }) => {
  const [isPending, startTransition] = useTransition();

  const openDialogItemUpdate = (user: ItemPublic) => {
    const openEvent = new CustomEvent(DIALOG_ITEM_UPDATE_OPEN, { detail: user });
    window.dispatchEvent(openEvent);
  };

  const handleDeleteItem = (userId: string) => {
    startTransition(() => {
      itemDeleteAction(userId);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openDialogItemUpdate(item)} disabled={isPending}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDeleteItem(item.id)}
          disabled={isPending}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownItem;
