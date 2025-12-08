import { notFound } from 'next/navigation';

import TableSkeleton from '@workspace/ui/components/skeletons/table';

import ErrorBoundarySuspense from '@/components/common/error-boundary-suspense';
import { DialogUserCreateButton } from '@/components/dashboard/admin/dialog-user-create';
import TableAdmin from '@/components/dashboard/admin/table-admin';
import DashboardTitle from '@/components/dashboard/common/dashboard-title';
import { UsersService } from '@/client/sdk.gen';
import { isPageOutOfBoundsFn, parsePage } from '@/utils/path';
import { CONFIG_CLIENT } from '@/config/client';

import type { FC } from 'react';

interface Props {
  params: Promise<{ page: string }>;
}

const { PAGE_SIZE_TABLE } = CONFIG_CLIENT;

const AdminPage: FC<Props> = async ({ params }) => {
  const { page } = await params;
  const { currentPage, isValidPage } = parsePage(page);

  if (!isValidPage) notFound();

  const [currentUserResult, usersResult] = await Promise.all([
    UsersService.readUserMe(),
    UsersService.readUsers({
      query: {
        skip: (currentPage - 1) * PAGE_SIZE_TABLE,
        limit: PAGE_SIZE_TABLE,
      },
    }),
  ]);

  const currentUser = currentUserResult.data;
  const users = usersResult.data;

  if (currentUserResult.error || !currentUser) notFound();

  const totalUsers = users?.count ?? 0;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE_TABLE);
  const isPageOutOfBounds = isPageOutOfBoundsFn({
    currentPage,
    totalItems: totalUsers,
    totalPages,
  });

  if (isPageOutOfBounds) notFound();

  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Admin Panel"
        description="Manage users and their permissions across the application."
        contentRight={<DialogUserCreateButton />}
      />
      <ErrorBoundarySuspense fallback={<TableSkeleton />}>
        <TableAdmin currentPage={currentPage} currentUser={currentUser} users={users} />
      </ErrorBoundarySuspense>
    </div>
  );
};

export default AdminPage;
