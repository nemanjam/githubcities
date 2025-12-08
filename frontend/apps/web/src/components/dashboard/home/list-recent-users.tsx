import { Users } from 'lucide-react';

import List from '@workspace/ui/components/list';
import { Badge } from '@workspace/ui/components/ui/badge';

import { UsersService } from '@/client/sdk.gen';
import { throwIfApiError } from '@/utils/error';

import type { FC } from 'react';

const ListRecentUsers: FC = async () => {
  const result = await UsersService.readUsers();

  throwIfApiError(result);

  const users = result.data?.data ?? [];

  return (
    <List
      title="Recent Users"
      icon={Users}
      items={users.map((user) => ({
        icon: (
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {(user.full_name ?? user.email).charAt(0).toUpperCase()}
            </span>
          </div>
        ),
        content: (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.full_name ?? user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        ),
        status: (
          <Badge variant={user.is_active ? 'default' : 'secondary'}>
            {user.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }))}
    />
  );
};

export default ListRecentUsers;
