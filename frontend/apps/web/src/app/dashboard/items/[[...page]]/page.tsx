import { notFound } from 'next/navigation';

import TableSkeleton from '@workspace/ui/components/skeletons/table';

import ErrorBoundarySuspense from '@/components/common/error-boundary-suspense';
import DashboardTitle from '@/components/dashboard/common/dashboard-title';
import { DialogItemCreateButton } from '@/components/dashboard/items/dialog-item-create';
import TableItems from '@/components/dashboard/items/table-items';
import { ItemsService } from '@/client/sdk.gen';
import { isPageOutOfBoundsFn, parsePage } from '@/utils/path';
import { CONFIG_CLIENT } from '@/config/client';

import type { FC } from 'react';

interface Props {
  params: Promise<{ page: string }>;
}

const { PAGE_SIZE_TABLE } = CONFIG_CLIENT;

const ItemsPage: FC<Props> = async ({ params }) => {
  const { page } = await params;
  const { currentPage, isValidPage } = parsePage(page);

  if (!isValidPage) notFound();

  const result = await ItemsService.readItems({
    query: {
      skip: (currentPage - 1) * PAGE_SIZE_TABLE,
      limit: PAGE_SIZE_TABLE,
    },
  });

  const items = result.data;

  const totalItems = items?.count ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE_TABLE);
  const isPageOutOfBounds = isPageOutOfBoundsFn({ currentPage, totalItems, totalPages });

  if (isPageOutOfBounds) notFound();

  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Items Management"
        description="Manage your application items and their properties."
        contentRight={<DialogItemCreateButton />}
      />
      <ErrorBoundarySuspense fallback={<TableSkeleton />}>
        <TableItems currentPage={currentPage} items={items} />
      </ErrorBoundarySuspense>
    </div>
  );
};

export default ItemsPage;
