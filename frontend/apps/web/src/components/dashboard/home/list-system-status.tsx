import { Settings } from 'lucide-react';

import List from '@workspace/ui/components/list';

import { ItemsService, UsersService, UtilsService } from '@/client/sdk.gen';
import { throwIfApiError } from '@/utils/error';

import type { FC } from 'react';

const ListSystemStatus: FC = async () => {
  const [systemResult, usersResult, itemsResult] = await Promise.all([
    UtilsService.healthCheck(),
    UsersService.readUsers(),
    ItemsService.readItems(),
  ]);

  throwIfApiError(systemResult);
  throwIfApiError(usersResult);
  throwIfApiError(itemsResult);

  const systemHealth = systemResult.data ?? false;
  const usersCount = usersResult.data?.count ?? 0;
  const itemsCount = itemsResult.data?.count ?? 0;

  return (
    <List
      title="System Status"
      icon={Settings}
      // Todo: fix this hardcoded array
      items={[
        {
          icon: (
            <>
              {systemHealth ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </>
          ),
          content: (
            <span className="text-sm font-medium text-gray-900 dark:text-white">API Server</span>
          ),
          status: (
            <div className="text-right">
              <div className={`text-sm ${systemHealth ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth ? 'Online' : 'Offline'}
              </div>
              <div className="text-xs text-gray-400">
                {systemHealth ? 'Responding' : 'Not responding'}
              </div>
            </div>
          ),
        },
        {
          icon: <div className="w-3 h-3 bg-green-500 rounded-full"></div>,
          content: (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Authentication
            </span>
          ),
          status: (
            <div className="text-right">
              <div className="text-sm text-green-600">Active</div>
              <div className="text-xs text-gray-400">Token valid</div>
            </div>
          ),
        },
        {
          icon: <div className="w-3 h-3 bg-blue-500 rounded-full"></div>,
          content: (
            <span className="text-sm font-medium text-gray-900 dark:text-white">Data Loading</span>
          ),
          status: (
            <div className="text-right">
              <div className="text-sm text-blue-600">Complete</div>
              <div className="text-xs text-gray-400">
                {usersCount} users, {itemsCount} items
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ListSystemStatus;
