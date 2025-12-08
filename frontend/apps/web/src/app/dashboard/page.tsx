import CardSmallSkeleton from '@workspace/ui/components/skeletons/card-small';
import ListSkeleton from '@workspace/ui/components/skeletons/list';
import { cn } from '@workspace/ui/lib/utils';

import ErrorBoundarySuspense from '@/components/common/error-boundary-suspense';
import DashboardTitle from '@/components/dashboard/common/dashboard-title';
import CardCurrentUser from '@/components/dashboard/home/card-current-user';
import CardSystemHealth from '@/components/dashboard/home/card-system-health';
import CardTotalItems from '@/components/dashboard/home/card-total-items';
import CardTotalUsers from '@/components/dashboard/home/card-total-users';
import ListRecentItems from '@/components/dashboard/home/list-recent-items';
import ListRecentUsers from '@/components/dashboard/home/list-recent-users';
import ListSystemStatus from '@/components/dashboard/home/list-system-status';
import { UsersService } from '@/client/sdk.gen';

import type { FC } from 'react';

const DashboardPage: FC = async () => {
  const result = await UsersService.readUserMe();
  const currentUser = result.data;

  const isSuperuser = currentUser?.is_superuser ?? false;

  const welcomeText = currentUser
    ? `Welcome back, ${currentUser.full_name ?? currentUser.email}!`
    : 'Welcome back!';

  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Dashboard"
        description={`${welcomeText} Here's what's happening with your application.`}
      />

      <div
        className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 items-start', {
          'lg:grid-cols-4': isSuperuser,
          'lg:grid-cols-3': !isSuperuser,
        })}
      >
        {isSuperuser && (
          <ErrorBoundarySuspense fallback={<CardSmallSkeleton />}>
            <CardTotalUsers />
          </ErrorBoundarySuspense>
        )}
        <ErrorBoundarySuspense fallback={<CardSmallSkeleton />}>
          <CardTotalItems />
        </ErrorBoundarySuspense>
        <ErrorBoundarySuspense fallback={<CardSmallSkeleton />}>
          <CardCurrentUser />
        </ErrorBoundarySuspense>
        <ErrorBoundarySuspense fallback={<CardSmallSkeleton />}>
          <CardSystemHealth />
        </ErrorBoundarySuspense>
      </div>

      <div
        className={cn('grid grid-cols-1 gap-6 items-start', {
          'lg:grid-cols-2': isSuperuser,
        })}
      >
        {isSuperuser && (
          <ErrorBoundarySuspense fallback={<ListSkeleton />}>
            <ListRecentUsers />
          </ErrorBoundarySuspense>
        )}

        <ErrorBoundarySuspense fallback={<ListSkeleton />}>
          <ListRecentItems />
        </ErrorBoundarySuspense>
      </div>

      {isSuperuser && (
        <ErrorBoundarySuspense fallback={<ListSkeleton count={3} />}>
          <ListSystemStatus />
        </ErrorBoundarySuspense>
      )}
    </div>
  );
};

export default DashboardPage;
