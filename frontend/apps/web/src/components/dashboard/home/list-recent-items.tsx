import { Package } from 'lucide-react';

import List from '@workspace/ui/components/list';

import { ItemsService } from '@/client/sdk.gen';
import { throwIfApiError } from '@/utils/error';

import type { FC } from 'react';

const ListRecentItems: FC = async () => {
  const result = await ItemsService.readItems();

  throwIfApiError(result);

  const items = result.data?.data ?? [];

  return (
    <List
      title="Recent Items"
      icon={Package}
      items={items.map((item) => ({
        icon: (
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
        ),
        content: (
          <>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {item.description || 'No description'}
            </p>
          </>
        ),
        status: <div className="text-xs text-gray-400 flex-1 truncate">ID: {item.id}</div>,
      }))}
    />
  );
};

export default ListRecentItems;
