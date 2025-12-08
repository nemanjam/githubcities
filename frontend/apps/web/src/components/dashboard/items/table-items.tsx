import { Search } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/ui/table';
import { cn } from '@workspace/ui/lib/utils';

import DialogItemCreate from '@/components/dashboard/items/dialog-item-create';
import DialogItemUpdate from '@/components/dashboard/items/dialog-item-update';
import DropdownItem from '@/components/dashboard/items/dropdown-item';
import { ROUTES } from '@/constants/routes';
import { CONFIG_CLIENT } from '@/config/client';

import type { ItemPublic, ItemsPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { PAGE_SIZE_TABLE } = CONFIG_CLIENT;

const { ITEMS } = ROUTES;

interface TableItemsHeaderProps {
  title: string;
}

const TableItemsHeader: FC<TableItemsHeaderProps> = ({ title }) => (
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Search className="h-5 w-5" />
      <span>{title}</span>
    </CardTitle>
  </CardHeader>
);

interface TableItemsContentProps {
  items: ItemPublic[];
}

const TableItemsContent: FC<TableItemsContentProps> = async ({ items }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono text-sm">{item.id}</TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
              {item.description || <span className="italic text-gray-400">No description</span>}
            </TableCell>
            <TableCell className="text-right">
              <DropdownItem item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface TableItemsPaginationProps {
  currentPage: number;
  totalPages: number;
}

const TableItemsPagination: FC<TableItemsPaginationProps> = ({ currentPage = 1, totalPages }) => (
  <div className="flex justify-center mt-6">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${ITEMS}${currentPage - 1}`}
            className={cn('cursor-pointer', {
              'cursor-default pointer-events-none opacity-50': currentPage <= 1,
            })}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isCurrentPage = page === currentPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={`${ITEMS}${page}`}
                isActive={isCurrentPage}
                className={cn({ 'cursor-pointer': isCurrentPage })}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={`${ITEMS}${currentPage + 1}`}
            className={cn('cursor-pointer', {
              'cursor-default pointer-events-none opacity-50': currentPage >= totalPages,
            })}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);

export interface TableItemsProps {
  currentPage: number;
  items: ItemsPublic | undefined;
}

const TableItems: FC<TableItemsProps> = async ({ currentPage, items }) => {
  const pageItems = items?.data ?? [];
  const totalItems = items?.count ?? 0;

  const totalPages = Math.ceil(totalItems / PAGE_SIZE_TABLE);

  return (
    <>
      <Card>
        <TableItemsHeader title={`Items (${totalItems})`} />
        <CardContent data-card-content="data-card-content">
          <TableItemsContent items={pageItems} />
          <TableItemsPagination currentPage={currentPage} totalPages={totalPages} />
        </CardContent>
      </Card>
      <DialogItemUpdate />
      <DialogItemCreate />
    </>
  );
};

export default TableItems;
