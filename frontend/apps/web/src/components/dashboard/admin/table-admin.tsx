import { Shield, ShieldCheck, Users } from 'lucide-react';

import { Badge } from '@workspace/ui/components/ui/badge';
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

import DialogUserCreate from '@/components/dashboard/admin/dialog-user-create';
import DialogUserUpdate from '@/components/dashboard/admin/dialog-user-update';
import DropdownUser from '@/components/dashboard/admin/dropdown-user';
import { ROUTES } from '@/constants/routes';
import { CONFIG_CLIENT } from '@/config/client';

import type { UserPublic, UsersPublic } from '@/client/types.gen';
import type { FC } from 'react';

const { PAGE_SIZE_TABLE } = CONFIG_CLIENT;

const { ADMIN } = ROUTES;

interface TableAdminHeaderProps {
  title: string;
}

const TableAdminHeader: FC<TableAdminHeaderProps> = ({ title }) => (
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Users className="h-5 w-5" />
      <span>{title}</span>
    </CardTitle>
  </CardHeader>
);

interface TableAdminContentProps {
  currentUser: UserPublic | undefined;
  users: UserPublic[];
}

const TableAdminContent: FC<TableAdminContentProps> = async ({ currentUser, users }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-mono text-sm">{user.id}</TableCell>
            <TableCell className="font-medium">
              {user.full_name || <span className="italic text-gray-400">No name</span>}
            </TableCell>
            <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.is_superuser ? 'default' : 'secondary'}>
                {user.is_superuser ? (
                  <>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Admin
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    User
                  </>
                )}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownUser currentUser={currentUser} user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface TableAdminPaginationProps {
  currentPage: number;
  totalPages: number;
}

const TableAdminPagination: FC<TableAdminPaginationProps> = ({ currentPage = 1, totalPages }) => (
  <div className="flex justify-center mt-6">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${ADMIN}${currentPage - 1}`}
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
                href={`${ADMIN}${page}`}
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
            href={`${ADMIN}${currentPage + 1}`}
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

export interface TableAdminProps {
  currentPage: number;
  currentUser: UserPublic;
  users: UsersPublic | undefined;
}

const TableAdmin: FC<TableAdminProps> = async ({ currentPage, currentUser, users }) => {
  const pageUsers = users?.data ?? [];
  const totalUsers = users?.count ?? 0;

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE_TABLE);

  return (
    <>
      <Card>
        <TableAdminHeader title={`Users (${totalUsers})`} />
        <CardContent>
          <TableAdminContent currentUser={currentUser} users={pageUsers} />
          <TableAdminPagination currentPage={currentPage} totalPages={totalPages} />
        </CardContent>
      </Card>
      <DialogUserUpdate />
      <DialogUserCreate />
    </>
  );
};

export default TableAdmin;
